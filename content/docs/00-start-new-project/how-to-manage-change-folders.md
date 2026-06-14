<div dir="rtl" style="text-align:right;">

# پوشه‌های change و archive — برای چیه؟

**یک خط:** وقتی پروژه بزرگ می‌شود، هر فیچر جدید یک **دفترچهٔ طرح جدا** می‌گیرد — تا `proposal.md` و `design.md` اصلی شلوغ و گیج‌کننده نشوند.

این راهنما همان لحن بقیهٔ پوشه است: خودمونی، با داستان از ایده تا بستن کار.

---

## داستان از اول تا آخر

فرض کن می‌خواهی «نمای کارت‌ها روی صفحهٔ اصلی» را عوض کنی. اگر همه‌چیز را بریزی داخل `docs/design.md` اصلی، شش ماه بعد کسی نمی‌فهمد کدام بخش مربوط به کارت است و کدام مربوط به ورود ادمین.

**ایده تازه آمد**

پوشه می‌سازی: `docs/change/card-view/`  
اسم **ساده و انگلیسی** — بدون تاریخ. یعنی «هنوز داریم روش کار می‌کنیم».

داخلش همان زنجیرهٔ همیشگی، فقط برای **همین فیچر**:

- `proposal.md` — چرا این کار را می‌کنیم؟
- `design.md` — سیستم چطور کار می‌کند؟
- `tasks.md` — قدم‌به‌قدم چه بزنیم؟
- `ui-behavior.md` — اگر UI دارد: روی صفحه چه می‌شود؟ (و فایل‌های فرعی مثل `ui-behavior-move-card-view.md` اگر مویرگ است)

ساخت سریع: `/new-change` در Cursor — از روی قالب پروژه.

**کار تموم شد**

وقتی تسک‌ها زده شدند (یا صریح گفتی تموم است)، `/sync-docs` می‌زنی. اسم پوشه عوض می‌شود:

`docs/change/1405-03-01-card-view/`

`1405-03-01` تاریخ شمسی روزی است که کار را بستی. با یک نگاه به پوشه‌ها می‌فهمی کدام طرح قدیمی است و کدام هنوز باز.

پوشهٔ تموم‌شده **نمی‌رود archive** — همانجا با تاریخ می‌ماند تا تاریخچهٔ پلن‌ها را ببینی.

**ایده را ول کردی یا رد شد**

می‌بری `docs/archive/` — **دستی**، نه با sync. مثل کشوی «شاید یک روز» یا «دیگه نمی‌خواهیم». معمولاً فقط `proposal.md` کافی است — چرا رد شد یا چرا معلق است.

---

## اسم پوشه یعنی چی؟

**`cart-view`** — باز است؛ داریم روش کار می‌کنیم.

**`1405-03-01-cart-view`** — تموم شده؛ تاریخ اول = روز بستن.

**`archive/loyalty-points/`** — ایده رد شد یا معلق — نه کار تموم‌شده.

نمونهٔ تموم‌شده در templates: [1405-02-18-discount-today-filter](./templates/docs/change/1405-02-18-discount-today-filter/proposal.md).

---

## فرق با proposal و design اصلی پروژه

**`docs/proposal.md`** — کل محصول: چرا اصلاً این سایت یا اپ را ساختیم.

**`docs/change/فلان/proposal.md`** — فقط یک تغییر: مثلاً فقط کارت‌ها.

**`docs/design.md`** — کل سیستم چطور کار می‌کند.

**`docs/change/فلان/design.md`** — فقط طراحی همان تغییر.

پس ریشه = داستان کل محصول.  
`change/...` = یک فصل جدا از همان کتاب.

---

## ui-behavior داخل change

اگر فیچر روی صفحه دیده می‌شود، ui-behavior را **همانجا** بنویس — نه حتماً در `docs/ui-behavior.md` ریشه. مثلاً جابه‌جایی کارت → `docs/change/folder-cards/ui-behavior-move-card-view.md`.

فایل اصلی `ui-behavior.md` داخل change می‌تواند فقط فهرست و لینک باشد.

---

## OpenSpec و دو بایگانی

بستن کار انسانی (`/sync-docs` + rename با تاریخ شمسی) با بایگانی OpenSpec (`openspec/changes/archive/YYYY-MM-DD-...`) **جدا** است. هر دو را بعد از فیچر به‌روز کن — جزئیات در [how-to-write-task.md](./how-to-write-task.md).

---

## وقتی کار تموم شد چه کار کنی؟

۱. در `tasks.md` همان پوشه تیک‌ها خورده باشند (یا صریح بنویس تموم است).  
۲. `/sync-docs` بزن — rename پوشه با تاریخ.  
۳. اگر در `docs/tasks.md` اصلی به این پلن اشاره کرده بودی، آنجا هم به‌روز کن.  
۴. یک خط در `docs-personal/walkthrough.md`: «پوشه change/card-view بسته شد.»

---

## لینک‌های مرتبط

ساخت change → `/new-change` در Cursor  
walkthrough → [how-to-write-walkthrough.md](./how-to-write-walkthrough.md)  
نمونه change باز → [templates/docs/change/filter-by-food-type/](./templates/docs/change/filter-by-food-type/proposal.md)  
نقشه کل → [readme.md](./readme.md)

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
