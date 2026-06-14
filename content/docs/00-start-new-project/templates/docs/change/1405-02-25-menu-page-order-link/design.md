<div dir="rtl" style="text-align:right;">

# طراحی — صفحهٔ منو و لینک سفارش

> **تموم شده** — 1405-02-25

---

## §۱ جریان

```
کلیک کارت → GET /restaurants/:id/menu → MenuPage → orderUrl (_blank)
```

---

## §۲ API (پیاده شده)

| مسیر | پاسخ |
|------|------|
| `GET /restaurants/:id/menu` | 200 + منو |
| رستوران غیرفعال | 404 |

---

## §۳ UI

- MenuPage: نام، بنر تخفیف، آیتم‌ها، دکمه سفارش
- برگشت به لیست — state جستجو/فیلتر حفظ (URL query)
- خطا: «این رستوران دیگه در دسترس نیست»

---

## §۴ E2E

| ID | وضعیت |
|----|--------|
| E2E-P-01 | [x] سبز |
| E2E-D-03 | [x] سبز |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
