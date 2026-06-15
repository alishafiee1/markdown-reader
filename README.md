# Markdown Reader (BookShelf)

وب‌اپ مستقل برای خواندن کتابخانهٔ مارک‌داون فارسی (RTL) از پوشهٔ `content/docs`، با SQLite برای متادیتا، کاربران و پیشرفت مطالعه.

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
| `HOST` | `0.0.0.0` | آدرس bind — برای LAN از `0.0.0.0` استفاده کن |
| `MARKDOWN_READER_DB` | `data/articles.db` | مسیر فایل SQLite |
| `ADMIN_SEED_PASSWORD` | `admino` | رمز اولیهٔ ادمین `admino` (در production عوض کن) |

نمونه: [`.env.example`](.env.example)

## محتوا

- مارک‌داون‌ها: `content/docs/` (درخت پوشه — منبع اصلی)
- دیتابیس: `data/*.db` · جلدها: `data/covers/`
- UI: BookShelf تیره — خانه، کتابخانه، مطالعه، حساب

## Deploy روی سرور

راهنمای کامل: [`docs/server-deploy.md`](docs/server-deploy.md)

```bash
PORT=4001 HOST=0.0.0.0 npm start
```

## API (BookShelf)

| Method | Path | توضیح |
|--------|------|--------|
| GET | `/api/browse?path=` | مرور یک سطح پوشه |
| GET | `/api/doc?path=` | مارک‌داون + HTML |
| GET | `/api/search?q=` | جستجوی کتابخانه |
| POST | `/api/auth/register` · `login` · `logout` | احراز هویت |
| GET | `/api/me` · PUT `/api/me/preferences` | پروفایل و تم |
| PUT | `/api/progress` · GET `/api/progress/recent` | پیشرفت مطالعه |
| PATCH | `/api/admin/books/:path` | ویرایش متادیتا (ادمین) |
| POST | `/api/admin/books/:path/cover` | آپلود جلد (ادمین) |
| POST | `/api/sync-index` | بازسازی ایندکس (ادمین) |

API قدیمی `/api/articles` برای سازگاری هنوز فعال است.

## تست

```powershell
$env:MD_READER_RUN_TESTS = "1"
npm test
```

اسموک:

```powershell
curl http://localhost:4001/api/browse
```

## داکیومنت پروژه

| مسیر | موضوع |
|------|--------|
| [`docs/proposal.md`](docs/proposal.md) | چشم‌انداز کل پروژه |
| [`docs/architecture-and-structure.md`](docs/architecture-and-structure.md) | ساختار فایل‌ها |
| [`docs/server-deploy.md`](docs/server-deploy.md) | نصب روی سرور لینوکس |
| [`docs/change/bookshelf-reader/`](docs/change/bookshelf-reader/proposal.md) | فیچر BookShelf |
| [`docs-for-ai/map.md`](docs-for-ai/map.md) | نقشهٔ فشرده برای AI |

## نکته

این repo عمداً **مستقل** است — بدون وابستگی به CMS یا پلتفرم ماژول.
