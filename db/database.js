'use strict';

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

/**
 * Resolves sql.js wasm path inside node_modules.
 * @param {string} wasmFileName - WASM file name from sql.js
 * @returns {string} Absolute path
 */
function locateWasmFile(wasmFileName) {
  return path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', wasmFileName);
}

/**
 * Opens SQLite via sql.js (pure JS — no native rebuild per Node version).
 * @param {string} databaseFilePath - Path to articles.db
 * @returns {Promise<{ database: import('sql.js').Database, persist: () => void }>}
 */
async function openDatabase(databaseFilePath) {
  const directory = path.dirname(databaseFilePath);
  fs.mkdirSync(directory, { recursive: true });

  const sql = await initSqlJs({ locateFile: locateWasmFile });

  let database;
  if (fs.existsSync(databaseFilePath)) {
    const buffer = fs.readFileSync(databaseFilePath);
    database = new sql.Database(buffer);
  } else {
    database = new sql.Database();
  }

  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  database.exec(schemaSql);

  /**
   * Writes in-memory database to disk.
   */
  function persist() {
    const exported = database.export();
    fs.writeFileSync(databaseFilePath, Buffer.from(exported));
  }

  persist();
  return { database, persist };
}

/**
 * Data access layer for articles table.
 */
class ArticleRepository {
  /**
   * @param {import('sql.js').Database} database - sql.js database instance
   * @param {() => void} persist - Flush database to disk
   */
  constructor(database, persist) {
    this.database = database;
    this.persist = persist;
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, source: string, dateAdded: number, updatedAt: number }} article
   */
  insertArticle(article) {
    this.database.run(
      `INSERT INTO articles (slug, filename, markdown, html, source, date_added, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        article.slug,
        article.filename,
        article.markdown,
        article.html,
        article.source,
        article.dateAdded,
        article.updatedAt,
      ],
    );
    this.persist();
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, source: string, dateAdded: number, updatedAt: number }} article
   */
  updateArticle(article) {
    this.database.run(
      `UPDATE articles
       SET filename = ?, markdown = ?, html = ?, source = ?, updated_at = ?
       WHERE slug = ?`,
      [
        article.filename,
        article.markdown,
        article.html,
        article.source,
        article.updatedAt,
        article.slug,
      ],
    );
    this.persist();
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, dateAdded: number, updatedAt: number }} article
   */
  upsertUpload(article) {
    const existing = this.findBySlug(article.slug);
    if (existing) {
      this.database.run(
        `UPDATE articles
         SET filename = ?, markdown = ?, html = ?, source = 'upload', updated_at = ?
         WHERE slug = ?`,
        [article.filename, article.markdown, article.html, article.updatedAt, article.slug],
      );
    } else {
      this.database.run(
        `INSERT INTO articles (slug, filename, markdown, html, source, date_added, updated_at)
         VALUES (?, ?, ?, ?, 'upload', ?, ?)`,
        [
          article.slug,
          article.filename,
          article.markdown,
          article.html,
          article.dateAdded,
          article.updatedAt,
        ],
      );
    }
    this.persist();
  }

  /**
   * @param {string} slug - Article slug
   * @returns {Record<string, unknown>|undefined}
   */
  findBySlug(slug) {
    const statement = this.database.prepare(
      'SELECT id, slug, filename, markdown, html, source, date_added, updated_at FROM articles WHERE slug = ?',
    );
    statement.bind([slug]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }

  /**
   * @returns {Array<Record<string, unknown>>}
   */
  listArticles() {
    const rows = [];
    const statement = this.database.prepare(
      'SELECT slug, filename, source, date_added, updated_at FROM articles ORDER BY date_added DESC',
    );
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    statement.free();
    return rows;
  }

  /**
   * @param {string} slug - Article slug
   * @returns {{ changes: number }}
   */
  deleteBySlug(slug) {
    this.database.run('DELETE FROM articles WHERE slug = ?', [slug]);
    const changes = this.database.getRowsModified();
    this.persist();
    return { changes };
  }

  /** @returns {{ changes: number }} */
  deleteAll() {
    this.database.run('DELETE FROM articles');
    const changes = this.database.getRowsModified();
    this.persist();
    return { changes };
  }

  /** Closes underlying SQLite connection. */
  close() {
    this.database.close();
  }
}

/**
 * Maps DB row to API list item.
 * @param {Record<string, unknown>} row - SQLite row
 * @returns {{ slug: string, filename: string, source: string, dateAdded: number, updatedAt: number }}
 */
function mapListRow(row) {
  return {
    slug: String(row.slug),
    filename: String(row.filename),
    source: String(row.source),
    dateAdded: Number(row.date_added),
    updatedAt: Number(row.updated_at),
  };
}

/**
 * Maps DB row to API detail item.
 * @param {Record<string, unknown>} row - SQLite row
 * @returns {Record<string, unknown>}
 */
function mapDetailRow(row) {
  return {
    slug: String(row.slug),
    filename: String(row.filename),
    markdown: String(row.markdown),
    html: String(row.html),
    source: String(row.source),
    dateAdded: Number(row.date_added),
    updatedAt: Number(row.updated_at),
  };
}

module.exports = {
  openDatabase,
  ArticleRepository,
  mapListRow,
  mapDetailRow,
};
