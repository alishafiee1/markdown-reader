'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'md-reader-e2e-'));
const databasePath = path.join(tempDirectory, 'e2e.db');
const port = Number(process.env.E2E_PORT || 4010);

process.env.MARKDOWN_READER_DB = databasePath;
process.env.ADMIN_SEED_PASSWORD = 'admino';
process.env.PORT = String(port);
process.env.HOST = '127.0.0.1';

const { createApplication } = require('../../server.js');

createApplication()
  .then(({ app }) => {
  // eslint-disable-next-line no-console -- e2e server bootstrap
    console.log(`e2e server listening on 127.0.0.1:${port}`);
    app.listen(port, '127.0.0.1');
  })
  .catch((error) => {
    console.error('e2e server failed:', error);
    process.exit(1);
  });
