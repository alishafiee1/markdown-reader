<div dir="rtl" style="text-align:right;">

# پوشهٔ templates — نمونهٔ واقعی ساختار داکیومنت

**یک خط:** این پوشه **مثل ریشهٔ یک پروژهٔ واقعی** چیده شده — نه فایل قالب خالی — تا ببینی `docs/`، `docs-for-ai/` و `docs-personal/` در عمل چه شکلی‌اند.

همهٔ مثال‌ها برای پروژهٔ فرضی **MenuHub** (سایت منوی رستوران) است. داستان علی و رستوران را با پروژهٔ خودت عوض کن؛ **ساختار پوشه** را نگه دار.

راهنما: [readme.md](../readme.md) · نقشهٔ کامل: [documentation-structure-map.md](../documentation-structure-map.md)

---

## این پوشه برای چیه؟

**الگوی ساختار** — پوشه‌بندی دقیقاً مثل repo واقعی.

**الگوی لحن** — `docs/` فارسی و خودمونی (ببین [proposal.md](./docs/proposal.md) چطور شروع می‌شود)؛ `docs-for-ai/` انگلیسی و فشرده.

**الگوی فیچر** — `change/` برای کار در جریان؛ `archive/` برای ایدهٔ رد شده.

**شروع سریع** — کپی کل درخت به ریشهٔ پروژهٔ جدید و عوض کردن داستان.

---

## درخت پوشه (در پروژه همین‌طور می‌گذاری)

```
templates/                    ← اینجا فقط نمونه؛ در پروژه: ریشه repo
├── docs/
│   ├── proposal.md
│   ├── design.md
│   ├── tasks.md
│   ├── ui-behavior.md
│   ├── architecture-and-structure.md
│   ├── change/
│   │   ├── filter-by-food-type/              ← باز
│   │   ├── 1405-02-18-discount-today-filter/ ← تموم
│   │   └── 1405-02-25-menu-page-order-link/  ← تموم
│   └── archive/
│       ├── loyalty-points/       ← رد شده
│       ├── restaurant-map/       ← معلق
│       └── user-reviews/         ← رد شده
├── docs-for-ai/
│   ├── map.md
│   ├── proposal.md
│   ├── design.md
│   ├── tasks.md
│   ├── ui-behavior.md
│   └── architecture-and-structure.md
└── docs-personal/
    └── walkthrough.md
```

---

## `docs/` — برای آدم‌ها

**[proposal.md](./docs/proposal.md)** — چرا MenuHub، برای کی، MVP.

**[design.md](./docs/design.md)** — لیست، منو، جریان سفارش، E2E.

**[tasks.md](./docs/tasks.md)** — فازها با تیک.

**[ui-behavior.md](./docs/ui-behavior.md)** — صفحهٔ اصلی، منو، پیام‌ها — فیلمنامهٔ صفحه.

**[architecture-and-structure.md](./docs/architecture-and-structure.md)** — کدام فایل کد چه کار می‌کند.

**change/filter-by-food-type/** — فیچر «فیلتر نوع غذا» — **هنوز باز**، بدون تاریخ.

**change/1405-02-18-discount-today-filter/** — فیلتر تخفیف امروز — **تموم** 1405-02-18.

**change/1405-02-25-menu-page-order-link/** — منو + دکمه سفارش — **تموم** (E2E-P-01).

**archive/loyalty-points/** — امتیاز وفاداری — **رد شد**.

**archive/restaurant-map/** — نقشه GPS — **معلق** شاید بعداً.

**archive/user-reviews/** — ستاره و نظر — **رد شد**.

---

## `docs-for-ai/` — برای هوش مصنوعی

همان موضوعات، **انگلیسی و فشرده** — endpoint، enum، test ID، مسیر فایل.

**[map.md](./docs-for-ai/map.md)** — اول agent این را بخواند: ترتیب خواندن، change فعال.

بقیه mirror یا خلاصهٔ `docs/` — بدون داستان طولانی.

OpenSpec از این پوشه ساخته یا هم‌خوان می‌شود — نه از متن بلند فارسی.

---

## `docs-personal/` — فقط خودت

**[walkthrough.md](./docs-personal/walkthrough.md)** — دو بلوک نمونه بعد جلسه با AI.

در پروژهٔ واقعی این پوشه در `.gitignore` است.

---

## چطور در پروژهٔ جدید استفاده کنی؟

۱. پوشه‌های `docs/`، `docs-for-ai/`، `docs-personal/` را کپی کن به ریشه repo.  
۲. داستان MenuHub را با پروژهٔ خودت عوض کن — ساختار و §ها را نگه دار.  
۳. **اول `docs/`** را کامل کن؛ **بعد `docs-for-ai/`** را از روی آن.  
۴. فیچر جدید → `docs/change/<name>/` بدون تاریخ.  
۵. فیچر تموم → `/sync-docs` → `1405-XX-XX-<name>/`.  
۶. ایده رد → `docs/archive/<name>/`.  
۷. بعد کار مهم → sync + خط در walkthrough.

---

## سه حالت `change/` در نمونه

**`filter-by-food-type/`** — باز؛ هنوز روش کار می‌کنیم.

**`1405-02-18-discount-today-filter/`** — بسته؛ تاریخ = روز تموم شدن.

**`1405-02-25-menu-page-order-link/`** — بسته؛ منو + سفارش.

---

## چیزی که این پوشه نیست

جایگزین `how-to-write-*.md` نیست — آن‌ها **قانون نوشتن**‌اند؛ اینجا **نمونهٔ پر**.

کد واقعی MenuHub نیست — فقط داکیومنت.

نقشهٔ همهٔ انواع پروژه (وب، Arduino، …) → [documentation-structure-map.md](../documentation-structure-map.md).

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
