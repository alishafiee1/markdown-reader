<div dir="rtl" style="text-align:right;">

# طراحی MenuHub — کشف رستوران و نمایش منو

> **نمونهٔ `docs/design.md`**  
> راهنما: [how-to-write-design.md](../../how-to-write-design.md) | پروپزال: [proposal.md](./proposal.md) | UI: [ui-behavior.md](./ui-behavior.md)

---

## §۱ معرفی

وقتی علی سایت را باز می‌کند، سیستم لیست رستوران‌ها را می‌آورد، فیلتر می‌کند، و منوی یک رستوران را نشان می‌دهد — بدون لاگین.

---

## §۲ محدوده

| داخل | خارج |
|------|------|
| لیست، جستجو، فیلتر تخفیف | پنل صاحب رستوران (فاز ۲) |
| منو + لینک سفارش | پرداخت، سبد |

---

## §۳ واژه‌ها

| اصطلاح | معنی |
|--------|------|
| رستوران | نام، آدرس کوتاه، لینک سفارش |
| تخفیف امروز | پرچم روزانه — فقط امروز |

---

## §۴ تصویر کلی

```
علی → صفحهٔ اصلی → (جستجو/فیلتر) → منو → لینک خارجی
```

---

## §۵ اجزای اصلی

| جزء | می‌کنه | نمی‌کنه |
|-----|--------|---------|
| API لیست | جستجو، فیلتر تخفیف | ویرایش منو |
| API منو | منوی یک رستوران | تخفیف پیچیده |
| صفحهٔ اصلی | کارت‌ها، loading، empty | لاگین |

---

## §۶ رفتار backend

- لیست: `q` جستجو، `discountToday=true`
- `active=false` در لیست عمومی نیاید
- منوی رستوران غیرفعال → 404
- DB down → 503 + trace id

---

## §۷ رفتار UI (خلاصه)

جزئیات کلیک و پیام‌ها → [ui-behavior.md](./ui-behavior.md)

---

## §۸ فرایند: باز کردن منو

```
کلیک کارت → درخواست منو → فعال؟ → نمایش → «سفارش بده» → orderUrl
```

---

## §۹ وضعیت‌ها

`loading` | `ready` | `empty` | `error`

---

## §۱۰ خطاها

| خطا | پیام کاربر |
|-----|------------|
| شبکه | «اتصال برقرار نشد — دوباره تلاش کن» |
| رستوران نیست | «این صفحه دیگه وجود نداره» |

---

## §۱۱ امنیت

- جستجو: max 100 chars
- `orderUrl` فقط http/https

---

## §۱۲ تصمیم‌ها

- مشتری بدون لاگین
- کش فقط روی لیست (TTL 5 min)

---

## §۱۳ ریسک فنی

| موضوع | شدت | کاهش |
|-------|-----|------|
| کندی لیست | متوسط | pagination |
| orderUrl خراب | بالا | اعتبارسنجی URL |

---

## §۱۴ E2E

| # | سناریو | نتیجه |
|---|--------|-------|
| E2E-D-01 | فیلتر تخفیف → منو | برچسب تخفیف |
| E2E-D-03 | URL قدیمی | «در دسترس نیست» |

---

## §۱۵ موارد باز

- فیلتر نوع غذا → [change/filter-by-food-type/](./change/filter-by-food-type/proposal.md)

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
