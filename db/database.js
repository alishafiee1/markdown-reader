'use strict';

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const { WriteQueue } = require('./write-queue');
const { UserRepository } = require('./user-repository');
const { BookRepository } = require('./book-repository');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const BCRYPT_ROUNDS = 10;

/**
 * Resolves sql.js wasm path inside node_modules.
 * @param {string} wasmFileName - WASM file name from sql.js
 * @returns {string} Absolute path
 */
function locateWasmFile(wasmFileName) {
  return path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', wasmFileName);
}

/**
 * Seeds default admin when no admin exists.
 * @param {UserRepository} userRepository
 * @returns {Promise<void>}
 */
async function seedAdminUser(userRepository) {
  if (userRepository.hasAdminUser()) {
    return;
  }
  const password = process.env.ADMIN_SEED_PASSWORD || 'admino';
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const now = Date.now();
  await userRepository.runWrite(() => {
    userRepository.database.run(
      'INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
      ['admino', passwordHash, 'admin', now],
    );
    const userId = userRepository.database.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    userRepository.database.run(
      'INSERT INTO user_preferences (user_id, reading_theme, font_scale) VALUES (?, ?, ?)',
      [userId, 'night', 'normal'],
    );
  });
}

/**
 * Opens SQLite via sql.js (pure JS — no native rebuild per Node version).
 * @param {string} databaseFilePath - Path to articles.db
 * @returns {Promise<{ database: import('sql.js').Database, persist: () => void, writeQueue: WriteQueue, articleRepository: ArticleRepository, userRepository: UserRepository, bookRepository: BookRepository }>}
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

  const writeQueue = new WriteQueue();

  /**
   * Writes in-memory database to disk.
   */
  function persist() {
    const exported = database.export();
    fs.writeFileSync(databaseFilePath, Buffer.from(exported));
  }

  const articleRepository = new ArticleRepository(database, writeQueue, persist);
  const userRepository = new UserRepository(database, writeQueue, persist);
  const bookRepository = new BookRepository(database, writeQueue, persist);

  await seedAdminUser(userRepository);
  persist();

  return {
    database,
    persist,
    writeQueue,
    articleRepository,
    userRepository,
    bookRepository,
  };
}

/**
 * Data access layer for articles table.
 */
class ArticleRepository {
  /**
   * @param {import('sql.js').Database} database - sql.js database instance
   * @param {WriteQueue} writeQueue - Serialized writes
   * @param {() => void} persist - Flush database to disk
   */
  constructor(database, writeQueue, persist) {
    this.database = database;
    this.writeQueue = writeQueue;
    this.persist = persist;
  }

  /**
   * @param {() => void} operation
   * @returns {Promise<void>}
   */
  runWrite(operation) {
    return this.writeQueue.enqueue(() => {
      operation();
      this.persist();
    });
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, source: string, dateAdded: number, updatedAt: number }} article
   * @returns {Promise<void>}
   */
  async insertArticle(article) {
    await this.runWrite(() => {
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
    });
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, source: string, dateAdded: number, updatedAt: number }} article
   * @returns {Promise<void>}
   */
  async updateArticle(article) {
    await this.runWrite(() => {
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
    });
  }

  /**
   * @param {{ slug: string, filename: string, markdown: string, html: string, dateAdded: number, updatedAt: number }} article
   * @returns {Promise<void>}
   */
  async upsertUpload(article) {
    await this.runWrite(() => {
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
    });
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
   * @returns {Promise<{ changes: number }>}
   */
  async deleteBySlug(slug) {
    let changes = 0;
    await this.runWrite(() => {
      this.database.run('DELETE FROM articles WHERE slug = ?', [slug]);
      changes = this.database.getRowsModified();
    });
    return { changes };
  }

  /** @returns {Promise<{ changes: number }>} */
  async deleteAll() {
    let changes = 0;
    await this.runWrite(() => {
      this.database.run('DELETE FROM articles');
      changes = this.database.getRowsModified();
    });
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
  UserRepository,
  BookRepository,
  mapListRow,
  mapDetailRow,
};
