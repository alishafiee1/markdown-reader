<div dir="rtl" style="text-align:right;">

# آرشیو — نقشهٔ رستوران‌ها (restaurant-map)

> **نمونهٔ `docs/archive/restaurant-map/proposal.md`** — ایدهٔ **معلق**؛ شاید بعداً برگردیم.  
> راهنما: [how-to-manage-change-folders.md](../../../../how-to-manage-change-folders.md)

---

## چی بود؟

نقشه روی صفحهٔ اصلی — علی رستوران‌های نزدیک را روی GPS ببیند و از روی پین انتخاب کند.

---

## چرا آرشیو شد (فعلاً نمی‌سازیم)؟

- فاز ۱ هدفش **مقایسهٔ منو و تخفیف** است، نه پیدا کردن مسیر.
- نیاز به موقعیت کاربر، API نقشه، هزینهٔ سرویس — برای MVP سنگین است.
- در `docs/design.md` §۲ عمداً «نقشه و GPS» خارج از محدوده گذاشته شده بود.

---

## اگر برگردیم چی لازم داریم؟

- رضایت کاربر برای location
- مختصات دقیق رستوران‌ها (الان فقط آدرس متنی داریم)
- تصمیم: نقشهٔ جدا یا همان صفحهٔ اصلی؟

---

## تاریخ آرشیو

1405-01-20 — جلسهٔ اولویت‌بندی: «بعد از ۱۰ رستوران واقعی و فاز ۲ پنل، دوباره نگاه کنیم.»

**منبع:** قبلاً یه پیش‌نویس کوتاه در `docs/change/restaurant-map/` بود — قبل از شروع جدی به archive منتقل شد (نه change تاریخ‌دار).

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
