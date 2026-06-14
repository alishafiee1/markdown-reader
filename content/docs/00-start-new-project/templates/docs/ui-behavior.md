<div dir="rtl" style="text-align:right;">

# رفتار UI — MenuHub

> **نمونهٔ `docs/ui-behavior.md`**  
> راهنما: [how-to-write-ui-ux-behavior.md](../../how-to-write-ui-ux-behavior.md) | design: [design.md](./design.md)

---

## معرفی

صفحهٔ اصلی، منو، و حالت‌های loading/خطا/خالی برای **مشتری بدون لاگین**.

---

## نقشهٔ صفحات

| صفحه | یک خط |
|------|-------|
| صفحهٔ اصلی | کارت‌ها + جستجو + فیلتر تخفیف |
| منوی رستوران | غذا، قیمت، سفارش |

---

## صفحه: صفحهٔ اصلی

**اول می‌بینه:** عنوان، جستجو، فیلتر تخفیف، کارت‌ها.

| حالت | نمایش |
|------|--------|
| loading | اسکلت کارت |
| خالی | «رستورانی پیدا نشد» |
| خطا | retry |

**کارها:** جستجو، فیلتر، کلیک کارت → منو.

---

## صفحه: منوی رستوران

**اول می‌بینه:** نام، بنر تخفیف (اگر هست)، لیست غذا، «سفارش بده».

برگشت به لیست — **فیلتر و جستجو حفظ** شوند.

---

## جریان: جستجو تا سفارش

1. باز کردن سایت → 2. فیلتر تخفیف → 3. انتخاب رستوران → 4. منو → 5. سفارش (تب جدید)

**E2E:** E2E-P-01 / E2E-D-01

---

## پیام‌ها

| حالت | جمله |
|------|------|
| شبکه | «اتصال برقرار نشد — دوباره تلاش کن» |
| رستوران نیست | «این رستوران دیگه در دسترس نیست» |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
