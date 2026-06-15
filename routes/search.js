'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { walkBookFiles } = require('../services/sync-index');
const { extractTitleAndDescription } = require('../services/metadata-extract');

/**
 * جستجوی کتابخانه --- GET /api/search on title, description, filename ---
 */

/**
 * @param {{ contentDocsDirectory: string, bookRepository: import('../db/book-repository').BookRepository }} options
 * @returns {import('express').Router}
 */
function createSearchRouter(options) {
  const router = express.Router();
  const { contentDocsDirectory, bookRepository } = options;

  router.get('/search', (request, response) => {
    try {
      const query = String(request.query.q || '').trim().toLowerCase();
      if (!query) {
        response.json({ items: [] });
        return;
      }

      const docPaths = walkBookFiles(contentDocsDirectory, '');
      const items = [];

      for (const docPath of docPaths) {
        const metadata = bookRepository.getMetadata(docPath);
        const filename = path.basename(docPath);
        let title = metadata?.title ? String(metadata.title) : '';
        let description = metadata?.description ? String(metadata.description) : '';

        if (!title) {
          const absolute = path.join(contentDocsDirectory, ...docPath.split('/'));
          const markdown = fs.readFileSync(absolute, 'utf8');
          const extracted = extractTitleAndDescription(markdown);
          title = extracted.title;
          description = extracted.description;
        }

        const haystack = `${title} ${description} ${filename}`.toLowerCase();
        if (!haystack.includes(query)) {
          continue;
        }

        items.push({
          path: docPath,
          title,
          description,
          folder: path.dirname(docPath).replace(/\\/g, '/'),
          coverType: metadata?.cover_type ? String(metadata.cover_type) : 'color',
          coverValue: metadata?.cover_value ? String(metadata.cover_value) : '',
        });
      }

      items.sort((left, right) => left.title.localeCompare(right.title, 'fa'));
      response.json({ items: items.slice(0, 50) });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  return router;
}

module.exports = {
  createSearchRouter,
};
