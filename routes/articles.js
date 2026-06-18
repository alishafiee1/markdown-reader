'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const { mapDetailRow, mapListRow } = require('../db/database');
const { renderMarkdownToHtml } = require('../services/markdown-render');
const { slugFromFilename, syncBundleContent } = require('../services/content-sync');

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

/**
 * Sanitizes user-provided filename for storage.
 * @param {string} rawFilename - Original filename
 * @returns {string} Safe basename
 */
function sanitizeFilename(rawFilename) {
  const baseName = path.basename(rawFilename || 'article.md');
  return baseName.replace(/[^a-zA-Z0-9._\u0600-\u06FF-]/g, '_');
}

/**
 * Creates Express router for article REST API.
 * @param {{ articleRepository: import('../db/database').ArticleRepository, contentDocsDirectory: string }} options
 * @returns {import('express').Router}
 */
function createArticlesRouter(options) {
  const router = express.Router();
  const { articleRepository, contentDocsDirectory } = options;

  router.get('/articles', (_request, response) => {
    const rows = articleRepository.listArticles();
    response.json(rows.map(mapListRow));
  });

  router.get('/articles/:slug', (request, response) => {
    const row = articleRepository.findBySlug(request.params.slug);
    if (!row) {
      response.status(404).json({ error: 'Article not found' });
      return;
    }
    response.json(mapDetailRow(row));
  });

  router.post('/articles', upload.single('file'), async (request, response) => {
    try {
      let filename;
      let markdown;

      if (request.file) {
        const extension = path.extname(request.file.originalname).toLowerCase();
        if (!['.md', '.txt', ''].includes(extension)) {
          response.status(400).json({ error: 'Only .md and .txt files are allowed' });
          return;
        }
        filename = sanitizeFilename(request.file.originalname);
        markdown = request.file.buffer.toString('utf8');
      } else if (request.body && request.body.markdown) {
        filename = sanitizeFilename(request.body.filename || 'article.md');
        markdown = String(request.body.markdown);
      } else {
        response.status(400).json({ error: 'Provide multipart file or JSON body with markdown' });
        return;
      }

      const slug = slugFromFilename(filename);
      const html = renderMarkdownToHtml(markdown);
      const now = Date.now();

      await articleRepository.upsertUpload({
        slug,
        filename,
        markdown,
        html,
        dateAdded: now,
        updatedAt: now,
      });

      const saved = articleRepository.findBySlug(slug);
      response.status(201).json(mapDetailRow(saved));
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.delete('/articles/:slug', async (request, response) => {
    try {
      const result = await articleRepository.deleteBySlug(request.params.slug);
      if (result.changes === 0) {
        response.status(404).json({ error: 'Article not found' });
        return;
      }
      response.status(204).send();
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.delete('/articles', async (_request, response) => {
    try {
      await articleRepository.deleteAll();
      response.status(204).send();
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.post('/sync-bundle', async (_request, response) => {
    try {
      const stats = await syncBundleContent(articleRepository, contentDocsDirectory);
      response.json({ ok: true, stats });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  return router;
}

module.exports = {
  createArticlesRouter,
  sanitizeFilename,
};
