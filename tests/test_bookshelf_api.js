'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const bcrypt = require('bcryptjs');

const TESTS_ENABLED = process.env.MD_READER_RUN_TESTS === '1';

/**
 * Performs HTTP request against local app.
 * @param {import('http').Server} server
 * @param {string} method
 * @param {string} urlPath
 * @param {string|null} body
 * @param {Record<string, string>} [headers]
 * @returns {Promise<{ status: number, body: unknown, headers: import('http').IncomingHttpHeaders }>}
 */
function requestServer(server, method, urlPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const requestHeaders = { ...headers };
    if (body) {
      requestHeaders['Content-Type'] = 'application/json';
      requestHeaders['Content-Length'] = String(Buffer.byteLength(body));
    }
    const options = {
      hostname: '127.0.0.1',
      port: address.port,
      path: urlPath,
      method,
      headers: requestHeaders,
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
        resolve({ status: res.statusCode, body: parsed, headers: res.headers });
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
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns {string|undefined}
 */
function extractSessionCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie || !setCookie[0]) {
    return undefined;
  }
  return setCookie[0].split(';')[0];
}

/**
 * Runs BookShelf API integration tests.
 * @returns {Promise<void>}
 */
async function runBookshelfTests() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'md-reader-test-'));
  const databasePath = path.join(tempDirectory, 'test.db');
  process.env.MARKDOWN_READER_DB = databasePath;
  process.env.ADMIN_SEED_PASSWORD = 'admino';

  delete require.cache[require.resolve('../server.js')];
  const { createApplication } = require('../server.js');
  const { app, articleRepository, userRepository, bookRepository } = await createApplication();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const traversal = await requestServer(server, 'GET', '/api/browse?path=../../etc/passwd');
    assert.strictEqual(traversal.status, 400);

    const browseRoot = await requestServer(server, 'GET', '/api/browse');
    assert.strictEqual(browseRoot.status, 200);
    assert.ok(Array.isArray(browseRoot.body.folders));

    const { deleteCoverFileIfExists } = require('../services/cover-files');
    const coversDirectory = path.join(tempDirectory, 'covers');
    fs.mkdirSync(coversDirectory, { recursive: true });
    const oldCoverPath = path.join(coversDirectory, 'old.jpg');
    fs.writeFileSync(oldCoverPath, 'cover');
    assert.strictEqual(deleteCoverFileIfExists(coversDirectory, '/api/covers/old.jpg'), true);
    assert.strictEqual(fs.existsSync(oldCoverPath), false);

    const docPath = '00-start-new-project/readme.md';
    const doc = await requestServer(server, 'GET', `/api/doc?path=${encodeURIComponent(docPath)}`);
    assert.strictEqual(doc.status, 200);
    assert.ok(String(doc.body.html).includes('<'));
    assert.strictEqual(Object.prototype.hasOwnProperty.call(doc.body, 'markdown'), false);

    const { addHeadingIds, buildTableOfContents } = require('../routes/doc');
    const multilineHeadings = addHeadingIds('<h2>Line one\nLine two</h2>');
    const toc = buildTableOfContents(multilineHeadings);
    assert.strictEqual(toc.length, 1);
    assert.strictEqual(toc[0].text, 'Line one\nLine two');

    const { extractTitleAndDescription } = require('../services/metadata-extract');
    const stylePreamble = '<style>body{color:red}</style>\n\n# عنوان واقعی\n\nتوضیح کوتاه';
    const extracted = extractTitleAndDescription(stylePreamble);
    assert.strictEqual(extracted.title, 'عنوان واقعی');
    assert.strictEqual(extracted.description, 'توضیح کوتاه');

    const networkBrowse = await requestServer(
      server,
      'GET',
      `/api/browse?path=${encodeURIComponent('01-Network-and-Security')}`,
    );
    assert.strictEqual(networkBrowse.status, 200);
    assert.ok((networkBrowse.body.books || []).length > 1);
    assert.ok(
      (networkBrowse.body.books || []).every(
        (book) => !String(book.title).toLowerCase().includes('<style'),
      ),
    );

    const loginBody = JSON.stringify({ username: 'admino', password: 'admino' });
    const login = await requestServer(server, 'POST', '/api/auth/login', loginBody);
    assert.strictEqual(login.status, 200);
    assert.strictEqual(login.body.needsPasswordChange, true);
    const sessionCookie = extractSessionCookie(login.headers);
    assert.ok(sessionCookie);

    const meWithSeedPassword = await requestServer(server, 'GET', '/api/me', null, {
      Cookie: sessionCookie,
    });
    assert.strictEqual(meWithSeedPassword.status, 200);
    assert.strictEqual(meWithSeedPassword.body.needsPasswordChange, true);

    const changedHash = await bcrypt.hash('changed-secret', 10);
    await userRepository.runWrite(() => {
      userRepository.database.run('UPDATE users SET password_hash = ? WHERE username = ?', [
        changedHash,
        'admino',
      ]);
    });
    const meAfterPasswordChange = await requestServer(server, 'GET', '/api/me', null, {
      Cookie: sessionCookie,
    });
    assert.strictEqual(meAfterPasswordChange.status, 200);
    assert.strictEqual(meAfterPasswordChange.body.needsPasswordChange, false);

    const progressBody = JSON.stringify({ docPath, scrollRatio: 0.42 });
    const progress = await requestServer(server, 'PUT', '/api/progress', progressBody, {
      Cookie: sessionCookie,
    });
    assert.strictEqual(progress.status, 200);

    const recent = await requestServer(server, 'GET', '/api/progress/recent', null, {
      Cookie: sessionCookie,
    });
    assert.strictEqual(recent.status, 200);
    assert.ok((recent.body.items || []).length >= 1);
    assert.ok((recent.body.items || []).length <= 3);

    const search = await requestServer(server, 'GET', '/api/search?q=readme');
    assert.strictEqual(search.status, 200);
    assert.ok((search.body.items || []).length >= 1);

    const registerBody = JSON.stringify({ username: 'testuser', password: 'testpass' });
    const registered = await requestServer(server, 'POST', '/api/auth/register', registerBody);
    assert.strictEqual(registered.status, 201);

    const duplicate = await requestServer(server, 'POST', '/api/auth/register', registerBody);
    assert.strictEqual(duplicate.status, 409);

    const invalidUsername = await requestServer(
      server,
      'POST',
      '/api/auth/register',
      JSON.stringify({ username: '<bad>', password: 'testpass' }),
    );
    assert.strictEqual(invalidUsername.status, 400);

    const listEmpty = await requestServer(server, 'GET', '/api/articles');
    assert.strictEqual(listEmpty.status, 200);

    console.log('All bookshelf-reader tests passed.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    articleRepository.close();
    userRepository.database.close();
    bookRepository.database.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

/**
 * @returns {Promise<void>}
 */
async function runLegacyArticleTests() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'md-reader-legacy-'));
  const databasePath = path.join(tempDirectory, 'test.db');
  process.env.MARKDOWN_READER_DB = databasePath;

  delete require.cache[require.resolve('../server.js')];
  const { createApplication } = require('../server.js');
  const { app, articleRepository } = await createApplication();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const createBody = JSON.stringify({
      filename: 'test-article.md',
      markdown: '# Hello\n\nWorld',
    });
    const created = await requestServer(server, 'POST', '/api/articles', createBody);
    assert.strictEqual(created.status, 201);
    assert.strictEqual(created.body.slug, 'test-article');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    articleRepository.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

async function runTests() {
  await runBookshelfTests();
  await runLegacyArticleTests();
}

if (!TESTS_ENABLED) {
  console.log('Skipped: set MD_READER_RUN_TESTS=1 to run tests.');
  process.exit(0);
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
