<div dir="rtl" style="text-align:right;">

# چطور walkthrough بنویسیم؟

**یک خط:** `walkthrough.md` دفترچهٔ شخصی توست — نه گزارش رسمی برای شرکت — که می‌گوید **دیروز چی خواستی، با AI چی شد**، تا شش ماه بعد بدانی از کجا ادامه بدهی.

این فایل در گیت عمومی نمی‌رود؛ فقط خودت (و AI وقتی `/sync-docs` می‌زنی) می‌بیندش.

---

## کجا بذاریمش؟

فقط اینجا: `docs-personal/walkthrough.md`

پوشهٔ `docs-personal` معمولاً در `.gitignore` است — رمز و یادداشت شخصی‌ات آنجا امن‌تر است.

**توجه:** بعضی پروژه‌های قدیمی (مثل ModuleHub) فایل `docs/session-walkthrough.md` داخل گیت دارند. برای پروژهٔ جدید همان استاندارد `docs-personal/` بهتر است.

---

## چرا اصلاً مهم است؟

فرض کن سه هفته روی «کارت پوشه» کار کردی، بعد دو ماه برگشتی. بدون walkthrough نمی‌دانی آخرین sync از کدام commit بود، کدام change باز ماند، و به AI چه گفته بودی.

`/sync-docs` آخرین بلوک walkthrough را می‌خواند → از تاریخ یا هش commit می‌فهمد از کجا تا کجا کد عوض شده → فقط داک‌های مربوط را به‌روز می‌کند → بلوک جدید با commit فعلی می‌گذارد.

اگر walkthrough خالی باشد، sync ممکن است بی‌دلیل کل داک را دست بزند یا برعکس چیزی جا بماند. **یک خط کوتاه بعد هر کار مهم** جلوی دردسر آینده را می‌گیرد.

---

## هر بلوک چه شکلی است؟

جدیدترین یادداشت **بالای** فایل می‌آید. هر بلوک سه قسمت دارد.

**۱. خط اول — تاریخ و نشانهٔ کد**

مثلاً: `[1405-03-01 14:30] abc123f`

تاریخ شمسی + ساعت کافی است. `abc123f` همان هش کوتاه git است — AI با sync از همین می‌فهمد بازهٔ تغییرات کجاست. اگر هنوز commit نزدی، فقط تاریخ بگذار.

**۲. کاربر محترم — حرف خودت**

همان جمله‌ای که به AI زدی، با لحن خودت. نه خلاصهٔ خشک، نه کپی کامل stack trace.

خوب: «کارت‌های صفحهٔ اصلی را مرتب کن، الان به‌هم ریخته‌اند.»

بد: «خطای ۵۰۰ در cardGrid.js خط ۴۲ — stack trace ضمیمه.»

**۳. نام AI. پاسخ — چی درآورد**

AI با اسم خودش (مثلاً Composer) می‌گوید چه کرد — ساده و عامیانه.

خوب: «داک UI را با کد هماهنگ کردم. پوشهٔ change/cart-view هم بستم.»

بد: پاراگراف فنی پر از اسم فایل بدون توضیح.

### نمونهٔ کامل

```
[1405-03-01 14:30] abc123f

کاربر محترم:
/sync-docs — کارت‌ها را در صفحه اصلی مرتب کن

Composer. پاسخ:
داک UI و design را از abc123f تا الان هماهنگ کردم. پوشه change/cart-view بسته شد.
```

---

## کی بنویسی؟

بعد از `/sync-docs`.  
بعد از فیچر مهمی که تموم شد.  
بعد از جلسه‌ای که تصمیم گرفتی و نمی‌خواهی یادت برود.

هر بار لازم نیست — فقط وقتی چیزی عوض شده یا قرار است بعداً برگردی.

---

## چی نذاری توی walkthrough؟

پسورد، توکن، API key.  
خروجی کامل `git diff` یا stack trace طولانی — اگر لازم شد برو `docs-for-ai/ai-common-mistakes`.  
همان بلوک را پشت سر هم بدون کار جدید تکرار نکن.  
فایل را در `docs/` بگذاری به‌جای `docs-personal/` (مگر استثنای پروژهٔ قدیمی).

---

## ربط با change و archive

وقتی پوشهٔ change بسته شد یا ایده‌ای رفت archive، **یک خط** در walkthrough کافی است: «change/folder-cards با تاریخ 1405-03-24 بسته شد — فاز ۴ معلق به archive.»

جزئیات طرح در `docs/change/...` می‌ماند؛ walkthrough فقط **زمان‌خط شخصی** توست.

---

## لینک‌ها

change → [how-to-manage-change-folders.md](./how-to-manage-change-folders.md)  
نمونهٔ پر → [templates/docs-personal/walkthrough.md](./templates/docs-personal/walkthrough.md)  
لحن و نقشه → [readme.md](./readme.md)

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
