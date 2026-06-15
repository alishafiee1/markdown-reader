'use strict';

const path = require('path');

const BOOK_EXTENSIONS = new Set(['.md', '.txt']);

/**
 * خطای مسیر نامعتبر --- invalid content path under content/docs ---
 */
class PathSafetyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PathSafetyError';
    this.statusCode = 400;
  }
}

/**
 * Normalizes and validates a relative path under content/docs.
 * @param {string|undefined|null} rawPath - Client path (POSIX-style)
 * @param {string} contentDocsDirectory - Absolute root for docs
 * @returns {{ relativePath: string, absolutePath: string }}
 */
function resolveSafeContentPath(rawPath, contentDocsDirectory) {
  const input = rawPath === undefined || rawPath === null ? '' : String(rawPath);
  const normalized = input.replace(/\\/g, '/').trim();

  if (normalized.includes('..')) {
    throw new PathSafetyError('مسیر نامعتبر است');
  }

  const segments = normalized.split('/').filter((segment) => segment.length > 0);
  for (const segment of segments) {
    if (segment === '.' || segment === '..' || segment.startsWith('.')) {
      throw new PathSafetyError('مسیر نامعتبر است');
    }
  }

  const relativePath = segments.join('/');
  const absolutePath = path.resolve(contentDocsDirectory, ...segments);
  const rootResolved = path.resolve(contentDocsDirectory);

  const insideRoot =
    absolutePath === rootResolved || absolutePath.startsWith(`${rootResolved}${path.sep}`);
  if (!insideRoot) {
    throw new PathSafetyError('مسیر نامعتبر است');
  }

  return { relativePath, absolutePath };
}

/**
 * @param {string} filename - File name
 * @returns {boolean}
 */
function isBookFilename(filename) {
  return BOOK_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

module.exports = {
  PathSafetyError,
  resolveSafeContentPath,
  isBookFilename,
  BOOK_EXTENSIONS,
};
