'use strict';

const fs = require('fs');
const path = require('path');
const { isBookFilename } = require('./path-safety');
const { extractTitleAndDescription, isStoredTextCorrupt } = require('./metadata-extract');

/**
 * همگام‌سازی ایندکس متادیتا --- rebuild and repair book_metadata from content tree ---
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
 * @returns {Promise<{ inserted: number, updated: number, skipped: number }>}
 */
async function syncMetadataIndex(bookRepository, contentDocsDirectory) {
  const docPaths = walkBookFiles(contentDocsDirectory, '');
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const docPath of docPaths) {
    const absolute = path.join(contentDocsDirectory, ...docPath.split('/'));
    const markdown = fs.readFileSync(absolute, 'utf8');
    const { title, description } = extractTitleAndDescription(markdown);
    const existing = bookRepository.getMetadata(docPath);

    if (!existing) {
      await bookRepository.upsertMetadata({
        docPath,
        title,
        description,
        coverType: 'none',
        coverValue: '',
      });
      inserted += 1;
      continue;
    }

    if (isStoredTextCorrupt(String(existing.title), String(existing.description))) {
      await bookRepository.upsertMetadata({
        docPath,
        title,
        description,
        coverType: String(existing.cover_type || 'none'),
        coverValue: String(existing.cover_value || ''),
      });
      updated += 1;
      continue;
    }

    skipped += 1;
  }

  return { inserted, updated, skipped };
}

module.exports = {
  syncMetadataIndex,
  walkBookFiles,
};
