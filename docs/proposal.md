<div dir="rtl" style="text-align:right;">

# پروپزال — کتابخانهٔ مارک‌داون BookShelf

**یک خط:** یک وب‌اپ **مستقل** می‌سازیم که داکیومنت‌های `content/docs` را مثل اپ کتاب‌خوانی تیره و راحت نشان دهد — روی سرور با `npm start` و پورت ۴۰۰۱، بدون وابستگی به هیچ CMS.

---

فرض کن یادداشت‌ها و آموزش‌هایت پراکنده در پوشه‌های مارک‌داون است. می‌خواهی شب با موبایل یا روز با لپ‌تاپ همان‌ها را بخوانی، بدون باز کردن VS Code، بدون نصب ماژول داخل سایت دیگر. فقط یک آدرس: `http://سرور:4001`.

این پروژه **خودش یک محصول کامل است** — برای تست، توسعه و deploy مستقیم. اگر روزی بخواهی همان را داخل پلتفرم دیگری بگذاری، با skill جدا بسته‌بندی می‌شود؛ الان عمداً هیچ اثری از آن سناریو در repo نیست.

---

## چی داریم الان؟

نسخهٔ اولیه: Express + SQLite + UI ساده با لیست تخت مقالات. کار می‌کند ولی شبیه کتابخانهٔ واقعی نیست.

## چی می‌خواهیم؟

تغییر بزرگ **BookShelf** — جزئیات در [`change/bookshelf-reader/proposal.md`](change/bookshelf-reader/proposal.md):

- مرور پوشه مثل اکسپلورر در `content/docs`
- UI تیره شبیه مرجع BookShelf
- چهار تم مطالعه + تمام‌صفحه
- جستجو در عنوان و داخل متن
- لاگین اختیاری + ذخیرهٔ تم و سه کتاب آخر
- پنل ادمین برای جلد و عنوان کتاب

## چی نمی‌سازیم در سطح پروژه؟

- نصب به‌عنوان ماژول CMS
- اسکریپت ZIP یا wizard آپلود
- وابستگی به reverse proxy خاص

---

## مسیر داکیومنت

| سند | نقش |
|-----|-----|
| همین فایل | چشم‌انداز کل |
| [`architecture-and-structure.md`](architecture-and-structure.md) | ساختار repo |
| [`server-deploy.md`](server-deploy.md) | راه‌اندازی روی سرور |
| [`change/bookshelf-reader/`](change/bookshelf-reader/proposal.md) | فیچر اصلی در حال طراحی |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
  font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important;
  direction: rtl;
  text-align: right;
}
pre, code { direction: ltr; text-align: left; }
</style>
