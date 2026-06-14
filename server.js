'use strict';

const express = require('express');
const path = require('path');
const { openDatabase, ArticleRepository } = require('./db/database');
const { createArticlesRouter } = require('./routes/articles');
const { syncBundleContent } = require('./services/content-sync');

const MODULE_ROOT = __dirname;
const DEFAULT_PORT = 4001;
const DEFAULT_HOST = process.env.HOST || '0.0.0.0';
const DATABASE_PATH = path.join(MODULE_ROOT, 'data', 'articles.db');
const CONTENT_DOCS_DIRECTORY = path.join(MODULE_ROOT, 'content', 'docs');
const PUBLIC_DIRECTORY = path.join(MODULE_ROOT, 'public');

/** @type {import('express').Express | null} */
let app = null;

/** @type {import('./db/database').ArticleRepository | null} */
let articleRepository = null;

/**
 * Initializes database, syncs bundle content, and builds Express app.
 * @returns {Promise<{ app: import('express').Express, articleRepository: import('./db/database').ArticleRepository }>}
 */
async function createApplication() {
  const databasePath = process.env.MARKDOWN_READER_DB || DATABASE_PATH;
  const { database, persist } = await openDatabase(databasePath);
  const repository = new ArticleRepository(database, persist);

  syncBundleContent(repository, CONTENT_DOCS_DIRECTORY);

  const expressApp = express();
  expressApp.use(express.json({ limit: '1mb' }));
  expressApp.use(
    '/api',
    createArticlesRouter({ articleRepository: repository, contentDocsDirectory: CONTENT_DOCS_DIRECTORY }),
  );
  expressApp.use(express.static(PUBLIC_DIRECTORY));

  expressApp.get('/', (_request, response) => {
    response.sendFile(path.join(PUBLIC_DIRECTORY, 'index.html'));
  });

  app = expressApp;
  articleRepository = repository;
  return { app: expressApp, articleRepository: repository };
}

const listenPort = Number(process.env.PORT) || DEFAULT_PORT;

if (require.main === module) {
  createApplication()
    .then(({ app: expressApp }) => {
      expressApp.listen(listenPort, DEFAULT_HOST, () => {
        // eslint-disable-next-line no-console -- server bootstrap log
        console.log(`markdown-reader listening on ${DEFAULT_HOST}:${listenPort}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start markdown-reader-module:', error);
      process.exit(1);
    });
}

module.exports = {
  createApplication,
  get app() {
    if (!app) {
      throw new Error('App not initialized — call createApplication() first');
    }
    return app;
  },
  get articleRepository() {
    if (!articleRepository) {
      throw new Error('Repository not initialized — call createApplication() first');
    }
    return articleRepository;
  },
  CONTENT_DOCS_DIRECTORY,
  DATABASE_PATH,
};
