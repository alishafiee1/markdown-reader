'use strict';

/**
 * استخراج عنوان و توضیح از مارک‌داون --- title/description from first lines or heading ---
 */

/**
 * Strips common markdown/HTML wrappers from a line.
 * @param {string} line - Raw line
 * @returns {string}
 */
function cleanLine(line) {
  return String(line || '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/^#+\s*/, '')
    .replace(/\*\*|__/g, '')
    .replace(/`/g, '')
    .trim();
}

/**
 * @param {string} markdownSource - Full markdown text
 * @returns {{ title: string, description: string }}
 */
function extractTitleAndDescription(markdownSource) {
  const lines = String(markdownSource || '').split(/\r?\n/);
  const nonEmpty = lines.map(cleanLine).filter((line) => line.length > 0);

  let title = 'بدون عنوان';
  let description = '';

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index].trim();
    if (!raw) {
      continue;
    }
    const headingMatch = raw.match(/^#{1,6}\s+(.+)/);
    if (headingMatch) {
      title = cleanLine(headingMatch[1]);
      const nextLines = lines.slice(index + 1).map(cleanLine).filter(Boolean);
      description = nextLines[0] || '';
      return { title, description };
    }
    break;
  }

  if (nonEmpty.length > 0) {
    title = nonEmpty[0];
    description = nonEmpty[1] || '';
  }

  return { title, description };
}

/**
 * Builds cover hint color from title hash.
 * @param {string} title - Book title
 * @returns {string} Hex color
 */
function fallbackCoverColor(title) {
  const palette = ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706', '#0891B2', '#4F46E5'];
  let hash = 0;
  for (let index = 0; index < title.length; index += 1) {
    hash = (hash * 31 + title.charCodeAt(index)) % 2147483647;
  }
  return palette[Math.abs(hash) % palette.length];
}

module.exports = {
  extractTitleAndDescription,
  fallbackCoverColor,
  cleanLine,
};
