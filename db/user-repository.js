'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = 10;

/**
 * کاربران و نشست‌ها --- users, sessions, preferences data access ---
 */
class UserRepository {
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
   * @param {string} username
   * @returns {Record<string, unknown>|undefined}
   */
  findByUsername(username) {
    const statement = this.database.prepare(
      'SELECT id, username, password_hash, role, created_at FROM users WHERE username = ?',
    );
    statement.bind([username]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }

  /**
   * @param {number} userId
   * @returns {Record<string, unknown>|undefined}
   */
  findById(userId) {
    const statement = this.database.prepare(
      'SELECT id, username, password_hash, role, created_at FROM users WHERE id = ?',
    );
    statement.bind([userId]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }

  /**
   * @returns {boolean}
   */
  hasAdminUser() {
    const statement = this.database.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1");
    const exists = statement.step();
    statement.free();
    return exists;
  }

  /**
   * @param {{ username: string, password: string, role?: string }} input
   * @returns {Promise<Record<string, unknown>>}
   */
  async createUser(input) {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const now = Date.now();
    await this.runWrite(() => {
      this.database.run(
        'INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
        [input.username, passwordHash, input.role || 'user', now],
      );
      const userId = this.database.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
      this.database.run(
        'INSERT INTO user_preferences (user_id, reading_theme, font_scale) VALUES (?, ?, ?)',
        [userId, 'night', 'normal'],
      );
    });
    return this.findByUsername(input.username);
  }

  /**
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async verifyPassword(username, password) {
    const user = this.findByUsername(username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, String(user.password_hash));
  }

  /**
   * @param {number} userId
   * @returns {Record<string, unknown>|undefined}
   */
  getPreferences(userId) {
    const statement = this.database.prepare(
      'SELECT reading_theme, font_scale FROM user_preferences WHERE user_id = ?',
    );
    statement.bind([userId]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    return row;
  }

  /**
   * @param {number} userId
   * @param {{ readingTheme?: string, fontScale?: string }} prefs
   * @returns {Promise<void>}
   */
  async updatePreferences(userId, prefs) {
    const current = this.getPreferences(userId) || { reading_theme: 'night', font_scale: 'normal' };
    const theme = prefs.readingTheme || current.reading_theme;
    const scale = prefs.fontScale || current.font_scale;
    await this.runWrite(() => {
      this.database.run(
        `INSERT INTO user_preferences (user_id, reading_theme, font_scale) VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET reading_theme = excluded.reading_theme, font_scale = excluded.font_scale`,
        [userId, theme, scale],
      );
    });
  }

  /**
   * @param {number} userId
   * @returns {Promise<{ token: string, expiresAt: number }>}
   */
  async createSession(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    await this.runWrite(() => {
      this.database.run('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [
        userId,
        tokenHash,
        expiresAt,
      ]);
    });
    return { token, expiresAt };
  }

  /**
   * @param {string} token - Raw session token from cookie
   * @returns {Record<string, unknown>|undefined}
   */
  findUserBySessionToken(token) {
    if (!token) {
      return undefined;
    }
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const statement = this.database.prepare(
      `SELECT u.id, u.username, u.role, u.created_at, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    );
    statement.bind([tokenHash]);
    const row = statement.step() ? statement.getAsObject() : undefined;
    statement.free();
    if (!row) {
      return undefined;
    }
    if (Number(row.expires_at) < Date.now()) {
      this.deleteSessionByToken(token);
      return undefined;
    }
    return row;
  }

  /**
   * @param {string} token
   */
  deleteSessionByToken(token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    this.database.run('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
    this.persist();
  }

  /**
   * @param {string} token
   * @returns {Promise<void>}
   */
  async logout(token) {
    await this.runWrite(() => {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      this.database.run('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
    });
  }
}

module.exports = {
  UserRepository,
  SESSION_DAYS,
};
