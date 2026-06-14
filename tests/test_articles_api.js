'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const TESTS_ENABLED = process.env.MD_READER_RUN_TESTS === '1';

/**
 * Performs HTTP request against local app.
 * @param {import('http').Server} server - Listening server
 * @param {string} method - HTTP method
 * @param {string} urlPath - Request path
 * @param {string|null} body - Optional JSON body
 * @returns {Promise<{ status: number, body: unknown }>}
 */
function requestServer(server, method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: address.port,
      path: urlPath,
      method,
      headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {},
    };
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let parsed = text;
        if ((res.headers['content-type'] || '').includes('application/json') && text) {
          parsed = JSON.parse(text);
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Runs article API integration tests against a temp database.
 * @returns {Promise<void>}
 */
async function runTests() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'md-reader-test-'));
  const databasePath = path.join(tempDirectory, 'test.db');
  process.env.MARKDOWN_READER_DB = databasePath;

  delete require.cache[require.resolve('../server.js')];
  const { createApplication } = require('../server.js');
  const { app, articleRepository } = await createApplication();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const listEmpty = await requestServer(server, 'GET', '/api/articles');
    assert.strictEqual(listEmpty.status, 200);
    assert.ok(Array.isArray(listEmpty.body));

    const createBody = JSON.stringify({
      filename: 'test-article.md',
      markdown: '# Hello\n\nWorld',
    });
    const created = await requestServer(server, 'POST', '/api/articles', createBody);
    assert.strictEqual(created.status, 201);
    assert.strictEqual(created.body.slug, 'test-article');
    assert.ok(String(created.body.html).includes('<h1'));

    const listOne = await requestServer(server, 'GET', '/api/articles');
    assert.ok(listOne.body.some((item) => item.slug === 'test-article'));

    const detail = await requestServer(server, 'GET', '/api/articles/test-article');
    assert.strictEqual(detail.status, 200);
    assert.ok(detail.body.markdown.includes('Hello'));

    const sync = await requestServer(server, 'POST', '/api/sync-bundle');
    assert.strictEqual(sync.status, 200);
    assert.ok(sync.body.stats);

    const deleted = await requestServer(server, 'DELETE', '/api/articles/test-article');
    assert.strictEqual(deleted.status, 204);

    const { slugFromFilename } = require('../services/content-sync');
    assert.strictEqual(slugFromFilename('My Doc.md'), 'my-doc');

    console.log('All markdown-reader tests passed.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    articleRepository.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

if (!TESTS_ENABLED) {
  console.log('Skipped: set MD_READER_RUN_TESTS=1 to run tests.');
  process.exit(0);
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
