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

<div dir="rtl" style="text-align:right;">

# راهنمای ساخت و مستندسازی API

سلام! اگه داری یک API می‌سازی یا مستندش می‌کنی، این راهنما همون چک‌لیست دوستانه‌ایه که می‌خوایم همه تیم (و حتی AI) ازش پیروی کنن.

**خلاصه ایده:** اول قرارداد رو بنویس، بعد کد بزن؛ API باید خودش به خودش جواب بده (`/help`، `/health`) و مستنداتش همیشه با واقعیت یکی باشه.

---

## ۱. قبل از کد — طراحی درست

### نسخه‌گذاری از روز اول
- مسیر: `/v1/users` یا هدر: `Accept-Version: 1`
- هر تغییر شکننده (breaking) → نسخه جدید، نه دستکاری بی‌صدا

### یک سبک نام‌گذاری، همه‌جا
| لایه | پیشنهاد |
|------|---------|
| JSON | `camelCase` |
| دیتابیس | `snake_case` |
| URL | `kebab-case` یا `snake_case` (یکی رو انتخاب کن و ثابت نگه دار) |

### endpointهایی که نباید فراموش بشن
| مسیر | کاربرد | احراز هویت |
|------|--------|------------|
| `GET /health` | زنده‌ای سرویس؟ | بدون |
| `GET /ready` | آماده ترافیک؟ (DB، صف، …) | بدون |
| `GET /help` یا `/info` | نام، نسخه، لینک مستندات | بدون |

### لاگ و ردیابی
هر درخواست مهم یک `request-id` داشته باشه تا موقع دیباگ گم نشی.

---

## ۲. ساخت API — استانداردهای اجباری

### طراحی قرارداد-محور (Contract-First)
1. اول `openapi.yaml` یا `openapi.json` بنویس
2. بعد کد رو طبق همون قرارداد پیاده کن
3. OpenAPI منبع اصلی حقیقت (source of truth)ه — Markdown فقط مکمله

### اعتبارسنجی و امنیت
- همه ورودی‌ها validate بشن
- خطاها معنادار باشن، نه جزئیات داخلی سرور
- `rate limiting` و `timeout` داشته باش و توی مستندات بنویس
- `CHANGELOG.md` رو با هر نسخه به‌روز کن

### تاریخ و زمان
همیشه ISO 8601: `2025-03-20T10:15:30Z`

### صفحه‌بندی و فیلتر
پارامترهای رایج رو مستند کن: `limit`, `offset`, `page`, `sort`, `filter`

---

## ۳. خطاها — فرمت یکدست

هر خطا حداقل این‌ها رو داشته باشه:

```json
{
  "error": "ERR_USER_NOT_FOUND",
  "message": "کاربر با این شناسه پیدا نشد",
  "help_url": "/docs/errors#ERR_USER_NOT_FOUND"
}
```

### قوانین طلایی
- **هرگز** `stack trace` توی production برنگردون — فقط لاگ داخلی
- خطای اعتبارسنجی → لیست فیلدهای مشکل‌دار:

```json
{
  "error": "VALIDATION_FAILED",
  "fields": { "email": "must be valid email" }
}
```

- توی پاسخ خطا فیلد `help_url` یا `hint` بذار تا کاربر بدونه کجا راهنما بخونه

---

## ۴. مستندسازی API — OpenAPI

### فایل و مسیر
- `openapi.yaml` یا `openapi.json` در ریشه پروژه
- مستندات تعاملی روی `/docs` یا `/swagger`

### هر endpoint باید شامل باشه
- `summary` (کوتاه) و `description` (بلند)
- پارامترهای path، query، header — با نوع، الزامی/اختیاری، مثال
- بدنه درخواست — schema + مثال
- پاسخ موفق — کد وضعیت + schema
- پاسخ خطا — حداقل `400`, `401`, `403`, `404`, `500`

### نمونه حداقلی

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: دریافت اطلاعات کاربر
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        '200':
          description: موفق
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: integer }
                  name: { type: string }
        '404':
          description: کاربر یافت نشد
```

### ابزارهای مفید
| کار | ابزار |
|-----|-------|
| اعتبارسنجی OpenAPI | `swagger-cli validate`, `redocly-cli` |
| تست تطابق قرارداد | `Dredd`, `Schemathesis`, `Prism` |
| نمایش مستندات | Swagger UI, Redoc, Stoplight Elements |

---

## ۵. راهنمای درون‌برنامه‌ای — خود API به خودش کمک کنه

### برای API وب — `GET /help`

```json
{
  "service": "User API",
  "version": "2.1.0",
  "docs": "https://docs.example.com/api",
  "swagger": "/swagger/index.html",
  "endpoints": [
    { "path": "/users", "methods": ["GET", "POST"] },
    { "path": "/users/{id}", "methods": ["GET", "PUT", "DELETE"] }
  ],
  "support": "support@example.com"
}
```

- اختیاری ولی خوب: پشتیبانی از هدر `Accept: application/json+help`
- توی خطاها `help_url` بذار

### برای CLI — `--help` و `-v`

همه دستورات اصلی از `--help` / `-h` پشتیبانی کنن. خروجی شامل:
- Usage
- Options (یک‌خطی)
- Commands (اگه زیردستور داری)
- یک مثال کوتاه در انتها

**حداکثر ~۳۰ خط** — بقیه بره `man` یا مستندات آنلاین.

```
Usage: user-cli [options] <command>

Manage users from command line.

Options:
  --help, -h     Show this help
  --version, -v  Show version
  --config FILE  Use custom config file

Commands:
  create    Create a new user
  list      List all users
  delete    Delete a user

Example:
  user-cli create --name "Ali" --email a@example.com
```

### کتابخانه‌های پیشنهادی
- **CLI:** `argparse` (Python)، `cobra` (Go)، `commander` (Node.js)
- **API:** Swagger UI, ReDoc, GraphiQL (GraphQL)

---

## ۶. قبل از انتشار — تست کن

| نوع تست | چی رو چک می‌کنه |
|---------|-----------------|
| یکپارچگی | endpointها و کدهای وضعیت |
| تطابق قرارداد | کد واقعی vs OpenAPI (Dredd / Schemathesis) |
| راهنما | `GET /help` و `--help` (اگه CLI داری) |

---

## ۷. چک‌لیست نهایی تیم

- [ ] فایل OpenAPI ساخته شده و معتبره
- [ ] `/health` و `/ready` بدون auth کار می‌کنن
- [ ] `/help` نام، نسخه و لینک مستندات رو برمی‌گردونه
- [ ] هر خطا `code`، `message` و `help_url` داره
- [ ] مستندات Markdown مکمل در `/docs/api` هست
- [ ] `--help` (اگه CLI داری) استاندارده
- [ ] contract testing سبزه
- [ ] `CHANGELOG.md` به‌روزه

---

## جمع‌بندی

| مرحله | کار اصلی |
|-------|----------|
| طراحی | نسخه‌گذاری، نام‌گذاری یکدست، endpointهای سلامت و راهنما |
| ساخت | contract-first، validation، خطای یکدست، rate limit |
| مستندسازی | OpenAPI کامل + Swagger UI |
| خودیاری | `/help` برای API، `--help` برای CLI |
| انتشار | تست یکپارچگی + تطابق قرارداد + چک‌لیست |

این فایل رو می‌تونی توی مخزن پروژه (مثلاً `docs/api-guide.md`) یا به عنوان قانون Cursor کپی کنی. اگه برای زبان یا فریم‌ورک خاصی نمونه می‌خوای، بگو تا اضافه کنیم.

</div>
