import { connectHost, HostRequestError } from "@openchamber/sdk";
import { applyHostReady, mountBanner, mountSpinner } from "@openchamber/sdk/ui";

type QuotaWindow = {
  usedPercent?: number | null;
  remainingPercent?: number | null;
  resetAt?: number | null;
  valueLabel?: string | null;
};

type QuotaResult = {
  ok: boolean;
  configured?: boolean;
  error?: string;
  planLabel?: string;
  user?: { name?: string; email?: string };
  usage?: { windows?: Record<string, QuotaWindow> };
};

type DayEntry = {
  date: string;
  runs: number;
  lines: number;
  models: Record<string, number>;
  tools: Record<string, number>;
  active: number;
};

type AnalyticsResult = {
  ok: boolean;
  error?: string;
  days: DayEntry[];
  models: Array<{ name: string; count: number }>;
  tools: Array<{ name: string; count: number }>;
  summary: { aiCodePct: number | null; totalLines: number } | null;
  rangeDays: number;
};

const host = connectHost();
const root = document.querySelector<HTMLDivElement>("#root")!;

let mounted: Array<{ dispose: () => void }> = [];
const clear = () => {
  for (const b of mounted) b.dispose();
  mounted = [];
};

let generation = 0;

const fmt = (ts: number | null | undefined) =>
  ts && Number.isFinite(ts) ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

const fmtFull = (ts: number | null | undefined) =>
  ts && Number.isFinite(ts) ? new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const pct = (v: number | null | undefined) =>
  v === null || v === undefined ? "—" : `${Math.round(v)}%`;

// persistent UI state
const LS_COLLAPSED = "devin-usage.collapsed";
const readCollapsed = (): Set<string> => {
  try {
    const raw = localStorage.getItem(LS_COLLAPSED);
    return raw ? new Set(JSON.parse(raw)) : new Set(["tools"]);
  } catch {
    return new Set(["tools"]);
  }
};
const writeCollapsed = (set: Set<string>) => {
  try {
    localStorage.setItem(LS_COLLAPSED, JSON.stringify(Array.from(set)));
  } catch {}
};
let collapsed = readCollapsed();
const toggleCollapsed = (key: string) => {
  if (collapsed.has(key)) collapsed.delete(key);
  else collapsed.add(key);
  writeCollapsed(collapsed);
  // refresh just the sections' visible state without full repaint
  root.querySelectorAll<HTMLElement>(`[data-collapse="${key}"]`).forEach((el) => {
    const chev = el.querySelector<HTMLElement>(".sec-chev");
    const body = el.nextElementSibling as HTMLElement | null;
    const isCollapsed = collapsed.has(key);
    if (chev) chev.textContent = isCollapsed ? "▸" : "▾";
    if (body) body.style.display = isCollapsed ? "none" : "";
  });
};

// =====================
// quota section
// =====================
const quotaCard = (label: string, w: QuotaWindow | undefined) => {
  if (!w) return "";
  const used = w.usedPercent ?? null;
  const isExceeded = w.valueLabel === "exceeded";
  const bar =
    used !== null
      ? `<div class="bar"><div class="bar-fill ${isExceeded ? "bar-fill-exceeded" : ""}" style="width:${used}%"></div></div>`
      : "";
  const main = isExceeded ? "exceeded" : used !== null ? pct(used) : (w.valueLabel ?? "—");
  const rows = [
    `<div class="q-row"><span class="q-label">${label}</span><span class="q-val ${isExceeded ? "q-val-exceeded" : ""}">${main}</span></div>`,
    bar,
  ];
  if (w.resetAt)
    rows.push(`<div class="q-row sub"><span>${isExceeded ? "resets" : "resets"}</span><span>${fmtFull(w.resetAt)}</span></div>`);
  if (w.valueLabel && used !== null && !isExceeded)
    rows.push(`<div class="q-row sub"><span></span><span>${w.valueLabel}</span></div>`);
  return `<div class="q-card ${isExceeded ? "q-card-exceeded" : ""}">${rows.join("")}</div>`;
};

// =====================
// heatmap
// =====================
// GitHub-style: rows = days of week (Mon..Sun), cols = weeks
// Each cell = total activity for that date
const HEAT_DAYS = 7;
const heatmap = (days: DayEntry[]) => {
  if (days.length === 0) return '<div class="empty">no data</div>';

  // value = runs * 10 + lines (weight runs much heavier)
  const valueOf = (d: DayEntry) => d.runs * 10 + d.lines;
  const max = Math.max(1, ...days.map(valueOf));
  const intensity = (v: number) => {
    if (v <= 0) return 0;
    const r = v / max;
    if (r < 0.2) return 1;
    if (r < 0.45) return 2;
    if (r < 0.7) return 3;
    return 4;
  };

  // align start to Monday
  const first = new Date(days[0].date + "T00:00:00Z");
  const startOffset = (first.getUTCDay() + 6) % 7; // Monday=0
  const cells: (DayEntry | null)[] = Array(startOffset).fill(null);
  for (const d of days) cells.push(d);

  const weeks: (DayEntry | null)[][] = [];
  for (let i = 0; i < cells.length; i += HEAT_DAYS) {
    weeks.push(cells.slice(i, i + HEAT_DAYS));
  }

  const months: string[] = [];
  let lastMonth = "";
  const monthLabels = weeks.map((w) => {
    const firstReal = w.find((c) => c !== null);
    if (!firstReal) return "";
    const m = new Date(firstReal.date + "T00:00:00Z").toLocaleDateString("en-US", { month: "short" });
    if (m !== lastMonth) {
      lastMonth = m;
      return m;
    }
    return "";
  });

  const rowLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
  const headerHtml =
    `<div class="hm-row hm-head"><div class="hm-corner"></div>` +
    weeks.map((_, i) => `<div class="hm-m">${monthLabels[i]}</div>`).join("") +
    `</div>`;

  const bodyHtml = Array.from({ length: HEAT_DAYS }, (_, row) => {
    const cellsHtml = weeks
      .map((w) => {
        const c = w[row];
        if (!c) return `<div class="hm-c hm-empty"></div>`;
        const v = valueOf(c);
        const cls = intensity(v);
        const title = `${c.date}\n${c.runs} run${c.runs === 1 ? "" : "s"}, ${c.lines} lines`;
        return `<div class="hm-c hm-l${cls}" title="${title.replace(/"/g, "&quot;")}"></div>`;
      })
      .join("");
    return `<div class="hm-row"><div class="hm-lab">${rowLabels[row]}</div>${cellsHtml}</div>`;
  }).join("");

  const legend = `<div class="hm-legend"><span class="hm-legend-label">Less</span><div class="hm-c hm-l0"></div><div class="hm-c hm-l1"></div><div class="hm-c hm-l2"></div><div class="hm-c hm-l3"></div><div class="hm-c hm-l4"></div><span class="hm-legend-label">More</span></div>`;

  return `<div class="hm">${headerHtml}${bodyHtml}${legend}</div>`;
};

// =====================
// models/tools
// =====================
const barList = (title: string, key: string, items: Array<{ name: string; count: number }>, maxItems = 6) => {
  if (items.length === 0) return "";
  const max = Math.max(1, ...items.map((i) => i.count));
  const isCollapsed = collapsed.has(key);
  const list = items
    .slice(0, maxItems)
    .map(
      (i) => `
        <div class="list-row">
          <div class="list-name" title="${i.name}">${i.name}</div>
          <div class="list-bar-wrap"><div class="list-bar" style="width:${(i.count / max) * 100}%"></div></div>
          <div class="list-val">${i.count}</div>
        </div>`
    )
    .join("");
  return `<div class="section">
    <button type="button" class="sec-head" data-collapse="${key}">
      <span class="sec-chev">${isCollapsed ? "▸" : "▾"}</span>
      <span class="section-title">${title}</span>
      <span class="sec-count">${items.length}</span>
    </button>
    <div class="sec-body" style="display:${isCollapsed ? "none" : ""}">${list}</div>
  </div>`;
};

// =====================
// main render
// =====================
const paint = async () => {
  const gen = ++generation;
  clear();
  root.innerHTML = "";
  const spinner = mountSpinner(root, { label: "Loading Devin activity" });
  mounted.push(spinner);

  try {
    const [quotaRes, analyticsRes] = await Promise.all([
      host.serviceRequest({ method: "GET", path: "/quota" }),
      host.serviceRequest({ method: "GET", path: "/analytics?days=120" }),
    ]);
    if (gen !== generation) return;
    spinner.dispose();

    const quota = quotaRes.status === 200 ? (JSON.parse(quotaRes.body) as QuotaResult) : null;
    let analytics: AnalyticsResult | null = null;
    if (analyticsRes.status === 200) {
      try {
        analytics = JSON.parse(analyticsRes.body) as AnalyticsResult;
      } catch {
        analytics = { ok: false, error: `bad JSON from service`, days: [], models: [], tools: [], summary: null, rangeDays: 0 };
      }
    } else {
      analytics = {
        ok: false,
        error: `service returned ${analyticsRes.status}: ${String(analyticsRes.body).slice(0, 200)}`,
        days: [], models: [], tools: [], summary: null, rangeDays: 0,
      };
    }

    const sections: string[] = [];

    // header — just "Devin" + Refresh
    sections.push(
      `<div class="hdr">
         <div class="title">Devin</div>
         <button class="btn" id="refresh">Refresh</button>
       </div>`
    );

    // user row under header: name · PLAN | Plan ends: date
    if (quota?.ok) {
      const w = quota.usage?.windows ?? {};
      const userName = quota.user?.name;
      const plan = quota.planLabel;
      const planEndMs = w["monthly"]?.resetAt;
      const planEndStr = planEndMs ? fmt(planEndMs) : null;
      const hasLeft = userName || plan;
      const hasRight = !!planEndStr;
      if (hasLeft || hasRight) {
        const leftHtml = [
          userName ? `<span class="u-name">${userName}</span>` : "",
          plan ? `<span class="plan-badge">${plan.toUpperCase()}</span>` : "",
        ].join("");
        const rightHtml = planEndStr
          ? `<span class="meta-label">Plan ends:</span> <span class="meta-val">${planEndStr}</span>`
          : "";
        sections.push(
          `<div class="user-row"><div class="u-left">${leftHtml}</div><div class="u-right">${rightHtml}</div></div>`
        );
      }
    }

    // quota cards — only Daily/Weekly/Credits (no more "Plan period")
    if (quota?.ok) {
      const w = quota.usage?.windows ?? {};
      const cards = [
        quotaCard("Daily", w["1d"]),
        quotaCard("Weekly", w["weekly"]),
        quotaCard("Credits", w["credits_balance"]),
      ]
        .filter(Boolean)
        .join("");
      if (cards) sections.push(`<div class="q-grid">${cards}</div>`);
    } else if (quota && !quota.ok) {
      sections.push(
        `<div class="err"><b>Quota:</b> ${quota.error ?? "unavailable"}</div>`
      );
    }

    // activity
    if (analytics?.ok && analytics.days && analytics.days.length > 0) {
      const activeDays = analytics.days.filter((d) => d.runs > 0 || d.lines > 0);
      const totalRuns = analytics.days.reduce((s, d) => s + d.runs, 0);
      const totalLines = analytics.days.reduce((s, d) => s + d.lines, 0);
      const aiPct = analytics.summary?.aiCodePct;

      sections.push(
        `<div class="section section-activity">
           <div class="section-title">Activity — last ${analytics.rangeDays} days</div>
           <div class="stats">
             <div class="stat"><div class="stat-num">${activeDays.length}</div><div class="stat-lab">active days</div></div>
             <div class="stat"><div class="stat-num">${totalRuns}</div><div class="stat-lab">runs</div></div>
             <div class="stat"><div class="stat-num">${totalLines.toLocaleString()}</div><div class="stat-lab">lines</div></div>
             ${aiPct !== null && aiPct !== undefined ? `<div class="stat"><div class="stat-num">${Math.round(aiPct * 100)}%</div><div class="stat-lab">AI code</div></div>` : ""}
           </div>
           ${heatmap(analytics.days)}
         </div>`
      );

      if (analytics.models?.length)
        sections.push(barList("Models", "models", analytics.models, 10));
      if (analytics.tools?.length)
        sections.push(barList("Tools", "tools", analytics.tools, 10));
    } else if (analytics?.ok && analytics.days && analytics.days.length === 0) {
      sections.push(`<div class="err"><b>Analytics:</b> service returned no days</div>`);
    } else if (analytics && !analytics.ok) {
      sections.push(`<div class="err"><b>Analytics:</b> ${analytics.error ?? "unavailable"}</div>`);
    } else {
      sections.push(`<div class="err"><b>Analytics:</b> no response from service</div>`);
    }

    root.innerHTML = `<div class="wrap">${sections.join("")}</div>`;
    root.querySelector("#refresh")?.addEventListener("click", () => void paint());
    root.querySelectorAll<HTMLButtonElement>("[data-collapse]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.collapse;
        if (key) toggleCollapsed(key);
      });
    });
  } catch (error) {
    if (gen !== generation) return;
    spinner.dispose();
    const msg =
      error instanceof HostRequestError ? `${error.code}: ${error.message}` : String(error);
    root.innerHTML = "";
    mounted.push(mountBanner(root, { tone: "error", title: "Service request failed", body: msg }));
  }
};

// =====================
// styles
// =====================
const css = document.createElement("style");
css.textContent = `
  .wrap { font: 12px/1.5 var(--font-sans, system-ui); color: var(--foreground, #ddd); display:flex; flex-direction:column; }
  .wrap > * + * { margin-top: 12px; }
  .wrap > .hdr + .user-row { margin-top: 0; }
  .wrap > .hdr + .q-grid { margin-top: 8px; }
  .wrap > .user-row + .q-grid { margin-top: 12px; }
  .wrap > .section-activity { margin-top: 1rem; }
  .hdr { display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border, #333); }
  .title { font-weight:600; font-size:13px; }
  .btn { background: var(--primary, #4a7); color: var(--primary-foreground, #fff); border:0; border-radius:4px; padding:4px 10px; font:inherit; cursor:pointer; font-size:11px; }
  .btn:hover { opacity: .9; }
  .user-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0 0; font-size:12px; }
  .u-left { display:flex; align-items:center; gap:8px; }
  .u-name { color: var(--foreground, #ddd); font-weight:500; }
  .plan-badge { background: #fffc; color: #000; font-size:8px; font-weight:400; padding:2px 6px; border-radius:3px; letter-spacing:.03em; }
  .u-right { font-size:11px; color: var(--muted-foreground, #888); }
  .meta-label { color: var(--muted-foreground, #888); }
  .meta-val { color: var(--foreground, #ddd); font-weight:500; }

  .q-grid { display:grid; grid-template-columns: 1fr 1fr; gap:8px; }
  .q-card { background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; padding:8px 10px; }
  .q-row { display:flex; justify-content:space-between; padding:1px 0; }
  .q-row.sub { font-size:10px; color: var(--muted-foreground, #888); }
  .q-label { font-weight:500; }
  .q-val { font-variant-numeric: tabular-nums; font-weight:600; }
  .bar { height: 4px; background: var(--muted, #2a2a2a); border-radius:2px; margin:4px 0 2px; overflow:hidden; }
  .bar-fill { height:100%; background: var(--primary, #4a7); border-radius:2px; transition:width .3s; }
  .bar-fill-exceeded { background: #d33; }
  .q-val-exceeded { color: #f77; }
  .q-card-exceeded { border-color: #d33; }

  .section { display:flex; flex-direction:column; gap:6px; }
  .section-title { font-size:11px; text-transform:uppercase; letter-spacing:.04em; color: var(--muted-foreground, #888); font-weight:600; }
  .stats { display:grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap:6px; margin-bottom:4px; }
  .stat { background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; padding:6px 8px; text-align:center; }
  .stat-num { font-size:16px; font-weight:700; font-variant-numeric: tabular-nums; }
  .stat-lab { font-size:9px; color: var(--muted-foreground, #888); text-transform:uppercase; letter-spacing:.04em; }

  .hm { display:flex; flex-direction:column; gap:3px; padding:8px; background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; }
  .hm-row { display:flex; gap:3px; align-items:center; flex:1; }
  .hm-row .hm-lab { flex-shrink:0; }
  .hm-row .hm-c { flex:1; }
  .hm-corner { width:24px; flex-shrink:0; }
  .hm-head { margin-bottom:2px; }
  .hm-m { flex:1; font-size:9px; color: var(--muted-foreground, #888); overflow:hidden; white-space:nowrap; min-width:0; }
  .hm-lab { width:24px; font-size:9px; color: var(--muted-foreground, #888); text-align:right; padding-right:3px; }
  .hm-c { height:14px; border-radius:2px; min-width:0; }
  .hm-empty { background: transparent; }
  .hm-l0 { background: var(--muted, #222); }
  .hm-l1 { background: #0e4429; }
  .hm-l2 { background: #006d32; }
  .hm-l3 { background: #26a641; }
  .hm-l4 { background: #39d353; }
  .hm-c:hover { outline: 1px solid var(--foreground, #fff); }
  .hm-legend { display:flex; align-items:center; gap:3px; margin-top:6px; justify-content:flex-end; }
  .hm-legend .hm-c { width:10px; height:10px; flex:none; }
  .hm-legend-label { font-size:9px; color: var(--muted-foreground, #888); margin: 0 4px; }

  .sec-head { display:flex; align-items:center; gap:6px; width:100%; background:transparent; border:0; padding:2px 0; cursor:pointer; color: inherit; font: inherit; text-align:left; }
  .sec-head:hover .section-title { color: var(--foreground, #ddd); }
  .sec-chev { color: var(--muted-foreground, #888); font-size:10px; width:10px; }
  .sec-count { margin-left:auto; font-size:10px; color: var(--muted-foreground, #888); background: var(--muted, #2a2a2a); border-radius:8px; padding:1px 6px; font-variant-numeric:tabular-nums; }
  .sec-body { display:flex; flex-direction:column; gap:2px; padding-top:4px; }

  .list-row { display:grid; grid-template-columns: minmax(0,1fr) 2fr 40px; align-items:center; gap:8px; padding:2px 0; font-size:11px; }
  .list-name { color: var(--foreground, #ddd); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .list-bar-wrap { height:6px; background: var(--muted, #222); border-radius:3px; overflow:hidden; }
  .list-bar { height:100%; background: var(--primary, #4a7); border-radius:3px; }
  .list-val { text-align:right; font-variant-numeric: tabular-nums; color: var(--muted-foreground, #aaa); }

  .err { background: var(--destructive, #633); color: var(--destructive-foreground, #fdd); border:1px solid var(--destructive, #844); border-radius:6px; padding:8px 10px; font-size:11px; }
  .empty { color: var(--muted-foreground, #888); font-size: 11px; padding: 8px 0; text-align:center; }
`;
document.head.appendChild(css);

host.onReady((ctx) => {
  applyHostReady(ctx, document.documentElement);
  void paint();
});
