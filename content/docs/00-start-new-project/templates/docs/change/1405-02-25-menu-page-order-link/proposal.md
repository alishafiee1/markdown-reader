<div dir="rtl" style="text-align:right;">

# پروپزال — صفحهٔ منو و لینک سفارش

> **نمونهٔ `docs/change/1405-02-25-menu-page-order-link/proposal.md`** — **تموم شده** (بسته‌شده 1405-02-25).  
> راهنما: [how-to-manage-change-folders.md](../../../../how-to-manage-change-folders.md)

---

## §۱ چرا این کار بود؟

لیست رستوران کافی نبود — علی باید **منوی واقعی** و دکمهٔ **سفارش** را ببیند (E2E-P-01).

---

## §۲ چی ساختیم؟

- صفحهٔ `/r/:id` با لیست غذا و قیمت
- API منوی یک رستوران + چک `active`
- دکمه «سفارش بده» → `orderUrl` در **تب جدید**
- صفحهٔ خطا برای رستوران حذف/غیرفعال

---

## §۳ چی نساختیم؟

- سبد خرید و پرداخت داخل MenuHub
- پیش‌نمایش منو داخل کارت لیست

---

## §۴ معیار موفقیت (رسیدیم)

- [x] E2E-P-01 کامل سبز: لیست → تخفیف → منو → کلیک سفارش
- [x] `orderUrl` فقط http/https — اعتبارسنجی در seed و design

---

## §۵ بستن کار

- **تاریخ بستن:** 1405-02-25
- **ادغام در داک اصلی:** `docs/design.md` §۸، `docs/tasks.md` فاز ۲
- **قبل از rename:** پوشه اسمش `menu-page-order-link` بود (بدون تاریخ)

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
