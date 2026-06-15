'use strict';

const fs = require('fs');
const path = require('path');
const { isBookFilename } = require('./path-safety');
const { extractTitleAndDescription } = require('./metadata-extract');

/**
 * همگام‌سازی ایندکس متادیتا --- rebuild empty book_metadata from content tree ---
 */

/**
 * @param {string} directory - Absolute directory
 * @param {string} relativePrefix - Path prefix under docs root
 * @returns {string[]} Relative doc paths
 */
function walkBookFiles(directory, relativePrefix) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  const results = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const childRelative = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
    const childAbsolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkBookFiles(childAbsolute, childRelative));
    } else if (entry.isFile() && isBookFilename(entry.name)) {
      results.push(childRelative);
    }
  }
  return results;
}

/**
 * @param {import('../db/book-repository').BookRepository} bookRepository
 * @param {string} contentDocsDirectory
 * @returns {Promise<{ inserted: number, skipped: number }>}
 */
async function syncMetadataIndex(bookRepository, contentDocsDirectory) {
  const docPaths = walkBookFiles(contentDocsDirectory, '');
  let inserted = 0;
  let skipped = 0;

  for (const docPath of docPaths) {
    const existing = bookRepository.getMetadata(docPath);
    if (existing) {
      skipped += 1;
      continue;
    }
    const absolute = path.join(contentDocsDirectory, ...docPath.split('/'));
    const markdown = fs.readFileSync(absolute, 'utf8');
    const { title, description } = extractTitleAndDescription(markdown);
    await bookRepository.upsertMetadata({
      docPath,
      title,
      description,
      coverType: 'none',
      coverValue: '',
    });
    inserted += 1;
  }

  return { inserted, skipped };
}

module.exports = {
  syncMetadataIndex,
  walkBookFiles,
};
