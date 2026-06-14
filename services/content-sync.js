'use strict';

const fs = require('fs');
const path = require('path');
const { renderMarkdownToHtml } = require('./markdown-render');

const ALLOWED_EXTENSIONS = new Set(['.md', '.txt']);

/**
 * Builds URL-safe slug from a filename.
 * @param {string} filename - Original file name
 * @returns {string} Slug without extension
 */
function slugFromFilename(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF_-]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'article';
}

/**
 * Lists markdown files under content/docs.
 * @param {string} contentDocsDirectory - Absolute path to content/docs
 * @returns {string[]} Absolute file paths
 */
function listBundleMarkdownFiles(contentDocsDirectory) {
  if (!fs.existsSync(contentDocsDirectory)) {
    return [];
  }
  const entries = fs.readdirSync(contentDocsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => path.join(contentDocsDirectory, entry.name));
}

/**
 * Syncs bundled markdown files into SQLite without overwriting uploads.
 * @param {import('../db/database').ArticleRepository} articleRepository - DB layer
 * @param {string} contentDocsDirectory - Path to content/docs
 * @returns {{ inserted: number, updated: number, skipped: number }}
 */
function syncBundleContent(articleRepository, contentDocsDirectory) {
  const files = listBundleMarkdownFiles(contentDocsDirectory);
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const now = Date.now();

  for (const absolutePath of files) {
    const filename = path.basename(absolutePath);
    const slug = slugFromFilename(filename);
    const existing = articleRepository.findBySlug(slug);

    if (existing && existing.source === 'upload') {
      skipped += 1;
      continue;
    }

    const markdown = fs.readFileSync(absolutePath, 'utf8');
    const html = renderMarkdownToHtml(markdown);

    if (existing) {
      articleRepository.updateArticle({
        slug,
        filename,
        markdown,
        html,
        source: 'bundle',
        dateAdded: existing.date_added,
        updatedAt: now,
      });
      updated += 1;
    } else {
      articleRepository.insertArticle({
        slug,
        filename,
        markdown,
        html,
        source: 'bundle',
        dateAdded: now,
        updatedAt: now,
      });
      inserted += 1;
    }
  }

  return { inserted, updated, skipped };
}

module.exports = {
  slugFromFilename,
  listBundleMarkdownFiles,
  syncBundleContent,
};
