'use strict';

/**
 * صف نوشتن برای sql.js --- serializes DB writes to avoid concurrent corruption ---
 */
class WriteQueue {
  constructor() {
    /** @type {Promise<void>} */
    this.chain = Promise.resolve();
  }

  /**
   * Enqueues a write operation.
   * @param {() => void | Promise<void>} operation - Sync or async write
   * @returns {Promise<void>}
   */
  enqueue(operation) {
    this.chain = this.chain.then(() => Promise.resolve(operation()));
    return this.chain;
  }
}

module.exports = {
  WriteQueue,
};
