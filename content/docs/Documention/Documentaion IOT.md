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


# استاندارد مستندسازی پروژه‌های IoT / firmware / ESP32

> این نسخه مخصوص پروژه‌های زیر است:
> - ESP32 / ESP8266
> - STM32 / AVR / RP2040 / Arduino-class
> - firmware سنسور/اکچویتور
> - دستگاه IoT متصل به Wi-Fi / BLE / MQTT / HTTP
> - gateway/device firmware
> - محصول‌های embedded که هم hardware دارند هم software

هدف این استاندارد:
- مستندات firmware و hardware از هم نپاشند
- مرز بین «رفتار دستگاه»، «مدار»، «پروتکل» و «کد» روشن باشد
- AI برای اصلاح کد، pinها، taskها و flowها کانتکست کافی داشته باشد
- اطلاعات حیاتی مثل wiring، boot mode، flashing، partition و power behavior گم نشوند
- تکرار لازم برای AI و عملیات واقعی مجاز باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، توضیحی، قابل فهم | فهم محصول، مدار، رفتار سیستم، روند توسعه |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | دقیق، فشرده، عملیاتی | کمک به تولید/اصلاح کد firmware بدون حدس |
| `docs-personal/` | فقط خودم | ❌ نه | اجرایی، شخصی، حساس | یادداشت‌های bench، دسترسی‌ها، وضعیت سخت‌افزار واقعی |

### قانون مهم
- `docs/` برای فهمیدن سیستم است.
- `docs-for-ai/` برای این است که AI بداند **کجا تغییر دهد و کجا دست نزند**.
- `docs-personal/` برای چیزهایی است که نباید داخل ریپو عمومی بمانند.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای نوشتن firmware لازم دارد pin map یا protocol summary را ببیند، باید همان اطلاعات به‌صورت خلاصه در `docs-for-ai/` هم وجود داشته باشد.
- اگر انسان برای راه‌اندازی برد لازم دارد wiring summary را سریع ببیند، می‌شود خلاصه‌ی آن در `how-to-use.md` یا `setup-step-by-step.md` تکرار شود.
- چیز بد، تکرار متناقض است؛ نه تکرار مفید.

---

## سطح‌بندی پروژه‌های IoT / firmware

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `fw-lite` | firmware ساده | یک سنسور، یک relay، یک board، منطق کم |
| `fw-standard` | firmware معمولی | ESP32 با Wi-Fi، API/MQTT، چند task، provisioning |
| `fw-complex` | firmware/IoT پیچیده | چند ماژول، OTA، BLE + Wi-Fi، cloud sync، low power، چند board revision |

### قانون استفاده
- در `fw-lite` فایل‌های پایه کافی‌اند
- در `fw-standard` فایل‌های wiring، protocol، flashing و testing تقریباً لازم‌اند
- در `fw-complex` بدون documentation دقیق برای power، state machine، partitions، OTA، calibration و hardware revision پروژه خیلی زود آشفته می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید به یک توسعه‌دهنده یا هم‌تیمی کمک کند بفهمد:
- دستگاه چیست
- چه کاری می‌کند
- از چه قطعاتی تشکیل شده
- روی چه برد و سنسورهایی کار می‌کند
- چطور build/flash/test می‌شود
- رفتار runtime آن چیست

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف مسئله و هدف دستگاه | کاربرد، سناریوی استفاده، ارزش محصول، محدوده | pin list کامل، کد، جزییات task scheduler |
| `design.md` | معماری سیستم | معماری firmware، ماژول‌ها، flow داده، stateهای اصلی، ارتباط با cloud/app | لیست کامل همه فایل‌ها یا register-level detail مگر لازم |
| `tasks.md` | مدیریت کارها | backlog، milestone، تست bench، تست field، کارهای باز | توضیح عمیق معماری |
| `how-to-use.md` | منوی اجرای سریع | build، flash، monitor، reset، test commandها | توضیح تحلیلی طولانی |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر + توضیح یک‌خطی | تفسیر معماری |

### فایل‌های شرطی مهم برای firmware

| نام فایل | کی لازم است |
|----------|-------------|
| `hardware-overview.md` | وقتی برد، سنسور، تغذیه و سیم‌کشی مهم است |
| `pin-map.md` | تقریباً در همه پروژه‌های واقعی embedded |
| `protocols.md` | وقتی UART / I2C / SPI / BLE / Wi-Fi / MQTT / HTTP / Modbus و ... وجود دارد |
| `flashing-and-recovery.md` | وقتی build/flash/partition/recovery مهم است |
| `power-behavior.md` | وقتی sleep، battery، brownout، wakeup یا power budget مهم است |
| `provisioning.md` | وقتی دستگاه نیاز به setup اولیه، Wi-Fi onboarding، pairing یا token injection دارد |
| `calibration.md` | وقتی sensor calibration، offset، gain یا factory calibration وجود دارد |
| `security.md` | وقتی secret، certificate، OTA، secure boot، token یا encrypted storage وجود دارد |
| `troubleshooting.md` | وقتی خطاهای رایج field یا bench زیاد است |
| `testing.md` | وقتی تست bench، تست integration یا تست hardware-in-loop مهم است |
| `deployment.md` | وقتی release/OTA/نسخه‌بندی device مهم است |
| `board-revisions.md` | وقتی چند revision سخت‌افزاری وجود دارد |
| `cloud-integration.md` | وقتی firmware به server/cloud/app متصل است |
| `manufacturing-notes.md` | وقتی پروژه از prototype به production نزدیک می‌شود |
| `architecture-and-structure.md` | از `fw-standard` به بالا — `write-docs-friendly/how-to-write-architecture-and-structure.md` |

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
- این دستگاه چیست؟
- چه مشکلی را حل می‌کند؟
- کاربر یا محیط استفاده‌اش چیست؟
- مرز پروژه کجاست؟

داخلش بنویس:
- هدف محصول
- سناریوی استفاده
- ورودی/خروجی در سطح بالا
- محدودیت‌های مهم
- فرضیات اصلی
- تعریف done در سطح محصول

داخلش ننویس:
- pin assignment کامل
- نام تمام topicها یا endpointها
- جزییات RTOS taskها
- wiring table مفصل

### `design.md`
این فایل هسته‌ی فنی برای انسان است.

داخلش بنویس:
- معماری firmware
- ماژول‌ها و مسئولیت هر کدام
- loop/task/event model
- state machine سطح بالا
- مسیر داده از sensor تا actuator یا cloud
- storage strategy
- error handling کلی
- ارتباط firmware با app/backend اگر وجود دارد

داخلش ننویس:
- لیست کامل pinها، مگر به‌صورت اشاره
- command reference کامل
- جدول کالیبراسیون خام
- لاگ bench

### `hardware-overview.md`
برای توضیح سخت‌افزار واقعی دستگاه است.

داخلش باشد:
- board اصلی
- MCU
- سنسورها
- اکچویتورها
- رگولاتورها
- منبع تغذیه
- ارتباط بین ماژول‌ها
- نکات مهم wiring
- محدودیت‌های سخت‌افزار

این فایل **جای شماتیک** نیست، بلکه توضیح انسانی شماتیک است.

### `pin-map.md`
این فایل باید خیلی واضح و بدون ابهام باشد.

حداقل شامل:
- GPIO
- نقش هر GPIO
- جهت (input/output/open-drain/ADC/etc)
- active level
- pull-up/pull-down نیاز دارد یا نه
- reserved pinها
- pinهای boot-sensitive
- pinهای ممنوع یا پرریسک

### `protocols.md`
برای تمام پروتکل‌ها و قراردادهای ارتباطی است.

مثال:
- I2C busها
- UART baud rate
- BLE service summary
- Wi-Fi mode
- MQTT topic structure
- HTTP endpoint usage
- framing rule
- retry/timeout behavior
- checksum/CRC rule اگر هست

### `flashing-and-recovery.md`
باید روشن کند:
- چطور build بگیری
- چطور flash کنی
- چطور monitor بگیری
- چطور full erase بزنی
- چطور recover کنی
- partition table چیست
- boot modeها کدام‌اند
- اگر device brick شد چه کار کنیم

### `power-behavior.md`
برای embedded خیلی مهم است.
داخلش باشد:
- منبع تغذیه دستگاه
- رنج ولتاژ کاری
- average/current peak اگر می‌دانی
- boot current concern
- sleep modeها
- wakeup sourceها
- brownout behavior
- safe shutdown/restart
- power sequence

### `provisioning.md`
وقتی دستگاه باید به محیط جدید وصل شود.

داخلش باشد:
- اولین boot چه می‌کند
- credentialها چطور وارد می‌شوند
- BLE pairing / AP mode / captive portal / serial provisioning
- device identity چطور تعیین می‌شود
- token/cert چطور inject می‌شود
- اگر provisioning fail شد رفتار دستگاه چیست

### `calibration.md`
هر چیزی که روی دقت محصول اثر می‌گذارد:
- چه چیزهایی calibration می‌شوند
- calibration چه زمانی انجام می‌شود
- مقادیر کجا ذخیره می‌شوند
- factory default چیست
- reset calibration چه می‌کند
- tolerances تقریبی

### `board-revisions.md`
برای پروژه‌هایی با چند نسخه‌ی برد.
داخلش باشد:
- rev A / rev B / rev C
- تفاوت pinها
- تفاوت قطعات
- تفاوت firmware requirement
- compatibility note

### `testing.md`
باید واضح کند:
- smoke test bench
- test before flash
- test after flash
- sensor validation
- connectivity validation
- long-run test
- failure injection اگر داری
- acceptance criteria

### `deployment.md`
در firmware یعنی release discipline.
داخلش باشد:
- versioning scheme
- release build rule
- OTA strategy
- rollback rule
- supported hardware versions
- upgrade path
- release checklist

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند بدون حدس:
- فایل درست را برای تغییر پیدا کند
- GPIOها و محدودیت‌های برد را خراب نکند
- اشتباهات رایج embedded را تکرار نکند
- protocol و state machine را درست بفهمد
- build/flash/test را درست انجام دهد

### اصل مهم
در پروژه firmware، **ناقص بودن context برای AI خیلی خطرناک‌تر از پروژه وب است** چون ممکن است باعث pin conflict، race condition، boot failure، memory issue یا behavior اشتباه روی device واقعی شود.
پس این پوشه باید خلاصه، ولی کامل و عملیاتی باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | خلاصه کامل پروژه برای AI |
| `map.md` | نقشه فایل‌ها، ماژول‌ها، taskها و مسئولیت‌ها |
| `platform.md` | toolchain، board، framework، env، build target |
| `ai-common-mistakes.md` | اشتباهات رایج و ruleهای ممنوعه |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `pin-summary.md` | تقریباً همیشه |
| `task-map.md` | وقتی FreeRTOS/task/event loop مهم است |
| `protocol-map.md` | وقتی ارتباطات متعدد وجود دارد |
| `state-machine.md` | وقتی behavior دستگاه stateful است |
| `storage-layout.md` | وقتی NVS/EEPROM/flash partition مهم است |
| `memory-notes.md` | وقتی RAM/PSRAM/stack/heap محدودیت جدی دارد |
| `build-targets.md` | وقتی چند board یا build target وجود دارد |
| `ota-rules.md` | وقتی OTA وجود دارد |
| `security-notes.md` | وقتی secret/cert/secure boot/encryption مهم است |
| `test-rules.md` | وقتی AI باید تست بنویسد یا bench checklist را رعایت کند |
| `sensor-behavior.md` | وقتی چند sensor و conversion rule وجود دارد |
| `cloud-contracts.md` | وقتی firmware با cloud/server/app حرف می‌زند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot عملی پروژه برای AI:
- دستگاه چیست
- stack چیست
- framework چیست
- entry point کجاست
- مهم‌ترین ruleها چیست
- چه بخش‌هایی حساس‌اند
- الان چه فازی فعال است

این فایل می‌تواند خلاصه‌ی `proposal.md` و `design.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید خیلی سریع بفهمد:
- `src/main/...` یا `main/` چیست
- driverها کجا هستند
- communication layer کجاست
- sensor abstraction کجاست
- configها کجاست
- build fileها کجاست
- testها کجا هستند

مثال:
- `main/` → startup and app bootstrap
- `components/sensors/` → sensor drivers and wrappers
- `components/network/` → Wi-Fi/MQTT/HTTP logic
- `components/storage/` → NVS and config persistence
- `components/actuators/` → output control logic
- `partitions.csv` → flash partition layout

### `platform.md`
این فایل برای اجرای فنی firmware است:
- board name
- MCU
- framework (ESP-IDF / Arduino / PlatformIO)
- version
- toolchain
- flash size
- partition scheme
- monitor baud
- serial port pattern
- required env names
- build profiles
- sdkconfig location اگر هست

### `pin-summary.md`
خلاصه‌ی سریع pin ruleها برای AI.

مثال:
- GPIO21 → I2C SDA, do not reuse
- GPIO22 → I2C SCL, do not reuse
- GPIO0 → boot-sensitive, avoid for normal output
- GPIO34 → input only
- relay pin is active-low
- ADC channel is noisy during Wi-Fi bursts

این فایل باید کوتاه، صریح و بدون ابهام باشد.

### `task-map.md`
اگر پروژه RTOS یا async/event-driven است این فایل حیاتی است.

داخلش باشد:
- نام taskها
- مسئولیت هر task
- priority
- timing/periodicity
- queue/event group usage
- shared resourceها
- watchdog concernها
- بخش‌هایی که نباید block شوند

### `protocol-map.md`
برای AI لازم است بداند هر ارتباط چگونه کار می‌کند.

مثال:
- MQTT topic naming
- QoS expectation
- reconnect policy
- HTTP retry policy
- BLE characteristic purpose
- UART packet structure
- timeoutهای اصلی
- parsing assumptionها

### `state-machine.md`
وقتی رفتار device stateful است:
- states
- triggerها
- transitionها
- timeoutها
- fail-safe state
- boot state
- provisioning state
- operational state
- error state

### `storage-layout.md`
این فایل خیلی مفید است.
داخلش باشد:
- چه داده‌ای کجا ذخیره می‌شود
- NVS namespaceها
- EEPROM offsets اگر هست
- flash partition use
- config persistence rule
- reset behavior
- migration rule بین versionها

### `memory-notes.md`
در embedded جلوی خطاهای AI را زیاد می‌گیرد.
داخلش باشد:
- heap حساسیت
- stack-heavy functionها
- buffer limit
- PSRAM availability
- fragmentation concern
- logging impact
- ISR restrictionها
- allocation rule

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: GPIO boot-sensitive را برای output دائمی استفاده نکن
- اشتباه: داخل ISR عملیات سنگین نکن
- اشتباه: در taskهای حساس `delay` یا blocking call بدون دلیل نگذار
- اشتباه: credential واقعی داخل کد hardcode نکن
- اشتباه: calibration constant را بدون migration rule تغییر نده
- اشتباه: relay active-low را active-high فرض نکن
- اشتباه: NVS schema را بدون compatibility note تغییر نده
- اشتباه: log سنگین را در loop سریع نگذار
- اشتباه: sensor read و network publish را بی‌فکر در یک لایه قاطی نکن

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | پورت‌ها، سیستم عامل bench، مسیر toolchain، آدرس پنل cloud، deviceهای موجود |
| `walkthrough.md` | گزارش جلسات — قالب: `write-docs-friendly/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `device-inventory.md` | لیست بردها، MAC، serial، revision، وضعیت |
| `bench-notes.md` | تست‌های عملی، مشاهدات، رفتار عجیب |
| `wifi-and-secrets.md` | فقط در صورت اجبار و فقط local |
| `factory-notes.md` | یادداشت‌های تولید یا مونتاژ |
| `field-incidents.md` | خطاهای واقعی دیده‌شده در میدان |

### قانون امنیتی
- secret واقعی تا جای ممکن در فایل plain text نگه‌داری نشود
- برای certificate، token، Wi-Fi credential و private key از secret manager یا storage امن استفاده شود
- اگر فایل محلی لازم شد، باید کاملاً local و gitignored بماند

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `fw-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/hardware-overview.md`
- `docs/pin-map.md`
- `docs/flashing-and-recovery.md`
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/pin-summary.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `fw-standard`
فایل‌های پیشنهادی:
- همه موارد `fw-lite`
- `docs/protocols.md`
- `docs/provisioning.md`
- `docs/security.md`
- `docs/testing.md`
- `docs/troubleshooting.md`
- `docs/power-behavior.md`
- `docs/deployment.md`
- `docs/cloud-integration.md`
- `docs-for-ai/task-map.md`
- `docs-for-ai/protocol-map.md`
- `docs-for-ai/storage-layout.md`
- `docs-for-ai/test-rules.md`
- `docs-for-ai/cloud-contracts.md`

### برای `fw-complex`
فایل‌های پیشنهادی:
- همه موارد `fw-standard`
- `docs/calibration.md`
- `docs/board-revisions.md`
- `docs/manufacturing-notes.md`
- `docs-for-ai/state-machine.md`
- `docs-for-ai/memory-notes.md`
- `docs-for-ai/build-targets.md`
- `docs-for-ai/ota-rules.md`
- `docs-for-ai/security-notes.md`
- `docs-for-ai/sensor-behavior.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن ممکن است اشتباه خطرناک در firmware ایجاد کند
- برای flash/recovery نیاز است اطلاعات حیاتی در بیش از یک فایل دیده شود
- خلاصه‌ی wiring، pin rule یا provisioning flow برای شروع سریع لازم باشد
- نسخه انسانی و نسخه AI از یک موضوع باید با سطح جزئیات متفاوت وجود داشته باشند

### تکرار غیرمجاز است اگر:
- باعث دو pin map متناقض شود
- دو منبع برای یک truth حساس مثل partition layout بسازی
- متن را بدون دلیل بین چند فایل کپی کنی

### الگوی درست
- `docs/pin-map.md` → نسخه کامل برای انسان
- `docs-for-ai/pin-summary.md` → نسخه کوتاه و عملی برای AI
- `docs/protocols.md` → توضیح انسانی ارتباطات
- `docs-for-ai/protocol-map.md` → قرارداد دقیق برای تغییر کد
- `docs/flashing-and-recovery.md` → راهنمای کامل انسان
- `docs-for-ai/platform.md` → build/flash facts برای AI

---

## دستور `/sync-docs-firmware`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- pin assignment
- board revision
- sensor/actuator جدید
- framework version
- partition table
- provisioning flow
- state machine
- protocol contract
- calibration rule
- build target
- OTA/release rule

### کارهایی که `/sync-docs-firmware` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف محصول هم‌خوان است
2. چک کند `design.md` هنوز معماری واقعی firmware را درست توضیح می‌دهد
3. `project-file-index.md` را با ساختار واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر فایل‌های مربوط به GPIO یا board تغییر کرده‌اند، `pin-map.md` و `docs-for-ai/pin-summary.md` را علامت بزند یا به‌روز کند
6. اگر protocolها تغییر کرده‌اند، `protocols.md` و `docs-for-ai/protocol-map.md` را sync کند
7. اگر partition یا storage layout تغییر کرده، `flashing-and-recovery.md`، `platform.md` و `storage-layout.md` را به‌روز کند
8. اگر taskها یا stateها عوض شده‌اند، `design.md`، `task-map.md` و `state-machine.md` را علامت بزند
9. اگر board revision جدید آمده، `board-revisions.md` را هشدار دهد
10. اگر version/release rule عوض شده، `deployment.md` و `ota-rules.md` را sync کند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد از خودش منطق سخت‌افزار یا wiring جدید اختراع کند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه firmware / ESP32

- [ ] سطح پروژه مشخص شده: `fw-lite` یا `fw-standard` یا `fw-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `hardware-overview.md` ساخته شده
- [ ] `pin-map.md` ساخته شده
- [ ] روش build/flash/recovery مستند شده
- [ ] board/framework/toolchain version مشخص شده
- [ ] اگر network وجود دارد، `protocols.md` یا `cloud-integration.md` ساخته شده
- [ ] اگر provisioning وجود دارد، `provisioning.md` ساخته شده
- [ ] اگر OTA وجود دارد، `deployment.md` و `ota-rules.md` ساخته شده
- [ ] اگر چند برد یا revision وجود دارد، `board-revisions.md` ساخته شده
- [ ] command یا rule مربوط به `/sync-docs-firmware` تعریف شده

---

## قانون نهایی

- کد و سخت‌افزار واقعی truth نهایی‌اند
- داکیومنت باید به firmware و board واقعی برسد
- AI نباید برای فهم pinها، taskها و protocolها کل پروژه را حدس بزند
- انسان نباید برای فهم wiring و flashing مجبور شود از روی سورس و bench errorها نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن