'use strict';

const express = require('express');
const { listOneLevel } = require('../services/browse-tree');
const { PathSafetyError } = require('../services/path-safety');

/**
 * مسیر مرور پوشه --- GET /api/browse one-level folder listing ---
 */

/**
 * @param {{ contentDocsDirectory: string, bookRepository: import('../db/book-repository').BookRepository }} options
 * @returns {import('express').Router}
 */
function createBrowseRouter(options) {
  const router = express.Router();
  const { contentDocsDirectory, bookRepository } = options;

  router.get('/browse', (request, response) => {
    try {
      const relativePath = request.query.path || '';
      const listing = listOneLevel(contentDocsDirectory, relativePath, (docPath) =>
        bookRepository.getMetadata(docPath),
      );
      response.json(listing);
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
  createBrowseRouter,
};
