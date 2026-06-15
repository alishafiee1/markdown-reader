'use strict';

/**
 * متادیتا و پیشرفت مطالعه --- book_metadata and reading_progress data access ---
 */
class BookRepository {
  /**
   * @param {import('sql.js').Database} database
   * @param {import('./write-queue').WriteQueue} writeQueue
   * @param {() => void} persist
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
   * @param {string} docPath
   * @returns {Record<string, unknown>|undefined}
   */
  getMetadata(docPath) {
    const statement = this.database.prepare(
      'SELECT doc_path, title, description, cover_type, cover_value, updated_at FROM book_metadata WHERE doc_path = ?',
    );
    statement.bind([docPath]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }

  /**
   * @param {{ docPath: string, title: string, description?: string, coverType?: string, coverValue?: string }} input
   * @returns {Promise<void>}
   */
  async upsertMetadata(input) {
    const now = Date.now();
    await this.runWrite(() => {
      this.database.run(
        `INSERT INTO book_metadata (doc_path, title, description, cover_type, cover_value, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(doc_path) DO UPDATE SET
           title = excluded.title,
           description = excluded.description,
           cover_type = excluded.cover_type,
           cover_value = excluded.cover_value,
           updated_at = excluded.updated_at`,
        [
          input.docPath,
          input.title,
          input.description || '',
          input.coverType || 'none',
          input.coverValue || '',
          now,
        ],
      );
    });
  }

  /**
   * @param {string} docPath
   * @param {{ title?: string, description?: string, coverType?: string, coverValue?: string }} patch
   * @returns {Promise<Record<string, unknown>|undefined>}
   */
  async patchMetadata(docPath, patch) {
    const existing = this.getMetadata(docPath);
    const merged = {
      docPath,
      title: patch.title ?? (existing ? String(existing.title) : ''),
      description: patch.description ?? (existing ? String(existing.description) : ''),
      coverType: patch.coverType ?? (existing ? String(existing.cover_type) : 'none'),
      coverValue: patch.coverValue ?? (existing ? String(existing.cover_value) : ''),
    };
    await this.upsertMetadata(merged);
    return this.getMetadata(docPath);
  }

  /**
   * @returns {Array<Record<string, unknown>>}
   */
  listAllMetadata() {
    const rows = [];
    const statement = this.database.prepare(
      'SELECT doc_path, title, description, cover_type, cover_value, updated_at FROM book_metadata',
    );
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    statement.free();
    return rows;
  }

  /**
   * @param {number} userId
   * @param {string} docPath
   * @param {number} scrollRatio
   * @returns {Promise<void>}
   */
  async saveProgress(userId, docPath, scrollRatio) {
    const now = Date.now();
    const ratio = Math.max(0, Math.min(1, Number(scrollRatio) || 0));
    await this.runWrite(() => {
      this.database.run(
        `INSERT INTO reading_progress (user_id, doc_path, scroll_ratio, last_opened_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, doc_path) DO UPDATE SET
           scroll_ratio = excluded.scroll_ratio,
           last_opened_at = excluded.last_opened_at`,
        [userId, docPath, ratio, now],
      );
    });
  }

  /**
   * @param {number} userId
   * @param {number} limit
   * @returns {Array<Record<string, unknown>>}
   */
  getRecentProgress(userId, limit = 3) {
    const rows = [];
    const statement = this.database.prepare(
      `SELECT doc_path, scroll_ratio, last_opened_at
       FROM reading_progress WHERE user_id = ?
       ORDER BY last_opened_at DESC LIMIT ?`,
    );
    statement.bind([userId, limit]);
    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
    statement.free();
    return rows;
  }

  /**
   * @param {number} userId
   * @param {string} docPath
   * @returns {Record<string, unknown>|undefined}
   */
  getProgress(userId, docPath) {
    const statement = this.database.prepare(
      'SELECT doc_path, scroll_ratio, last_opened_at FROM reading_progress WHERE user_id = ? AND doc_path = ?',
    );
    statement.bind([userId, docPath]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }
}

module.exports = {
  BookRepository,
};
