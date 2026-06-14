<div dir="rtl" style="text-align:right;">

# چطور اسکریپت‌ها و تست‌ها را یکدست کنیم؟

**یک خط:** وقتی پروژه‌ات (یا چند پروژه) اسکریپت‌های پراکنده، نام‌های قدیمی، یا تست بدون ساختار دارد، این راهنما **قدم‌به‌قدم عملی** می‌گوید چطور مثل یک منوی رستوران — «چه کار می‌خواهم → چه دستور» — مرتبشان کنی.

**استاندارد کامل:** [`Documention/Scripts-and-tests-standard.md`](../Documention/Scripts-and-tests-standard.md)  
**نمونهٔ زنده:** ModuleHub-cms (`scripts/`، `tests/`) · 3x-ui (`scripts/run_server_checks.py`)

---

## اول بفهم مشکل چیه

معمولاً یکی از این‌ها را می‌بینی:

اسمی مثل `build-phase4-test-zip.sh` — یعنی نام به **فاز قدیمی** چسبیده؛ باید به **موضوع** عوض شود.

کنار هم `setup_net_limit` و `deploy-full` — دو سبک نام؛ shell باید **kebab-case** باشد (`setup-net-limit.sh`).

سه اسکریپت برای یک کار WAN — تکرار؛ یک **canonical** + بقیه legacy.

`server-fix-deploy.sh` بدون توضیح — اسکریپت **یک‌بار مصرف** که شش ماه بعد کسی نمی‌داند بزند یا نه.

نمی‌دانی کدام را بزنی — **`scripts/README.md` نیست**.

---

## قدم ۱ — یک README برای `scripts/`

مثل منوی رستوران: اول بگو «اول این را بزن»، بعد «چه کار می‌خواهم → چه دستور».

ساختار پیشنهادی:

عنوان کوتاه.  
یک دستور شروع — مثلاً `bash scripts/run-checks.sh` یا `python3 scripts/run_server_checks.py`.  
بخش «چه کاری می‌خواهم؟» — deploy، smoke، backup — هر کدام یک خط دستور.  
بخش «Legacy (منسوخ)» — اسم قدیمی → جایگزین.

**لحن:** خودمونی — مثل `ModuleHub-cms/docs/server-scripts.md` و `3x-ui/scripts/README.md`.

---

## قدم ۲ — نام‌گذاری یکسان

**Shell** — همیشه kebab-case: `deploy-full.sh` ✅ · `deploy_full.sh` ❌ · `build-phase4-test.sh` ❌ → بهتر `build-package-cache-fixture-zip.sh`.

**Python** — پکیج importشونده (`server_health/`) snake_case؛ اسکریپت خط فرمان در `scripts/` ترجیحاً kebab-case مثل shell.

**npm scripts** — `test` برای unit پیش‌فرض؛ `test:unit` صریح؛ `checks` برای health محلی؛ `smoke:cache` برای smoke یک موضوع.

---

## قدم ۳ — یک نقطه ورود «همه را چک کن»

سرور / CMS: `bash scripts/run-checks.sh`  
3x-ui: `python3 scripts/run_server_checks.py`

داخلش: health HTTP، systemd (اختیاری)، smoke با flag.

**چرا:** تو و AI هر دو می‌دانید اولین قدم عیب‌یابی چیست — قبل از اینکه ده اسکریپت را یکی‌یکی امتحان کنید.

---

## قدم ۴ — تست‌ها را لایه‌بندی کن

```
tests/
├── README.md       ← چطور بزنم (ویندوز + لینوکس)
├── unit/           ← سریع، بدون شبکه
├── integration/    ← با mock یا DB
├── fixtures/       ← JSON، ZIP نمونه
└── smoke/          ← چک‌لیست markdown (دستی)
```

**قانون طلایی:**

unit → هر commit منطقی است.  
smoke/integration روی سرور واقعی → **فقط با env flag** (`MODULEHUB_RUN_SMOKE=1`).  
E2E → فقط مسیر اصلی کاربر — همان‌هایی که در proposal و ui-behavior نام برده‌ای.

---

## قدم ۵ — مهاجرت بدون شکستن deploy

نام قدیمی را **ناگهان حذف نکن**. wrapper بگذار:

```bash
# build-package-cache-fixture-zip.sh (canonical)
exec "$(dirname "$0")/build-phase4-test-zip.sh" "$@"
```

در README جدول Legacy بگذار. بعد از یک release نام قدیمی را بردار.

همین کار برای `verify-package-cache.sh` ← `verify-phase4-cache.sh` و `setup-net-limit.sh` ← `setup_net_limit.sh`.

---

## قدم ۶ — داک برای AI

در `docs-for-ai/scripts-and-tests-rules.md` — انگلیسی، فشرده:

canonical script names  
`scripts/lib/` — do not run directly  
never edit `scripts/` on production — push + deploy  
test env flags

نمونه: `ModuleHub-cms/docs-for-ai/scripts-and-tests-rules.md` بعد از sync پروژه.

---

## قدم ۷ — در `how-to-use.md` سه خط کافی است

توسعه محلی → `npm run dev`  
تست unit → `npm test`  
چک سلامت سرور → `bash scripts/run-checks.sh`

جزئیات → `scripts/README.md`.

---

## قبل از بستن refactor — چک کن

`scripts/README.md` و `tests/README.md` هست؟  
یک `run-checks` (یا معادل Python) هست؟  
نام‌های phase به topic عوض شده (یا wrapper)؟  
`.gitattributes`: `*.sh text eol=lf`  
`docs-for-ai/scripts-and-tests-rules.md` به‌روز است؟  
legacy در README ذکر شده؟

---

## لینک‌ها

[Scripts-and-tests-standard.md](../Documention/Scripts-and-tests-standard.md) — قواعد کامل  
[documentation-structure-map.md](./documentation-structure-map.md) — کجا `testing.md` برود  
[Documentation-server-devOps.md](../Documention/Documentation-server-devOps.md) — infra  
[Documentation-CLI.md](../Documention/Documentation-CLI.md) — ابزار CLI

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
