<div dir="rtl" style="text-align:right;">

# طراحی — فیلتر «تخفیف امروز»

> **تموم شده** — 1405-02-18

---

## §۱ محدوده

فیلتر boolean روی `GET /restaurants` + UI toggle در HomePage.

---

## §۲ API (پیاده شده)

```
GET /restaurants?discountToday=true
```

فقط رستوران‌های `active=true` و `discountToday=true`.

---

## §۳ UI

- چک‌باکس یا سوئیچ زیر جستجو
- کارت: badge «تخفیف» اگر `discountToday`
- حالت empty: «رستورانی با تخفیف امروز نداریم»

---

## §۴ تست

| ID | وضعیت |
|----|--------|
| E2E-D-01 (بخش فیلتر) | [x] سبز |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
