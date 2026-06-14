<div dir="rtl" style="text-align:right;">

# چطور architecture-and-structure بنویسیم؟

**یک خط:** این فایل به کسی که کد نمی‌خواند می‌گوید **کدام فایل یا پوشه در پروژه چه نقشی دارد** — مثل راهنمای گشت در یک ساختمان، نه مثل نقشهٔ فنی پر از اصطلاح.

`design.md` می‌گوید وقتی کاربر دکمه را می‌زند **چه اتفاقی می‌افتد** (جریان، سرور، ذخیره).  
`architecture-and-structure.md` می‌گوید **کدام فایل** در آن ماجرا نشسته — با چند خط توضیح ساده.

جای فایل در پروژه: `docs/architecture-and-structure.md`

---

## کی لازمش داریم؟

**پروژهٔ کوچک (lite):** اختیاری — شاید همان `project-file-index.md` با یک خط برای هر فایل کافی باشد.

**پروژهٔ معمولی به بالا:** خیلی کمک می‌کند — مخصوصاً وقتی شش ماه دیگر برمی‌گردی یا هم‌تیمی تازه می‌آید و می‌پرسد «لاگین کجاست؟».

---

## با بقیهٔ داک‌ها قاطی نکن

**`design.md`** — «وقتی ادمین کارت را می‌کشد چه می‌شود؟»

**`ui-behavior.md`** — «دستگیره کجاست، toast چه می‌گوید؟»

**`architecture-and-structure.md`** — «فایل `folder-management.ts` در این ماجرا چه کار می‌کند؟»

**`project-file-index.md`** — فهرست تلفن: مسیر + **یک خط**.

**`docs-for-ai/map.md`** — همان نقشه ولی فشرده و انگلیسی برای AI.

اگر فقط یک خط می‌خواهی → index.  
اگر می‌خواهی **بفهمی** نه فقط اسم ببینی → architecture-and-structure.

---

## اول یک مثال — ModuleHub یا هر CMS

فرض کن می‌خواهی بدانی «وقتی ادمین پوشه را rename می‌کند، کدام فایل‌ها درگیرند».

در design نوشته‌ای: «درخواست به سرور می‌رود، نام در فایل چیدمان ذخیره می‌شود.»

در architecture می‌نویسی:

«**`core/src/server/routes/folders.ts`** — مسیرهای HTTP مربوط به پوشه را تعریف می‌کند؛ وقتی rename می‌آید، اینجا اول بررسی می‌شود ادمین حق دارد یا نه.

**`core/src/server/services/folder-management.ts`** — منطق rename و جابه‌جایی؛ اجازه نمی‌دهد پوشه داخل خودش برود.

**`public/card-layout-editor.js`** — روی صفحه، منوی چرخ‌دنده و درخواست به API را می‌فرستد.»

هر بلوک **۵ تا ۲۰ خط** — نه یک کلمه، نه صفحهٔ کد.

---

## چطور بنویسیم که خوانا باشد؟

**درخت فایل و توضیح را قاطی نکن** — شلوغ می‌شود.

به‌جاش: یک سرتیتر برای گروه («فایل‌های سرور»، «فایل‌های رابط کاربر»، «تست‌ها»)، بعد مسیر فایل، بعد پاراگراف حرف.

گروه‌های معمول: بک‌اند · UI/فرانت · تست · اسکریپت و ابزار · تنظیمات (config)

---

## هر فایل architecture چطور شروع می‌شود

**عنوان** — «ساختار — ModuleHub CMS» یا «نقشهٔ فایل‌های سرور و UI».

**یک خط** — «توضیح می‌دهد کدام فایل‌های مهم در جریان پوشه، کارت و ماژول چه نقشی دارند.»

**نمای کلی** — دو سه پاراگراف: این پروژه از نگاه کسی که کد نمی‌خواند چیست — چند بخش اصلی دارد.

بعد می‌روی سراغ فایل‌ها — عنوان ساده، نه §۱ تا §۲۰.

---

## لحن نوشتن

خوب: «این فایل وقتی کاربر لاگین می‌کند چک می‌کند رمز درست است.»

بد برای `docs/`: «Authentication middleware validates JWT» بدون توضیح فارسی.

فقط فایل‌های **واقعاً مهم** — نه لیست کردن هزار فایل داخل `node_modules`.

مخاطب: خودت بعد از چند ماه، هم‌تیمی، کسی که قبل از کد زدن نقشه می‌خواهد.

---

## اگر پروژه بزرگ شد

مثل design و ui-behavior می‌توانی بشکنی:

- `architecture-and-structure.md` — فهرست و لینک
- `architecture-server.md` — فقط بک‌اند
- `architecture-frontend.md` — فقط UI

قانون حجم: حدود ۳۰۰–۴۰۰ خط برای هر فایل؛ بیشتر → فایل موضوعی جدید.

---

## با `/sync-docs` چطور به‌روز می‌شود؟

کل فایل را هر بار از نو ننویس — دردسر است.

فقط وقتی sync می‌زنی:

فایلی در کد عوض شده → همان بخش را درست کن.  
فایل مهم جدید → بخش جدید.  
فایلی حذف شده → بخشش را بردار یا بنویس «منسوخ».

بازهٔ «چی عوض شده» از walkthrough و گیت می‌آید — پس walkthrough را خالی نگذار.

---

## قبل از بستن — خودت بخوان

آیا بدون باز کردن کد فهمیدی «rename پوشه از کدام فایل شروع می‌شود»؟  
آیا design را دوباره کپی نکرده‌ای؟  
آیا ui-behavior (رنگ دکمه) اینجا نیامده؟

---

## لینک‌ها

قبلش → [how-to-write-design.md](./how-to-write-design.md)  
نمونهٔ پر → [templates/docs/architecture-and-structure.md](./templates/docs/architecture-and-structure.md)  
نسخه AI → [templates/docs-for-ai/architecture-and-structure.md](./templates/docs-for-ai/architecture-and-structure.md)  
walkthrough → [how-to-write-walkthrough.md](./how-to-write-walkthrough.md)  
نقشه → [readme.md](./readme.md)

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
