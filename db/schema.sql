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
