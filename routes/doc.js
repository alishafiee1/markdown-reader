'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { renderMarkdownToHtml } = require('../services/markdown-render');
const { PathSafetyError, resolveSafeContentPath, isBookFilename } = require('../services/path-safety');
const { extractTitleAndDescription, fallbackCoverColor, resolveBookText } = require('../services/metadata-extract');

/**
 * مسیر سند --- GET /api/doc markdown fetch and HTML render ---
 */

/**
 * @param {string} html - Rendered HTML
 * @returns {Array<{ id: string, text: string, level: number }>}
 */
function buildTableOfContents(html) {
  const headings = [];
  const pattern = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gis;
  let match = pattern.exec(html);
  while (match) {
    headings.push({
      level: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
    match = pattern.exec(html);
  }
  return headings;
}

/**
 * Adds heading ids for TOC anchors.
 * @param {string} html
 * @returns {string}
 */
function addHeadingIds(html) {
  let index = 0;
  return html.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/gis, (full, level, attrs, text) => {
    if (/\bid=/.test(attrs)) {
      return full;
    }
    index += 1;
    return `<h${level}${attrs} id="heading-${index}">${text}</h${level}>`;
  });
}

/**
 * @param {{ contentDocsDirectory: string, bookRepository: import('../db/book-repository').BookRepository }} options
 * @returns {import('express').Router}
 */
function createDocRouter(options) {
  const router = express.Router();
  const { contentDocsDirectory, bookRepository } = options;

  router.get('/doc', (request, response) => {
    try {
      const relativePath = request.query.path;
      if (!relativePath) {
        response.status(400).json({ error: 'پارامتر path الزامی است' });
        return;
      }

      const { relativePath: safePath, absolutePath } = resolveSafeContentPath(
        relativePath,
        contentDocsDirectory,
      );

      if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
        response.status(404).json({ error: 'فایل پیدا نشد' });
        return;
      }

      if (!isBookFilename(path.basename(absolutePath))) {
        response.status(400).json({ error: 'فقط فایل‌های متنی مجازند' });
        return;
      }

      const markdown = fs.readFileSync(absolutePath, 'utf8');
      const extracted = extractTitleAndDescription(markdown);
      const metadata = bookRepository.getMetadata(safePath);
      const { title, description } = resolveBookText(metadata, extracted);
      const coverType = metadata?.cover_type ? String(metadata.cover_type) : 'color';
      const coverValue =
        metadata?.cover_value && String(metadata.cover_value)
          ? String(metadata.cover_value)
          : fallbackCoverColor(title);

      const rawHtml = renderMarkdownToHtml(markdown);
      const html = addHeadingIds(rawHtml);
      const toc = buildTableOfContents(html);

      response.json({
        path: safePath,
        filename: path.basename(absolutePath),
        title,
        description,
        coverType,
        coverValue,
        html,
        toc,
      });
    } catch (error) {
      if (error instanceof PathSafetyError) {
        response.status(400).json({ error: error.message });
        return;
      }
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  return router;
}

module.exports = {
  addHeadingIds,
  buildTableOfContents,
  createDocRouter,
};
