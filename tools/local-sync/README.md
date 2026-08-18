# Local sync CLI

Reports **building now** (+ branch) on Deen Dynamics project cards while you work locally.

It does **not** create cards. Card creation is the GitHub webhook graph on the Next.js app.

## Setup

```bash
cp tools/local-sync/deen-sync.example.json ~/.deen-sync.json
```

Edit `~/.deen-sync.json`:

- `endpoint` — deployed site origin (no trailing slash)
- `secret` — same value as `SYNC_SECRET` on Vercel
- `roots` — folders that contain git checkouts

The CLI matches remotes of the form `github.com/QOOlajide/<repo>`.

## Run

```bash
npm run sync:local
# or
node tools/local-sync/sync.mjs
```

Heartbeats expire after ~20 minutes on the server.
