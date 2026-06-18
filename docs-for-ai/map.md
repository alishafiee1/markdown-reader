
# markdown-reader — project map

Standalone Node web app. **Not** a CMS module. No zip/build scripts.

## Entry

- `server.js` — Express, `PORT` default 4002, `HOST` default 0.0.0.0
- `npm start` / `npm test` (`MD_READER_RUN_TESTS=1`)

## Layout

| Path | Role |
|------|------|
| `routes/` | HTTP handlers |
| `services/` | content-sync, markdown-render |
| `db/` | sql.js schema + repository |
| `public/` | static UI (legacy; BookShelf redesign pending) |
| `content/docs/` | markdown tree (source of truth on disk) |
| `data/` | sqlite + future covers (gitignored db) |

## Docs

- Human FA: `docs/proposal.md`, `docs/server-deploy.md`, `docs/architecture-and-structure.md`
- Active change: `docs/change/bookshelf-reader/` + `docs-for-ai/change/bookshelf-reader.md`

## Deploy

Direct on server only. See `docs/server-deploy.md` (pm2/systemd). No ModuleHub paths.

## Future packaging

Separate skill/repo step — keep this tree clean for normal `node server.js` testing.
