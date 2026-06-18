(function () {
  'use strict';

  /**
   * فرار HTML --- escape text before inserting into innerHTML ---
   */

  /**
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.BookShelfHtml = { escapeHtml };
})();
