# Devin Usage — OpenChamber extension

> ⚠️ **Requires [`opencode-devin`](https://github.com/vanyapr/opencode-devin) OpenCode plugin.**
> The panel reads the Devin session token from OpenCode's credential store (`opencode api get /api/credential` → `integrationID: "devin"`). Without the plugin, quota and activity endpoints won't have a credential to call `server.codeium.com` with.

A panel for [OpenChamber](https://docs.openchamber.dev) that shows your Devin (Cognition) usage: current quota, daily activity, models and tools breakdown.

## Features

- **Quota cards** — daily & weekly usage with reset times, credit balance
- **Activity heatmap** — GitHub-style contribution grid, last 120 days
- **Top models & tools** — collapsible lists, persisted across sessions
- **Plan info** — user name, plan tier (`PRO`), plan end date
- **Auto-refresh** — click Refresh to re-fetch

## How it works

- **Panel** (`panel/`) — sandboxed iframe, talks to host via `connectHost()` from `@openchamber/sdk`
- **Service** (`service/`) — local Node/Bun process on `127.0.0.1`, calls `server.codeium.com` protobuf endpoints (`GetPlanStatus`, `GetAnalytics`, `GetCurrentUser`) and serves them as JSON
- **Token** — resolved once per request from OpenCode's credential store via `opencode api get /api/credential`

## Install

1. Make sure [`opencode-devin`](https://github.com/vanyapr/opencode-devin) is installed and you've authenticated (`opencode auth login` / Devin integration).
2. In OpenChamber: **Settings → Extensions → Add** → point at this folder.
3. Approve the `service` permission (it spawns a local process).
4. Click the Devin Usage icon on the rail.

## Develop

```sh
bun install
bunx openchamber-guest-bundle panel/main.ts panel/main.js
```

The service needs no build — plain ES module that runs under Bun/Node.

## Layout

```
openchamber-devin-usage/
├── package.json            # manifest: panel + service contributes
├── panel/
│   ├── index.html          # panel entry
│   ├── main.ts             # UI source
│   └── main.js             # bundled IIFE (generated)
└── service/
    └── main.js             # HTTP server on 127.0.0.1, protobuf wire
```
