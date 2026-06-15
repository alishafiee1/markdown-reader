'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const { requireAdmin } = require('../middleware/require-admin');
const { resolveSafeContentPath, isBookFilename, PathSafetyError } = require('../services/path-safety');
const { extractTitleAndDescription } = require('../services/metadata-extract');
const { syncMetadataIndex } = require('../services/sync-index');

const MAX_COVER_BYTES = 2 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COVER_BYTES },
});

/**
 * مدیریت جلد کتاب --- admin book metadata and cover upload ---
 */

/**
 * @param {import('express').Request} request
 * @returns {string}
 */
function extractDocPathFromRequest(request) {
  const wildcard = request.params[0];
  if (wildcard) {
    return decodeURIComponent(wildcard);
  }
  return String(request.query.path || '');
}

/**
 * @param {{ bookRepository: import('../db/book-repository').BookRepository, contentDocsDirectory: string, coversDirectory: string }} options
 * @returns {import('express').Router}
 */
function createAdminBooksRouter(options) {
  const router = express.Router();
  const { bookRepository, contentDocsDirectory, coversDirectory } = options;

  fs.mkdirSync(coversDirectory, { recursive: true });

  router.post('/admin/books/*/cover', requireAdmin, upload.single('cover'), async (request, response) => {
    try {
      const docPath = extractDocPathFromRequest(request);
      const { absolutePath } = resolveSafeContentPath(docPath, contentDocsDirectory);
      if (!fs.existsSync(absolutePath)) {
        response.status(404).json({ error: 'فایل پیدا نشد' });
        return;
      }
      if (!request.file) {
        response.status(400).json({ error: 'فایل جلد ارسال نشده است' });
        return;
      }

      const mime = request.file.mimetype;
      const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
      if (!allowed.has(mime)) {
        response.status(400).json({ error: 'فقط jpeg، png و webp مجاز است' });
        return;
      }

      const extension = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
      const fileName = `${crypto.createHash('sha256').update(docPath).digest('hex').slice(0, 16)}.${extension}`;
      const coverPath = path.join(coversDirectory, fileName);
      fs.writeFileSync(coverPath, request.file.buffer);

      const existing = bookRepository.getMetadata(docPath);
      const markdown = fs.readFileSync(absolutePath, 'utf8');
      const extracted = extractTitleAndDescription(markdown);

      const metadata = await bookRepository.patchMetadata(docPath, {
        title: existing ? String(existing.title) : extracted.title,
        description: existing ? String(existing.description) : extracted.description,
        coverType: 'image',
        coverValue: `/api/covers/${fileName}`,
      });

      response.json({
        docPath,
        coverType: 'image',
        coverValue: String(metadata?.cover_value),
      });
    } catch (error) {
      if (error instanceof PathSafetyError) {
        response.status(400).json({ error: error.message });
        return;
      }
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.patch('/admin/books/*', requireAdmin, async (request, response) => {
    try {
      const docPath = extractDocPathFromRequest(request);
      const { absolutePath } = resolveSafeContentPath(docPath, contentDocsDirectory);
      if (!fs.existsSync(absolutePath) || !isBookFilename(path.basename(absolutePath))) {
        response.status(404).json({ error: 'فایل پیدا نشد' });
        return;
      }

      const markdown = fs.readFileSync(absolutePath, 'utf8');
      const extracted = extractTitleAndDescription(markdown);
      const existing = bookRepository.getMetadata(docPath);

      const metadata = await bookRepository.patchMetadata(docPath, {
        title: request.body?.title ?? (existing ? String(existing.title) : extracted.title),
        description:
          request.body?.description ?? (existing ? String(existing.description) : extracted.description),
        coverType: request.body?.coverType ?? (existing ? String(existing.cover_type) : 'color'),
        coverValue: request.body?.coverValue ?? (existing ? String(existing.cover_value) : ''),
      });

      response.json({
        docPath,
        title: String(metadata?.title),
        description: String(metadata?.description),
        coverType: String(metadata?.cover_type),
        coverValue: String(metadata?.cover_value),
      });
    } catch (error) {
      if (error instanceof PathSafetyError) {
        response.status(400).json({ error: error.message });
        return;
      }
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  router.post('/sync-index', requireAdmin, async (_request, response) => {
    try {
      const stats = await syncMetadataIndex(bookRepository, contentDocsDirectory);
      response.json({ ok: true, stats });
    } catch (error) {
      response.status(500).json({ error: String(error.message || error) });
    }
  });

  return router;
}

module.exports = {
  createAdminBooksRouter,
};
