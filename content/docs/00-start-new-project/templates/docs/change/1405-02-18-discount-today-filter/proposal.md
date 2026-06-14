<div dir="rtl" style="text-align:right;">

# پروپزال — فیلتر «تخفیف امروز»

> **نمونهٔ `docs/change/1405-02-18-discount-today-filter/proposal.md`** — **تموم شده** (بسته‌شده 1405-02-18).  
> راهنما: [how-to-manage-change-folders.md](../../../../how-to-manage-change-folders.md)

---

## §۱ چرا این کار بود؟

علی می‌خواست فقط رستوران‌هایی را ببیند که **امروز** تخفیف دارند — نه کل لیست را ورق بزند.

---

## §۲ چی ساختیم؟

- سوئیچ «فقط تخفیف امروز» روی صفحهٔ اصلی
- پارامتر `discountToday` در API لیست
- برچسب «تخفیف» روی کارت وقتی فعال است

---

## §۳ چی نساختیم؟

- درصد تخفیف روی کارت (فقط برچسب — جزئیات در منو)
- اعلان push برای تخفیف

---

## §۴ معیار موفقیت (رسیدیم)

- [x] با روشن کردن فیلتر، فقط رستوران‌های `discountToday=true` بیایند
- [x] E2E-D-01 بخش اول (لیست + فیلتر) سبز شد

---

## §۵ بستن کار

- **تاریخ بستن:** 1405-02-18
- **ادغام در داک اصلی:** `docs/design.md` §۶، `docs/ui-behavior.md` صفحهٔ اصلی
- **یادداشت:** پوشه با `/sync-docs` تاریخ‌دار شد — تاریخچهٔ پلن همین‌جا می‌ماند

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
