## Why

The current markdown reader works but only shows a flat first-level folder list with an editor-like sidebar — not a professional bookshelf experience. Users cannot browse nested documentation folders, switch between four reading comfort themes, resume reading from saved scroll position, or search across the library. We need a dark, modern BookShelf-style web library so technical docs in `content/docs/` are pleasant to read on phone, tablet, and desktop without forcing login.

## What Changes

- Replace flat article list with **folder explorer** (one level per request, breadcrumb navigation, deep links via `?path=`)
- Add **BookShelf dark UI**: home, library, reader, account pages with bottom navigation
- Add **four reading themes** (day, sepia, dim, night) + font scale + fullscreen mode on the reader card only
- Add **optional auth**: simple register/login; logged-in users get theme preferences and scroll progress for last 3 books on server
- Add **admin cover editing**: title, description, color cover, or image upload (max 2MB)
- Add **library search** (title/description/filename) and **in-document search** with highlight
- Add new SQLite tables: `users`, `sessions`, `user_preferences`, `book_metadata`, `reading_progress`
- **BREAKING**: Replace legacy flat sidebar/drawer UI and first-level-only sync with explorer-based browse API
- Default server: `PORT=4001`, `HOST=0.0.0.0` for LAN access

## Capabilities

### New Capabilities

- `folder-explorer`: Safe one-level folder browsing API, breadcrumb library UI, deep links
- `document-reader`: Document fetch/render, four reading themes, fullscreen, in-doc search, progress bar
- `user-auth`: Register, login, logout, session cookie, user preferences (theme, font scale)
- `reading-progress`: Debounced scroll position save, continue-reading section (max 3 recent), guest localStorage fallback
- `admin-book-metadata`: Admin-only book title/description/cover edit, image upload, metadata sync index
- `library-search`: Library-wide search API and home search UI

### Modified Capabilities

- _(none — greenfield capabilities for this change)_

## Non-goals (phase 1)

- Native mobile app (responsive web only)
- In-browser markdown editing or real-time collaboration
- Comments, ratings, or social features
- OAuth, 2FA, or complex password recovery
- Heavy full-text search engine across all files
- Separate taxonomy beyond folder structure
- Text-to-speech or audio playback
- Public file upload by regular users (content stays on server disk; admin edits covers only)

## Impact

- **server.js** — new routes, default port/host, startup sync-index
- **routes/** — new browse, doc, auth, progress, admin, search routers; legacy articles router deprecated
- **services/** — `browse-tree.js`, shared title/description extraction, markdown render
- **db/** — new schema tables, migration from legacy `articles` if present
- **public/** — full BookShelf UI redesign (welcome, home, library, reader, account)
- **data/** — SQLite DB + `covers/` directory for uploaded images
- **tests/** — browse, auth, progress API tests behind `MD_READER_RUN_TESTS=1`
- **docs/** — human FA docs remain in `docs/change/bookshelf-reader/`; deploy in `docs/server-deploy.md`
