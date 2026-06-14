<div dir="rtl" style="text-align:right;">

# طراحی — کتابخانهٔ BookShelf و مسیر داده

> پوشه: `docs/change/bookshelf-reader/`  
> چرا: [proposal.md](./proposal.md) · ظاهر صفحه: [ui-behavior.md](./ui-behavior.md) · تم‌ها: [reading-themes-guide.md](./reading-themes-guide.md)

**یک خط:** توضیح می‌دهد محتوا از `content/docs` چطور به درخت پوشه، صفحهٔ مطالعه، SQLite و حساب کاربری وصل می‌شود — بدون نام فایل و تابع در کد.

---

فرض کن کاربر آدرس `http://192.168.88.50:4001` را باز کرده. مرورگر صفحهٔ خانهٔ تیره را می‌گیرد؛ سرور Express روی پورت **۴۰۰۱** (متغیر `PORT`) و آدرس bind **`0.0.0.0`** تا از شبکهٔ محلی در دسترس باشد. هیچ لاگین اجباری نیست؛ API درخت پوشه را از دیسک می‌خواند و متادیتای جلد را از SQLite برمی‌گرداند.

---

## محدودهٔ این طراحی

**داخل:** مرور پوشه، مطالعه، چهار تم، تمام‌صفحه، جستجو، auth اختیاری، پیشرفت مطالعه، پنل ادمین جلد کتاب.

**خارج:** رنگ دقیق دکمه‌ها → ui-behavior. چرا محصول → proposal. جزئیات deploy → [`docs/server-deploy.md`](../../server-deploy.md).

---

## تصویر کلی

```
content/docs/  ──scan──►  API browse + read
       │                        │
       │                        ▼
       │                  مرورگر (SPA سبک)
       │                        │
       ▼                        ▼
  فایل .md روی دیسک      SQLite: users, metadata, progress
```

محتوای مارک‌داون **روی دیسک** می‌ماند؛ دیتابیس فقط چیزهایی را نگه می‌دارد که باید بین کاربران یا جلسات بماند: حساب، جلد، عنوان، موقعیت اسکرول، ترجیح تم.

---

## اجزای سیستم

**سرور Node (Express)** — درخواست‌های API، سرو فایل‌های استاتیک رابط، خواندن امن مسیر داخل `content/docs` (جلوگیری از path traversal)، رندر مارک‌داون سمت سرور برای API محتوا.

**مرورگر** — چند «صفحه» بدون فریمورک سنگین (یا با تقسیم ماژول JS): خانه، کتابخانه (explorer)، مطالعه، حساب کاربری، پنل ادمین. وضعیت مسیر فعلی در URL hash یا query (`?path=02-Linux/foo.md`) برای deep link.

**SQLite (sql.js)** — فایل `data/reader.db` (نام جدید؛ migration از `articles.db` اختیاری در tasks). اگر فایل نبود، پوشه `data/` و schema ساخته می‌شود.

**پوشهٔ uploads** — `data/covers/` برای عکس جلد آپلودشده توسط ادمین.

---

## مرور پوشه (شبیه اکسپلورر)

### درخواست

`GET /api/browse?path=` — `path` نسبی نسبت به `content/docs`، خالی = ریشه.

### پاسخ

لیست ورودی‌ها: هر کدام `name`, `type` (`folder` | `file`), `relativePath`, و برای فایل‌های `.md`/` .txt` فیلدهای `title`, `description`, `cover` (url یا رنگ).

### قوانین امنیت

- `path` نرمال‌سازی می‌شود؛ `..` و مسیر مطلق رد می‌شود  
- فقط پسوند `.md` و `.txt` به‌عنوان «کتاب» باز می‌شوند  
- پوشه‌های مخفی (شروع با `.`) در لیست نیستند  

### عنوان و توضیح پیش‌فرض

اگر در جدول `book_metadata` رکوردی نباشد:

1. خط اول غیرخالی فایل (بدون `#` اجباری) → **title**  
2. خط دوم غیرخالی → **description**  
3. اگر خط اول heading مارک‌داون باشد (`# عنوان`)، همان استخراج می‌شود  

### breadcrumb

سرور یا کلاینت از `relativePath` قطعات را می‌سازد: `خانه / 05-Web-Development / node.js.md`.

---

## مطالعهٔ یک کتاب

### درخواست

`GET /api/doc?path=relative/path.md` — محتوای خام + HTML رندرشده + headings برای فهرست مطالب (اختیاری فاز ۱).

### پیشرفت اسکرول

- **مهمان:** `localStorage` کلید `scroll:{path}`  
- **کاربر:** `PUT /api/progress` با `{ path, scrollRatio, anchorHeading? }` — debounce حدود ۲ ثانیه در کلاینت  

`scrollRatio` عدد ۰ تا ۱ (موقعیت اسکرول نسبت به ارتفاع کل) کافی است؛ ساده و مستقل از اندازهٔ صفحه.

### سه سند اخیر

جدول `reading_progress` برای هر کاربر حداکثر **۳** ردیف «فعال» نگه می‌دارد: با هر باز کردن سند، `last_opened_at` به‌روز می‌شود؛ اگر بیش از سه تا شد، قدیمی‌ترین از لیست «ادامه بده» حذف نمی‌شود از DB ولی در UI فقط ۳ تا نشان داده می‌شود.

---

## جستجو

### جستجوی کتابخانه

`GET /api/search?q=...` — روی `book_metadata.title`, `book_metadata.description` و در فاز اول **نام فایل** و **خطوط اول** استخراج‌شده. پیاده‌سازی: SQL `LIKE` ساده یا اسکن دوره‌ای درخت (برای تعداد فایل کم آموزشی کافی است). نتایج: `path`, `title`, `snippet`, `folder`.

### جستجو داخل سند

سمت **کلاینت** روی HTML رندرشده یا متن خام؛ highlight با `<mark>` و دکمهٔ بعدی/قبلی. برای سندهای خیلی بزرگ، محدودیت ۵۰۰۰ نتیجه یا هشدار.

---

## حساب کاربری و نقش‌ها

### جداول پیشنهادی

**users** — `id`, `username` (یکتا), `password_hash`, `role` (`admin` | `user`), `created_at`

**sessions** — `token`, `user_id`, `expires_at` — یا کوکی signed session

**user_preferences** — `user_id`, `reading_theme`, `font_scale`

**book_metadata** — `doc_path` (یکتا، نسبی), `title`, `description`, `cover_type` (`none` | `image` | `color`), `cover_value`, `updated_at`

**reading_progress** — `user_id`, `doc_path`, `scroll_ratio`, `last_opened_at` — ایندکس روی `(user_id, last_opened_at DESC)`

### ثبت‌نام

`POST /api/auth/register` — username حداقل ۳ کاراکتر، password حداقل ۴ (بدون پیچیدگی). username تکراری → پیام فارسی.

### ورود

`POST /api/auth/login` — session cookie `httpOnly`, `sameSite=lax`. مدت session: ۳۰ روز.

### خروج

`POST /api/auth/logout`

### ادمین seed

در اولین بالا آمدن سرور، اگر کاربری با `role=admin` نیست:

- username: `admino`  
- password: `1q2w3e4r5t` (در production حتماً عوض شود)  

رمز با **bcrypt** یا **scrypt** hash می‌شود — plaintext در DB نیست.

### دسترسی API

| عمل | مهمان | user | admin |
|-----|--------|------|-------|
| browse / read doc | ✓ | ✓ | ✓ |
| search | ✓ | ✓ | ✓ |
| progress ذخیره | local فقط | ✓ | ✓ |
| preferences | local | ✓ | ✓ |
| ویرایش metadata / آپلود جلد | ✗ | ✗ | ✓ |

---

## پنل ادمین — جلد و متادیتا

`PATCH /api/admin/books/:path` — نیاز به session ادمین.

بدنه نمونه:

```json
{
  "title": "راهنمای nginx",
  "description": "برای مبتدی شبکه",
  "coverType": "color",
  "coverValue": "#1E3A5F"
}
```

یا `coverType: "image"` با `multipart` جدا: `POST /api/admin/books/:path/cover`.

عکس در `data/covers/` با نام امن (hash path) ذخیره می‌شود؛ حداکثر ۲ مگابایت، فرمت jpeg/png/webp.

`coverType: "none"` — فقط رنگ/متن پیش‌فرض از خطوط اول.

---

## پورت و deploy

| محیط | PORT | Bind |
|------|------|------|
| توسعه محلی | 4001 | `127.0.0.1` یا `0.0.0.0` |
| سرور لینوکس | **4001** | **0.0.0.0** |

پیش‌فرض در `server.js`: `PORT=4001`, `HOST=0.0.0.0`. راهنمای pm2/systemd: [`docs/server-deploy.md`](../../server-deploy.md).

همگام‌سازی محتوا: در startup و `POST /api/sync-index` — اسکن درخت، به‌روزرسانی `book_metadata` فقط برای فیلدهای خالی (دست‌نخورده توسط ادمین).

---

## مهاجرت از نسخهٔ فعلی

نسخهٔ فعلی `articles` تخت و sync سطح اول دارد. در فاز پیاده‌سازی:

1. schema جدید اضافه شود بدون حذف ناگهانی  
2. explorer به‌جای لیست تخت sidebar  
3. endpointهای قدیمی `/api/articles` یا deprecate با redirect به browse — در tasks تصمیم نهایی  

---

## امنیت و حریم

- Path traversal مسدود  
- رمز ادمین seed فقط بار اول؛ توصیهٔ تغییر در اولین ورود (banner ادمین)  
- آپلود فقط admin + validation MIME  
- Rate limit ساده روی login (مثلاً ۱۰ تلاش در دقیقه per IP) — فاز ۲ اگر لازم  
- داک عمومی نباید رمز production را نگه دارد؛ در `docs-personal/` برای سرور واقعی  

---

## ریسک‌های فنی

**درخت بزرگ `content/docs`:** لیست‌کردن lazy — فقط یک سطح در هر درخواست browse؛ sync متادیتا می‌تواند پس‌زمینه و با flag «در حال ایندکس» باشد.

**sql.js و concurrency:** یک process Node؛ نوشتن progress با صف کوتاه در حافظه قبل از `persist()` تا race کم شود.

**فارسی/انگلیسی:** `dir=auto` روی پاراگراف‌های مطالعه؛ metadata همیشه UTF-8.

**گوش دادن 127.0.0.1 در کد فعلی:** برای سرور باید به `0.0.0.0` تغییر کند وگرنه پورت 4001 از بیرون باز نمی‌شود.

---

## API خلاصه (مرجع پیاده‌سازی)

| Method | Path | توضیح |
|--------|------|--------|
| GET | `/api/browse?path=` | لیست پوشه/فایل |
| GET | `/api/doc?path=` | محتوای کتاب |
| GET | `/api/search?q=` | جستجوی عنوان/توضیح |
| POST | `/api/auth/register` | ثبت‌نام |
| POST | `/api/auth/login` | ورود |
| POST | `/api/auth/logout` | خروج |
| GET | `/api/me` | پروفایل + preferences |
| PUT | `/api/me/preferences` | تم و اندازهٔ متن |
| PUT | `/api/progress` | ذخیره موقعیت |
| GET | `/api/progress/recent` | سه مورد اخیر |
| PATCH | `/api/admin/books/:path` | metadata |
| POST | `/api/admin/books/:path/cover` | آپلود جلد |
| POST | `/api/sync-index` | بازسازی ایندکس metadata |

---

*قدم بعد: [ui-behavior.md](./ui-behavior.md) برای فیلمنامهٔ صفحه‌ها.*

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
  font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important;
  direction: rtl;
  text-align: right;
}
pre, code {
  direction: ltr;
  text-align: left;
}
.markdown-body table,
.markdown-preview-section table,
table {
  direction: rtl !important;
  text-align: right !important;
  width: 100%;
  border-collapse: collapse;
  margin-inline-start: 0;
  margin-inline-end: auto;
}
.markdown-body th,
.markdown-body td,
.markdown-preview-section th,
.markdown-preview-section td,
table thead th,
table tbody td,
table th,
table td {
  text-align: right !important;
  direction: rtl;
  vertical-align: top;
  padding: 0.35em 0.5em;
}
table td code,
table th code,
.markdown-body table td code,
.markdown-body table th code {
  direction: ltr;
  unicode-bidi: embed;
  text-align: right !important;
  display: inline-block;
}
.task-list-item input[type="checkbox"],
input.task-list-item-checkbox {
  margin: 0 0.5em 0 0 !important;
}
</style>
