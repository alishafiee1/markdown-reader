## 1. Foundation — schema, port, browse service (Phase 0)

> Risk: if bind stays on 127.0.0.1, server is unreachable from LAN.

- [ ] 1.1 Add new tables in `db/schema.sql`: `users`, `sessions`, `user_preferences`, `book_metadata`, `reading_progress`
- [ ] 1.2 Update `db/database.js` init: create DB if missing, seed admin `admino` with bcrypt hash
- [ ] 1.3 Update `server.js`: default `PORT=4001`, bind `0.0.0.0` when `NODE_ENV=production` or `HOST=0.0.0.0`
- [ ] 1.4 Create `services/browse-tree.js`: safe one-level listing from `content/docs`
- [ ] 1.5 Create `routes/browse.js` with `GET /api/browse`; wire in `server.js`
- [ ] 1.6 Add test in `tests/`: path with `..` returns 400
- [ ] 1.7 **Phase done:** `GET /api/browse` at root returns folder list

## 2. Explorer and document reading (Phase 1)

> Risk: legacy sync only handles first level — replace with browse.

- [ ] 2.1 Create `routes/doc.js` with `GET /api/doc?path=` — read file + render HTML via `services/markdown-render.js`
- [ ] 2.2 Add `services/metadata-extract.js`: title/description from first lines or heading (shared with browse)
- [ ] 2.3 Build library UI in `public/js/library.js`: breadcrumb, folder/book grid
- [ ] 2.4 Wire book click → reader page; back returns to same folder
- [ ] 2.5 Support deep link `?path=` in `public/js/router.js` or `app.js`
- [ ] 2.6 Manual E2E: open `content/docs/00-start-new-project/readme.md` and verify render
- [ ] 2.7 **Phase done:** subfolder navigation works like file explorer

## 3. BookShelf UI and reading themes (Phase 2)

> See `docs/change/bookshelf-reader/reading-themes-guide.md` and `ui-behavior.md`.

- [ ] 3.1 Add CSS tokens in `public/css/tokens.css`: dark app shell (`--bg-black`, `--accent-blue`, etc.)
- [ ] 3.2 Build home page in `public/js/home.js`: search bar, category pills, bottom nav
- [ ] 3.3 Implement four reading themes + three font scales in `public/js/reader.js` and `public/css/reader-themes.css`
- [ ] 3.4 Add fullscreen mode + Escape handler in reader
- [ ] 3.5 Responsive layout: 375px, 768px, 1024px — no horizontal scroll
- [ ] 3.6 Replace emoji icons with inline SVG in `public/`
- [ ] 3.7 Add `prefers-reduced-motion` and verify theme contrast
- [ ] 3.8 Manual test: all four themes on mixed FA/EN document
- [ ] 3.9 **Phase done:** UI matches BookShelf reference (welcome, home, library, reader, bottom nav)

## 4. Auth and continue reading (Phase 3)

- [ ] 4.1 Create `routes/auth.js`: `POST /api/auth/register`, `login`, `logout`; `GET /api/me`
- [ ] 4.2 Implement httpOnly session cookie middleware in `middleware/session.js`
- [ ] 4.3 Create `routes/progress.js`: `PUT /api/progress` with client debounce (~2s)
- [ ] 4.4 Add `GET /api/progress/recent` — max 3 items
- [ ] 4.5 Build "Continue reading" section on home for logged-in users
- [ ] 4.6 Guest fallback: `localStorage` for theme + optional one recent book
- [ ] 4.7 Add `PUT /api/me/preferences` for theme and font scale
- [ ] 4.8 E2E test: login → read → close → return → same scroll position
- [ ] 4.9 **Phase done:** three recent books with correct positions

## 5. Admin panel and book covers (Phase 4)

- [ ] 5.1 Add `middleware/require-admin.js` for admin-only routes
- [ ] 5.2 Create `routes/admin-books.js`: `PATCH /api/admin/books/:path` for title, description, cover color
- [ ] 5.3 Add `POST /api/admin/books/:path/cover` with multer (max 2MB, jpeg/png/webp) → `data/covers/`
- [ ] 5.4 Build admin edit modal in `public/js/admin-cover-modal.js` (pencil icon on book cards)
- [ ] 5.5 Cover preview: color, image, or fallback from md first lines
- [ ] 5.6 Show "change default password" banner for `admino` on account page
- [ ] 5.7 Manual test: upload cover + verify grid update
- [ ] 5.8 **Phase done:** admin can fully manage book metadata

## 6. Search and index sync (Phase 5)

- [ ] 6.1 Create `routes/search.js`: `GET /api/search?q=` on title, description, filename
- [ ] 6.2 Implement in-document search with highlight in `public/js/reader-search.js`
- [ ] 6.3 Create `services/sync-index.js` + `POST /api/sync-index` for admin metadata rebuild
- [ ] 6.4 Run lightweight sync-index on server startup (non-blocking)
- [ ] 6.5 Test: search "nginx" returns results from multiple folders
- [ ] 6.6 **Phase done:** library search and in-doc search both work

## 7. Deploy, tests, cleanup (Phase 6)

- [ ] 7.1 Update `README.md` and `docs/server-deploy.md`
- [ ] 7.2 Update `.env.example` with `PORT=4001`, `HOST=0.0.0.0`
- [ ] 7.3 Extend `tests/` with browse, auth, progress cases (`MD_READER_RUN_TESTS=1`)
- [ ] 7.4 Smoke: `curl http://localhost:4001/api/browse`
- [ ] 7.5 Remove legacy drawer/upload UI from `public/`
- [ ] 7.6 **Phase done:** reachable at `192.168.x.x:4001` on LAN

## Priority if time is limited

1. Sections 1 + 2 + 3 — MVP (explorer + UI + themes)
2. Section 4 — continue reading
3. Section 5 — admin covers
4. Section 6 — search

## After implementation

- Archive human docs folder via `/sync-docs` as `1405-XX-XX-bookshelf-reader` when complete
- Store production admin password in `docs-personal/`, not public git
