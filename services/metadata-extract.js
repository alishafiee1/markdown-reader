'use strict';

/**
 * استخراج عنوان و توضیح از مارک‌داون --- title/description from heading or first text lines ---
 */

const DEFAULT_TITLE = 'بدون عنوان';

/**
 * Strips block HTML that often appears at the top of Persian docs.
 * @param {string} markdownSource
 * @returns {string}
 */
function stripHtmlBlocks(markdownSource) {
  return String(markdownSource || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Strips common markdown/HTML wrappers from a line.
 * @param {string} line - Raw line
 * @returns {string}
 */
function cleanLine(line) {
  return String(line || '')
    .replace(/<[^>]+>/g, '')
    .replace(/^#+\s*/, '')
    .replace(/\*\*|__/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

/**
 * @param {string} line
 * @returns {boolean}
 */
function isHtmlMarkupLine(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed) {
    return false;
  }
  return (
    /^<\/?[a-z][^>]*>/i.test(trimmed) ||
    trimmed === '</style>' ||
    trimmed === '<style>'
  );
}

/**
 * @param {string} line
 * @returns {boolean}
 */
function isSkippableLine(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed) {
    return true;
  }
  if (isHtmlMarkupLine(trimmed)) {
    return true;
  }
  return /^[-*_]{3,}$/.test(trimmed);
}

/**
 * @param {string} line
 * @returns {string|undefined}
 */
function parseHeadingLine(line) {
  const trimmed = String(line || '').trim();
  const headingMatch = trimmed.match(/^#{1,6}\s+(.+)/);
  if (!headingMatch) {
    return undefined;
  }
  const title = cleanLine(headingMatch[1]);
  return title || undefined;
}

/**
 * @param {string[]} lines
 * @param {number} startIndex
 * @returns {string}
 */
function findNextTextLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const raw = lines[index].trim();
    if (isSkippableLine(raw)) {
      continue;
    }
    const text = cleanLine(raw);
    if (text) {
      return text;
    }
  }
  return '';
}

/**
 * @param {string} markdownSource
 * @returns {string[]}
 */
function toContentLines(markdownSource) {
  return stripHtmlBlocks(markdownSource).split(/\r?\n/);
}

/**
 * Detects titles/descriptions saved before HTML-aware extraction.
 * @param {string} title
 * @param {string} [description]
 * @returns {boolean}
 */
function isStoredTextCorrupt(title, description) {
  const storedTitle = String(title || '').trim();
  const storedDescription = String(description || '').trim();

  if (!storedTitle) {
    return true;
  }
  if (/^<\/?[a-z][^>]*>$/i.test(storedTitle)) {
    return true;
  }
  if (/^<style>$/i.test(storedTitle)) {
    return true;
  }
  if (/[{}]|font-family|!important|direction:\s*rtl/i.test(storedDescription)) {
    return true;
  }
  if (/^}?\s*body\s*,/i.test(storedDescription)) {
    return true;
  }
  return false;
}

/**
 * Prefers admin-edited DB text; falls back to fresh file extraction when stored text is corrupt.
 * @param {Record<string, unknown>|undefined} metadata
 * @param {{ title: string, description: string }} extracted
 * @returns {{ title: string, description: string }}
 */
function resolveBookText(metadata, extracted) {
  if (
    metadata?.title &&
    !isStoredTextCorrupt(String(metadata.title), metadata.description ? String(metadata.description) : '')
  ) {
    return {
      title: String(metadata.title),
      description: metadata.description ? String(metadata.description) : '',
    };
  }
  return {
    title: extracted.title,
    description: extracted.description,
  };
}

/**
 * @param {string} markdownSource - Full markdown text
 * @returns {{ title: string, description: string }}
 */
function extractTitleAndDescription(markdownSource) {
  const lines = toContentLines(markdownSource);

  for (let index = 0; index < lines.length; index += 1) {
    const title = parseHeadingLine(lines[index]);
    if (!title) {
      continue;
    }
    const description = findNextTextLine(lines, index + 1);
    return { title, description };
  }

  const textLines = [];
  for (const line of lines) {
    const raw = line.trim();
    if (isSkippableLine(raw)) {
      continue;
    }
    const text = cleanLine(raw);
    if (text) {
      textLines.push(text);
    }
  }

  return {
    title: textLines[0] || DEFAULT_TITLE,
    description: textLines[1] || '',
  };
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
  stripHtmlBlocks,
  parseHeadingLine,
  findNextTextLine,
  isStoredTextCorrupt,
  resolveBookText,
};
