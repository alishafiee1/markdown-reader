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


# استاندارد مستندسازی پروژه‌های وب
> این نسخه مخصوص پروژه‌های وب است:
> - سایت شرکتی
> - لندینگ پیج
> - پنل ادمین
> - وب‌اپ
> - SaaS
> - فرانت‌اند متصل به API
> - فول‌استک وب

هدف این استاندارد:
- مستندات پروژه وب از روز اول شکل ثابت داشته باشند
- مرز فایل‌ها مشخص باشد
- اطلاعات لازم برای انسان و AI هر دو کامل باشد
- تکرار لازم و هدفمند مجاز باشد
- برای پروژه کوچک و بزرگ هر دو قابل استفاده باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | ساده، روشن، توضیحی | فهم محصول، ساختار، روند کار |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | فشرده، دقیق، bullet، جدول | دادن کانتکست کافی برای تولید/اصلاح کد |
| `docs-personal/` | فقط خودم | ❌ نه | عملیاتی، شخصی، حساس | یادداشت‌های اجرایی، دسترسی، وضعیت لحظه‌ای |

### قانون مهم
- `docs/` برای فهمیدن پروژه است.
- `docs-for-ai/` برای کار کردن سریع و درست AI روی پروژه است.
- `docs-personal/` برای اطلاعات شخصی، حساس و موقتی است.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر یک اطلاعات برای کار AI لازم است، باید داخل `docs-for-ai/` هم بیاید حتی اگر نسخه‌ی توضیحی آن در `docs/` وجود داشته باشد.
- اگر یک اطلاعات برای فهم سریع انسان لازم است، می‌تواند خلاصه‌اش در `docs/` تکرار شود حتی اگر نسخه‌ی دقیق‌ترش در فایل دیگری باشد.
- چیزی که ممنوع است، **تکرار بی‌هدف و متناقض** است؛ نه تکرار مفید.

---

## سطح‌بندی پروژه وب

قبل از ساخت مستندات، نوع پروژه را مشخص کن:

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `web-lite` | پروژه وب کوچک | لندینگ، سایت ساده، صفحه معرفی، ابزار تک‌صفحه‌ای |
| `web-standard` | پروژه معمول وب | پنل ادمین، داشبورد، وب‌اپ معمولی، فرانت‌اند + API |
| `web-complex` | پروژه وب بزرگ | SaaS چندماژوله، چند پنل، چند نقش کاربری، چند سرویس |

### قانون استفاده
- در `web-lite` فقط فایل‌های اجباری را کامل نگه دار.
- در `web-standard` بیشتر فایل‌های شرطی فعال می‌شوند.
- در `web-complex` تقریباً همه فایل‌های معماری، عملیات، API، UX و deployment لازم‌اند.

---

## پوشه `docs/` – برای انسان

همه فایل‌های این پوشه باید برای خواننده انسانی قابل فهم باشند.
زبان باید روشن، مستقیم و بدون شلوغی غیرضروری باشد.
نوشتن کد طولانی داخل این پوشه ممنوع است، مگر در حد snippet کوتاه.

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف مسئله و هدف پروژه | مسئله، مخاطب، ارزش، خروجی اصلی، محدوده پروژه | جزئیات معماری، لیست فایل‌ها، کد |
| `design.md` | نقشه فنی برای انسان | معماری کلی، ماژول‌ها، flow داده، envهای مهم، سرویس‌ها، مسیرهای کلیدی | جزئیات ریز همه فایل‌ها، کپی کامل API |
| `tasks.md` | مدیریت کارها | backlog، فازها، TODO، done، تست دستی، checklist release | توضیح معماری |
| `how-to-use.md` | راهنمای استفاده و اجرای سریع | نصب، run، build، test، deploy، commandهای اصلی | توضیح عمیق طراحی داخلی |
| `project-file-index.md` | نقشه فایل‌ها برای خواندن سریع | مسیر فایل/پوشه + توضیح یک‌خطی | تحلیل معماری یا منطق بیزینس |

### فایل‌های شرطی مهم برای وب

| نام فایل | کی لازم است |
|----------|-------------|
| `api.md` | وقتی پروژه با API سر و کار دارد، چه بک‌اند خودش باشد چه سرویس خارجی |
| `setup-step-by-step.md` | وقتی راه‌اندازی برای نفر جدید ساده نیست |
| `developer.md` | وقتی پروژه commandها و workflow توسعه زیادی دارد |
| `security.md` | وقتی auth، token، permission، payment، فایل خصوصی، webhook یا secret وجود دارد |
| `troubleshooting.md` | وقتی خطاهای تکراری و setup issue زیاد است |
| `ui-behavior.md` | وقتی UI مهم است و باید رفتار صفحه‌ها بدون کد توضیح داده شود |
| `user-experience.md` | وقتی UX و flow کاربر در موفقیت محصول مهم است |
| `look-and-feel.md` | وقتی هویت بصری، برند، typography و style guide مهم است |
| `deployment.md` | وقتی build/release/deploy/rollback مهم است |
| `testing.md` | وقتی تست دستی یا خودکار مهم است |
| `decision-log.md` | وقتی تصمیم‌های معماری زیاد و برگشت‌ناپذیر هستند |
| `roles-and-permissions.md` | وقتی چند نقش کاربری وجود دارد |
| `integrations.md` | وقتی پروژه به سرویس‌های بیرونی وصل است |
| `architecture-and-structure.md` | از `web-standard` به بالا — `00-start-new-project/how-to-write-architecture-and-structure.md` |

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
- این پروژه چیست؟
- برای چه کسی است؟
- چه مشکلی را حل می‌کند؟
- محدوده‌اش چیست و چیست نیست؟

داخلش بنویس:
- معرفی پروژه
- مشکل اصلی
- کاربران هدف
- قابلیت‌های سطح بالا
- محدودیت‌ها
- معیار موفقیت

داخلش ننویس:
- ساختار پوشه‌ها
- endpointهای کامل
- اسم تمام envها
- جزییات state management

### `design.md`
این فایل جواب می‌دهد:
- سیستم از چه بخش‌هایی ساخته شده؟
- داده از کجا می‌آید و کجا می‌رود؟
- هر لایه چه مسئولیتی دارد؟

داخلش بنویس:
- معماری کلی
- ساختار frontend/backend اگر هست
- routing
- state management
- data fetching strategy
- auth flow
- build/deploy overview
- envهای مهم در حد معرفی
- وابستگی‌های مهم

داخلش ننویس:
- لیست کامل همه فایل‌ها
- لیست کامل endpointها با مثال کامل
- تمام commandها
- متن روایی محصول

### `how-to-use.md`
این فایل فقط **راهنمای اجرای کار** است، نه طراحی.
باید بشود با باز کردن آن سریع فهمید:
- چطور نصب کنم
- چطور اجرا کنم
- چطور تست کنم
- چطور build بگیرم
- چطور deploy کنم
- commandهای روزمره چیست

اگر پروژه کوچک است، می‌تواند بخشی از `setup-step-by-step.md` و `developer.md` را خلاصه کند.
اگر پروژه بزرگ است، باید فقط نقش پیشخوان داشته باشد و به فایل‌های دیگر لینک بدهد.

### `setup-step-by-step.md`
فقط برای راه‌اندازی اولیه از صفر است.
از لحظه clone تا اولین run موفق.

داخلش باشد:
1. پیش‌نیازها
2. clone
3. install
4. env setup
5. database/init اگر هست
6. run
7. health check اولیه

داخلش نباشد:
- commandهای روزمره توسعه
- توضیح معماری
- deploy production

### `developer.md`
این فایل فقط برای کارهای روزمره توسعه‌دهنده است.
مثل:
- lint
- format
- test
- seed
- migrate
- build
- dev tools
- reset commands
- mock commands

### `ui-behavior.md`
این فایل برای توضیح **ظاهر و رفتار رابط کاربری بدون کد** است.

مثال موضوعات:
- صفحه login چه اجزایی دارد
- خطاها کجا نمایش داده می‌شوند
- search box چه رفتاری دارد
- modalها چطور باز و بسته می‌شوند
- tableها، filterها، pagination چه رفتاری دارند
- empty state و loading state چگونه دیده می‌شوند

### `user-experience.md`
این فایل درباره حس و flow کاربر است، نه ظاهر صرف.

مثال موضوعات:
- کاربر در onboarding کجا ممکن است گیج شود
- چطور اعتماد می‌گیریم
- لحن پیام‌های موفقیت/خطا چیست
- بار ذهنی هر صفحه چقدر است
- کجا friction لازم است و کجا باید حذف شود

### `look-and-feel.md`
این فایل فقط برای هویت بصری است.

مثال:
- رنگ‌ها
- فونت‌ها
- سایزها
- spacing
- border radius
- icon style
- tone visual
- dark/light mode rules

### `project-file-index.md`
این فایل فقط index است.
هر خط:
`مسیر ← مسئولیت خیلی کوتاه`

مثال:
`src/pages/login.tsx ← صفحه ورود`
`src/components/table/ ← کامپوننت‌های مربوط به جدول`
`src/lib/api.ts ← wrapper درخواست‌های API`

نباید تبدیل به فایل تحلیلی شود.

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بدون گشتن زیاد در کل پروژه بتواند:
- ساختار پروژه را بفهمد
- محل تغییر درست را پیدا کند
- اشتباهات رایج را تکرار نکند
- بدون توضیح اضافه کد مرتبط تولید کند

### اصل مهم
در این پوشه **خلاصه‌سازی مهم است، ولی ناقص‌گویی ممنوع است**.
اگر برای کدنویسی لازم است، اطلاعات تکراری را اینجا هم بیاور.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | خلاصه کامل پروژه برای AI |
| `map.md` | نقشه عملی فایل‌ها، ماژول‌ها و مسئولیت‌ها |
| `platform.md` | نیازمندی اجرا، env، سرویس‌ها، نسخه‌ها |
| `ai-common-mistakes.md` | اشتباهات تکراری و ruleهای مهم |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `frontend-rules.md` | وقتی patternهای ثابت UI/component/state وجود دارد |
| `api-contracts.md` | وقتی AI باید دقیق با API کار کند |
| `data-models.md` | وقتی مدل داده، schema یا DTO مهم است |
| `routing.md` | وقتی routing و navigation پیچیده است |
| `auth-flow.md` | وقتی login/session/token/role مهم است |
| `ui-map.md` | وقتی چند صفحه و رفتار UI زیاد است |
| `deployment-notes.md` | وقتی build/release/deploy ruleهای خاص دارد |
| `testing-rules.md` | وقتی AI باید تست بنویسد یا تست‌ها را نشکند |
| `prompts-and-commands.md` | وقتی Agent commandها یا workflow خاص پروژه وجود دارد |
| `researches.md` | وقتی تصمیم‌های مبتنی بر تحقیق و reference مهم‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
این فایل باید یک snapshot سریع و کامل بدهد:
- پروژه چیست
- stack چیست
- ساختار کلی چیست
- الان روی چه فازی هست
- مهم‌ترین ruleهای توسعه چیست
- entry pointهای اصلی کجاست

این فایل می‌تواند خلاصه‌ای از `proposal.md` و `design.md` را تکرار کند.
این تکرار **مجاز و لازم** است.

### `map.md`
این فایل برای پیدا کردن جای درست تغییر است.
بهتر است به‌صورت bullet یا جدول باشد.

مثال:
- `src/pages/*` → route-level pages
- `src/components/ui/*` → componentهای reusable
- `src/features/billing/*` → منطق billing
- `src/lib/api.ts` → api client base
- `src/store/*` → global state

### `platform.md`
این فایل برای اجرای فنی پروژه است:
- node / bun / pnpm / npm version
- framework version
- env names
- external services
- ports
- build output
- deploy target
- required secrets names فقط در حد نام، نه مقدار

### `ai-common-mistakes.md`
هر rule تکراری را صریح بنویس.

مثال:
- اشتباه: کامپوننت‌های shared را مستقیم داخل page تعریف نکن → درست: داخل `src/components/`
- اشتباه: endpointها را hardcode نکن → درست: از `src/lib/api.ts` استفاده کن
- اشتباه: state صفحه را در global store نریز مگر لازم باشد
- اشتباه: style جدید خارج از design token نساز

### `frontend-rules.md`
برای پروژه‌های وب خیلی مهم است.
داخلش می‌تواند باشد:
- naming rules
- component split rule
- state management rule
- form handling rule
- validation rule
- styling rule
- folder convention
- data fetching rule
- error handling rule
- responsive rule

### `api-contracts.md`
این فایل با `docs/api.md` فرق دارد.

- `docs/api.md` برای فهم انسان است
- `docs-for-ai/api-contracts.md` برای کار دقیق AI است

اینجا باید باشد:
- base URL pattern
- auth header rule
- endpoint list
- request shape
- response shape
- error shape
- retry/caching note
- pagination/filter/sort rule

### `ui-map.md`
برای AI خیلی مفید است.
بگو هر صفحه:
- از چه routeی باز می‌شود
- از چه componentهایی تشکیل شده
- چه stateهایی دارد
- چه eventهایی مهم است
- به کدام endpointها وصل است

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | اطلاعات محیط فعلی، دامنه، سرور، آدرس‌ها، پنل‌ها |
| `walkthrough.md` | گزارش جلسات — قالب: `00-start-new-project/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `pending-decisions.md` | تصمیم‌های باز و unresolved |
| `release-notes-local.md` | یادداشت‌های release شخصی |
| `contacts.md` | دسترسی‌ها یا اشخاص مرتبط اگر لازم باشد |

### قانون امنیتی
- نگهداری secret واقعی در فایل متنی تا جای ممکن انجام نشود.
- به‌جای `secrets.env` بهتر است از password manager یا secret manager استفاده شود.
- اگر مجبور شدی فایل محلی داشته باشی، باید کاملاً local بماند و واضح علامت‌گذاری شود.

---

## فایل‌های پیشنهادی بر اساس نوع پروژه وب

### برای `web-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/ui-behavior.md` (اگر UI مهم است)
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `web-standard`
فایل‌های پیشنهادی:
- همه موارد `web-lite`
- `docs/api.md`
- `docs/setup-step-by-step.md`
- `docs/developer.md`
- `docs/security.md`
- `docs/troubleshooting.md`
- `docs/testing.md`
- `docs/deployment.md`
- `docs-for-ai/frontend-rules.md`
- `docs-for-ai/api-contracts.md`
- `docs-for-ai/ui-map.md`
- `docs-for-ai/testing-rules.md`

### برای `web-complex`
فایل‌های پیشنهادی:
- همه موارد `web-standard`
- `docs/user-experience.md`
- `docs/look-and-feel.md`
- `docs/roles-and-permissions.md`
- `docs/integrations.md`
- `docs/decision-log.md`
- `docs-for-ai/auth-flow.md`
- `docs-for-ai/data-models.md`
- `docs-for-ai/routing.md`
- `docs-for-ai/deployment-notes.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- برای AI لازم است بدون مراجعه به ۵ فایل دیگر تصمیم بگیرد
- برای onboarding انسان لازم است سریع پروژه را بفهمد
- خلاصه‌ای از یک فایل طولانی در فایل مرجع دیگری لازم است
- نسخه انسانی و نسخه AI از یک موضوع باید با لحن متفاوت نوشته شوند

### تکرار غیرمجاز است اگر:
- فقط همان متن را بی‌دلیل کپی کرده‌ای
- بعداً باعث دو منبع متناقض می‌شود
- مسئولیت فایل‌ها را مخدوش می‌کند

### الگوی درست
- `docs/design.md` → توضیح انسانی معماری
- `docs-for-ai/project.md` → خلاصه عملی همان معماری برای AI
- `docs/api.md` → توضیح مفهومی API برای انسان
- `docs-for-ai/api-contracts.md` → قرارداد دقیق برای AI

---

## دستور `/sync-docs-web`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- فایل/پوشه جدید
- route جدید
- endpoint جدید
- env جدید
- تغییر در auth
- تغییر در ساختار UI
- تغییر در build/deploy

### کارهایی که `/sync-docs-web` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف فعلی پروژه هماهنگ است
2. چک کند `design.md` هنوز معماری واقعی را درست توضیح می‌دهد
3. `project-file-index.md` را با فایل‌های واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. `docs-for-ai/map.md` را به‌روز کند
6. اگر route جدید اضافه شده، `docs-for-ai/ui-map.md` یا `routing.md` را هشدار دهد/به‌روز کند
7. اگر endpoint یا schema عوض شده، `docs/api.md` و `docs-for-ai/api-contracts.md` را علامت بزند
8. اگر env جدید اضافه شده، `docs-for-ai/platform.md` و `docs/design.md` را به‌روز کند
9. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
10. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند
11. فایل‌های stale را گزارش کند، نه بازنویسی کورکورانه

### قانون
این دستور حق تصمیم‌گیری محصولی یا معماری ندارد.
فقط sync، هشدار و update کم‌خطر انجام می‌دهد.

---

## چک‌لیست شروع پروژه وب

- [ ] نوع پروژه مشخص شده: `web-lite` یا `web-standard` یا `web-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] اگر UI مهم است، `ui-behavior.md` ساخته شده
- [ ] اگر API وجود دارد، `api.md` و `api-contracts.md` ساخته شده
- [ ] اگر auth وجود دارد، `security.md` و `auth-flow.md` ساخته شده
- [ ] اگر deploy واقعی وجود دارد، `deployment.md` و `deployment-notes.md` ساخته شده
- [ ] `README.md` به `docs/how-to-use.md` لینک می‌دهد
- [ ] rule یا command مربوط به `/sync-docs-web` تعریف شده

---

## قانون نهایی

- کد حقیقت نهایی است
- داکیومنت باید به کد برسد
- AI نباید برای فهمیدن ساختار پروژه مجبور شود کل ریپو را بگردد
- انسان نباید برای فهم کار پروژه مجبور شود از روی کد حدس بزند
- هر فایل باید فقط یک نقش اصلی داشته باشد
- تکرار لازم را حذف نکن، تناقض را حذف کن