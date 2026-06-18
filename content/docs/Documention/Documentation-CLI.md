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


# استاندارد مستندسازی پروژه‌های desktop / tooling / CLI

> این نسخه مخصوص پروژه‌های زیر است:
> - ابزار CLI
> - ابزار ترمینالی داخلی
> - desktop app سبک
> - launcher / utility / helper tool
> - اسکریپت‌های automation و tooling
> - برنامه‌های local-first
> - ابزارهای build/dev/ops
> - ابزارهایی که config محلی، commandهای متعدد یا package/release binary دارند

هدف این استاندارد:
- مرز بین «هدف ابزار»، «commandها»، «config»، «flow اجرا» و «release/distribution» روشن باشد
- AI بتواند command جدید، option جدید یا automation جدید را در جای درست اضافه کند
- کاربر یا توسعه‌دهنده سریع بفهمد ابزار چه می‌کند، چطور نصب می‌شود، و failure modeهایش چیست
- برای پروژه‌های tooling، فایل‌های setup، usage و troubleshooting با هم قاطی نشوند
- تکرار لازم برای AI و quick-start مجاز باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، عملیاتی، مستقیم | فهم ابزار، commandها، config، packaging |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | فشرده، rule-based، دقیق | کمک به توسعه امن commandها و flowها |
| `docs-personal/` | فقط خودم | ❌ نه | محلی، عملیاتی، حساس | shortcutها، pathهای محلی، credentialها، تجربه‌های شخصی |

### قانون مهم
- `docs/` برای فهمیدن ابزار است.
- `docs-for-ai/` برای این است که AI بداند **commandها کجا تعریف می‌شوند، config کجا parse می‌شود، side effectها کجا رخ می‌دهند و release چطور ساخته می‌شود**.
- `docs-personal/` برای اطلاعات محلی یا شخصی است که نباید داخل ریپو عمومی بماند.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای توسعه subcommand جدید لازم دارد command tree یا config rule را ببیند، باید همان اطلاعات در `docs-for-ai/` هم وجود داشته باشد.
- اگر کاربر برای استفاده سریع لازم دارد summary commandها و config pathها را یکجا ببیند، می‌شود آن را در `how-to-use.md` هم خلاصه کرد.
- چیزی که ممنوع است تکرار متناقض است، نه تکرار هدفمند.

---

## سطح‌بندی پروژه‌های desktop / CLI

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `tool-lite` | ابزار کوچک | اسکریپت یا CLI ساده با چند command |
| `tool-standard` | ابزار معمولی | چند subcommand، config file، output format، package/release |
| `tool-complex` | ابزار پیچیده | plugin-like behavior، profile/config چندگانه، desktop UI، automation chain، distribution چندپلتفرمی |

### قانون استفاده
- در `tool-lite` فایل‌های پایه + commands + config کافی‌اند
- در `tool-standard` فایل‌های output behavior، packaging، testing و troubleshooting معمولاً لازم‌اند
- در `tool-complex` بدون مستندسازی command tree، profiles، stateful fileها، packaging matrix و automation flow پروژه مبهم می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید کمک کند یک نفر بفهمد:
- ابزار چیست و چه مشکلی را حل می‌کند
- چطور نصب و اجرا می‌شود
- چه commandهایی دارد
- config آن از کجا می‌آید
- خروجی‌ها، فایل‌ها و side effectها چه هستند
- چطور package/release/test می‌شود

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف ابزار و مسئله | هدف، use case، مخاطب، ارزش ابزار | command tree کامل، code detail |
| `design.md` | معماری کلی ابزار | execution flow، moduleها، config flow، output flow، integrationها | تمام optionها یا مثال‌های بلند command |
| `tasks.md` | برنامه کارها | backlog، milestone، release task، maintenance task | تحلیل تکراری معماری |
| `how-to-use.md` | منوی سریع استفاده | install، run، command summary، examples، common flags | توضیح کامل طراحی داخلی |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر + توضیح یک‌خطی | تفسیر رفتاری طولانی |

### فایل‌های شرطی مهم برای desktop / CLI

| نام فایل | کی لازم است |
|----------|-------------|
| `commands.md` | تقریباً همیشه |
| `configuration.md` | وقتی config/env/file/profile داری |
| `input-output.md` | وقتی formatهای ورودی/خروجی مهم‌اند |
| `setup-step-by-step.md` | وقتی setup برای کاربر جدید ساده نیست |
| `developer.md` | وقتی workflow توسعه و build چندبخشی است |
| `automation.md` | وقتی tool چند مرحله automation دارد |
| `packaging-and-release.md` | وقتی binary/package/release داری |
| `platform-support.md` | وقتی Windows/Linux/macOS تفاوت دارند |
| `plugins-or-extensions.md` | وقتی extension/plugin model داری |
| `storage-and-state.md` | وقتی cache, temp, local DB, state file داری |
| `security.md` | وقتی credential، token، secret، shell exec یا file access حساس داری |
| `testing.md` | وقتی command behavior، snapshot، integration یا e2e مهم است |
| `troubleshooting.md` | وقتی خطاهای رایج setup/runtime زیاد است |
| `logging-and-debug.md` | وقتی debug mode و log output مهم است |
| `desktop-ui.md` | وقتی ابزار desktop GUI هم دارد |
| `shortcuts-and-workflows.md` | وقتی جریان کار روزمره مهم است |
| `distribution.md` | وقتی install/update/uninstall strategy مهم است |
| `architecture-and-structure.md` | از `tool-standard` به بالا — `write-docs-friendly/how-to-write-architecture-and-structure.md` |

---

## پوشه‌های `change/` و `archive/`

| مسیر | معنی |
|------|------|
| `docs/change/<name>/` | پلن فعال (proposal + design + tasks) |
| `docs/change/1405-03-01-<name>/` | تمام‌شده — پیشوند تاریخ شمسی روز اتمام |
| `docs/archive/` | معلق، ردشده، داک منسوخ |

راهنما: `write-docs-friendly/how-to-manage-change-folders.md`

---

## مرزبندی دقیق فایل‌های `docs/`

### `proposal.md`
این فایل جواب می‌دهد:
- ابزار چیست؟
- برای چه کسی است؟
- چه مشکلی را حل می‌کند؟
- در چه سناریوهایی استفاده می‌شود؟
- محدوده نسخه فعلی چیست؟

داخلش بنویس:
- مخاطب
- use case
- مشکل
- ارزش ابزار
- خروجی اصلی
- محدودیت‌ها

داخلش ننویس:
- syntax کامل commandها
- pathهای همه فایل‌ها
- option detail
- packaging command detail

### `design.md`
هسته‌ی فنی انسانی ابزار است.

داخلش بنویس:
- معماری کلی
- command execution flow
- config resolution
- module boundary
- integrationها
- error handling کلی
- output behavior overview
- packaging/release overview اگر مهم است

داخلش ننویس:
- مثال‌های زیاد CLI usage
- tree کامل همه commandها
- همه envها و flagها
- troubleshooting detail

### `commands.md`
فایل اصلی commandها است.

برای هر command یا subcommand بگو:
- نام
- هدف
- syntax
- optionهای مهم
- مثال کوتاه
- side effect
- خروجی
- failure mode مهم

### `configuration.md`
داخلش باشد:
- config file location
- config precedence (flag/env/file/default)
- profile support
- default values
- sensitive config note
- invalid config behavior
- reload/restart need if any

### `input-output.md`
وقتی format مهم است:
- input sourceها
- file/stdin/arg support
- output modes
- machine-readable vs human-readable output
- exit code summary
- error output style

### `automation.md`
وقتی ابزار فقط command runner نیست و flow دارد:
- stepها
- dependency بین stepها
- failure handling
- retry/skip behavior
- dry-run behavior
- destructive step warning

### `packaging-and-release.md`
خیلی مهم است.
داخلش باشد:
- build artifactها
- target platformها
- versioning
- package manager distribution
- standalone binary rule
- checksum/signing rule اگر هست
- release checklist

### `platform-support.md`
داخلش باشد:
- OS support
- shell assumptions
- path differences
- permission differences
- line ending caveat
- unsupported cases

### `storage-and-state.md`
وقتی ابزار stateful است:
- cache path
- temp file path
- persistent state path
- cleanup rule
- corruption/fallback rule
- migration rule

### `logging-and-debug.md`
داخلش باشد:
- log levels
- debug flag
- verbose mode
- trace mode
- sensitive log rule
- where logs go

### `desktop-ui.md`
اگر GUI desktop هم داری:
- screenها
- UI flow
- relation با CLI core
- state sharing
- file picker/dialog behavior
- platform-specific note

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند:
- command جدید را در tree درست اضافه کند
- config parsing و precedence را نشکند
- exit code و output format را ناهماهنگ نکند
- packaging و release flow را خراب نکند
- path و platform-specific behavior را فراموش نکند

### اصل مهم
در CLI و tooling، AI با context ناقص معمولاً این خطاها را می‌دهد:
- command را اضافه می‌کند ولی help/update docs را فراموش می‌کند
- option جدید را parse می‌کند ولی validation را جا می‌اندازد
- output را برای انسان خوب می‌کند ولی machine-readable mode را می‌شکند
- config precedence را خراب می‌کند
- Windows/Linux path behavior را نادیده می‌گیرد
- destructive action را بدون confirm/dry-run اضافه می‌کند
پس این پوشه باید دقیق و کاربردی باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | snapshot سریع و کامل پروژه برای AI |
| `map.md` | نقشه فایل‌ها، commandها، parserها، runnerها و package flow |
| `platform.md` | runtime، platform support، build/release commandها |
| `ai-common-mistakes.md` | خطاهای تکراری و ruleهای مهم |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `command-map.md` | تقریباً همیشه |
| `config-rules.md` | وقتی config/env/profile مهم است |
| `output-rules.md` | وقتی format و exit code مهم است |
| `validation-rules.md` | وقتی option/input validation مهم است |
| `state-rules.md` | وقتی local state/cache/temp مهم است |
| `packaging-rules.md` | وقتی release/distribution مهم است |
| `platform-rules.md` | وقتی cross-platform behavior مهم است |
| `automation-rules.md` | وقتی multi-step flow یا destructive actions داری |
| `security-rules.md` | وقتی shell exec/credential/file access حساس داری |
| `testing-rules.md` | وقتی snapshot/e2e/fixture test مهم است |
| `ui-rules.md` | وقتی desktop GUI هم داری |
| `integration-contracts.md` | وقتی tool با API، git، docker، shell یا external tool کار می‌کند |
| `researches.md` | وقتی تصمیم‌های مهم بر اساس مقایسه فنی بوده‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot سریع برای AI:
- ابزار چیست
- command structure چیست
- config sourceها چیست
- output modeها چیست
- packaging/release دارد یا نه
- stateful است یا نه
- cross-platform concern دارد یا نه
- entry pointهای اصلی کجاست

این فایل می‌تواند خلاصه‌ی `proposal.md`، `design.md` و `commands.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید سریع بفهمد:
- entry point کجاست
- command registry کجاست
- arg parser کجاست
- config loader کجاست
- validation کجاست
- output formatter کجاست
- integration adapterها کجاست
- packaging fileها کجاست
- test fixtureها کجا هستند

### `command-map.md`
برای هر command:
- file/path
- handler
- options
- validation dependency
- config dependency
- output mode
- destructive or not
- related tests
- docs that must be updated

### `config-rules.md`
داخلش باشد:
- precedence rule: flag > env > config file > default یا هرچه پروژه دارد
- profile resolution
- invalid config behavior
- required configها
- secret handling
- no hidden fallback rule
- path expansion rule

### `output-rules.md`
داخلش باشد:
- human-readable output rule
- JSON/machine output rule
- exit code rule
- stderr/stdout separation
- quiet/verbose behavior
- color usage rule

### `validation-rules.md`
داخلش باشد:
- where input validation happens
- option validation
- file/path validation
- mutually exclusive flag rule
- required argument rule
- safe default rule

### `state-rules.md`
وقتی cache/state داری:
- cache location
- cleanup policy
- lock file rule
- corruption recovery
- migration rule
- temp file safety

### `platform-rules.md`
داخلش باشد:
- path separator concern
- shell assumption rule
- permission caveat
- executable naming
- unsupported platform behavior
- line ending concern

### `automation-rules.md`
خیلی مهم است.
داخلش باشد:
- dry-run requirement
- confirm-before-destructive rule
- retry/rollback capability
- partial failure behavior
- resumable step rule
- idempotency expectation

### `packaging-rules.md`
داخلش باشد:
- target builds
- naming convention artifactها
- release version source
- update installer/package metadata
- checksum/signing note
- release docs sync rule

### `security-rules.md`
نمونه ruleها:
- credential را hardcode نکن
- shell command را unsafe compose نکن
- path traversal را نادیده نگیر
- destructive command بدون confirmation یا explicit flag نده
- secrets را در verbose log چاپ نکن
- temp file حساس را بدون cleanup رها نکن

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: command جدید را بدون help و docs اضافه نکن
- اشتباه: output انسانی را طوری تغییر نده که mode ماشینی بشکند
- اشتباه: config precedence موجود را عوض نکن
- اشتباه: destructive operation را بدون dry-run/confirm اضافه نکن
- اشتباه: path handling را فقط برای Linux ننویس
- اشتباه: validation را فقط در UI/CLI layer رها نکن اگر پایین‌دست هم لازم است
- اشتباه: exit codeها را ناهماهنگ نکن
- اشتباه: secret یا token را در log یا config sample واقعی نگذار

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | pathهای محلی، shell profile، package manager noteها، تست محلی |
| `walkthrough.md` | گزارش جلسات — قالب: `write-docs-friendly/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `local-shortcuts.md` | aliasها، scriptهای شخصی، wrapperهای محلی |
| `release-notes-local.md` | یادداشت‌های release و publish |
| `secrets-and-tokens.md` | فقط در صورت اجبار و فقط local |
| `device-or-os-notes.md` | تفاوت رفتار روی OSهای تست |
| `debug-observations.md` | observationهای محلی و issueهای تکراری |

### قانون امنیتی
- credential، token، API key و private signing material نباید داخل repo عمومی بمانند
- `docs-personal/` باید فقط context شخصی و عملیاتی محلی بدهد
- repo باید بدون این پوشه هم قابل فهم و قابل نگهداری باشد

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `tool-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/commands.md`
- `docs/configuration.md`
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/command-map.md`
- `docs-for-ai/config-rules.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `tool-standard`
فایل‌های پیشنهادی:
- همه موارد `tool-lite`
- `docs/input-output.md`
- `docs/setup-step-by-step.md`
- `docs/developer.md`
- `docs/packaging-and-release.md`
- `docs/platform-support.md`
- `docs/testing.md`
- `docs/troubleshooting.md`
- `docs/logging-and-debug.md`
- `docs/security.md`
- `docs/storage-and-state.md`
- `docs-for-ai/output-rules.md`
- `docs-for-ai/validation-rules.md`
- `docs-for-ai/state-rules.md`
- `docs-for-ai/packaging-rules.md`
- `docs-for-ai/platform-rules.md`
- `docs-for-ai/testing-rules.md`
- `docs-for-ai/security-rules.md`

### برای `tool-complex`
فایل‌های پیشنهادی:
- همه موارد `tool-standard`
- `docs/automation.md`
- `docs/plugins-or-extensions.md`
- `docs/distribution.md`
- `docs/desktop-ui.md`
- `docs/shortcuts-and-workflows.md`
- `docs-for-ai/automation-rules.md`
- `docs-for-ai/ui-rules.md`
- `docs-for-ai/integration-contracts.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن command tree، config precedence یا packaging behavior را اشتباه می‌فهمد
- کاربر برای quick-start لازم دارد install، command summary و config path را یکجا ببیند
- نسخه انسانی و نسخه AI از commandها، config و output باید با سطح جزئیات متفاوت وجود داشته باشند
- برای جلوگیری از خطا، ruleهای حساس مثل destructive action و exit code در چند مرجع خلاصه شوند

### تکرار غیرمجاز است اگر:
- دو منبع متناقض برای command syntax، config precedence یا output mode بسازی
- همان help text را بی‌دلیل در چند فایل کپی کنی
- source of truth برای command behavior مبهم شود

### الگوی درست
- `docs/commands.md` → توضیح انسانی commandها
- `docs-for-ai/command-map.md` → خلاصه عملی محل تغییر و dependencyها
- `docs/configuration.md` → فهم انسانی config
- `docs-for-ai/config-rules.md` → ruleهای enforceable برای parsing و precedence
- `docs/packaging-and-release.md` → توضیح انسانی release
- `docs-for-ai/packaging-rules.md` → ruleهای دقیق build/distribution

---

## دستور `/sync-docs-tool`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- command جدید
- flag/option جدید
- config precedence change
- output format change
- exit code change
- local state/cache path change
- packaging/release change
- platform support change
- automation flow change
- integration change

### کارهایی که `/sync-docs-tool` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف ابزار هماهنگ است
2. چک کند `design.md` هنوز flow واقعی ابزار را درست توضیح می‌دهد
3. `project-file-index.md` را با ساختار واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر command یا option جدید آمده، `commands.md` و `command-map.md` را sync یا علامت بزند
6. اگر config عوض شده، `configuration.md` و `config-rules.md` را به‌روز کند
7. اگر output/exit code عوض شده، `input-output.md` و `output-rules.md` را sync کند
8. اگر packaging/release یا platform support عوض شده، فایل‌های مربوط را به‌روز کند
9. اگر automation یا destructive flow عوض شده، `automation.md` و `automation-rules.md` را علامت بزند
10. اگر state path یا cache rule عوض شده، `storage-and-state.md` و `state-rules.md` را sync کند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد command behavior جدید اختراع کند یا safety ruleهای destructive را حدس بزند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه desktop / tooling / CLI

- [ ] سطح پروژه مشخص شده: `tool-lite` یا `tool-standard` یا `tool-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `commands.md` ساخته شده
- [ ] `configuration.md` ساخته شده
- [ ] اگر output مهم است، `input-output.md` ساخته شده
- [ ] اگر packaging/release داری، فایل مربوطه ساخته شده
- [ ] اگر local state/cache داری، `storage-and-state.md` ساخته شده
- [ ] اگر destructive command داری، automation/safety ruleها مستند شده‌اند
- [ ] command یا rule مربوط به `/sync-docs-tool` تعریف شده

---

## قانون نهایی

- truth نهایی، رفتار واقعی commandها، config واقعی و release واقعی ابزار است
- داکیومنت باید به command tree، optionها، outputها، packageها و state pathهای واقعی برسد
- AI نباید برای فهمیدن parser، config precedence، exit code و destructive action کل repo را حدس بزند
- انسان نباید برای فهم ابزار مجبور شود فقط از روی `--help`، source code و scriptهای release نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن