<div dir="rtl" style="text-align:right;">

# استاندارد اسکریپت‌ها و تست‌ها — همهٔ انواع پروژه

> این سند **مشترک** بین وب، سرور/DevOps، CLI، IoT و SaaS است.  
> جزئیات نوع پروژه: [`Documentation-server-devOps.md`](./Documentation-server-devOps.md) · [`Documentation-CLI.md`](./Documentation-CLI.md) · [`Documentation for web.md`](./Documentation%20for%20web.md)  
> راهنمای عملی کوتاه: [`00-start-new-project/how-to-standardize-scripts-and-tests.md`](../00-start-new-project/how-to-standardize-scripts-and-tests.md)

---

## چرا این استاندارد؟

در پروژه‌های واقعی (مثل ModuleHub-cms و 3x-ui) معمولاً این مشکلات دیده می‌شود:

- اسکریپت‌های **فاز قدیمی** (`build-phase4-test-zip.sh`) که نامشان دیگر معنی ندارد
- **دو سبک نام‌گذاری** (`setup_net_limit.sh` در کنار `deploy-full.sh`)
- اسکریپت **تکراری** برای یک کار (`run-with-free-wan.sh` و `temp-free-wan-default.sh`)
- اسکریپت **یک‌بار مصرف** (`server-fix-deploy.sh`) بدون برچسب منسوخ
- تست واحد، smoke و health در پوشه‌های مختلف **بدون README**
- `package.json` فقط `test` دارد و smoke سرور جایی ثبت نشده

هدف: **یک نقشهٔ واحد** تا هر پروژهٔ جدید و هر refactor قدیمی همان قواعد را دنبال کند.

---

## اصل پایه: سه لایه، سه مخاطب

| لایه | مسیر معمول | مخاطب | چه چیزی اینجا باشد |
|------|------------|--------|---------------------|
| **اسکریپت اجرا** | `scripts/` | انسان + CI + AI | deploy، smoke، fix، lib |
| **تست خودکار** | `tests/` | توسعه‌دهنده + CI | unit، integration، fixture |
| **پکیج قابل import** | مثلاً `server_health/` | کد + تست | منطق چک سلامت، نه shell یک‌خطی |

| داک | مخاطب | نقش |
|-----|--------|-----|
| `docs/how-to-use.md` | انسان | دستورهای روزمره — **یک جدول «چه کار → چه دستور»** |
| `scripts/README.md` | انسان | فهرست کامل اسکریپت‌ها + منسوخ‌ها |
| `tests/README.md` | انسان | چطور تست بزنی، env flagها |
| `docs-for-ai/scripts-and-tests-rules.md` | AI | نام‌گذاری، مسیر lib، ممنوعیت‌ها |

**قانون:** انسان اول `scripts/README.md` را می‌خواند؛ AI اول `docs-for-ai/scripts-and-tests-rules.md` را می‌خواند.

---

## درخت پوشهٔ استاندارد

```
project-root/
├── scripts/
│   ├── README.md                 ← اجباری از سطح standard
│   ├── run-checks.sh             ← یک نقطه ورود (health + smoke اختیاری)
│   ├── lib/                      ← فقط source؛ مستقیم اجرا نشود
│   ├── smoke/                    ← smoke دستی/نیمه‌خودکار (اختیاری)
│   ├── manual/                   ← ابزار ماهانه یا یک‌باره
│   └── systemd/                  ← unit نمونه (اگر infra)
├── tests/
│   ├── README.md                 ← اجباری از سطح standard
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── smoke/                    ← چک‌لیست markdown (نه کد اجرایی)
├── <python-package>/             ← اگر health/diagnostics جداست (مثل server_health)
└── package.json یا pyproject.toml
    └── scripts: test، test:unit، smoke:* (در صورت نیاز)
```

**تفاوت `scripts/smoke/` و `tests/smoke/`:**  
- `scripts/smoke/` = shell/python که روی سرور یا محیط واقعی اجرا می‌شود  
- `tests/smoke/` = چک‌لیست دستی یا سند E2E (مثل `card-canvas-checklist.md`)

---

## نام‌گذاری — قانون واحد

### فایل‌های shell (`.sh`)

| قانون | درست | غلط |
|--------|------|-----|
| **kebab-case** | `deploy-full.sh` | `deploy_full.sh` |
| فعل + موضوع | `install-systemd.sh` | `systemd.sh` |
| بدون شماره فاز | `build-package-cache-fixture-zip.sh` | `build-phase4-test-zip.sh` |
| پیشوند نقش | `verify-package-cache.sh` | `verify-phase4-cache.sh` |

### فایل‌های Python در `scripts/`

| حالت | نام | مثال |
|------|-----|------|
| اسکریپت CLI مستقل | **kebab-case** `.py` ترجیحاً | `network-metric-toggler.py` |
| ماژول importشونده | **snake_case** پکیج | `server_health/checks/` |
| broker/helper حساس | نام ثابت در کل پروژه | `sudo_broker.py` + `run_via_broker.py` |

> اگر Python فقط از خط فرمان صدا زده می‌شود و import نمی‌شود، kebab-case یکسان با shell نگه دار.

### PowerShell (ویندوز)

- همان منطق kebab-case: `build-package-cache-fixture-zip.ps1`
- جفت bash: همان کار، پسوند متفاوت

### پوشه `lib/`

- فقط توابع مشترک — **بدون** `main` مستقیم
- نام: `deploy-common.sh`، `sudo-exec.sh`، `git-wan-fetch.sh`

### پیشوندهای مجاز

| پیشوند | معنی | مثال |
|--------|------|------|
| `install-` | نصب یک‌بار روی سرور | `install-systemd.sh` |
| `deploy-` | به‌روزرسانی مکرر | `deploy-on-server.sh` |
| `run-` | wrapper اجرای دستور | `run-with-free-wan.sh` |
| `verify-` / `test-` | بررسی بعد از deploy | `verify-package-cache.sh` |
| `build-` | ساخت artifact تست | `build-package-cache-fixture-zip.sh` |
| `enable-` / `disable-` | فلگ موقت dev | `enable-dev-admin-on-server.sh` |
| `fix-` | تعمیر یک‌باره | `fix-inbound-443.py` |

### منسوخ (deprecated)

- فایل قدیمی **حذف نکن** ناگهانی — یک نسخه wrapper یا کامنت `# DEPRECATED: use …`
- در `scripts/README.md` جدول **Legacy** نگه دار
- حداکثر **۲ نسخه** همزمان؛ بعد از یک release نام قدیمی را حذف کن

---

## دسته‌بندی اسکریپت‌ها

| دسته | کی اجرا می‌شود | exit code | مثال ModuleHub | مثال 3x-ui |
|------|----------------|-----------|----------------|------------|
| **deploy** | بعد از push | 0 = موفق deploy | `deploy-full.sh` | — |
| **install** | یک‌بار setup | 0 | `setup-server-dirs.sh` | `install_xray_policy_routing.sh` |
| **run/wrap** | قبل از git/npm | 0 | `run-with-free-wan.sh` | — |
| **smoke** | بعد deploy یا دستی | 0/1 | `test-package-cache-manual.sh` | — |
| **health** | مانیتورینگ | 0/1/2 | `run-checks.sh` | `run_server_checks.py` |
| **fix** | وقتی health خطا داد | 0 | — | `fix_inbound_443.py` |
| **manual** | ماهانه / PC | — | — | `manual/3x-UI Server Security Tester.py` |
| **dev-only** | فقط توسعه | — | `enable-dev-admin-on-server.sh` | — |

**یک نقطه ورود:** هر پروژهٔ `infra-standard` یا `web-standard` باید **یک** دستور «همه‌چیز را چک کن» داشته باشد:

```bash
# ModuleHub
bash scripts/run-checks.sh

# 3x-ui
python3 scripts/run_server_checks.py
```

---

## استاندارد تست‌ها

### لایه‌ها

| لایه | مسیر | ابزار | کی |
|------|------|-------|-----|
| **unit** | `tests/unit/<feature>/` | jest / pytest / unittest | هر commit — سریع، بدون شبکه |
| **integration** | `tests/integration/` | همان + DB/mock | قبل merge |
| **smoke** | `scripts/smoke/` یا `scripts/test-*.sh` | bash + curl | روی staging/production |
| **health** | پکیج جدا (`server_health/`) | python `-m` | cron یا دستی از PC |
| **E2E** | فقط جریان اصلی | playwright / دستی | release |

### env flag — تست پیش‌فرض خاموش

| پروژه | flag | دستور |
|--------|------|-------|
| 3x-ui unit | `RODI_RUN_HEALTH_TESTS=1` | `python -m unittest discover -s tests` |
| 3x-ui API | `RUN_API_TESTS=1` | `python -m unittest discover -s api/tests` |
| ModuleHub | (پیش‌فرض روشن در `npm test`) | `npm test` — فقط unit |
| ModuleHub smoke | `MODULEHUB_RUN_SMOKE=1` | `bash scripts/run-checks.sh --smoke` |

**قانون:** smoke و integration که به سرور واقعی می‌زنند **هرگز** پیش‌فرض CI نباشند مگر env صریح.

### خروجی تست

- unit → stdout یا `tests/` log
- smoke → `[tag] message` یکسان در همه اسکریپت‌ها (`[deploy]`، `[free-wan]`، `[verify-package-cache]`)
- health → exit `0` سالم، `1` warning، `2` critical (مثل `server_health`)

### fixture

- مسیر: `tests/fixtures/<name>/`
- نام fixture **موضوع** نه فاز: `package-cache-test` نه `phase4-cache-test` (نام قدیمی در README legacy ذکر شود)
- ZIP/binary ساخته‌شده: `.gitignore` یا script `build-*-fixture-zip`

---

## `package.json` / اسکریپت‌های npm

حداقل استاندارد `web-standard` و `infra-standard` با Node:

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:unit": "jest --runInBand",
    "lint": "eslint …",
    "build": "…"
  }
}
```

اختیاری ولی توصیه‌شده:

```json
{
  "scripts": {
    "checks": "bash scripts/run-checks.sh",
    "smoke:package-cache": "bash scripts/smoke/test-package-cache.sh"
  }
}
```

نام npm script: **`test:unit`**، **`smoke:<topic>`**، **`checks`** — نه `phase4-verify`.

---

## داکیومنت اجباری در هر پروژه

### `scripts/README.md` (الگو)

1. **یک دستور اول** — «عیب‌یابی سریع»
2. جدول **چه کار → چه دستور**
3. جدول **deploy / install**
4. جدول **smoke**
5. جدول **Legacy / deprecated**
6. لینک به `docs/deploy-guide.md` یا `how-to-use.md`

نمونهٔ واقعی: `3x-ui/scripts/README.md`، `ModuleHub-cms/scripts/README.md`

### `tests/README.md` (الگو)

1. هدف — «بدون سرور» vs «نیاز به SSH»
2. دستور اجرا (ویندوز + لینوکس)
3. جدول فایل → چه چیزی را تست می‌کند
4. env flagها

### `docs-for-ai/scripts-and-tests-rules.md`

- لیست مسیرهای lib
- نام canonical هر اسکریپت
- «هرگز روی سرور `scripts/` را دستی ویرایش نکن»
- mapping deploy flow

---

## شبکه dual-WAN — الگوی واحد

روی سرورهای دو کارت شبکه (مثل `enp63s0` / `ens4`):

| نیاز | اسکریپت canonical | منسوخ / کمکی |
|------|-------------------|--------------|
| یک دستور git/npm | `run-with-free-wan.sh` | `temp-free-wan-default.sh` |
| موتور metric | `network-metric-toggler.py` | `ip route` دستی در داک |
| sudo بدون پسورد مکرر | `sudo_broker.py` + `run_via_broker.py` | `broker-sudo.py` (وجود ندارد) |
| policy routing دائمی | `install_*_policy_routing.sh` | — |

جزئیات سرور: `docs-personal/server condition.md` — در repo عمومی فقط نام رابط بدون IP.

---

## چک‌لیست مهاجرت پروژهٔ قدیمی

- [ ] `scripts/README.md` و `tests/README.md` ساخته شد
- [ ] یک `run-checks` یا معادل وجود دارد
- [ ] نام‌های phase/شماره به نام موضوع تغییر یا wrapper شد
- [ ] snake_case shell به kebab-case (یا wrapper)
- [ ] اسکریپت یک‌باره → `manual/` یا برچسب deprecated
- [ ] `docs-for-ai/scripts-and-tests-rules.md` به‌روز
- [ ] `how-to-use.md` جدول دستور سریع دارد
- [ ] `.gitattributes`: `*.sh text eol=lf`

---

## نمونهٔ mapping — ModuleHub-cms

| نام قدیمی | نام canonical | وضعیت |
|-----------|---------------|--------|
| `build-phase4-test-zip.sh` | `build-package-cache-fixture-zip.sh` | removed |
| `verify-phase4-cache.sh` | `verify-package-cache.sh` | removed |
| `setup_net_limit.sh` | `setup-net-limit.sh` | removed |
| `server-fix-deploy.sh` | `deploy-full.sh` | deprecated |
| `temp-free-wan-default.sh` | `manual/temp-free-wan-default.sh` | legacy |
| `phase4-cache-test` (fixture) | `package-cache-test` | renamed |

---

## نمونهٔ mapping — 3x-ui

| الگو | فایل |
|------|------|
| health package | `server_health/` |
| یک دستور | `scripts/run_server_checks.py` |
| fix | `scripts/fix_*.py` |
| policy routing | `scripts/install_*_policy_routing.sh` |
| unit بدون سرور | `tests/test_*.py` + `RODI_RUN_HEALTH_TESTS=1` |

---

## لینک‌های مرتبط

- [documentation-structure-map.md](../00-start-new-project/documentation-structure-map.md)
- [how-to-standardize-scripts-and-tests.md](../00-start-new-project/how-to-standardize-scripts-and-tests.md)
- [Documentation-server-devOps.md](./Documentation-server-devOps.md) — `runbooks.md`، `how-to-use.md`
- [Documentation-CLI.md](./Documentation-CLI.md) — `commands.md`، `testing.md`

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
