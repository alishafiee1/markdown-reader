# Markdown Reader (BookShelf)

وب‌اپ مستقل برای خواندن کتابخانهٔ مارک‌داون فارسی (RTL) از پوشهٔ `content/docs`، با SQLite برای متادیتا و تنظیمات کاربر.

> **Node.js:** 18+ · دیتابیس `sql.js` (بدون native rebuild)

## شروع سریع (محلی)

```powershell
cd "D:\2 Curent project git\Ai_projects\markdown-reader-module"
npm install
npm start
```

مرورگر: `http://127.0.0.1:4001/`

## متغیرهای محیط

| متغیر | پیش‌فرض | توضیح |
|--------|---------|--------|
| `PORT` | `4001` | پورت HTTP |
| `HOST` | `0.0.0.0` | آدرس bind (`127.0.0.1` فقط لوکال) |
| `MARKDOWN_READER_DB` | `data/articles.db` | مسیر فایل SQLite |

نمونه: [`.env.example`](.env.example)

## محتوا

- مارک‌داون‌ها: `content/docs/` (درخت پوشه — منبع اصلی)
- دیتابیس: `data/*.db` (خودکار ساخته می‌شود)
- UI فعلی: نسخهٔ ساده؛ نسخهٔ BookShelf در حال طراحی → [`docs/change/bookshelf-reader/`](docs/change/bookshelf-reader/proposal.md)

## Deploy روی سرور

راهنمای کامل: [`docs/server-deploy.md`](docs/server-deploy.md)

```bash
PORT=4001 HOST=0.0.0.0 npm start
# یا با pm2 / systemd
```

## API (نسخهٔ فعلی)

| Method | Path | توضیح |
|--------|------|--------|
| GET | `/api/articles` | لیست مقالات |
| GET | `/api/articles/:slug` | یک مقاله |
| POST | `/api/articles` | آپلود (JSON یا multipart) |
| DELETE | `/api/articles/:slug` | حذف |
| POST | `/api/sync-bundle` | بازخوانی `content/docs` (سطح اول) |

API نهایی BookShelf در [design.md](docs/change/bookshelf-reader/design.md).

## تست

```powershell
$env:MD_READER_RUN_TESTS = "1"
npm test
```

## داکیومنت پروژه

| مسیر | موضوع |
|------|--------|
| [`docs/proposal.md`](docs/proposal.md) | چشم‌انداز کل پروژه |
| [`docs/architecture-and-structure.md`](docs/architecture-and-structure.md) | ساختار فایل‌ها |
| [`docs/server-deploy.md`](docs/server-deploy.md) | نصب روی سرور لینوکس |
| [`docs/change/bookshelf-reader/`](docs/change/bookshelf-reader/proposal.md) | فیچر BookShelf (در دست ساخت) |
| [`docs-for-ai/map.md`](docs-for-ai/map.md) | نقشهٔ فشرده برای AI |

## نکته

این repo عمداً **مستقل** است — بدون وابستگی به CMS یا پلتفرم ماژول. بسته‌بندی برای سایر پلتفرم‌ها در آینده با skill جدا انجام می‌شود.

در monorepoٔ [DocForAi](https://github.com/alishafiee1/DocForAi) به‌صورت **git submodule** در مسیر `markdown-reader-module/` قرار دارد.
