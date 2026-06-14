<div dir="rtl" style="text-align:right;">

# طراحی — فیلتر نوع غذا

> **نمونهٔ `docs/change/filter-by-food-type/design.md`**

---

## §۱ محدوده

فیلتر `foodType` روی API لیست + UI chipها در صفحهٔ اصلی.

---

## §۲ داده

جدول یا فیلد `tags[]` روی رستوران — مقادیر از enum ثابت: `fastfood`, `traditional`, `cafe`.

---

## §۳ API

`GET /restaurants?foodType=fastfood` — ترکیب با `q` و `discountToday` مجاز.

---

## §۴ UI

چیپ‌های قابل کلیک زیر جستجو. چند انتخاب همزمان — فاز اولیه: **فقط یکی**.

---

## §۵ E2E پیشنهادی

E2E-C-01: انتخاب «فست‌فود» → همهٔ کارت‌ها همان نوع.

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
