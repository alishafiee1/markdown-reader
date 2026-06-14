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


# استاندارد مستندسازی پروژه‌های API / backend کوچک

> این نسخه مخصوص پروژه‌های زیر است:
> - REST API کوچک
> - backend سبک برای وب/موبایل/IoT
> - auth service
> - webhook receiver
> - admin backend
> - worker / cron service کوچک
> - ingestion service یا telemetry API سبک
> - پروژه‌های بک‌اند تک‌سرویس یا کم‌ماژول

هدف این استاندارد:
- مستندات backend از اول روشن و یک‌دست باشند
- مرز بین «هدف محصول»، «معماری»، «قرارداد API»، «مدل داده» و «عملیات» قاطی نشود
- AI برای توسعه و اصلاح endpointها، مدل‌ها و flowها کانتکست کافی داشته باشد
- تکرار لازم برای AI و onboarding مجاز باشد
- پروژه کوچک بی‌جهت شبیه enterprise سنگین نشود، ولی ناقص هم نماند

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، توضیحی، قابل فهم | فهم محصول، معماری، رفتار API، روند توسعه |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | فشرده، دقیق، عملیاتی | کمک به تولید و اصلاح کد بدون حدس |
| `docs-personal/` | فقط خودم | ❌ نه | اجرایی، حساس، شخصی | اطلاعات محیط واقعی، دسترسی‌ها، یادداشت‌های عملیاتی |

### قانون مهم
- `docs/` برای فهمیدن backend است.
- `docs-for-ai/` برای این است که AI سریع بفهمد **کجا چه تغییری بدهد و چه چیزی را نشکند**.
- `docs-personal/` برای اطلاعاتی است که عمومی یا اشتراکی نیستند.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای نوشتن endpoint یا migration لازم دارد contract، model summary یا auth rule را ببیند، باید همان اطلاعات به‌شکل فشرده در `docs-for-ai/` هم وجود داشته باشد.
- اگر برای توسعه‌دهنده انسانی لازم است quick-start و env summary را یکجا ببیند، می‌توان خلاصه‌ای از آن در `how-to-use.md` آورد.
- چیزی که ممنوع است تکرار متناقض و بی‌هدف است، نه تکرار مفید.

---

## سطح‌بندی پروژه‌های backend کوچک

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `api-lite` | بک‌اند خیلی کوچک | webhook listener، auth-lite، CRUD ساده |
| `api-standard` | بک‌اند معمولی | API برای وب/موبایل/IoT با DB و auth |
| `api-extended` | بک‌اند کوچک ولی عملیاتی‌تر | چند domain، queue/cron، role، deploy واقعی |

### قانون استفاده
- در `api-lite` فقط فایل‌های پایه و contractهای اصلی کافی‌اند
- در `api-standard` فایل‌های auth، data model، testing و deployment معمولاً لازم‌اند
- در `api-extended` بدون مستندسازی jobها، migrationها، roleها، integrationها و error flow خیلی زود پروژه مبهم می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید به توسعه‌دهنده یا هم‌تیمی کمک کند بفهمد:
- این backend چه کاری می‌کند
- برای چه clientهایی ساخته شده
- چه endpointها و flowهایی دارد
- داده‌ها کجا و چطور ذخیره می‌شوند
- چطور اجرا، تست و deploy می‌شود

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف مسئله و هدف سرویس | مسئله، مخاطب، use caseها، محدوده پروژه | schema کامل DB، لیست همه routeها، کد |
| `design.md` | معماری سرویس | ماژول‌ها، flow درخواست، storage، auth، integrationها | تکرار کامل همه APIها و مدل‌ها |
| `tasks.md` | مدیریت کارها | backlog، milestone، release checklist، TODO | توضیح عمیق معماری |
| `how-to-use.md` | منوی اجرای سریع | install، run، test، migrate، seed، deploy commandها | تحلیل عمیق بیزینس یا معماری |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر + توضیح یک‌خطی | تحلیل رفتاری یا contract کامل |

### فایل‌های شرطی مهم برای backend

| نام فایل | کی لازم است |
|----------|-------------|
| `api.md` | تقریباً در همه APIها |
| `data-models.md` | وقتی DB/schema/entity مهم است |
| `auth.md` | وقتی login، token، session، api key، role یا permission وجود دارد |
| `setup-step-by-step.md` | وقتی راه‌اندازی برای نفر جدید ساده نیست |
| `developer.md` | وقتی commandها و workflow توسعه زیاد است |
| `security.md` | وقتی secret، auth، webhook، upload، payment یا داده حساس وجود دارد |
| `testing.md` | وقتی تست endpoint، integration یا regression مهم است |
| `deployment.md` | وقتی release/deploy/rollback اهمیت دارد |
| `troubleshooting.md` | وقتی خطاهای setup یا runtime تکراری زیاد است |
| `jobs-and-schedulers.md` | وقتی cron، queue، background job یا worker وجود دارد |
| `integrations.md` | وقتی سرویس‌های بیرونی مثل Redis، S3، payment، SMS، email، MQTT و ... وجود دارند |
| `roles-and-permissions.md` | وقتی چند سطح دسترسی داری |
| `error-handling.md` | وقتی format خطا و status code مهم است |
| `decision-log.md` | وقتی تصمیم‌های معماری مهم و قابل رجوع وجود دارد |
| `architecture-and-structure.md` | از `api-standard` به بالا — `00-start-new-project/how-to-write-architecture-and-structure.md` |

---

## پوشه‌های `change/` و `archive/`

| مسیر | معنی |
|------|------|
| `docs/change/<name>/` | پلن فعال (proposal + design + tasks) |
| `docs/change/1405-03-01-<name>/` | تمام‌شده — پیشوند تاریخ شمسی روز اتمام |
| `docs/archive/` | معلق، ردشده، داک منسوخ |

راهنما: `00-start-new-project/how-to-manage-change-folders.md`

---

## مرزبندی دقیق فایل‌های `docs/`

### `proposal.md`
این فایل جواب می‌دهد:
- این سرویس چیست؟
- برای چه کاری ساخته شده؟
- چه کلاینت یا محصولی از آن استفاده می‌کند؟
- محدوده‌اش چیست و چیست نیست؟

داخلش بنویس:
- مسئله و هدف
- کاربران یا clientهای اصلی
- سناریوهای اصلی
- قابلیت‌های سطح بالا
- محدودیت‌ها
- معیار موفقیت

داخلش ننویس:
- route list کامل
- مدل دیتابیس کامل
- env list کامل
- جزئیات فنی handlerها

### `design.md`
هسته‌ی فنی انسانی پروژه است.

داخلش بنویس:
- معماری کلی
- request lifecycle
- لایه‌ها و مسئولیت‌ها
- auth flow
- DB/storage overview
- integrationها
- background jobs اگر هست
- logging/error strategy
- config/env overview

داخلش ننویس:
- OpenAPI کامل
- schema کامل همه tableها
- command reference کامل
- مثال‌های زیاد request/response

### `api.md`
این فایل برای انسان است، نه فقط ماشین.
باید بشود از روی آن فهمید:
- endpointها چه هستند
- چه کاری می‌کنند
- auth می‌خواهند یا نه
- ورودی و خروجی کلی چیست
- خطاهای مهم چیست

برای هر route بهتر است این‌ها باشد:
- method + path
- توضیح
- auth rule
- ورودی
- خروجی
- errorهای مهم
- مثال کوتاه

### `data-models.md`
برای مدل‌های داده، entityها و relationها است.

داخلش باشد:
- entityهای اصلی
- relationها
- fieldهای مهم
- unique ruleها
- soft delete rule اگر هست
- lifecycle مهم داده
- data ownership

این فایل جای migration history ریز نیست؛ جای فهم مدل است.

### `auth.md`
اگر auth یا permission داری، این فایل حیاتی است.

داخلش باشد:
- نوع auth
- login flow
- token/session/api key rule
- refresh/revoke behavior
- roleها
- permissionها
- protected routeها
- failure behavior

### `jobs-and-schedulers.md`
برای backendهای کوچک هم خیلی مهم می‌شود اگر cron یا queue داشته باشی.

داخلش باشد:
- jobها
- triggerها
- retry policy
- timeout
- idempotency concern
- failure handling
- dead letter behavior اگر هست

### `deployment.md`
این فایل باید مشخص کند:
- deploy target چیست
- چطور build می‌گیری
- migration چه زمانی اجرا می‌شود
- envها چطور بارگذاری می‌شوند
- restart strategy چیست
- rollback چطور انجام می‌شود
- health check چیست

### `testing.md`
باید روشن کند:
- unit test rule
- integration test rule
- API test rule
- smoke test قبل از release
- test data / seed strategy
- critical paths to verify

### `error-handling.md`
وقتی پاسخ خطا مهم است.
داخلش باشد:
- error format
- status code convention
- validation error shape
- auth error behavior
- internal error behavior
- logging/correlation id note اگر هست

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند:
- جای درست تغییر در کد را پیدا کند
- endpoint جدید را هماهنگ با ساختار موجود بسازد
- migration، DTO، validator و service layer را از قلم نیندازد
- auth و role rule را نشکند
- integration و background job را اشتباه پیاده‌سازی نکند

### اصل مهم
در backend، AI اگر context ناقص داشته باشد معمولاً این خطاها را می‌دهد:
- route را می‌سازد ولی validator را فراموش می‌کند
- schema را عوض می‌کند ولی migration را نمی‌نویسد
- auth را دور می‌زند
- response shape را ناهماهنگ می‌کند
- business rule را داخل controller می‌ریزد
پس این پوشه باید کوتاه ولی کافی باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | snapshot کامل پروژه برای AI |
| `map.md` | نقشه فایل‌ها، ماژول‌ها، domainها و مسئولیت‌ها |
| `platform.md` | stack، runtime، env، سرویس‌ها، portها، commandها |
| `ai-common-mistakes.md` | خطاهای تکراری و ruleهای مهم |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `api-contracts.md` | تقریباً در همه backendها |
| `data-model-summary.md` | وقتی schema و relation مهم است |
| `auth-rules.md` | وقتی auth/permission داری |
| `routing-map.md` | وقتی routeها یا moduleها زیادند |
| `service-rules.md` | وقتی layering و service pattern مهم است |
| `validation-rules.md` | وقتی DTO/validator/schema validation مهم است |
| `db-migration-rules.md` | وقتی migration دستی یا ساختاری مهم است |
| `job-map.md` | وقتی queue/cron/worker داری |
| `integration-contracts.md` | وقتی سرویس بیرونی داری |
| `error-response-rules.md` | وقتی format خطا باید ثابت بماند |
| `testing-rules.md` | وقتی AI باید تست بنویسد یا regression را نشکند |
| `researches.md` | وقتی تصمیم‌ها بر اساس مقایسه فنی مهم‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot سریع و کافی برای AI:
- سرویس چیست
- stack چیست
- entry point چیست
- ماژول‌های اصلی کدام‌اند
- auth rule کلی چیست
- database/store چیست
- مهم‌ترین conventionها چیست
- الان چه فازهایی فعال‌اند

این فایل می‌تواند خلاصه‌ی `proposal.md` و `design.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید سریع بفهمد:
- routeها کجا هستند
- controllerها کجا هستند
- serviceها کجا هستند
- validatorها کجا هستند
- model/schemaها کجا هستند
- migrationها کجا هستند
- testها کجا هستند

مثال:
- `src/routes/` → route registration
- `src/controllers/` → request handlers
- `src/services/` → business logic
- `src/repositories/` → DB access layer
- `src/validators/` → input validation
- `src/models/` یا `prisma/` → data model
- `migrations/` → DB schema changes

### `platform.md`
این فایل برای اجرای فنی سرویس است:
- runtime: Node / Python / Go / ...
- framework
- package manager
- DB type
- cache/queue if any
- port
- env names
- main commandها
- test commandها
- migration commandها
- deploy target

### `api-contracts.md`
این فایل برای AI حیاتی است.
داخلش باشد:
- base path
- auth requirement by route group
- request shape
- response shape
- pagination rule
- filter/sort rule
- versioning rule
- status code convention
- idempotency note اگر هست

### `data-model-summary.md`
باید بگوید:
- entityهای اصلی چیست
- relationها چیست
- fieldهای حساس چیست
- unique/index ruleها چیست
- delete/update behavior چیست
- audit fieldها کدام‌اند

### `auth-rules.md`
داخلش باشد:
- auth type
- token/session rule
- middlewareها
- role check rule
- public routeها
- refresh/revoke rule
- access denied response

### `service-rules.md`
خیلی مفید است.
مثال:
- controller فقط orchestration
- business rule داخل service
- repository فقط data access
- external integration فقط در adapter layer
- response mapping در layer مشخص
- side effectها مستقیم در controller انجام نشوند

### `validation-rules.md`
داخلش باشد:
- validation library
- request validation location
- response validation rule اگر هست
- DTO naming convention
- schema reuse rule
- normalization rule

### `db-migration-rules.md`
برای جلوگیری از خرابکاری AI خیلی مهم است.
داخلش باشد:
- هر تغییر مدل باید migration داشته باشد
- naming convention migration
- backfill/migration concern
- destructive change rule
- rollback note
- seed update need or not

### `job-map.md`
وقتی worker/cron داری:
- job name
- trigger
- schedule
- retry
- timeout
- idempotency
- failure logging
- dependency on DB/API/queue

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: business rule را داخل route/controller نریز
- اشتباه: schema را عوض نکن مگر migration هم اضافه شود
- اشتباه: validator را برای endpoint جدید فراموش نکن
- اشتباه: response shape را خارج از convention پروژه نساز
- اشتباه: secret یا token را hardcode نکن
- اشتباه: auth-required route را public نکن
- اشتباه: query مستقیم و تکراری را در چند جا پخش نکن
- اشتباه: cron/job را بدون idempotency و retry note اضافه نکن
- اشتباه: error response را ناهماهنگ نساز

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | آدرس سرور، panel، port، systemd/docker service name، domain |
| `walkthrough.md` | گزارش جلسات — قالب: `00-start-new-project/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `local-ops-notes.md` | نکات عملیاتی محلی |
| `secrets-and-access.md` | فقط در صورت اجبار و فقط local |
| `incident-notes.md` | خطاهای واقعی production یا staging |
| `db-notes.md` | وضعیت دیتابیس، بکاپ، migrationهای حساس |
| `deploy-history.md` | releaseهای اخیر و نتیجه rollout |

### قانون امنیتی
- secret واقعی تا جای ممکن در فایل متنی نگه‌داری نشود
- برای token، DB password، webhook secret و API key از secret manager یا vault یا حداقل روش امن‌تر از plain file استفاده شود
- اگر فایل local لازم شد، باید کاملاً gitignored و واضح علامت‌گذاری شود

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `api-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/api.md`
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/api-contracts.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `api-standard`
فایل‌های پیشنهادی:
- همه موارد `api-lite`
- `docs/data-models.md`
- `docs/auth.md`
- `docs/setup-step-by-step.md`
- `docs/developer.md`
- `docs/security.md`
- `docs/testing.md`
- `docs/troubleshooting.md`
- `docs/deployment.md`
- `docs/error-handling.md`
- `docs/integrations.md`
- `docs-for-ai/data-model-summary.md`
- `docs-for-ai/auth-rules.md`
- `docs-for-ai/service-rules.md`
- `docs-for-ai/validation-rules.md`
- `docs-for-ai/db-migration-rules.md`
- `docs-for-ai/testing-rules.md`

### برای `api-extended`
فایل‌های پیشنهادی:
- همه موارد `api-standard`
- `docs/jobs-and-schedulers.md`
- `docs/roles-and-permissions.md`
- `docs/decision-log.md`
- `docs-for-ai/routing-map.md`
- `docs-for-ai/job-map.md`
- `docs-for-ai/integration-contracts.md`
- `docs-for-ai/error-response-rules.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن endpoint یا migration را اشتباه بسازد
- برای quick-start لازم است commandها و envهای مهم بیش از یک جا خلاصه شوند
- نسخه انسانی و نسخه AI از API contract باید با سطح جزئیات متفاوت وجود داشته باشند
- auth rule و response shape برای جلوگیری از خطا باید در چند فایل مرجع خلاصه شوند

### تکرار غیرمجاز است اگر:
- دو قرارداد ناسازگار برای یک endpoint بسازی
- schema را در چند فایل جداگانه با جزئیات برابر نگه داری
- فقط همان متن را بی‌دلیل کپی کنی

### الگوی درست
- `docs/api.md` → توضیح انسانی endpointها
- `docs-for-ai/api-contracts.md` → قرارداد عملیاتی برای AI
- `docs/data-models.md` → فهم انسانی مدل داده
- `docs-for-ai/data-model-summary.md` → خلاصه عملی تغییرات و relationها
- `docs/auth.md` → فهم انسانی auth
- `docs-for-ai/auth-rules.md` → ruleهای صریح برای توسعه کد

---

## دستور `/sync-docs-api`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- route جدید
- request/response shape
- validation rule
- data model / migration
- auth flow
- env variable
- integration جدید
- background job جدید
- deploy/release rule
- error format

### کارهایی که `/sync-docs-api` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف فعلی سرویس هماهنگ است
2. چک کند `design.md` هنوز معماری واقعی را درست توضیح می‌دهد
3. `project-file-index.md` را با ساختار واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر routeها تغییر کرده‌اند، `docs/api.md` و `docs-for-ai/api-contracts.md` را علامت بزند یا sync کند
6. اگر schema عوض شده، `docs/data-models.md` و `docs-for-ai/data-model-summary.md` و `db-migration-rules.md` را بررسی کند
7. اگر auth یا permission عوض شده، `docs/auth.md` و `docs-for-ai/auth-rules.md` را به‌روز کند
8. اگر job یا integration جدید آمده، فایل‌های مرتبط را به‌روز یا هشدار دهد
9. اگر env جدید اضافه شده، `design.md` و `platform.md` را sync کند
10. اگر deploy flow عوض شده، `deployment.md` را علامت بزند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد business rule جدید اختراع کند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه API / backend کوچک

- [ ] سطح پروژه مشخص شده: `api-lite` یا `api-standard` یا `api-extended`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `docs/api.md` ساخته شده
- [ ] runtime/framework/DB/envهای اصلی مستند شده
- [ ] اگر DB وجود دارد، `data-models.md` یا خلاصه آن ساخته شده
- [ ] اگر auth وجود دارد، `auth.md` و `auth-rules.md` ساخته شده
- [ ] اگر migration وجود دارد، rule آن مشخص شده
- [ ] اگر worker/cron وجود دارد، `jobs-and-schedulers.md` یا `job-map.md` ساخته شده
- [ ] اگر deploy واقعی وجود دارد، `deployment.md` مستند شده
- [ ] command یا rule مربوط به `/sync-docs-api` تعریف شده

---

## قانون نهایی

- کد و رفتار واقعی API truth نهایی‌اند
- داکیومنت باید به کد، schema و deploy واقعی برسد
- AI نباید برای فهم routeها، validatorها، modelها و auth ruleها کل پروژه را حدس بزند
- انسان نباید برای فهم flow سرویس مجبور شود فقط از روی controllerها و migrationها نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن