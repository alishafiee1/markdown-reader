<div dir="rtl" style="text-align:right;">

# نقشهٔ جامع ساختار داکیومنت پروژه

**یک خط:** این سند می‌گوید **چه فایلی در کدام پوشه** برای وب، موبایل، IoT، سرور و … لازم است — و فرق `docs/` (انسان) با `docs-for-ai/` (AI) چیست.

**چطور بنویسی:** [readme.md](./readme.md) · **نمونهٔ پر:** [templates/](./templates/) (MenuHub) · **جزئیات هر نوع:** [Documention/](../Documention/)

---

## این نقشه برای چیه؟

فرض کن پروژهٔ جدید `web-standard` شروع می‌کنی. نمی‌دانی علاوه بر proposal و design چه فایل‌هایی لازم است — `api.md`؟ `deployment.md`؟ `docs-for-ai/map.md`؟

این فایل **لیست و قانون** است. راهنماهای `how-to-write-*.md` می‌گویند **چطور** بنویسی؛ اینجا می‌گوید **کجا** بگذاری.

**قانون طلایی:** انسان `docs/` — فارسی، خودمونی. AI و OpenSpec `docs-for-ai/` — انگلیسی، فشرده. **اول انسان، بعد AI.**

---

## سه پوشه در ریشهٔ پروژه

```
project-root/
├── docs/              ← انسان‌ها
├── docs-for-ai/       ← AI / OpenSpec
└── docs-personal/     ← فقط خودت (معمولاً gitignore)
```

**`docs/`** — داستان محصول، design، ui-behavior، tasks. وقتی با هم‌تیمی حرف می‌زنی همین را نشان بده.

**`docs-for-ai/`** — `map.md` (اول agent بخواند)، `platform.md`، `ai-common-mistakes.md`، قرارداد API، خلاصهٔ proposal/design.

**`docs-personal/`** — walkthrough اجباری برای sync؛ plus `current-platform.md`، مسیرهای محلی، یادداشت سرور — **هرگز commit نشود**.

در `.gitignore` ریشه حتماً `docs-personal/` باشد. بعد از `git add`، `status` نباید چیزی از آنجا نشان دهد.

---

## درخت کلی `docs/`

```
docs/
├── proposal.md
├── design.md
├── tasks.md
├── how-to-use.md
├── project-file-index.md
├── ui-behavior.md              ← اگر UI دارد
├── architecture-and-structure.md ← از سطح standard به بالا
├── change/
│   ├── feature-name/             ← باز (بدون تاریخ)
│   └── 1405-02-18-feature-name/  ← تموم شده
└── archive/
    └── rejected-idea/proposal.md
```

فایل‌های شرطی بیشتر (security، deployment، testing، …) بسته به نوع و سطح پروژه — پایین‌تر.

---

## لایه ۱ — اجباری در همهٔ انواع

### پنج فایل پایه در `docs/`

**`proposal.md`** — چرا می‌سازیم؟ برای کی؟ چه نمی‌کنیم؟ → [how-to-write-proposal](./how-to-write-proposal.md). ننویس: معماری ریز، لیست فایل.

**`design.md`** — سیستم چطور کار می‌کند؟ → [how-to-write-design](./how-to-write-design.md). ننویس: کپی کامل API، کد.

**`tasks.md`** — الان چه کار کنیم؟ → [how-to-write-task](./how-to-write-task.md).

**`how-to-use.md`** — install، run، build، test. ننویس: داستان محصول.

**`project-file-index.md`** — هر فایل یک خط. ننویس: تحلیل عمیق (آن کار architecture است).

**لحن `docs/`:** «کاربر باید بتونه منو ببینه» — نه «User shall access menu».

### چهار فایل پایه در `docs-for-ai/`

**`map.md`** — نقشهٔ یک‌صفحه‌ای: ترتیب خواندن، change/archive فعال، test IDs.

**`platform.md`** — env keys، نسخه‌ها، پورت‌ها، سرویس‌های وابسته.

**`ai-common-mistakes.md`** — «هرگز نکن»، مسیرهای اشتباه رایج.

**`project.md`** — snapshot کل پروژه: stack، فاز، scope IN/OUT.

دو الگو مجاز: (۱) یک `project.md` جامع — (۲) mirror اسم‌های `docs/` خلاصه‌تر. در `map.md` بگو کدام را داری.

**لحن `docs-for-ai/`:** English, bullets, `GET /path` — no long story.

---

## `docs-personal/` — چه بگذاری؟

**`walkthrough.md`** — اجباری. بعد هر جلسه با AI — [راهنما](./how-to-write-walkthrough.md).

**`current-platform.md`** — دامنه، IP، پورت SSH، پنل — فقط محلی.

**`server-inventory.md`** — لیست ماشین‌ها و نقش هر کدام.

**`access-notes.md`** — SSH alias، کاربر DB — **بدون پسورد plain در walkthrough**.

**`local-paths.md`** — `D:\projects\...` روی PC تو.

**`secrets-and-credentials.md`** — آخرین راه؛ ترجیح password manager.

**`incident-notes.md`** — خرابی واقعی و درس.

**`pending-decisions.md`** — تصمیم‌های باز.

چی **نباید** اینجا باشد به‌جای `docs/`: proposal، design، tasks — آن‌ها عمومی‌اند. فقط context محلی تو.

---

## لایه ۲ — شرطی (بیشتر پروژه‌ها)

از سطح **standard** به بالا معمولاً بعضی از این‌ها را اضافه می‌کنی:

**`architecture-and-structure.md`** — توضیح چندخطی فایل‌های مهم. مکمل: `project-file-index` یک خطی است.

**`ui-behavior.md`** — اگر UI مهم است؛ شاید فایل‌های فرعی.

**`security.md`** — auth، secret، payment.

**`testing.md`** — تست دستی/خودکار.

**`scripts/README.md`** در ریشه repo — deploy، smoke — [how-to-standardize-scripts-and-tests](./how-to-standardize-scripts-and-tests.md).

**`deployment.md`** — release.

**`troubleshooting.md`** — خطاهای تکراری.

**`developer.md`** — workflow شلوغ.

**`decision-log.md`** — تصمیم‌های برگشت‌ناپذیر.

معادل AI: `api-contracts.md`، `ui-map.md`، `scripts-and-tests-rules.md`، …

---

## جفت‌سازی `docs/` و `docs-for-ai/`

همان موضوع، دو مخاطب:

محصول → `docs/proposal.md` داستان · AI → scope IN/OUT  
معماری → `docs/design.md` flow ساده · AI → entities، API table  
API → `docs/api.md` مفهومی · AI → `api-contracts.md` دقیق  
UI → `docs/ui-behavior.md` کلیک و پیام · AI → `ui-map.md` route و state  
فایل‌ها → `project-file-index` · AI → `map.md`  
اجرا → `how-to-use.md` · AI → `platform.md`

**تکرار مجاز** وقتی مخاطب فرق دارد. **تکرار ممنوع** وقتی فقط کپی بی‌ارزش است.

---

## `change/` و `archive/`

**`docs/change/<name>/`** — فیچر باز: proposal + design + tasks (+ ui-behavior). بدون تاریخ.

**`docs/change/1405-XX-XX-<name>/`** — تموم شده. تاریخ = روز بستن شمسی.

**`docs/archive/<name>/`** — رد یا معلق. معمولاً فقط proposal.

راهنما: [how-to-manage-change-folders.md](./how-to-manage-change-folders.md) · ساخت: `/new-change`

---

## سطح‌بندی lite / standard / complex

هر نوع در `Documention/` سه سطح دارد:

**lite** — کوچک، یک نفر: فقط لایه ۱ (پنج + چهار فایل پایه).

**standard** — معمولی: اجباری + بیشتر لایه ۲.

**complex** — بزرگ: تقریباً همهٔ فایل‌های نوع.

---

## نوع پروژه — خلاصه (جزئیات در Documention)

**وب** — [Documentation for web.md](../Documention/Documentation%20for%20web.md)  
lite: ui-behavior اگر UI · standard: + api، architecture، deployment، testing، security · complex: + UX، look-and-feel، roles، integrations

**موبایل Android** — [Documentation-mobile-android.md](../Documention/Documentation-mobile-android.md)  
lite: screens خلاصه · standard: navigation، permissions، release · complex: offline، background، flavors

**سرور / DevOps** — [Documentation-server-devOps.md](../Documention/Documentation-server-devOps.md)  
lite: topology، deployment · standard: runbooks، backup، monitoring · complex: networking، incident، CI/CD

**IoT / Firmware** — [Documentaion IOT.md](../Documention/Documentaion%20IOT.md)  
lite: hardware، pin-map · standard: protocols، flashing، testing · complex: OTA، provisioning

**CLI / Desktop** — [Documentation-CLI.md](../Documention/Documentation-CLI.md)  
lite: commands · standard: config، packaging · complex: plugins، automation

**API / Backend** — [Documentation-api-backend.md](../Documention/Documentation-api-backend.md)  
lite: api خلاصه · standard: data-models، auth، errors · complex: jobs، integrations

**SaaS** — [Documantation-saas.md](../Documention/Documantation-saas.md)  
lite: onboarding · standard: billing، admin، roles · complex: multi-tenant، analytics

---

## OpenSpec و `/sync-docs`

OpenSpec از `docs-for-ai/` تغذیه می‌شود.

`/sync-docs`: آخرین walkthrough → diff کد → به‌روز `docs/` و `docs-for-ai/` → rename change تموم‌شده → بلوک walkthrough جدید.

---

## چک‌لیست شروع پروژه

نوع و سطح مشخص شد (مثلاً web-standard).  
سه پوشه ساخته شد؛ `docs-personal/` در gitignore.  
walkthrough حداقل یک بلوک دارد.  
پنج فایل `docs/` + چهار فایل `docs-for-ai/` پایه.  
`README.md` ریشه به `docs/how-to-use.md` لینک می‌دهد.  
فایل‌های شرطی سطح/نوع از بخش بالا.  
[review-checklist.md](./review-checklist.md) برای اسناد هسته.

---

## خارج از این نقشه

[Code Documentation.md](../Documention/Code%20Documentation.md) — داک‌استرینگ داخل کد  
[GitHub Standard.md](../Documention/GitHub%20Standard.md) — README، PR  
[Scripts-and-tests-standard.md](../Documention/Scripts-and-tests-standard.md) — استاندارد scripts/tests

---

## لینک‌های سریع

proposal → [how-to-write-proposal.md](./how-to-write-proposal.md)  
شکل واقعی → [templates/readme.md](./templates/readme.md)  
مسیر از ایده تا کد → [readme.md](./readme.md)

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; margin-inline-start: 0; margin-inline-end: auto; }
.markdown-body th, .markdown-body td, .markdown-preview-section th, .markdown-preview-section td, table thead th, table tbody td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code, .markdown-body table td code, .markdown-body table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
