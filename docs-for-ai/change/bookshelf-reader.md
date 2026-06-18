# docs-for-ai — bookshelf-reader (compact)

**Change folder:** `docs/change/bookshelf-reader/`  
**Human docs (FA):** proposal.md, design.md, ui-behavior.md, reading-themes-guide.md, tasks.md

## Project context

Standalone Node app — **no CMS/module packaging** in this repo. Deploy: `docs/server-deploy.md` (port 4002, HOST 0.0.0.0, HTTPS production uses `COOKIE_SECURE=true` + `TRUST_PROXY=1`).

## Goal

Replace flat article list with **folder explorer** over `content/docs`, **BookShelf dark UI**, **4 reading themes + fullscreen**, optional **auth** (theme + 3-doc scroll progress), **admin cover/metadata**, **library + in-doc search**.

## Stack (keep)

- Node 18+, Express, sql.js, marked, multer
- No React — vanilla JS modules or split `public/` files
- Content stays on disk; DB for users, metadata, progress only

## New DB tables

- `users` (role admin|user), `sessions`, `user_preferences`, `book_metadata` (doc_path unique), `reading_progress`

## Seed admin

- username `admino`, initial password per design (hash only in DB); change in production

## Key APIs

| Endpoint | Notes |
|----------|--------|
| GET `/api/browse?path=` | Safe one-level listing |
| GET `/api/doc?path=` | Rendered HTML + TOC; raw markdown is not exposed |
| GET `/api/search?q=` | Title/desc/filename |
| POST `/api/auth/*` | register, login, logout |
| GET/PUT `/api/me`, `/api/me/preferences` | |
| PUT `/api/progress`, GET `/api/progress/recent` | max 3 |
| PATCH `/api/admin/books/:path`, POST cover | admin only |
| POST `/api/sync-index` | rebuild empty metadata |

## Server defaults

- `PORT=4002`, `HOST=0.0.0.0`
- Path traversal blocked on all `path` params
- `GET /api/browse`, `/api/doc`, and `/api/search` are intentionally public; progress/admin APIs require session auth
- Production cookies are `httpOnly`, `sameSite=lax`, and `secure` when `NODE_ENV=production` or `COOKIE_SECURE=true`

## UI pages

1. Welcome (first visit optional)
2. Home — search, top-level categories, continue reading (3)
3. Library — breadcrumb explorer, book cards
4. Reader — themes, fullscreen, in-doc search, progress bar
5. Account — login/register
6. Admin — cover modal on book cards

## Reading themes (reader card only)

`day` | `sepia` | `dim` | `night` — see reading-themes-guide.md hex tokens

## Default cover

Line 1 title, line 2 description from `.md` unless admin overrides

## Implementation order

See tasks.md phases 0→6. MVP = phases 0+1+2.

## Tests

`MD_READER_RUN_TESTS=1 npm test` — add browse, auth, progress cases

## Packaging elsewhere

Future CMS integration via separate skill — do not add zip/wizard scripts to this repo.
