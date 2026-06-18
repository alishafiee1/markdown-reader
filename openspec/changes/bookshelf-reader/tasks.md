## 1. Foundation — schema, port, browse service (Phase 0)

> Risk: if bind stays on 127.0.0.1, server is unreachable from LAN.

- [x] 1.1 Add new tables in `db/schema.sql`: `users`, `sessions`, `user_preferences`, `book_metadata`, `reading_progress`
- [x] 1.2 Update `db/database.js` init: create DB if missing, seed admin `admino` with bcrypt hash
- [x] 1.3 Update `server.js`: default `PORT=4002`, bind `0.0.0.0` when `NODE_ENV=production` or `HOST=0.0.0.0`
- [x] 1.4 Create `services/browse-tree.js`: safe one-level listing from `content/docs`
- [x] 1.5 Create `routes/browse.js` with `GET /api/browse`; wire in `server.js`
- [x] 1.6 Add test in `tests/`: path with `..` returns 400
- [x] 1.7 **Phase done:** `GET /api/browse` at root returns folder list

## 2. Explorer and document reading (Phase 1)

> Risk: legacy sync only handles first level — replace with browse.

- [x] 2.1 Create `routes/doc.js` with `GET /api/doc?path=` — read file + render HTML via `services/markdown-render.js`
- [x] 2.2 Add `services/metadata-extract.js`: title/description from first lines or heading (shared with browse)
- [x] 2.3 Build library UI in `public/js/library.js`: breadcrumb, folder/book grid
- [x] 2.4 Wire book click → reader page; back returns to same folder
- [x] 2.5 Support deep link `?path=` in `public/js/router.js` or `app.js`
- [x] 2.6 Manual E2E: open `content/docs/write-docs-friendly/readme.md` and verify render
- [x] 2.7 **Phase done:** subfolder navigation works like file explorer

## 3. BookShelf UI and reading themes (Phase 2)

> See `docs/change/bookshelf-reader/reading-themes-guide.md` and `ui-behavior.md`.

- [x] 3.1 Add CSS tokens in `public/css/tokens.css`: dark app shell (`--bg-black`, `--accent-blue`, etc.)
- [x] 3.2 Build home page in `public/js/home.js`: search bar, category pills, bottom nav
- [x] 3.3 Implement four reading themes + three font scales in `public/js/reader.js` and `public/css/reader-themes.css`
- [x] 3.4 Add fullscreen mode + Escape handler in reader
- [x] 3.5 Responsive layout: 375px, 768px, 1024px — no horizontal scroll
- [x] 3.6 Replace emoji icons with inline SVG in `public/`
- [x] 3.7 Add `prefers-reduced-motion` and verify theme contrast
- [x] 3.8 Manual test: all four themes on mixed FA/EN document
- [x] 3.9 **Phase done:** UI matches BookShelf reference (welcome, home, library, reader, bottom nav)

## 4. Auth and continue reading (Phase 3)

- [x] 4.1 Create `routes/auth.js`: `POST /api/auth/register`, `login`, `logout`; `GET /api/me`
- [x] 4.2 Implement httpOnly session cookie middleware in `middleware/session.js`
- [x] 4.3 Create `routes/progress.js`: `PUT /api/progress` with client debounce (~2s)
- [x] 4.4 Add `GET /api/progress/recent` — max 3 items
- [x] 4.5 Build "Continue reading" section on home for logged-in users
- [x] 4.6 Guest fallback: `localStorage` for theme + optional one recent book
- [x] 4.7 Add `PUT /api/me/preferences` for theme and font scale
- [x] 4.8 E2E test: login → read → close → return → same scroll position
- [x] 4.9 **Phase done:** three recent books with correct positions

## 5. Admin panel and book covers (Phase 4)

- [x] 5.1 Add `middleware/require-admin.js` for admin-only routes
- [x] 5.2 Create `routes/admin-books.js`: `PATCH /api/admin/books/:path` for title, description, cover color
- [x] 5.3 Add `POST /api/admin/books/:path/cover` with multer (max 2MB, jpeg/png/webp) → `data/covers/`
- [x] 5.4 Build admin edit modal in `public/js/admin-cover-modal.js` (pencil icon on book cards)
- [x] 5.5 Cover preview: color, image, or fallback from md first lines
- [x] 5.6 Show "change default password" banner for `admino` on account page
- [x] 5.7 Manual test: upload cover + verify grid update
- [x] 5.8 **Phase done:** admin can fully manage book metadata

## 6. Search and index sync (Phase 5)

- [x] 6.1 Create `routes/search.js`: `GET /api/search?q=` on title, description, filename
- [x] 6.2 Implement in-document search with highlight in `public/js/reader-search.js`
- [x] 6.3 Create `services/sync-index.js` + `POST /api/sync-index` for admin metadata rebuild
- [x] 6.4 Run lightweight sync-index on server startup (non-blocking)
- [x] 6.5 Test: search "nginx" returns results from multiple folders
- [x] 6.6 **Phase done:** library search and in-doc search both work

## 7. Deploy, tests, cleanup (Phase 6)

- [x] 7.1 Update `README.md` and `docs/server-deploy.md`
- [x] 7.2 Update `.env.example` with `PORT=4002`, `HOST=0.0.0.0`
- [x] 7.3 Extend `tests/` with browse, auth, progress cases (`MD_READER_RUN_TESTS=1`)
- [x] 7.4 Smoke: `curl http://localhost:4002/api/browse`
- [x] 7.5 Remove legacy drawer/upload UI from `public/`
- [x] 7.6 **Phase done:** reachable at `192.168.x.x:4002` on LAN

## Priority if time is limited

1. Sections 1 + 2 + 3 — MVP (explorer + UI + themes)
2. Section 4 — continue reading
3. Section 5 — admin covers
4. Section 6 — search

## After implementation

- Archive human docs folder via `/sync-docs` as `1405-XX-XX-bookshelf-reader` when complete
- Store production admin password in `docs-personal/`, not public git
