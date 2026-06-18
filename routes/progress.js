'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('../middleware/session');
const { resolveSafeContentPath, isBookFilename } = require('../services/path-safety');
const { extractTitleAndDescription, fallbackCoverColor, resolveBookText } = require('../services/metadata-extract');

/**
 * پیشرفت مطالعه --- PUT /api/progress and GET /api/progress/recent ---
 */

/**
 * @param {{ bookRepository: import('../db/book-repository').BookRepository, contentDocsDirectory: string }} options
 * @returns {import('express').Router}
 */
function createProgressRouter(options) {
  const router = express.Router();
  const { bookRepository, contentDocsDirectory } = options;

  router.put('/progress', requireAuth, async (request, response) => {
    try {
      const docPath = String(request.body?.docPath || request.body?.doc_path || '');
      const scrollRatio = Number(request.body?.scrollRatio ?? request.body?.scroll_ratio ?? 0);

      if (!docPath) {
        response.status(400).json({ error: 'مسیر سند الزامی است' });
        return;
      }

      const { absolutePath } = resolveSafeContentPath(docPath, contentDocsDirectory);
      if (!fs.existsSync(absolutePath) || !isBookFilename(path.basename(absolutePath))) {
        response.status(404).json({ error: 'فایل پیدا نشد' });
        return;
      }

      await bookRepository.saveProgress(request.user.id, docPath, scrollRatio);
      response.json({ ok: true });
    } catch (error) {
      response.status(400).json({ error: String(error.message || error) });
    }
  });

  router.get('/progress/recent', requireAuth, (request, response) => {
    const rows = bookRepository.getRecentProgress(request.user.id, 3);
    const items = rows.map((row) => {
      const docPath = String(row.doc_path);
      const metadata = bookRepository.getMetadata(docPath);
      let title = docPath;
      let coverType = metadata?.cover_type ? String(metadata.cover_type) : 'color';
      let coverValue = metadata?.cover_value ? String(metadata.cover_value) : '';

      const absolute = path.join(contentDocsDirectory, ...docPath.split('/'));
      if (fs.existsSync(absolute)) {
        const markdown = fs.readFileSync(absolute, 'utf8');
        const extracted = extractTitleAndDescription(markdown);
        title = resolveBookText(metadata, extracted).title;
        if (!coverValue && coverType === 'color') {
          coverValue = fallbackCoverColor(title);
        }
      } else if (!coverValue && coverType === 'color') {
        coverValue = fallbackCoverColor(title);
      }

      return {
        docPath,
        title,
        coverType: coverType === 'none' ? 'color' : coverType,
        coverValue,
        scrollRatio: Number(row.scroll_ratio),
        lastOpenedAt: Number(row.last_opened_at),
      };
    });

    response.json({ items });
  });

  return router;
}

module.exports = {
  createProgressRouter,
};
