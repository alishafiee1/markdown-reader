<div dir="rtl" style="text-align:right;">

# ساختار پروژه — Markdown Reader

**یک خط:** نقشهٔ فایل‌های مهم همین repo — اپ مستقل Node، نه ماژول CMS.

---

## تصویر کلی

```
مرورگر  →  public/ (HTML/CSS/JS)
              ↓ fetch
           server.js  →  routes/  →  services/
              ↓                      ↓
           data/*.db              content/docs/
           (SQLite)               (مارک‌داون روی دیسک)
```

کاربر صفحه را باز می‌کند؛ JS به API درخواست می‌زند؛ سرور یا از دیسک می‌خواند یا از SQLite متادیتا برمی‌گرداند.

---

## پوشه‌های اصلی

**`server.js`** — نقطهٔ ورود؛ Express، پورت و host از env.

**`routes/`** — endpointهای REST (فعلاً `articles.js`؛ بعداً auth، browse، admin).

**`services/`** — منطق بدون HTTP: sync محتوا، رندر مارک‌داون.

**`db/`** — schema SQL و لایهٔ دسترسی SQLite (`sql.js`).

**`public/`** — فرانت‌اند استاتیک (تا بازطراحی BookShelf همین‌جا می‌ماند).

**`content/docs/`** — **کتابخانهٔ واقعی** — هزاران فایل آموزشی؛ در git یا sync جدا روی سرور.

**`data/`** — runtime: دیتابیس، بعداً `covers/` برای جلد کتاب. در git نیست (فقط `.gitkeep`).

**`tests/`** — تست API با flag `MD_READER_RUN_TESTS=1`.

**`docs/`** — داک انسان‌محور فارسی.

**`docs-for-ai/`** — خلاصهٔ انگلیسی برای agent.

**`docs/change/bookshelf-reader/`** — طراحی فیچر جدید (proposal، design، tasks).

---

## عمداً نیست

| چیز | چرا |
|-----|-----|
| `scripts/build-zip` | مربوط به packaging CMS بود — حذف شد |
| `docs/modulehub-install` | حذف شد |
| `dist/` | خروجی ZIP — استفاده نمی‌شود |

---

## متغیرهای محیط

`PORT` (4001) · `HOST` (0.0.0.0) · `MARKDOWN_READER_DB` · `MD_READER_RUN_TESTS`

جزئیات: [server-deploy.md](server-deploy.md) و `.env.example`.

---

## آینده (خارج از repo)

بسته‌بندی برای پلتفرم‌های دیگر با **skill جدا** — این repo تمیز و قابل تست مستقل می‌ماند.

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
  font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important;
  direction: rtl;
  text-align: right;
}
pre, code { direction: ltr; text-align: left; }
</style>
