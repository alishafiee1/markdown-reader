'use strict';

const fs = require('fs');
const path = require('path');
const { resolveSafeContentPath, isBookFilename } = require('./path-safety');
const { extractTitleAndDescription, fallbackCoverColor } = require('./metadata-extract');

/**
 * مرور یک سطح پوشه --- safe one-level listing from content/docs ---
 */

/**
 * @param {string} contentDocsDirectory - Absolute docs root
 * @param {string} relativePath - Folder path relative to docs root
 * @param {(docPath: string) => Record<string, unknown>|undefined} getMetadata - DB metadata lookup
 * @returns {{ path: string, breadcrumbs: Array<{ label: string, path: string }>, folders: Array<Record<string, unknown>>, books: Array<Record<string, unknown>> }}
 */
function listOneLevel(contentDocsDirectory, relativePath, getMetadata) {
  const { relativePath: safePath, absolutePath } = resolveSafeContentPath(
    relativePath,
    contentDocsDirectory,
  );

  if (!fs.existsSync(absolutePath)) {
    return {
      path: safePath,
      breadcrumbs: buildBreadcrumbs(safePath),
      folders: [],
      books: [],
    };
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isDirectory()) {
    return {
      path: safePath,
      breadcrumbs: buildBreadcrumbs(safePath),
      folders: [],
      books: [],
    };
  }

  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  const folders = [];
  const books = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const childRelative = safePath ? `${safePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      folders.push({
        name: entry.name,
        path: childRelative,
      });
      continue;
    }

    if (!entry.isFile() || !isBookFilename(entry.name)) {
      continue;
    }

    const fileAbsolute = path.join(absolutePath, entry.name);
    const markdown = fs.readFileSync(fileAbsolute, 'utf8');
    const extracted = extractTitleAndDescription(markdown);
    const metadata = getMetadata ? getMetadata(childRelative) : undefined;

    const title = metadata?.title ? String(metadata.title) : extracted.title;
    const description = metadata?.description ? String(metadata.description) : extracted.description;
    const coverType = metadata?.cover_type ? String(metadata.cover_type) : 'color';
    const coverValue =
      metadata?.cover_value && String(metadata.cover_value)
        ? String(metadata.cover_value)
        : fallbackCoverColor(title);

    books.push({
      path: childRelative,
      filename: entry.name,
      title,
      description,
      coverType: coverType === 'none' ? 'color' : coverType,
      coverValue,
    });
  }

  folders.sort((left, right) => left.name.localeCompare(right.name, 'fa'));
  books.sort((left, right) => left.title.localeCompare(right.title, 'fa'));

  return {
    path: safePath,
    breadcrumbs: buildBreadcrumbs(safePath),
    folders,
    books,
  };
}

/**
 * @param {string} relativePath - Current folder path
 * @returns {Array<{ label: string, path: string }>}
 */
function buildBreadcrumbs(relativePath) {
  const crumbs = [{ label: 'خانه', path: '' }];
  if (!relativePath) {
    return crumbs;
  }
  const parts = relativePath.split('/');
  let accumulated = '';
  for (const part of parts) {
    accumulated = accumulated ? `${accumulated}/${part}` : part;
    crumbs.push({ label: part, path: accumulated });
  }
  return crumbs;
}

module.exports = {
  listOneLevel,
  buildBreadcrumbs,
};
