'use strict';

const fs = require('fs');
const path = require('path');

const COVER_URL_PREFIX = '/api/covers/';

/**
 * فایل‌های جلد --- safe cover file cleanup helpers ---
 */

/**
 * @param {string} coverValue
 * @returns {string|undefined}
 */
function extractLocalCoverFileName(coverValue) {
  const value = String(coverValue || '');
  if (!value.startsWith(COVER_URL_PREFIX)) {
    return undefined;
  }
  return path.basename(value.slice(COVER_URL_PREFIX.length));
}

/**
 * @param {string} coversDirectory
 * @param {string} coverValue
 * @returns {boolean}
 */
function deleteCoverFileIfExists(coversDirectory, coverValue) {
  const fileName = extractLocalCoverFileName(coverValue);
  if (!fileName) {
    return false;
  }
  const coverPath = path.join(coversDirectory, fileName);
  if (!fs.existsSync(coverPath)) {
    return false;
  }
  fs.unlinkSync(coverPath);
  return true;
}

module.exports = {
  deleteCoverFileIfExists,
  extractLocalCoverFileName,
};
