'use strict';

const express = require('express');
const path = require('path');
const { openDatabase } = require('./db/database');
const { createArticlesRouter } = require('./routes/articles');
const { createBrowseRouter } = require('./routes/browse');
const { createDocRouter } = require('./routes/doc');
const { createAuthRouter } = require('./routes/auth');
const { createProgressRouter } = require('./routes/progress');
const { createAdminBooksRouter } = require('./routes/admin-books');
const { createSearchRouter } = require('./routes/search');
const { createSessionMiddleware } = require('./middleware/session');
const { syncBundleContent } = require('./services/content-sync');
const { syncMetadataIndex } = require('./services/sync-index');
const { registerGracefulShutdown } = require('./lib/graceful-shutdown');

const MODULE_ROOT = __dirname;
const DEFAULT_PORT = 4002;
const DATABASE_PATH = path.join(MODULE_ROOT, 'data', 'articles.db');
const CONTENT_DOCS_DIRECTORY = path.join(MODULE_ROOT, 'content', 'docs');
const COVERS_DIRECTORY = path.join(MODULE_ROOT, 'data', 'covers');
const PUBLIC_DIRECTORY = path.join(MODULE_ROOT, 'public');
const SESSION_CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Resolves bind host: 0.0.0.0 in production or when HOST=0.0.0.0.
 * @returns {string}
 */
function resolveListenHost() {
  if (process.env.HOST) {
    return process.env.HOST;
  }
  if (process.env.NODE_ENV === 'production') {
    return '0.0.0.0';
  }
  return '0.0.0.0';
}

/** @type {import('express').Express | null} */
let app = null;

/** @type {import('./db/database').ArticleRepository | null} */
let articleRepository = null;

/**
 * Initializes database, syncs bundle content, and builds Express app.
 * @returns {Promise<{ app: import('express').Express, articleRepository: import('./db/database').ArticleRepository, userRepository: import('./db/user-repository').UserRepository, bookRepository: import('./db/book-repository').BookRepository }>}
 */
async function createApplication() {
  const databasePath = process.env.MARKDOWN_READER_DB || DATABASE_PATH;
  const { articleRepository: repository, userRepository, bookRepository } = await openDatabase(
    databasePath,
  );

  await syncBundleContent(repository, CONTENT_DOCS_DIRECTORY);
  await userRepository.purgeExpiredSessions();

  const expressApp = express();
  if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
    expressApp.set('trust proxy', 1);
  }

  expressApp.use(express.json({ limit: '2mb' }));
  expressApp.use(createSessionMiddleware({ userRepository }));

  const apiOptions = {
    articleRepository: repository,
    contentDocsDirectory: CONTENT_DOCS_DIRECTORY,
    bookRepository,
    userRepository,
    coversDirectory: COVERS_DIRECTORY,
  };

  expressApp.use('/api', createBrowseRouter(apiOptions));
  expressApp.use('/api', createDocRouter(apiOptions));
  expressApp.use('/api', createAuthRouter(apiOptions));
  expressApp.use('/api', createProgressRouter(apiOptions));
  expressApp.use('/api', createAdminBooksRouter(apiOptions));
  expressApp.use('/api', createSearchRouter(apiOptions));
  expressApp.use(
    '/api',
    createArticlesRouter({ articleRepository: repository, contentDocsDirectory: CONTENT_DOCS_DIRECTORY }),
  );

  expressApp.use('/api/covers', express.static(COVERS_DIRECTORY));

  expressApp.use(express.static(PUBLIC_DIRECTORY));

  expressApp.get('/', (_request, response) => {
    response.sendFile(path.join(PUBLIC_DIRECTORY, 'index.html'));
  });

  app = expressApp;
  articleRepository = repository;

  setImmediate(() => {
    syncMetadataIndex(bookRepository, CONTENT_DOCS_DIRECTORY).catch((error) => {
      console.error('sync-index startup failed:', error);
    });
  });

  const sessionCleanupInterval = setInterval(() => {
    userRepository.purgeExpiredSessions().catch((error) => {
      console.error('session cleanup failed:', error);
    });
  }, SESSION_CLEANUP_INTERVAL_MS);
  sessionCleanupInterval.unref();

  return { app: expressApp, articleRepository: repository, userRepository, bookRepository };
}

const listenPort = Number(process.env.PORT) || DEFAULT_PORT;
const listenHost = resolveListenHost();

if (require.main === module) {
  createApplication()
    .then(({ app: expressApp }) => {
      const httpServer = expressApp.listen(listenPort, listenHost, () => {
        // eslint-disable-next-line no-console -- server bootstrap log
        console.log(`markdown-reader listening on ${listenHost}:${listenPort}`);
      });
      registerGracefulShutdown(httpServer);
    })
    .catch((error) => {
      console.error('Failed to start markdown-reader-module:', error);
      process.exit(1);
    });
}

module.exports = {
  DEFAULT_PORT,
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
  COVERS_DIRECTORY,
};
