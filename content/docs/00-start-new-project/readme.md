<div dir="rtl" style="text-align:right;">

# راهنمای مستندات — از ایده تا کد

**یک خط:** راهنمای عمومی برای **همهٔ نوع پروژه‌ها** — وب، موبایل، سرور، Arduino، SaaS — که می‌گوید **داکیومنت‌ها کجا بروند**، **با چه ادبیاتی** بنویسیشان، و **قدم‌به‌قدم** از پروپزال تا کد و sync چه مسیری بروی؛ نه اینکه کد چطور نوشته شود.

فرض کن فردا پروژهٔ جدید شروع می‌کنی یا با AI روی ModuleHub کار می‌کنی. قبل از `proposal` یا `/sync-docs`، این صفحه می‌گوید: انسان‌ها از کدام فایل بخوانند، AI از کدام، یادداشت شخصی کجا برود — و چرا داک فارسی نباید شبیه spec انگلیسی ترجمه‌شده باشد.

**فهرست کامل فایل‌ها (وب، IoT، سرور، …):** [documentation-structure-map.md](./documentation-structure-map.md)  
**نمونهٔ پر (MenuHub):** [templates/readme.md](./templates/readme.md)

---

## دو لایهٔ داک — و یک کشوی شخصی

فرض کن فردا یک نفر جدید به تیم می‌پیوندد و یک AI هم روی همان repo کار می‌کند. هر دو به داک نیاز دارند — ولی **نه همان داک**.

**`docs/`** — برای آدم‌ها. فارسی، خودمونی، با داستان. منبع حقیقت «چرا و چی». وقتی با هم‌تیمی یا مشتری حرف می‌زنی، همین را نشان بده.

**`docs-for-ai/`** — برای هوش مصنوعی و OpenSpec. انگلیسی، فشرده. endpoint، قوانین، نام فایل. AI با کمترین توکن درست کار کند — بدون خواندن کل پروپزال فارسی.

**`docs-personal/`** — فقط برای خودت. walkthrough، IP سرور، مسیر `D:\...`. معمولاً در `.gitignore` است.

**قانون طلایی:** اول `docs/` را برای انسان بنویس؛ بعد از روی همان `docs-for-ai/` را بساز. اگر فقط یکی را عوض کنی، دومی قدیمی می‌ماند.

---

## OpenSpec چطور وصل می‌شود؟

فایل‌های OpenSpec از **توصیفات `docs-for-ai`** ساخته یا هم‌خوان می‌شوند — نه از متن بلند فارسی `docs/`.

دو بایگانی جدا: پوشهٔ change تموم‌شده `docs/change/1405-XX-XX-...` و آرشیو OpenSpec در `openspec/changes/archive/` — جزئیات در [how-to-write-task.md](./how-to-write-task.md).

---

## مسیر پیشنهادی — مثل پله‌پله

**۱. پروپزال** — چی می‌سازیم و برای کی؟ → `docs/proposal.md`

**۲. دیزاین** — سیستم چطور کار می‌کند؟ → `docs/design.md` (و فایل‌های موضوعی اگر بزرگ شد)

**۳. ui-behavior** — روی صفحه چه می‌شود؟ → `docs/ui-behavior.md` و فایل‌های فرعی. اگر UI ندارید (مثلاً فقط CLI)، رد کن.

**۴. tasks** — الان چه کار کنیم؟ → `docs/tasks.md`

**۵. docs-for-ai** — قراردادها، API — انگلیسی

**۶. AI / OpenSpec** — جزئیات فنی

**۷. کد**

**۸. /sync-docs** — هماهنگی `docs/` + بلوک جدید در walkthrough

**فیچر بزرگ جدا؟** → `docs/change/<name>/` — [how-to-manage-change-folders.md](./how-to-manage-change-folders.md) · `/new-change`

**ایده ول شد؟** → `docs/archive/`

---

## هر سند یک سوال جواب می‌دهد

**`proposal.md`** — چرا؟ (در AI: scope، MVP)

**`design.md`** — چطور کار می‌کند؟ (در AI: architecture، APIs)

**`ui-behavior.md`** — کاربر چه می‌بیند؟ (در AI: screens، states)

**`tasks.md`** — قدم بعدی؟ (در AI: checklist، test IDs)

**`architecture-and-structure.md`** — هر فایل مهم چه کار می‌کند؟

**walkthrough** — دیروز چی خواستم؟ فقط `docs-personal/`

---

## از کجا شروع کنم؟

**تازه‌وارد** — `docs/proposal.md` پروژه را بخوان.

**می‌خواهی داک بنویسی** — راهنماهای پایین این صفحه؛ نمونه: [templates/](./templates/).

**AI/OpenSpec** — `docs-for-ai/` از روی `docs/`.

**فیچر جدید** — `/new-change` یا `docs/change/<slug>/`.

**کد** — اول design، بعد tasks.

**UI** — ui-behavior، نه design.

**اصطلاح فنی** — [tech-terms-glossary.md](./tech-terms-glossary.md).

**سند آماده؟** — [review-checklist.md](./review-checklist.md).

---

## راهنمای نوشتن هر سند

[how-to-write-proposal.md](./how-to-write-proposal.md) · [how-to-write-design.md](./how-to-write-design.md) · [how-to-write-ui-ux-behavior.md](./how-to-write-ui-ux-behavior.md) · [how-to-write-task.md](./how-to-write-task.md) · [how-to-write-walkthrough.md](./how-to-write-walkthrough.md) · [how-to-manage-change-folders.md](./how-to-manage-change-folders.md) · [how-to-write-architecture-and-structure.md](./how-to-write-architecture-and-structure.md) · [how-to-standardize-scripts-and-tests.md](./how-to-standardize-scripts-and-tests.md) · [review-checklist.md](./review-checklist.md) · [documentation-structure-map.md](./documentation-structure-map.md) · [tech-terms-glossary.md](./tech-terms-glossary.md)

---

## ادبیات — چطور بنویسیم که خوانده شود

مثل حرف با دوست فنی — نه کتاب درسی. با مثال واقعی شروع کن؛ جمله کامل؛ کمتر از سه جدول در هر سند.

**وقتی AI می‌نویسد:** صریح بگو «با داستان شروع کن» — [how-to-write-proposal.md](./how-to-write-proposal.md) بخش «وقتی AI می‌نویسد».

---

## ریسک و تست — کدام سند؟

**ریسک محصول** → پروپزال · **ریسک فنی** → design · **ریسک UX** → ui-behavior

**E2E** — نام در پروپزال؛ گام در design؛ کلیک در ui-behavior؛ تیک در tasks.

جزئیات endpoint → `docs-for-ai/`.

---

## یادت باشه

پروپزال عوض شد → اول پروپزال، بعد بقیه — هر دو `docs/` و `docs-for-ai/`.

design عوض شد → اول design، بعد tasks و ui-behavior.

بعد کار مهم → `/sync-docs` + walkthrough.

**انسان `docs/` — AI `docs-for-ai/`** — قاطی نکن.

---

## چطور این پوشه را به‌روز کنیم؟

تغییر کوچک → همان فایل راهنما. موضوع جدید → فایل جدید + لینک از **همین readme**. بعد تغییر استاندارد در پروژه → `/sync-docs`. فایل `.md` فارسی: `<div dir="rtl">` اول، `<style>` **فقط آخر**.

---

## رابطه با بقیهٔ داک‌ها

```
write-docs-friendly/     ← چطور بنویسیم (این پوشه)
Documention/              ← جزئیات هر نوع پروژه
docs/                     ← انسان‌ها
docs-for-ai/              ← AI
docs-personal/            ← شخصی
```

این پوشه **منبع اصلی قوانین نوشتن** است.

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
