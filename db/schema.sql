CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  markdown TEXT NOT NULL,
  html TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('bundle', 'upload')),
  date_added INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date_added DESC);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  reading_theme TEXT NOT NULL DEFAULT 'night' CHECK(reading_theme IN ('day', 'sepia', 'dim', 'night')),
  font_scale TEXT NOT NULL DEFAULT 'normal' CHECK(font_scale IN ('normal', 'large', 'xlarge'))
);

CREATE TABLE IF NOT EXISTS book_metadata (
  doc_path TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_type TEXT NOT NULL DEFAULT 'none' CHECK(cover_type IN ('none', 'color', 'image')),
  cover_value TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc_path TEXT NOT NULL,
  scroll_ratio REAL NOT NULL DEFAULT 0 CHECK(scroll_ratio >= 0 AND scroll_ratio <= 1),
  last_opened_at INTEGER NOT NULL,
  UNIQUE(user_id, doc_path)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON reading_progress(user_id, last_opened_at DESC);
