<div dir="rtl" style="text-align:right;">

# راهنمای تم‌های مطالعه — چهار حالت نور + تمام‌صفحه

> مکمل: [ui-behavior.md](./ui-behavior.md) (دکمه‌ها و جابه‌جایی) · [design.md](./design.md) (ذخیرهٔ تم)

این سند فقط **حالت‌های مطالعه** را توضیح می‌دهد — نه تم تیرهٔ کل اپ. رابط بیرونی (خانه، کتابخانه، نوار پایین) همیشه تم BookShelf تیره می‌ماند؛ چهار حالت زیر فقط **کارت متن کتاب** و ناحیهٔ خواندن را عوض می‌کنند.

---

## چرا چهار حالت؟

خوانندگان طولانی‌مدت معمولاً یک تم ثابت ندارند: روز روشن، عصر کرم، شب خاکستری، تاریکی کامل. هدف **راحتی چشم** است نه زیبایی تصادفی. هر تم باید کنتراست متن حداقل **۴.۵:۱** (WCAG AA) داشته باشد.

---

## تم ۱ — روشن (Day)

| نقش | مقدار |
|-----|--------|
| پس‌زمینهٔ مطالعه | `#FAFAF8` |
| متن اصلی | `#1A1A1A` |
| متن ثانویه / یادداشت | `#525252` |
| لینک | `#2563EB` |
| کد / pre | `#F3F4F6` پس‌زمینه، متن `#1E293B` |
| حاشیهٔ کارت | `rgba(0,0,0,0.06)` |

مناسب نور روز و چاپ ذهنی. فونت بدنه: **Libre Baskerville** (انگلیسی) + **Vazirmatn** (فارسی).

---

## تم ۲ — کرم (Sepia)

| نقش | مقدار |
|-----|--------|
| پس‌زمینه | `#F4ECD8` |
| متن اصلی | `#3D3428` |
| متن ثانویه | `#6B5E4C` |
| لینک | `#8B4513` |
| کد / pre | `#E8DFC8` |
| حاشیه | `rgba(61,52,40,0.12)` |

حس کاغذ کهنه؛ برای مطالعهٔ شب‌های ملایم بدون سفیدی تند.

---

## تم ۳ — خاکستری (Dim)

| نقش | مقدار |
|-----|--------|
| پس‌زمینه | `#2D2D2D` |
| متن اصلی | `#E8E8E8` |
| متن ثانویه | `#A3A3A3` |
| لینک | `#60A5FA` |
| کد / pre | `#1F1F1F` |
| حاشیه | `rgba(255,255,255,0.08)` |

میانهٔ راه بین روشن و OLED؛ برای محیط نیمه‌تاریک.

---

## تم ۴ — شب (Night / OLED)

| نقش | مقدار |
|-----|--------|
| پس‌زمینه | `#000000` یا `#121212` |
| متن اصلی | `#E0E0E0` |
| متن ثانویه | `#9CA3AF` |
| لینک | `#38BDF8` (آبی ملایم) |
| درخشش بالای کارت | گرادیان `rgba(30,58,138,0.35)` → شفاف (مثل مرجع BookShelf) |
| کد / pre | `#0A0A0A` |

پیش‌فرض مطالعه برای کاربرانی که اپ را در حالت تیره باز می‌کنند. glow فقط روی هدر کارت، نه روی کل صفحه.

---

## تمام‌صفحه (Fullscreen)

حالت جدا از چهار تم است — **لایهٔ UI** را عوض می‌کند:

- نوار بالا، نوار پایین مطالعه، breadcrumb و bottom nav پنهان می‌شوند  
- فقط کارت متن + یک دکمهٔ شناور کوچک «خروج از تمام‌صفحه» (گوشه)  
- اسکرول و ذخیرهٔ موقعیت مثل حالت عادی  
- کلید `Esc` یا ضربهٔ دوباره روی آیکون تمام‌صفحه برمی‌گردد  

در تمام‌صفحه، تم مطالعه (یکی از چهار حالت) همچنان اعمال است.

---

## اندازهٔ متن

سه سطح (علاوه بر zoom مرورگر): **معمولی ۱۸px**، **بزرگ ۲۰px**، **خیلی بزرگ ۲۲px** — `line-height` حدود **۱.۷۵**. عرض ستون متن روی دسکتاپ `max-width: 42rem` برای خوانایی.

---

## ذخیرهٔ انتخاب کاربر

| وضعیت | کجا ذخیره می‌شود |
|--------|------------------|
| مهمان | `localStorage`: `readingTheme`, `fontScale`, `lastGuestDoc` (اختیاری، یک مورد) |
| لاگین | جدول `user_preferences` روی سرور + همان کلیدها برای sync سریع |

پیش‌فرض اولین بازدید: تم مطالعه **شب**، مقیاس **معمولی**.

---

## دسترسی

- دکمه‌های تم `aria-pressed` دارند  
- `prefers-reduced-motion`: بدون انیمیشن گرادیان  
- فوکوس کیبورد روی سوییچر تم با حلقهٔ ۳px آبی روشن  

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
  font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important;
  direction: rtl;
  text-align: right;
}
pre, code {
  direction: ltr;
  text-align: left;
}
.markdown-body table,
.markdown-preview-section table,
table {
  direction: rtl !important;
  text-align: right !important;
  width: 100%;
  border-collapse: collapse;
  margin-inline-start: 0;
  margin-inline-end: auto;
}
.markdown-body th,
.markdown-body td,
.markdown-preview-section th,
.markdown-preview-section td,
table thead th,
table tbody td,
table th,
table td {
  text-align: right !important;
  direction: rtl;
  vertical-align: top;
  padding: 0.35em 0.5em;
}
table td code,
table th code,
.markdown-body table td code,
.markdown-body table th code {
  direction: ltr;
  unicode-bidi: embed;
  text-align: right !important;
  display: inline-block;
}
.task-list-item input[type="checkbox"],
input.task-list-item-checkbox {
  margin: 0 0.5em 0 0 !important;
}
</style>
