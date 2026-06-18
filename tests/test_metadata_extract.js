'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  extractTitleAndDescription,
  isStoredTextCorrupt,
  resolveBookText,
} = require('../services/metadata-extract');

const CONTENT_ROOT = path.join(__dirname, '..', 'content', 'docs');

assert.strictEqual(
  extractTitleAndDescription('<style>body{}</style>\n\n# عنوان واقعی\n\nتوضیح کوتاه').title,
  'عنوان واقعی',
);
assert.strictEqual(
  extractTitleAndDescription('<style>body{}</style>\n\n# عنوان واقعی\n\nتوضیح کوتاه').description,
  'توضیح کوتاه',
);

const divWrapped = `<div dir="rtl">

# راهنمای مستندات

**یک خط:** راهنمای عمومی برای همهٔ پروژه‌ها
`;
const fromDiv = extractTitleAndDescription(divWrapped);
assert.strictEqual(fromDiv.title, 'راهنمای مستندات');
assert.ok(fromDiv.description.includes('یک خط'));

const plainAfterHtml = `<div dir="rtl"></div>

اولین جمله بدون هدر
دومین جمله به عنوان توضیح
`;
const fromPlain = extractTitleAndDescription(plainAfterHtml);
assert.strictEqual(fromPlain.title, 'اولین جمله بدون هدر');
assert.strictEqual(fromPlain.description, 'دومین جمله به عنوان توضیح');

const sslPath = path.join(
  CONTENT_ROOT,
  '01-Network-and-Security',
  '01-ssl-handshake-and-trust.md',
);
const sslMarkdown = fs.readFileSync(sslPath, 'utf8');
const sslMeta = extractTitleAndDescription(sslMarkdown);
assert.ok(sslMeta.title.includes('SSL'));
assert.ok(sslMeta.description.includes('هدف این سند'));

const dnsPath = path.join(
  CONTENT_ROOT,
  '01-Network-and-Security',
  '02-dns-propagation-and-domain-setup.md',
);
const dnsMeta = extractTitleAndDescription(fs.readFileSync(dnsPath, 'utf8'));
assert.ok(dnsMeta.title.includes('DNS'));
assert.ok(dnsMeta.description.includes('تبریک'));

assert.strictEqual(isStoredTextCorrupt('<style>', '} body, p, h1'), true);
assert.strictEqual(
  resolveBookText(
    { title: '<style>', description: '} body, p, h1' },
    { title: 'عنوان درست', description: 'توضیح درست' },
  ).title,
  'عنوان درست',
);
assert.strictEqual(
  resolveBookText(
    { title: 'عنوان ادمین', description: 'توضیح ادمین' },
    { title: 'از فایل', description: 'از فایل' },
  ).title,
  'عنوان ادمین',
);

console.log('All metadata-extract tests passed.');
