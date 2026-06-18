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

# استاندارد مستندسازی پروژه‌های SaaS چندماژول

> این نسخه مخصوص پروژه‌های زیر است:
> - SaaS چندبخشی
> - پنل کاربری + پنل ادمین + API
> - محصول subscription-based
> - پلتفرم چندنقشی
> - dashboard product با چند domain/module
> - multi-tenant SaaS
> - محصول‌هایی که billing، auth، onboarding، role، notification و workflow دارند

هدف این استاندارد:
- مستندات محصول، فنی، عملیاتی و UX با هم قاطی نشوند
- مرز بین moduleها، roleها، billing و workflow روشن باشد
- AI بتواند بدون گشتن در کل repo، ساختار ماژول‌ها و قراردادها را بفهمد
- برای محصول‌های در حال رشد، مستندات scalable باقی بمانند
- تکرار لازم برای AI، onboarding و هماهنگی تیم مجاز باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، توضیحی، محصولی + فنی | فهم محصول، ماژول‌ها، معماری، عملیات |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | فشرده، rule-based، عملیاتی | کمک به تغییر امن و هماهنگ در codebase |
| `docs-personal/` | فقط خودم | ❌ نه | محلی، حساس، عملیاتی | یادداشت‌های محصول/عملیات، دسترسی‌ها، context شخصی |

### قانون مهم
- `docs/` برای فهمیدن SaaS است؛ هم از زاویه محصول، هم از زاویه فنی.
- `docs-for-ai/` برای این است که AI بداند **ماژول کجاست، قراردادش چیست، کدام role روی آن اثر دارد، و تغییر یک بخش چه جاهای دیگری را می‌شکند**.
- `docs-personal/` برای اطلاعات محلی، حساس و تصمیم‌های موقتی است.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای ساخت feature جدید لازم دارد summary ماژول، role rule، billing effect یا route map را ببیند، همان اطلاعات باید در `docs-for-ai/` هم وجود داشته باشد.
- اگر برای onboarding انسان لازم است خلاصه‌ی ماژول‌ها و flowها یکجا دیده شود، می‌توان آن را در فایل‌های سطح بالا تکرار کرد.
- چیزی که ممنوع است تکرار متناقض و مبهم است، نه تکرار هدفمند.

---

## سطح‌بندی پروژه‌های SaaS

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `saas-lite` | SaaS کوچک | یک پنل کاربری، چند feature، billing ساده |
| `saas-standard` | SaaS معمولی | چند ماژول، role، admin panel، billing، API |
| `saas-complex` | SaaS چندبخشی | multi-tenant، workflow زیاد، notification، analytics، team management، چند محیط و چند integration |

### قانون استفاده
- در `saas-lite` فایل‌های پایه + module map + auth + API کافی‌اند
- در `saas-standard` فایل‌های role، billing، onboarding، admin و UX تقریباً لازم‌اند
- در `saas-complex` بدون مستندسازی module boundary، feature ownership، tenant rule، event flow و integrationها پروژه خیلی زود مبهم می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید کمک کند یک نفر بفهمد:
- محصول دقیقاً چیست
- چه ماژول‌هایی دارد
- هر ماژول چه مشکلی را حل می‌کند
- نقش‌های کاربری چه هستند
- data flow و system architecture چگونه است
- billing، onboarding، notification و admin چطور کار می‌کنند
- چطور build/test/deploy می‌شود

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف محصول و مسئله | مسئله، کاربران، ارزش، use caseها، محدوده محصول | route list کامل، schema کامل، کد |
| `design.md` | معماری کلی محصول و سیستم | moduleها، لایه‌ها، ارتباط frontend/backend، data flow، integrationها | جزییات کامل هر ماژول |
| `tasks.md` | برنامه کارها | roadmap، milestone، release task، backlog | توضیح معماری تکراری |
| `how-to-use.md` | منوی سریع اجرا و commandها | install، run، test، build، deploy، seed | توضیح طولانی محصول |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر + توضیح یک‌خطی | تحلیل محصولی |

### فایل‌های شرطی مهم برای SaaS

| نام فایل | کی لازم است |
|----------|-------------|
| `modules.md` | تقریباً همیشه |
| `api.md` | تقریباً همیشه |
| `auth.md` | تقریباً همیشه |
| `roles-and-permissions.md` | وقتی چند نقش کاربری وجود دارد |
| `billing.md` | وقتی subscription/payment/plan داری |
| `onboarding.md` | وقتی setup اولیه کاربر مهم است |
| `admin-panel.md` | وقتی پنل ادمین داری |
| `data-models.md` | وقتی schema/entityهای مهم داری |
| `integrations.md` | وقتی به سرویس‌های بیرونی وصل هستی |
| `architecture-and-structure.md` | از `saas-standard` به بالا — `write-docs-friendly/how-to-write-architecture-and-structure.md` |
| `notifications.md` | وقتی email/SMS/in-app/push/event داری |
| `workflows.md` | وقتی featureها چندمرحله‌ای یا event-driven هستند |
| `user-experience.md` | وقتی UX محصول اهمیت بالایی دارد |
| `ui-behavior.md` | وقتی رفتار UI باید بدون کد توضیح داده شود |
| `look-and-feel.md` | وقتی design system یا brand consistency مهم است |
| `security.md` | وقتی داده حساس، team access، billing یا admin action داری |
| `deployment.md` | وقتی release/deploy/rollback مهم است |
| `testing.md` | وقتی regression و flows مهم‌اند |
| `troubleshooting.md` | وقتی خطاهای setup/runtime زیاد می‌شوند |
| `tenant-model.md` | وقتی multi-tenant هستی |
| `analytics-and-events.md` | وقتی event tracking و KPI مهم است |
| `decision-log.md` | وقتی تصمیم‌های محصولی/فنی مهم و قابل رجوع‌اند |

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
- این SaaS چیست؟
- برای چه کسی ساخته شده؟
- چه مشکلی را حل می‌کند؟
- value proposition آن چیست؟
- محدوده MVP و خارج از MVP چیست؟

داخلش بنویس:
- مخاطب هدف
- مشکل
- ارزش پیشنهادی
- use caseهای اصلی
- featureهای سطح بالا
- محدودیت‌ها
- معیار موفقیت

داخلش ننویس:
- endpoint list
- schema detail
- نقش هر فایل در repo
- commandهای فنی

### `design.md`
هسته‌ی فنی/سیستمی محصول است.

داخلش بنویس:
- معماری frontend/backend
- ماژول‌های اصلی
- data flow
- auth overview
- tenant/role overview
- integration overview
- storage and async flow
- deployment shape
- boundary بین moduleها

داخلش ننویس:
- تمام جزئیات هر ماژول
- قرارداد کامل API
- توضیح UX جزئی
- commandهای توسعه

### `modules.md`
این فایل برای SaaS خیلی مهم است.

برای هر module بگو:
- نام
- مسئله‌ای که حل می‌کند
- user roleهای مرتبط
- وابستگی‌ها
- داده‌های اصلی
- page/routeهای مهم
- APIهای مهم
- owner منطقی
- وابستگی به billing/plan/permission

### `roles-and-permissions.md`
باید روشن کند:
- roleهای سیستم چیست
- هر role چه کارهایی می‌تواند بکند
- role inheritance وجود دارد یا نه
- scope دسترسی چیست
- admin چه قدرتی دارد
- محدودیت‌های مهم چیست

### `billing.md`
اگر SaaS پولی است این فایل حیاتی است.

داخلش باشد:
- planها
- feature gating
- trial rule
- subscription lifecycle
- upgrade/downgrade
- invoice/payment provider
- failed payment behavior
- cancel/reactivate behavior
- billing impact on modules

### `onboarding.md`
باید توضیح دهد:
- کاربر از signup تا first value چه مسیرهایی دارد
- چه setupهایی لازم است
- چه frictionهایی عمدی‌اند
- activation point چیست
- اگر onboarding کامل نشود چه می‌شود

### `admin-panel.md`
داخلش باشد:
- ادمین چه چیزی را می‌بیند
- چه چیزی را می‌تواند تغییر دهد
- audit actionها چیست
- چه کارهایی حساس‌اند
- مرز admin با support یا super-admin چیست

### `workflows.md`
برای flowهای چندمرحله‌ای:
- trigger
- stateها
- dependencyها
- actionهای کاربر
- actionهای سیستم
- failure mode
- retry behavior

### `notifications.md`
داخلش باشد:
- notification typeها
- triggerها
- channelها
- rate limit
- user preference
- fallback behavior
- template ownership

### `tenant-model.md`
اگر multi-tenant هستی:
- tenant چیست
- ownership چیست
- data isolation rule چیست
- cross-tenant access ممنوعیت‌ها چیست
- tenant-scoped objectها کدام‌اند
- invite/member/team rule چیست

### `analytics-and-events.md`
داخلش باشد:
- eventهای اصلی
- funnelهای مهم
- KPIها
- naming rule
- source of truth
- privacy note

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند:
- feature جدید را در ماژول درست بسازد
- consistency بین frontend، backend، role، billing و analytics را از دست ندهد
- naming و layering پروژه را رعایت کند
- تغییر یک ماژول را بدون شکستن tenant rule، auth rule و plan gating انجام دهد

### اصل مهم
در SaaS چندماژول، AI با context ناقص معمولاً این خطاها را می‌دهد:
- feature را می‌سازد ولی plan gating را فراموش می‌کند
- role check را جا می‌اندازد
- route/UI/API را ناهماهنگ می‌سازد
- event tracking را فراموش می‌کند
- admin behavior را از user behavior جدا نمی‌کند
- multi-tenant boundary را می‌شکند
پس این پوشه باید دقیق و کاربردی باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | snapshot سریع و کامل پروژه برای AI |
| `map.md` | نقشه فایل‌ها، appها، moduleها و layerها |
| `platform.md` | stack، envها، serviceها، commandها، runtimeها |
| `ai-common-mistakes.md` | خطاهای تکراری و ruleهای حساس |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `module-map.md` | تقریباً همیشه |
| `routing-map.md` | وقتی routeها و screenها زیادند |
| `api-contracts.md` | تقریباً همیشه |
| `data-model-summary.md` | وقتی schema/entity مهم است |
| `auth-rules.md` | وقتی auth/role/permission وجود دارد |
| `billing-rules.md` | وقتی billing و plan gating داری |
| `tenant-rules.md` | وقتی multi-tenant هستی |
| `admin-rules.md` | وقتی پنل ادمین داری |
| `workflow-map.md` | وقتی flowهای چندمرحله‌ای مهم‌اند |
| `event-tracking-rules.md` | وقتی analytics مهم است |
| `notification-rules.md` | وقتی notification system داری |
| `ui-rules.md` | وقتی frontend patternهای قوی داری |
| `service-rules.md` | وقتی backend/service layer pattern مهم است |
| `validation-rules.md` | وقتی DTO/schema validation مهم است |
| `testing-rules.md` | وقتی regression coverage مهم است |
| `integration-contracts.md` | وقتی سرویس بیرونی داری |
| `researches.md` | وقتی تصمیم‌های مهم بر پایه مقایسه و بررسی‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot سریع و کافی برای AI:
- محصول چیست
- چه ماژول‌هایی دارد
- roleها چه هستند
- tenant model چیست
- billing دارد یا نه
- admin panel دارد یا نه
- entry pointها کجاست
- لایه‌های اصلی چیست
- مهم‌ترین conventionها چیست

این فایل می‌تواند خلاصه‌ی `proposal.md`، `design.md` و `modules.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید سریع بفهمد:
- frontend appها کجا هستند
- backend appها کجا هستند
- shared packageها کجا هستند
- moduleها کجا هستند
- API layer کجاست
- validationها کجاست
- billing code کجاست
- admin code کجاست
- analytics code کجاست
- testها کجا هستند

### `module-map.md`
برای هر module خیلی صریح بگو:
- folder/path
- purpose
- routes/pages
- API endpoints
- data models
- role dependency
- billing dependency
- analytics requirement
- shared component dependency

### `routing-map.md`
وقتی چند app/screen داری:
- route
- who can access
- module
- layout
- data dependency
- feature flag/plan gate
- onboarding dependency

### `api-contracts.md`
برای AI حیاتی است.
داخلش باشد:
- base pathها
- module-wise route group
- auth rule
- request/response shape
- pagination/filter/sort rule
- error format
- versioning rule
- idempotency note اگر لازم است

### `auth-rules.md`
داخلش باشد:
- auth type
- session/token rule
- route protection
- role check rule
- permission scope
- tenant scope
- impersonation rule اگر هست
- admin override rule اگر هست

### `billing-rules.md`
این فایل در SaaS خیلی مهم است.
داخلش باشد:
- planها
- feature gate mapping
- trial gateها
- usage limit rule
- upgrade/downgrade behavior
- grace period
- failed payment behavior
- billing-driven UI/API states

### `tenant-rules.md`
داخلش باشد:
- tenant boundary
- tenant-scoped objectها
- cross-tenant ممنوعیت
- invite/member relationship
- ownership transfer rule
- data query boundary
- admin access exceptionها

### `workflow-map.md`
برای flowهای پیچیده:
- trigger
- stateها
- related roles
- related screens
- related APIs
- related notifications
- retry/failure path

### `event-tracking-rules.md`
داخلش باشد:
- event naming rule
- required events per module
- funnel critical events
- where to trigger
- duplicate event avoidance
- privacy/sensitive field rule

### `notification-rules.md`
داخلش باشد:
- notification type
- trigger source
- channel
- user preference dependency
- dedup rule
- retry rule
- silent failure policy

### `ui-rules.md`
برای AI مهم است:
- page composition rule
- component reuse rule
- form pattern
- empty/loading/error state rule
- table/filter/search pattern
- modal/drawer rule
- role/plan aware UI behavior

### `admin-rules.md`
داخلش باشد:
- admin-only routeها
- dangerous action rule
- audit logging requirement
- masked data rule
- support action boundary
- impersonation or forced action boundary

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: feature جدید را بدون role check نساز
- اشتباه: plan gating را فقط در UI اعمال نکن؛ backend هم باید enforce کند
- اشتباه: tenant-scoped query را global نکن
- اشتباه: event tracking را فراموش نکن
- اشتباه: admin action را بدون audit log طراحی نکن
- اشتباه: workflow چندمرحله‌ای را فقط با route ساختن تمام‌شده فرض نکن
- اشتباه: notification trigger را خارج از lifecycle درست feature نگذار
- اشتباه: response shape بین app و API را ناهماهنگ نساز
- اشتباه: shared component را داخل module-specific code duplicate نکن

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | آدرس محیط‌ها، panelها، providerها، دسترسی‌ها |
| `walkthrough.md` | گزارش جلسات — قالب: `write-docs-friendly/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `pricing-notes.md` | یادداشت‌های pricing/plan و ایده‌های آزمایشی |
| `customer-feedback.md` | بازخوردهای خام مشتری |
| `incident-notes.md` | رخدادهای واقعی یا failureهای محصول |
| `growth-notes.md` | ایده‌های acquisition/activation/retention |
| `secrets-and-access.md` | فقط در صورت اجبار و فقط local |
| `ops-shortcuts.md` | commandها و لینک‌های محلی |

### قانون امنیتی
- repo باید بدون `docs-personal/` هم قابل فهم و maintain باشد
- secret واقعی، credential و اطلاعات مشتری نباید بدون ضرورت در plain text بمانند
- `docs-personal/` باید برای context شخصی باشد، نه جبران کمبود مستندات اصلی

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `saas-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/modules.md`
- `docs/api.md`
- `docs/auth.md`
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/module-map.md`
- `docs-for-ai/api-contracts.md`
- `docs-for-ai/auth-rules.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `saas-standard`
فایل‌های پیشنهادی:
- همه موارد `saas-lite`
- `docs/roles-and-permissions.md`
- `docs/billing.md`
- `docs/onboarding.md`
- `docs/admin-panel.md`
- `docs/data-models.md`
- `docs/notifications.md`
- `docs/workflows.md`
- `docs/security.md`
- `docs/testing.md`
- `docs/deployment.md`
- `docs/troubleshooting.md`
- `docs/integrations.md`
- `docs/ui-behavior.md`
- `docs/user-experience.md`
- `docs-for-ai/routing-map.md`
- `docs-for-ai/data-model-summary.md`
- `docs-for-ai/billing-rules.md`
- `docs-for-ai/workflow-map.md`
- `docs-for-ai/ui-rules.md`
- `docs-for-ai/testing-rules.md`
- `docs-for-ai/integration-contracts.md`

### برای `saas-complex`
فایل‌های پیشنهادی:
- همه موارد `saas-standard`
- `docs/tenant-model.md`
- `docs/look-and-feel.md`
- `docs/analytics-and-events.md`
- `docs/decision-log.md`
- `docs-for-ai/tenant-rules.md`
- `docs-for-ai/admin-rules.md`
- `docs-for-ai/event-tracking-rules.md`
- `docs-for-ai/notification-rules.md`
- `docs-for-ai/service-rules.md`
- `docs-for-ai/validation-rules.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن consistency بین UI/API/role/billing را از دست می‌دهد
- onboarding انسان نیاز دارد خلاصه‌ی moduleها و flowها را یکجا ببیند
- نسخه انسانی و نسخه AI از auth، billing، tenant و workflow باید با جزئیات متفاوت وجود داشته باشند
- برای جلوگیری از خطای feature work لازم است summaryهای حساس در چند مرجع دیده شوند

### تکرار غیرمجاز است اگر:
- دو source متناقض برای role rule، billing gate یا tenant boundary بسازی
- همان توضیح module را بی‌دلیل در چند فایل برابر تکرار کنی
- source of truth برای feature behavior مبهم شود

### الگوی درست
- `docs/modules.md` → توضیح انسانی ماژول‌ها
- `docs-for-ai/module-map.md` → خلاصه عملی برای محل تغییر
- `docs/billing.md` → توضیح محصولی billing
- `docs-for-ai/billing-rules.md` → ruleهای enforceable برای کد
- `docs/roles-and-permissions.md` → توضیح انسانی نقش‌ها
- `docs-for-ai/auth-rules.md` و `tenant-rules.md` → ruleهای اجرایی برای توسعه

---

## دستور `/sync-docs-saas`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- module جدید
- route/screen جدید
- endpoint جدید
- role/permission change
- billing rule change
- onboarding flow change
- notification trigger change
- event tracking change
- tenant rule change
- admin capability change
- env/service/integration change

### کارهایی که `/sync-docs-saas` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف فعلی محصول هماهنگ است
2. چک کند `design.md` هنوز معماری واقعی را درست توضیح می‌دهد
3. `project-file-index.md` را با ساختار واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر module جدید اضافه شده، `modules.md` و `module-map.md` را به‌روز کند
6. اگر route یا API تغییر کرده، `api.md`، `routing-map.md` و `api-contracts.md` را علامت بزند یا sync کند
7. اگر role/auth/tenant تغییر کرده، `roles-and-permissions.md`، `auth-rules.md` و `tenant-rules.md` را به‌روز کند
8. اگر billing یا plan gating عوض شده، `billing.md` و `billing-rules.md` را به‌روز کند
9. اگر workflow/notification/event عوض شده، فایل‌های مرتبط را sync یا هشدار دهد
10. اگر env یا integration تغییر کرده، `platform.md` و `integrations.md` را sync کند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد product rule، pricing logic یا permission logic جدید اختراع کند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه SaaS چندماژول

- [ ] سطح پروژه مشخص شده: `saas-lite` یا `saas-standard` یا `saas-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `modules.md` ساخته شده
- [ ] `api.md` ساخته شده
- [ ] `auth.md` ساخته شده
- [ ] اگر roleها وجود دارند، `roles-and-permissions.md` ساخته شده
- [ ] اگر billing وجود دارد، `billing.md` ساخته شده
- [ ] اگر onboarding مهم است، `onboarding.md` ساخته شده
- [ ] اگر admin panel وجود دارد، `admin-panel.md` ساخته شده
- [ ] اگر multi-tenant هستی، `tenant-model.md` ساخته شده
- [ ] rule یا command مربوط به `/sync-docs-saas` تعریف شده

---

## قانون نهایی

- truth نهایی، رفتار واقعی محصول و کد واقعی سیستم است
- داکیومنت باید به moduleها، roleها، flowها، APIها و billing ruleهای واقعی برسد
- AI نباید برای فهمیدن module boundary، tenant rule یا plan gating کل repo را حدس بزند
- انسان نباید برای فهم محصول مجبور شود فقط از روی routeها، tableها و endpointها نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن