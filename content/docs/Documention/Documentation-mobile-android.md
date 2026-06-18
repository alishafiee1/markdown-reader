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

# استاندارد مستندسازی پروژه‌های Android / mobile

> این نسخه مخصوص پروژه‌های زیر است:
> - اپ اندروید native
> - Kotlin / Java Android app
> - Jetpack Compose app
> - XML-based Android app
> - mobile app متصل به API
> - اپ‌های offline-first یا sync-based
> - اپ‌های چند screen با auth، onboarding، notification، background work و release واقعی

هدف این استاندارد:
- مستندات محصول موبایل، UI، state، data و release از هم جدا و واضح باشند
- مرز بین screen behavior، navigation، permission، data flow و build/release قاطی نشود
- AI بتواند بدون حدس، screen درست، viewmodel درست و data flow درست را پیدا کند
- برای تغییر feature، dependency بین UI، state، API، local storage و permission فراموش نشود
- تکرار لازم برای AI و onboarding مجاز باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، محصولی + فنی | فهم اپ، screenها، flowها، state، release |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | دقیق، فشرده، rule-based | کمک به توسعه و اصلاح هماهنگ کد |
| `docs-personal/` | فقط خودم | ❌ نه | محلی، عملیاتی، حساس | context شخصی، keyها، release noteهای محلی، device noteها |

### قانون مهم
- `docs/` برای فهمیدن اپ است.
- `docs-for-ai/` برای این است که AI بداند **feature در کدام screen/layer/state جریان دارد و تغییر آن چه وابستگی‌هایی دارد**.
- `docs-personal/` برای چیزهایی است که نباید داخل ریپو عمومی یا تیمی باشند.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای تغییر screen لازم دارد navigation summary، permission rule یا local-data rule را ببیند، باید همان اطلاعات در `docs-for-ai/` هم وجود داشته باشد.
- اگر انسان برای onboarding لازم دارد flow کلی screenها را یکجا ببیند، می‌توان خلاصه‌ی آن را در فایل‌های سطح بالا تکرار کرد.
- چیزی که ممنوع است تکرار متناقض است، نه تکرار هدفمند.

---

## سطح‌بندی پروژه‌های mobile

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `mobile-lite` | اپ کوچک | چند screen، auth ساده، API کم |
| `mobile-standard` | اپ معمولی | auth، onboarding، API، local storage، notification |
| `mobile-complex` | اپ پیچیده | چند flow، background sync، offline mode، flavor، analytics، multi-role |

### قانون استفاده
- در `mobile-lite` فایل‌های پایه + screens + navigation کافی‌اند
- در `mobile-standard` فایل‌های state، permissions، release و API معمولاً لازم‌اند
- در `mobile-complex` بدون مستندسازی offline behavior، sync، flavor، analytics، deep link و background work پروژه مبهم می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید کمک کند یک نفر بفهمد:
- این اپ چیست
- چه screenها و flowهایی دارد
- کاربر از کجا وارد می‌شود و به کجا می‌رسد
- state و data از کجا می‌آیند
- چه permissionهایی لازم است
- چطور build/test/release می‌شود

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف محصول موبایل | مسئله، کاربران، use case، ارزش محصول، محدوده | route/class list، code detail |
| `design.md` | معماری کلی اپ | لایه‌ها، screen flow کلی، data flow، state overview، integrationها | جزییات همه screenها |
| `tasks.md` | برنامه کارها | backlog، milestone، release task، bugfix list | تحلیل معماری |
| `how-to-use.md` | منوی اجرای سریع | run، build، test، emulator، release commandها | روایت طولانی محصول |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر + توضیح یک‌خطی | تحلیل UI/UX |

### فایل‌های شرطی مهم برای mobile

| نام فایل | کی لازم است |
|----------|-------------|
| `screens.md` | تقریباً همیشه |
| `navigation.md` | تقریباً همیشه |
| `api.md` | وقتی اپ با backend حرف می‌زند |
| `state-management.md` | وقتی ViewModel/StateFlow/MVI/MVVM/Redux-like pattern مهم است |
| `local-storage.md` | وقتی Room/DataStore/cache/file storage داری |
| `permissions.md` | وقتی camera/location/bluetooth/storage/notification و ... داری |
| `auth.md` | وقتی login/session/token داری |
| `onboarding.md` | وقتی setup اولیه و activation مهم است |
| `notifications.md` | وقتی push/local notification داری |
| `offline-and-sync.md` | وقتی offline mode یا sync behavior داری |
| `deep-links.md` | وقتی deep link/app link/support URL داری |
| `background-work.md` | وقتی WorkManager/service/background task داری |
| `release.md` | وقتی build/release/store distribution مهم است |
| `flavors-and-environments.md` | وقتی dev/staging/prod flavor داری |
| `analytics-and-events.md` | وقتی event tracking مهم است |
| `ui-behavior.md` | وقتی رفتار UI باید بدون کد شرح داده شود |
| `user-experience.md` | وقتی UX محصول مهم است |
| `look-and-feel.md` | وقتی design system/brand consistency مهم است |
| `security.md` | وقتی token، local secret، certificate pinning، secure storage مهم است |
| `testing.md` | وقتی UI test/unit/integration مهم است |
| `troubleshooting.md` | وقتی setup/build/runtime issue زیاد است |
| `architecture-and-structure.md` | از `mobile-standard` به بالا — `write-docs-friendly/how-to-write-architecture-and-structure.md` |

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
- این اپ چیست؟
- برای چه کسی ساخته شده؟
- چه مشکلی را حل می‌کند؟
- use case اصلی چیست؟
- محدوده نسخه فعلی چیست؟

داخلش بنویس:
- کاربر هدف
- مشکل
- ارزش محصول
- featureهای سطح بالا
- محدودیت‌ها
- success criteria

داخلش ننویس:
- activity/fragment list
- navigation detail
- API contract detail
- commandها و configهای build

### `design.md`
هسته‌ی معماری انسانی اپ است.

داخلش بنویس:
- معماری کلی
- screen layer + domain + data layer
- navigation overview
- state strategy
- API/local storage overview
- permission overview
- background work overview
- release shape
- integrationها

داخلش ننویس:
- detail تمام screenها
- تمام routeها و destinationها
- تمام DTOها و modelها
- command reference

### `screens.md`
برای هر screen بگو:
- نام
- هدف
- ورودی/خروجی
- stateهای مهم
- actionهای کاربر
- error/loading/empty state
- وابستگی به auth/permission/plan اگر دارد

### `navigation.md`
این فایل خیلی مهم است.

داخلش باشد:
- start destination
- auth gate
- flowهای اصلی
- back behavior
- deep link entryها
- bottom nav/tab rule
- modal/dialog screen rule
- navigation between major sections

### `state-management.md`
داخلش باشد:
- معماری state
- source of truth
- ViewModel responsibility
- UI state shape
- event/effect rule
- one-shot event handling
- loading/error strategy
- data refresh rule

### `permissions.md`
داخلش باشد:
- permissionهای مورد نیاز
- چرا لازم‌اند
- چه زمانی request می‌شوند
- اگر deny شوند چه می‌شود
- degraded mode چیست
- foreground/background permission تفاوت‌ها

### `local-storage.md`
برای هر storage بگو:
- چه داده‌ای ذخیره می‌شود
- چرا local است
- cache vs persistent data
- invalidation rule
- encryption need
- migration rule

### `offline-and-sync.md`
وقتی sync مهم است:
- offline behavior
- queueing/retry
- conflict rule
- stale data handling
- last sync rule
- manual refresh behavior

### `background-work.md`
داخلش باشد:
- background taskها
- triggerها
- constraints
- retry
- battery/network concern
- foreground service need or not

### `release.md`
برای موبایل حیاتی است.
داخلش باشد:
- debug/release build
- signing rule
- versionCode/versionName policy
- store/internal distribution
- release checklist
- rollback/hotfix strategy
- mapping/proguard note اگر هست

### `flavors-and-environments.md`
داخلش باشد:
- flavorها
- env base URLها
- feature flag difference
- signing/app id difference
- debug tools visibility
- production safety rule

### `analytics-and-events.md`
داخلش باشد:
- event naming
- funnelهای مهم
- screen tracking rule
- sensitive data policy
- duplicate event avoidance

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند:
- feature جدید را در screen و layer درست بسازد
- navigation و state را نشکند
- permission و background behavior را فراموش نکند
- API/local cache/UI state consistency را حفظ کند
- build flavor و release constraint را رعایت کند

### اصل مهم
در mobile، AI با context ناقص معمولاً این خطاها را می‌دهد:
- UI را می‌سازد ولی ViewModel/state را هماهنگ نمی‌کند
- navigation را عوض می‌کند ولی back behavior را نمی‌بیند
- permission flow را جا می‌اندازد
- local cache یا offline behavior را نادیده می‌گیرد
- event tracking یا analytics را فراموش می‌کند
- flavor یا env-specific behavior را خراب می‌کند
پس این پوشه باید دقیق و کاربردی باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | snapshot سریع و کامل پروژه برای AI |
| `map.md` | نقشه فایل‌ها، featureها، screenها و layerها |
| `platform.md` | stack، SDK، envها، buildها، commandها |
| `ai-common-mistakes.md` | خطاهای تکراری و ruleهای مهم |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `screen-map.md` | تقریباً همیشه |
| `navigation-map.md` | تقریباً همیشه |
| `state-rules.md` | وقتی state pattern مهم است |
| `api-contracts.md` | وقتی backend integration داری |
| `local-data-rules.md` | وقتی Room/DataStore/cache مهم است |
| `auth-rules.md` | وقتی auth داری |
| `permission-rules.md` | وقتی runtime permission داری |
| `sync-rules.md` | وقتی offline/sync مهم است |
| `background-task-rules.md` | وقتی WorkManager/background process داری |
| `release-rules.md` | وقتی flavor/release/signing مهم است |
| `event-tracking-rules.md` | وقتی analytics مهم است |
| `ui-rules.md` | وقتی Compose/XML component pattern مهم است |
| `testing-rules.md` | وقتی UI/unit/integration test مهم است |
| `integration-contracts.md` | وقتی SDK یا سرویس بیرونی داری |
| `researches.md` | وقتی تصمیم‌های مهم بر پایه بررسی فنی بوده‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot سریع برای AI:
- اپ چیست
- چه screenهایی دارد
- navigation structure چیست
- state pattern چیست
- auth دارد یا نه
- offline/cache دارد یا نه
- permissionهای حساس کدام‌اند
- build flavorها چیست
- entry pointهای اصلی کجاست

این فایل می‌تواند خلاصه‌ی `proposal.md`، `design.md` و `screens.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید سریع بفهمد:
- app moduleها کجا هستند
- screenها کجا هستند
- viewmodelها کجا هستند
- navigation graph کجاست
- repository/data sourceها کجا هستند
- room/datastore کجاست
- network layer کجاست
- ui componentهای shared کجا هستند
- testها کجا هستند

### `screen-map.md`
برای هر screen:
- path/package
- purpose
- ViewModel
- state object
- related route/destination
- API/local dependency
- permission dependency
- analytics event need
- auth gate

### `navigation-map.md`
داخلش باشد:
- graph structure
- start destination
- protected destinationها
- deep link destinationها
- bottom nav group
- modal/fullscreen rule
- back stack expectation
- cross-feature navigation rule

### `state-rules.md`
خیلی مهم است.
داخلش باشد:
- state holder rule
- immutable state rule
- event/effect handling
- loading/error/empty state convention
- refresh trigger rule
- UI should not own business logic
- one source of truth rule

### `permission-rules.md`
داخلش باشد:
- permission name
- where requested
- when requested
- fallback behavior
- “never ask again” handling
- background permission caution
- no hidden permission request rule

### `local-data-rules.md`
داخلش باشد:
- cache location
- persistence boundary
- source of truth
- invalidation rule
- schema migration rule
- secure storage rule
- stale data fallback

### `sync-rules.md`
اگر sync داری:
- sync trigger
- retry rule
- conflict resolution
- optimistic update rule
- offline queue rule
- manual resync behavior

### `background-task-rules.md`
داخلش باشد:
- task names
- triggers
- constraints
- retry/backoff
- battery/network sensitivity
- foreground service rule
- user-visible behavior

### `release-rules.md`
خیلی مهم است.
داخلش باشد:
- flavor names
- package/applicationId difference
- signing boundary
- release-only rule
- production API safety
- obfuscation/shrinking note
- crash/reporting rule

### `ui-rules.md`
برای AI مهم است:
- Compose/XML pattern
- screen composition
- reusable component boundary
- form pattern
- list/search/filter pattern
- loading/error/empty state components
- theme/style usage

### `auth-rules.md`
داخلش باشد:
- auth flow
- token storage rule
- session expiry behavior
- logout cleanup
- protected screen rule
- guest mode rule اگر هست

### `event-tracking-rules.md`
داخلش باشد:
- screen view rule
- event naming
- critical funnel events
- avoid duplicate fire
- no sensitive payload rule

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: screen جدید را بدون ViewModel/state منسجم نساز
- اشتباه: navigation را بدون درنظر گرفتن back behavior تغییر نده
- اشتباه: permission لازم را فقط در manifest اضافه نکن؛ runtime flow را هم در نظر بگیر
- اشتباه: UI state و repository data را دو source of truth نساز
- اشتباه: event tracking را فراموش نکن
- اشتباه: release flavor را با debug config قاطی نکن
- اشتباه: token یا secret را plain داخل کد یا local storage ناامن نگذار
- اشتباه: offline/cache rule را برای featureهای data-driven نادیده نگیر
- اشتباه: loading و error state را حذف نکن

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | دستگاه‌های تست، keystore path، panelها، env noteها |
| `walkthrough.md` | گزارش جلسات — قالب: `write-docs-friendly/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `device-test-notes.md` | تفاوت رفتار روی deviceهای مختلف |
| `release-notes-local.md` | یادداشت‌های release و rollout شخصی |
| `secrets-and-signing.md` | فقط در صورت اجبار و فقط local |
| `store-notes.md` | نکات Play Console/internal testing |
| `crash-notes.md` | crashها و observationهای مهم |
| `ux-observations.md` | بازخوردهای دستی و مشاهدات UX |

### قانون امنیتی
- keystore، token، signing secret و credential نباید داخل repo عمومی بمانند
- `docs-personal/` باید فقط context محلی و شخصی بدهد، نه اینکه کمبود docs اصلی را جبران کند
- repo باید بدون این پوشه هم قابل فهم و maintain باشد

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `mobile-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/screens.md`
- `docs/navigation.md`
- `docs/api.md` (اگر backend دارد)
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/screen-map.md`
- `docs-for-ai/navigation-map.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `mobile-standard`
فایل‌های پیشنهادی:
- همه موارد `mobile-lite`
- `docs/state-management.md`
- `docs/local-storage.md`
- `docs/permissions.md`
- `docs/auth.md`
- `docs/onboarding.md`
- `docs/notifications.md`
- `docs/release.md`
- `docs/flavors-and-environments.md`
- `docs/testing.md`
- `docs/troubleshooting.md`
- `docs/ui-behavior.md`
- `docs/user-experience.md`
- `docs/security.md`
- `docs-for-ai/state-rules.md`
- `docs-for-ai/api-contracts.md`
- `docs-for-ai/local-data-rules.md`
- `docs-for-ai/auth-rules.md`
- `docs-for-ai/permission-rules.md`
- `docs-for-ai/release-rules.md`
- `docs-for-ai/ui-rules.md`
- `docs-for-ai/testing-rules.md`

### برای `mobile-complex`
فایل‌های پیشنهادی:
- همه موارد `mobile-standard`
- `docs/offline-and-sync.md`
- `docs/background-work.md`
- `docs/deep-links.md`
- `docs/analytics-and-events.md`
- `docs/look-and-feel.md`
- `docs-for-ai/sync-rules.md`
- `docs-for-ai/background-task-rules.md`
- `docs-for-ai/event-tracking-rules.md`
- `docs-for-ai/integration-contracts.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن consistency بین UI، state، permission و data flow را از دست می‌دهد
- onboarding انسان نیاز دارد screen flow یا build/release summary را یکجا ببیند
- نسخه انسانی و نسخه AI از navigation، auth، local data و release باید با جزئیات متفاوت وجود داشته باشند
- برای جلوگیری از خطا، summaryهای حساس مثل permission و flavor در چند فایل مرجع دیده شوند

### تکرار غیرمجاز است اگر:
- دو منبع متناقض برای navigation، permission یا flavor rule بسازی
- همان توضیح screen را بی‌دلیل در چند فایل برابر تکرار کنی
- source of truth برای state behavior مبهم شود

### الگوی درست
- `docs/screens.md` → توضیح انسانی screenها
- `docs-for-ai/screen-map.md` → خلاصه عملی برای محل تغییر
- `docs/navigation.md` → فهم انسانی flow
- `docs-for-ai/navigation-map.md` → ruleهای دقیق destination و back stack
- `docs/release.md` → توضیح انسانی release
- `docs-for-ai/release-rules.md` → ruleهای enforceable برای build/release

---

## دستور `/sync-docs-mobile`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- screen جدید
- navigation change
- state pattern change
- permission change
- API contract change
- local storage/schema change
- offline/sync rule change
- background task change
- flavor/env change
- release process change
- event tracking change

### کارهایی که `/sync-docs-mobile` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف محصول هماهنگ است
2. چک کند `design.md` هنوز معماری واقعی را درست توضیح می‌دهد
3. `project-file-index.md` را با ساختار واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر screen یا navigation عوض شده، `screens.md`، `navigation.md`، `screen-map.md` و `navigation-map.md` را sync یا علامت بزند
6. اگر state یا data flow عوض شده، `state-management.md` و `state-rules.md` را به‌روز کند
7. اگر permission یا auth عوض شده، فایل‌های مربوطه را sync کند
8. اگر storage/sync/background work عوض شده، فایل‌های مرتبط را sync یا هشدار دهد
9. اگر flavor/release/env عوض شده، `platform.md`، `flavors-and-environments.md` و `release-rules.md` را به‌روز کند
10. اگر analytics یا notification عوض شده، فایل‌های مربوط را علامت بزند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد UX flow، product rule یا permission logic جدید اختراع کند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه Android / mobile

- [ ] سطح پروژه مشخص شده: `mobile-lite` یا `mobile-standard` یا `mobile-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `screens.md` ساخته شده
- [ ] `navigation.md` ساخته شده
- [ ] اگر API وجود دارد، `api.md` یا `api-contracts.md` ساخته شده
- [ ] اگر permission وجود دارد، `permissions.md` و `permission-rules.md` ساخته شده
- [ ] اگر auth وجود دارد، `auth.md` و `auth-rules.md` ساخته شده
- [ ] اگر release واقعی داری، `release.md` و `flavors-and-environments.md` ساخته شده
- [ ] اگر offline/background work داری، فایل‌های مربوطه ساخته شده
- [ ] command یا rule مربوط به `/sync-docs-mobile` تعریف شده

---

## قانون نهایی

- truth نهایی، رفتار واقعی اپ، build واقعی و screen flow واقعی است
- داکیومنت باید به screenها، stateها، permissionها، release ruleها و integrationهای واقعی برسد
- AI نباید برای فهمیدن navigation، ViewModel، permission flow و flavor behavior کل repo را حدس بزند
- انسان نباید برای فهم اپ مجبور شود فقط از روی activityها، composableها، manifest و gradle fileها نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن