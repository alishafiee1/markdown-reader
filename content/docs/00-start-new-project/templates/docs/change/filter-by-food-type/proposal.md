<div dir="rtl" style="text-align:right;">

# پروپزال — فیلتر نوع غذا

> **نمونهٔ `docs/change/filter-by-food-type/proposal.md`** — فیچر در حال بررسی، هنوز بسته نشده.  
> راهنما: [how-to-manage-change-folders.md](../../../../how-to-manage-change-folders.md)

---

## §۱ چرا این کار؟

علی گاهی فقط «فست‌فود» یا «سنتی» می‌خواهد — نه همهٔ رستوران‌ها. الان فقط جستجوی نام و تخفیف داریم.

---

## §۲ چی می‌سازیم؟

- چند دستهٔ ثابت: فست‌فود، سنتی، کافه، …
- فیلتر روی صفحهٔ اصلی کنار فیلتر تخفیف
- هر رستوران یک یا چند برچسب نوع

---

## §۳ چی نمی‌سازیم؟

- فیلتر بر اساس قیمت یا فاصله
- دسته‌بندی خودکار با AI

---

## §۴ معیار موفقیت

علی با فیلتر «فست‌فود» فقط رستوران‌های همان نوع را ببیند — کمتر از ۳ ثانیه.

---

## §۵ ریسک

| ریسک | شدت |
|------|-----|
| رستوران‌ها برچسب نزنند | بالا — لیست خالی به نظر برسد |
| دسته‌ها زیاد شوند | متوسط — UI شلوغ |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
