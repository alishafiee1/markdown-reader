## Context

Standalone Node.js web app serving markdown from `content/docs/` on disk. Current state: Express + sql.js with flat `articles` table, first-level sync only, legacy sidebar UI in `public/`. Users need a BookShelf-style dark library with folder explorer, reading themes, optional auth, and admin cover editing.

Human UI specs (FA): `docs/change/bookshelf-reader/ui-behavior.md`  
Reading theme tokens (FA): `docs/change/bookshelf-reader/reading-themes-guide.md`

## Goals / Non-Goals

**Goals:**

- Folder explorer over `content/docs` (one level per API call, path traversal blocked)
- Reader with 4 themes, font scale, fullscreen, in-doc search, scroll progress
- Optional auth: theme + last 3 books with scroll position on server
- Admin: edit title, description, color cover, or upload image (max 2MB)
- Library search on title/description/filename; responsive web (375px–desktop)
- Deploy on port 4001, bind `0.0.0.0` for LAN access

**Non-Goals:**

- Native app, markdown editing, OAuth/2FA, heavy search engine, public upload, audio — see proposal Non-goals

## Decisions

### Architecture: content on disk, metadata in SQLite

Markdown files stay on disk as source of truth. SQLite (sql.js in-process) stores only: users, sessions, preferences, book metadata, reading progress. Cover images stored in `data/covers/` on disk.

**Alternative considered:** Copy markdown into DB — rejected; complicates sync and git workflow.

### Browse: one level per request

`GET /api/browse?path=` returns folders + text files for one directory only. Large trees stay fast; client navigates incrementally.

**Alternative considered:** Full tree in one response — rejected for large `content/docs` trees.

### Default cover from file lines

If no `book_metadata` row: line 1 (or first heading) = title, line 2 = description. Shared extraction function used by browse, doc, and sync-index.

### Reading progress: debounced client save

Logged-in users: client sends `PUT /api/progress` ~2s after scroll stops with `scrollRatio` (0–1). Not per-pixel — avoids server load on weak devices.

Guests: `localStorage` for theme, font scale, optional last book scroll.

### Auth: simple sessions

Username min 3 chars, password min 4 chars. bcrypt hash. httpOnly session cookie (~30 days). Seed admin `admino` on first boot if no admin exists (password in docs-personal, not public docs).

### Path security

Normalize all `path` params; reject `..`, absolute paths, paths outside `content/docs`. Hidden folders (dot-prefix) excluded from listings. Only `.md` and `.txt` as books.

### UI stack: vanilla JS modules

No React. Split `public/js/` by page (home, library, reader, account). CSS tokens for dark app shell; reading themes apply only to reader card (see reading-themes-guide.md).

### Migration from legacy articles

Add new tables without dropping `articles` initially. Replace flat sidebar with explorer UI. Deprecate or redirect old article endpoints in later task phase.

### Write queue for sql.js

Single-process sql.js: short in-memory write queue before persist to avoid concurrent write corruption.

## API Endpoints

All prefixed `/api/`:

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/browse?path=` | none | One-level folder listing |
| GET | `/doc?path=` | none | Raw markdown, HTML, optional TOC |
| GET | `/search?q=` | none | Library search (title, desc, filename) |
| POST | `/auth/register` | none | Create account |
| POST | `/auth/login` | none | Start session |
| POST | `/auth/logout` | session | End session |
| GET | `/me` | session | Current user profile |
| PUT | `/me/preferences` | session | Theme, font scale |
| PUT | `/progress` | session | Save scroll position |
| GET | `/progress/recent` | session | Last 3 opened books |
| PATCH | `/admin/books/:path` | admin | Title, description, cover color |
| POST | `/admin/books/:path/cover` | admin | Upload cover image (multer, 2MB) |
| POST | `/sync-index` | admin | Rebuild empty metadata from tree |

## Database Schema (new tables)

- **users** — id, username (unique), password_hash, role (`admin`|`user`), created_at
- **sessions** — id, user_id, token_hash, expires_at
- **user_preferences** — user_id, reading_theme, font_scale
- **book_metadata** — doc_path (unique), title, description, cover_type (`none`|`color`|`image`), cover_value, updated_at
- **reading_progress** — user_id, doc_path, scroll_ratio, last_opened_at (unique on user_id + doc_path)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large folder tree feels overwhelming | One-level browse + breadcrumb; background sync-index with status flag |
| sql.js concurrent writes | In-memory write queue before persist |
| Mixed FA/EN text direction wrong in reader | Auto `dir` on paragraphs; UTF-8 everywhere |
| Bind localhost only — unreachable from LAN | Default `HOST=0.0.0.0`; document in server-deploy.md |
| Default admin password unchanged | Banner on first admin login to change password |
| In-doc search on huge docs slow | Cap highlight count; warn user if exceeded |

## Migration Plan

1. Deploy schema migration (new tables, keep articles)
2. Add browse/doc APIs alongside legacy articles
3. Ship new UI behind same origin; remove legacy drawer in phase 6
4. Rollback: revert to previous `public/` and routes if needed; DB tables additive only

## Open Questions

- Exact legacy `articles` endpoint removal vs redirect — decide during phase 1 implementation
- Welcome page skip flag: `localStorage` key name — implement in phase 2
