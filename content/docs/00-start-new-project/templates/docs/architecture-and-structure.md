<div dir="rtl" style="text-align:right;">

# ساختار پروژه MenuHub

> **نمونهٔ `docs/architecture-and-structure.md`**  
> راهنما: [how-to-write-architecture-and-structure.md](../../how-to-write-architecture-and-structure.md)

---

## نمای کلی

MenuHub یک وب‌اپ ساده است: **فرانت** صفحه‌ها را نشان می‌دهد، **بک‌اند** لیست و منو را از دیتابیس می‌آورد. مشتری لاگین نمی‌کند؛ صاحب رستوران در فاز ۲ پنل جدا دارد.

---

## فایل‌های بک‌اند

### `server/src/index.ts`
نقطهٔ شروع سرور. تنظیمات را می‌خواند، routeها را وصل می‌کند، روی پورت گوش می‌دهد.

### `server/src/routes/restaurants.ts`
API لیست رستوران: جستجو (`q`)، فیلتر تخفیف (`discountToday`). فقط `active=true`.

### `server/src/routes/menu.ts`
منوی یک رستوران با `restaurantId`. اگر غیرفعال → 404.

### `server/src/db/`
اتصال دیتابیس و queryهای ساده. seed تست در `seed.ts`.

---

## فایل‌های فرانت

### `client/src/pages/HomePage.tsx`
صفحهٔ اصلی — کارت رستوران، جستجو، فیلتر. حالت‌های loading/empty/error.

### `client/src/pages/MenuPage.tsx`
منوی یک رستوران + دکمه «سفارش بده» (تب جدید).

### `client/src/components/RestaurantCard.tsx`
یک کارت در لیست — نام، توضیح کوتاه، برچسب تخفیف.

---

## داکیومنت‌ها (همین پروژه)

| مسیر | نقش |
|------|-----|
| `docs/proposal.md` | چرا MenuHub |
| `docs/design.md` | جریان لیست و منو |
| `docs/ui-behavior.md` | رفتار صفحه‌ها |
| `docs/tasks.md` | فازهای کار |
| `docs/change/` | فیچرهای در حال طراحی |
| `docs-for-ai/` | نسخهٔ انگلیسی فشرده برای AI |

---

## آخرین به‌روزرسانی

- **تاریخ:** 1405-03-01 (نمونه)
- **تغییر:** ساختار اولیه فاز ۱ — لیست و منو

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
