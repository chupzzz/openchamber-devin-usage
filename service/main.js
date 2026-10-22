/**
 * Local service for the devin-usage OpenChamber extension.
 * Host spawns this with `process.execPath` (bun or node) and gives:
 *   OPENCHAMBER_SERVICE_PORT — loopback port to bind
 *   OPENCHAMBER_SERVICE_TOKEN — shared secret; every request must send
 *                               `Authorization: Bearer <token>`
 *
 * The service needs the Devin session token to call server.codeium.com.
 * The panel doesn't hold it — the host owns the integration credential.
 * We don't get it automatically. So this service expects the panel to
 * pass nothing and instead reads the OpenCode credential store itself:
 * OpenChamber already exposed it through the local OpenCode CLI
 * (`opencode api get /api/credential`), which we shell out to.
 * That's the same source the builtin quota providers use.
 */

import http from 'node:http';
import { spawnSync } from 'node:child_process';

const PORT = Number(process.env.OPENCHAMBER_SERVICE_PORT ?? 0);
const TOKEN = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';
if (!PORT || !TOKEN) {
  console.error('Missing OPENCHAMBER_SERVICE_PORT or OPENCHAMBER_SERVICE_TOKEN');
  process.exit(2);
}

const GET_PLAN_STATUS_URL =
  'https://server.codeium.com/exa.seat_management_pb.SeatManagementService/GetPlanStatus';
const GET_ANALYTICS_URL =
  'https://server.codeium.com/exa.user_analytics_pb.UserAnalyticsService/GetAnalytics';
const GET_CURRENT_USER_URL =
  'https://server.codeium.com/exa.seat_management_pb.SeatManagementService/GetCurrentUser';
const REQUEST_TIMEOUT_MS = 15000;
const MICROS_PER_USD = 1_000_000;

// ---------------- protobuf wire ----------------
const encodeVarint = (v) => {
  let x = BigInt(v);
  const out = [];
  while (x > 0x7fn) {
    out.push(Number(x & 0x7fn) | 0x80);
    x >>= 7n;
  }
  out.push(Number(x));
  return Buffer.from(out);
};
const tag = (n, w) => encodeVarint((n << 3) | w);
const encString = (n, s) => {
  const b = Buffer.from(s, 'utf8');
  return Buffer.concat([tag(n, 2), encodeVarint(b.length), b]);
};
const encVarint = (n, v) => Buffer.concat([tag(n, 0), encodeVarint(v)]);
const encMsg = (n, buf) => Buffer.concat([tag(n, 2), encodeVarint(buf.length), buf]);
const encTimestamp = (n, ms, nanos = 0) =>
  encMsg(n, Buffer.concat([encVarint(1, Math.floor(ms / 1000)), encVarint(2, nanos)]));

const decodeVarint = (buf, off) => {
  let r = 0n, s = 0n, i = off;
  while (i < buf.length) {
    const x = buf[i++];
    r |= BigInt(x & 0x7f) << s;
    if (!(x & 0x80)) return [r, i];
    s += 7n;
  }
  throw new Error('truncated varint');
};

function* iterFields(buf) {
  let i = 0;
  while (i < buf.length) {
    const [t, a] = decodeVarint(buf, i);
    i = a;
    const num = Number(t) >> 3, wire = Number(t) & 7;
    if (wire === 0) {
      const [v, j] = decodeVarint(buf, i);
      i = j;
      yield { num, wire, value: v };
    } else if (wire === 1) {
      yield { num, wire, value: buf.slice(i, i + 8) };
      i += 8;
    } else if (wire === 2) {
      const [l, a2] = decodeVarint(buf, i);
      i = a2;
      const len = Number(l);
      yield { num, wire, value: buf.slice(i, i + len) };
      i += len;
    } else if (wire === 5) {
      yield { num, wire, value: buf.slice(i, i + 4) };
      i += 4;
    } else {
      return;
    }
  }
}

const readTimestamp = (buf) => {
  for (const f of iterFields(buf)) {
    if (f.num === 1 && f.wire === 0) return Number(f.value) * 1000;
  }
  return null;
};
const readVarint = (f) => (f.wire === 0 ? Number(f.value) : null);

// ---------------- credential source ----------------
// Ask the local OpenCode CLI (same mechanism OpenChamber's own providers use).
const getDevinToken = () => {
  try {
    const r = spawnSync('opencode', ['api', 'get', '/api/credential'], {
      encoding: 'utf8',
      timeout: 15000,
      windowsHide: true,
    });
    if (r.status !== 0 || !r.stdout) return null;
    const parsed = JSON.parse(r.stdout);
    const entries = parsed?.data ?? [];
    const devin = entries.find((c) => c.integrationID === 'devin' && c.active);
    const access = devin?.value?.access;
    if (!access) return null;
    return access.startsWith('devin-session-token$')
      ? access
      : `devin-session-token$${access}`;
  } catch {
    return null;
  }
};

// ---------------- fetch quota ----------------
const clampPercent = (v) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : null;

const DAY_MS = 24 * 3600 * 1000;

const fetchCurrentUser = async (token) => {
  try {
    const res = await fetch(GET_CURRENT_USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/proto',
        'Connect-Protocol-Version': '1',
        'x-auth-token': token,
        'x-devin-session-token': token,
      },
      body: new Uint8Array(0),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    // response: {1: user{1 apiKey, 2 name, 3 email, ...}, 2: role, 4: org, 6: planInfo, ...}
    let name = null, email = null, role = null;
    for (const f of iterFields(buf)) {
      if (f.num === 1 && f.wire === 2) {
        for (const u of iterFields(f.value)) {
          if (u.num === 2 && u.wire === 2) name = u.value.toString('utf8');
          else if (u.num === 3 && u.wire === 2) email = u.value.toString('utf8');
        }
      } else if (f.num === 2 && f.wire === 2) {
        role = f.value.toString('utf8');
      }
    }
    return { name, email, role };
  } catch {
    return null;
  }
};

const fetchQuota = async () => {
  const token = getDevinToken();
  if (!token) {
    return {
      ok: false,
      configured: false,
      error: 'No active devin credential found in OpenCode',
    };
  }

  const body = Buffer.concat([encString(1, token), encVarint(2, 1)]);

  let response;
  try {
    response = await fetch(GET_PLAN_STATUS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/proto',
        'Connect-Protocol-Version': '1',
        'x-auth-token': token,
        'x-devin-session-token': token,
      },
      body: new Uint8Array(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return { ok: false, configured: true, error: err?.message ?? 'request failed' };
  }

  const buf = Buffer.from(await response.arrayBuffer());
  if (!response.ok) {
    const snippet = buf.toString('utf8').slice(0, 200);
    return {
      ok: false,
      configured: true,
      error:
        response.status === 401 || response.status === 403
          ? 'Session expired — re-auth Devin'
          : `HTTP ${response.status}${snippet ? ` — ${snippet}` : ''}`,
    };
  }

  const user = await fetchCurrentUser(token);

  let planStatusBuf = null;
  for (const f of iterFields(buf)) {
    if (f.num === 1 && f.wire === 2) {
      planStatusBuf = f.value;
      break;
    }
  }
  if (!planStatusBuf) {
    return { ok: false, configured: true, error: 'No plan status in response' };
  }

  let planName = null;
  let dailyRemaining = null;
  let weeklyRemaining = null;
  let dailyResetAt = null;
  let weeklyResetAt = null;
  let overageMicros = null;
  let planStartMs = null;
  let planEndMs = null;

  for (const f of iterFields(planStatusBuf)) {
    if (f.num === 1 && f.wire === 2) {
      for (const p of iterFields(f.value)) {
        if (p.num === 2 && p.wire === 2) planName = p.value.toString('utf8');
      }
    } else if (f.num === 2 && f.wire === 2) planStartMs = readTimestamp(f.value);
    else if (f.num === 3 && f.wire === 2) planEndMs = readTimestamp(f.value);
    else if (f.num === 14) dailyRemaining = readVarint(f);
    else if (f.num === 15) weeklyRemaining = readVarint(f);
    else if (f.num === 16) overageMicros = readVarint(f);
    else if (f.num === 17) dailyResetAt = readVarint(f);
    else if (f.num === 18) weeklyResetAt = readVarint(f);
  }

  const windows = {};
  if (dailyRemaining !== null && dailyResetAt) {
    windows['1d'] = {
      usedPercent: clampPercent(100 - dailyRemaining),
      remainingPercent: clampPercent(dailyRemaining),
      resetAt: dailyResetAt * 1000,
    };
  }
  if (weeklyRemaining !== null && weeklyResetAt) {
    windows['weekly'] = {
      usedPercent: clampPercent(100 - weeklyRemaining),
      remainingPercent: clampPercent(weeklyRemaining),
      resetAt: weeklyResetAt * 1000,
    };
  }
  if (planEndMs) {
    windows['monthly'] = {
      resetAt: planEndMs,
      valueLabel: `Plan ends ${new Date(planEndMs).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`,
    };
  }
  if (overageMicros !== null && overageMicros !== 0) {
    windows['credits_balance'] = {
      valueLabel: `$${(overageMicros / MICROS_PER_USD).toFixed(2)}`,
    };
  }

  return {
    ok: true,
    configured: true,
    planLabel: planName ?? 'Devin',
    user: user ?? undefined,
    usage: { windows },
    fetchedAt: Date.now(),
  };
};

// ---------------- fetch analytics ----------------
// GetAnalytics request: repeated QueryRequest at field 2 (each a oneof msg),
// start_timestamp field 3, end_timestamp field 4.
// Result: repeated QueryResult at field 1, each oneof result_type:
//   2  daily activity  {ts, msg{5,6,7}}   — completions_by_day
//   6  daily activity  {ts, msg}          — chats_by_day
//   18 cascade_lines   {ts, f2, f3}       — accepted lines per day
//   19 cascade_tool_usage {name f2, count f3}
//   20 cascade_runs    {ts, model f2, mode f3, count f4, cascadeId f6}
//   21 daily_active    {ts, f2}
//   9  cascade_summary {f1 pct f64, f4..f7 totals}
const buildAnalyticsBody = (startMs, endMs, timeZone = 'UTC') => {
  const parts = [];
  const addQuery = (qNum, inner) => {
    const qField = encMsg(qNum, inner ?? Buffer.alloc(0));
    parts.push(encMsg(2, qField));
  };
  addQuery(2, encString(1, timeZone));   // completions_by_day — needs {1: tz}
  addQuery(10, encString(1, timeZone));  // chats_by_day
  addQuery(23);                          // cascade_lines
  addQuery(24);                          // cascade_tool_usage
  addQuery(25);                          // cascade_runs
  addQuery(29);                          // daily_active_user_counts
  addQuery(31);                          // cascade_summary
  parts.push(encTimestamp(3, startMs));
  parts.push(encTimestamp(4, endMs, 999999000));
  return Buffer.concat(parts);
};

const fetchAnalytics = async (days = 60) => {
  const token = getDevinToken();
  if (!token) {
    return { ok: false, configured: false, error: 'No active devin credential' };
  }
  const endMs = Date.now();
  const startMs = endMs - days * DAY_MS;
  const body = buildAnalyticsBody(startMs, endMs);

  let response;
  try {
    response = await fetch(GET_ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/proto',
        'Connect-Protocol-Version': '1',
        'x-auth-token': token,
        'x-devin-session-token': token,
        Origin: 'https://windsurf.com',
        Referer: 'https://windsurf.com/profile',
      },
      body: new Uint8Array(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return { ok: false, configured: true, error: err?.message ?? 'request failed' };
  }

  const buf = Buffer.from(await response.arrayBuffer());
  if (!response.ok) {
    return { ok: false, configured: true, error: `HTTP ${response.status}` };
  }

  // --- decode ---
  const daysMap = new Map(); // dateKey -> { runs, lines, models:Set, tools:{} }
  const modelsCount = new Map();
  const toolsCount = new Map();
  const toolDayCount = new Map(); // date -> tool invocations
  let summary = null;
  const dayKey = (ms) => new Date(ms).toISOString().slice(0, 10);
  const ensure = (ms) => {
    const k = dayKey(ms);
    if (!daysMap.has(k)) {
      daysMap.set(k, { date: k, runs: 0, lines: 0, models: {}, tools: {}, active: 0 });
    }
    return daysMap.get(k);
  };
  // pre-fill full range so the grid is continuous
  for (let d = new Date(startMs); d.getTime() <= endMs; d.setDate(d.getDate() + 1)) {
    ensure(d.getTime());
  }
  const readTs = (buf) => {
    for (const f of iterFields(buf)) if (f.num === 1 && f.wire === 0) return Number(f.value) * 1000;
    return null;
  };

  for (const f of iterFields(buf)) {
    if (f.num !== 1 || f.wire !== 2) continue;
    for (const rf of iterFields(f.value)) {
      const type = rf.num;
      if (type === 20) {
        // cascade_runs: each entry {1 ts, 2 model, 3 mode, 4 count, 6 cascadeId}
        for (const e of iterFields(rf.value)) {
          if (e.num !== 1 || e.wire !== 2) continue;
          let ts = null, model = null, count = 0;
          for (const ef of iterFields(e.value)) {
            if (ef.num === 1) ts = readTs(ef.value);
            else if (ef.num === 2 && ef.wire === 2) model = ef.value.toString('utf8');
            else if (ef.num === 4 && ef.wire === 0) count = Number(ef.value);
          }
          if (ts && model) {
            const day = ensure(ts);
            day.runs += Math.max(1, count);
            day.models[model] = (day.models[model] ?? 0) + Math.max(1, count);
            modelsCount.set(model, (modelsCount.get(model) ?? 0) + Math.max(1, count));
          }
        }
      } else if (type === 18) {
        // cascade_lines: {1 ts, 2 proposed, 3 accepted}
        for (const e of iterFields(rf.value)) {
          if (e.num !== 1 || e.wire !== 2) continue;
          let ts = null, lines = 0;
          for (const ef of iterFields(e.value)) {
            if (ef.num === 1) ts = readTs(ef.value);
            else if (ef.num === 3 && ef.wire === 0) lines = Number(ef.value);
          }
          if (ts) ensure(ts).lines += lines;
        }
      } else if (type === 19) {
        // cascade_tool_usage: {2 name, 3 count}
        for (const e of iterFields(rf.value)) {
          if (e.num !== 1 || e.wire !== 2) continue;
          let name = null, count = 0;
          for (const ef of iterFields(e.value)) {
            if (ef.num === 2 && ef.wire === 2) name = ef.value.toString('utf8');
            else if (ef.num === 3 && ef.wire === 0) count = Number(ef.value);
          }
          if (name) toolsCount.set(name, (toolsCount.get(name) ?? 0) + count);
        }
      } else if (type === 21) {
        // daily_active: {1 ts, 2 count}
        for (const e of iterFields(rf.value)) {
          if (e.num !== 1 || e.wire !== 2) continue;
          let ts = null, v = 0;
          for (const ef of iterFields(e.value)) {
            if (ef.num === 1) ts = readTs(ef.value);
            else if (ef.num === 2 && ef.wire === 0) v = Number(ef.value);
          }
          if (ts) ensure(ts).active += v;
        }
      } else if (type === 9) {
        // cascade_summary scalars
        let aiCodePct = null, totalLines = 0;
        for (const e of iterFields(rf.value)) {
          if (e.num === 1 && e.wire === 1) aiCodePct = e.value.readDoubleLE(0);
          else if (e.num === 6 && e.wire === 0) totalLines = Number(e.value);
        }
        summary = { aiCodePct, totalLines };
      }
    }
  }

  const daysArr = Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  return {
    ok: true,
    configured: true,
    days: daysArr,
    models: Array.from(modelsCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    tools: Array.from(toolsCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    summary,
    rangeDays: days,
    fetchedAt: Date.now(),
  };
};

// ---------------- http server ----------------
const server = http.createServer(async (req, res) => {
  const auth = req.headers.authorization ?? '';
  if (auth !== `Bearer ${TOKEN}`) {
    res.writeHead(401, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (req.method === 'GET' && url.pathname === '/quota') {
    try {
      const result = await fetchQuota();
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err?.message ?? 'failed' }));
    }
    return;
  }
  if (req.method === 'GET' && url.pathname === '/analytics') {
    try {
      const days = Math.min(365, Math.max(7, Number(url.searchParams.get('days') ?? 60)));
      const result = await fetchAnalytics(days);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err?.message ?? 'failed' }));
    }
    return;
  }
  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`devin-usage service listening on 127.0.0.1:${PORT}`);
});
