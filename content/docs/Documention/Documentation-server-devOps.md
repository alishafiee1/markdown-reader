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

# استاندارد مستندسازی پروژه‌های server / infrastructure / DevOps

> این نسخه مخصوص پروژه‌های زیر است:
> - سرور لینوکس
> - infrastructure app/server
> - Docker / Docker Compose / container stack
> - reverse proxy / Nginx / Caddy / Traefik
> - VPN / tunneling / proxy panel / gateway
> - OpenWRT / router / edge node
> - CI/CD pipeline
> - monitoring / logging / alerting stack
> - automation / provisioning / IaC سبک
> - عملیات production، staging و self-hosted service

هدف این استاندارد:
- مستندات زیرساخت، عملیات و topology روشن و پایدار باشند
- مرز بین «چی ساخته‌ایم»، «چطور deploy می‌شود»، «روی چه ماشین‌هایی اجرا می‌شود» و «در خرابی چه کار می‌کنیم» قاطی نشود
- AI بتواند با context کافی، config و automation را اصلاح کند بدون اینکه سرویس را کورکورانه بشکند
- اطلاعات حیاتی مثل portها، service dependency، secret boundary، backup/restore و recovery flow گم نشوند
- تکرار لازم برای عملیات و AI مجاز باشد

---

## اصل پایه: سه پوشه، سه مخاطب

| پوشه | مخاطب | داخل گیت؟ | سبک نوشتار | هدف |
|------|-------|-----------|------------|------|
| `docs/` | انسان | ✅ بله | روشن، توضیحی، عملیاتی | فهم topology، سرویس‌ها، deploy، امنیت و نگهداری |
| `docs-for-ai/` | AI / Agent / Chat | ✅ بله | دقیق، فشرده، rule-based | کمک به تغییر امن config، script و deployment |
| `docs-personal/` | فقط خودم | ❌ نه | حساس، محلی، اجرایی | دسترسی‌ها، IPهای واقعی، incident noteهای شخصی، secret reference |

### قانون مهم
- `docs/` برای فهم infrastructure است.
- `docs-for-ai/` برای این است که AI بداند **کجا دست بزند، کجا دست نزند، و قبل از هر تغییر چه dependencyهایی را چک کند**.
- `docs-personal/` برای اطلاعاتی است که نباید عمومی بمانند یا فقط برای اپراتور اصلی لازم‌اند.

### قانون مهم‌تر
- **تکرار کنترل‌شده مجاز است.**
- اگر AI برای ویرایش compose، nginx، firewall یا service file لازم دارد topology summary و port summary را ببیند، باید همان اطلاعات در `docs-for-ai/` هم به‌صورت فشرده وجود داشته باشد.
- اگر انسان برای recovery سریع لازم دارد commandها و dependencyها را یکجا ببیند، می‌شود خلاصه‌ای از آن در `how-to-use.md` یا `runbooks.md` تکرار شود.
- چیزی که بد است تکرار متناقض است، نه تکرار مفید.

---

## سطح‌بندی پروژه‌های infrastructure

| سطح | نوع پروژه | مثال |
|------|-----------|------|
| `infra-lite` | setup یا stack کوچک | یک VPS، یک nginx، یک app، یک database |
| `infra-standard` | زیرساخت معمولی | چند سرویس docker، reverse proxy، monitoring، backup |
| `infra-complex` | عملیات جدی‌تر | چند node، VPN/tunnel، CI/CD، failover، alerting، multi-env |

### قانون استفاده
- در `infra-lite` فایل‌های پایه، topology، deployment و security حداقلی کافی‌اند
- در `infra-standard` runbook، backup، monitoring و troubleshooting تقریباً لازم‌اند
- در `infra-complex` بدون مستندسازی network path، recovery، access model، service dependency و automation risk پروژه خطرناک می‌شود

---

## پوشه `docs/` – برای انسان

این پوشه باید کمک کند یک نفر بفهمد:
- این زیرساخت برای چه ساخته شده
- چه سرویس‌هایی دارد
- هر سرویس کجا اجرا می‌شود
- traffic از کجا وارد می‌شود و به کجا می‌رود
- چطور deploy/update/restart/rollback می‌شود
- در خرابی چه کار باید کرد

### فایل‌های اجباری

| نام فایل | هدف | چه چیزی داخلش باشد | چه چیزی داخلش نباشد |
|----------|-----|---------------------|----------------------|
| `proposal.md` | تعریف هدف زیرساخت | مسئله، use case، سرویس‌های اصلی، محیط هدف | config line-by-line، IPهای حساس، secret |
| `design.md` | معماری و topology | nodeها، سرویس‌ها، dependencyها، network flow، envها | command reference کامل یا لاگ incident |
| `tasks.md` | مدیریت کارها | backlog، maintenance task، hardening checklist، release task | تحلیل معماری تکراری |
| `how-to-use.md` | منوی اجرای سریع | commandهای مهم، deploy، restart، logs، test، health check | روایت طولانی |
| `project-file-index.md` | فهرست فایل‌های مهم | مسیر فایل/پوشه + توضیح یک‌خطی | topology تحلیلی |

### فایل‌های شرطی مهم برای infrastructure

| نام فایل | کی لازم است |
|----------|-------------|
| `topology.md` | تقریباً همیشه |
| `deployment.md` | تقریباً همیشه |
| `security.md` | تقریباً همیشه |
| `runbooks.md` | وقتی عملیات واقعی یا production داری |
| `troubleshooting.md` | وقتی خطاهای تکراری یا failure modeها زیادند |
| `backup-and-restore.md` | وقتی stateful service یا database داری |
| `monitoring.md` | وقتی metrics/logs/alerts داری |
| `networking.md` | وقتی subnet، firewall، reverse proxy، tunnel یا routing مهم است |
| `services.md` | وقتی چند سرویس/daemon/container داری |
| `environments.md` | وقتی dev/staging/prod یا چند node داری |
| `ci-cd.md` | وقتی pipeline یا auto deploy داری |
| `access-and-roles.md` | وقتی چند اپراتور یا دسترسی چندسطحی داری |
| `incident-response.md` | وقتی uptime مهم است |
| `change-log.md` | وقتی تغییرات عملیاتی باید track شوند |
| `openwrt-notes.md` | وقتی edge/router/OpenWRT بخشی از پروژه است |
| `proxy-and-tunnels.md` | وقتی VLESS/WG/WS/TLS/tunnel/proxy panel داری |
| `architecture-and-structure.md` | از `infra-standard` به بالا — `write-docs-friendly/how-to-write-architecture-and-structure.md` |

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
- این زیرساخت برای چه ساخته شده؟
- چه مشکلی را حل می‌کند؟
- چه سرویس‌هایی را میزبانی می‌کند؟
- محدوده‌اش چیست؟

داخلش بنویس:
- هدف setup
- سناریوی استفاده
- سرویس‌های سطح بالا
- محیط هدف
- محدودیت‌ها
- معیار موفقیت

داخلش ننویس:
- IP واقعی
- secretها
- config کامل nginx/docker-compose
- port list ریز مگر در حد اشاره

### `design.md`
این فایل هسته‌ی فنی انسانی است.

داخلش بنویس:
- معماری کلی
- سرویس‌ها و dependencyها
- traffic flow
- storage/state overview
- runtime environment
- reverse proxy / ingress overview
- auth/access overview
- persistence strategy
- restart/update model

داخلش ننویس:
- commandهای کامل عملیات
- incident timeline
- line-by-line config dump

### `topology.md`
باید روشن کند:
- چند node/VM/VPS/router داری
- هر node چه نقشی دارد
- ingress از کجا وارد می‌شود
- traffic به کجا route می‌شود
- هر service روی کدام host/container است
- چه پورت‌هایی externally exposed هستند
- internal dependencyها چیست

### `services.md`
برای هر service بگو:
- نام
- نقش
- محل اجرا
- start method
- dependency
- data path/volume
- log path
- health check
- restart behavior

### `networking.md`
برای network و proxy بسیار مهم است.

داخلش باشد:
- domain/subdomain mapping
- DNS overview
- firewall summary
- open ports
- internal ports
- reverse proxy routeها
- tunnel/VPN ruleها
- trusted network boundary
- TLS termination point

### `deployment.md`
باید جواب دهد:
- چطور deploy می‌شود
- با چه command یا pipeline
- ترتیب deploy چیست
- envها کجا بار می‌شوند
- migration/reload/restart چطور انجام می‌شود
- rollback چیست
- post-deploy check چیست

### `backup-and-restore.md`
برای stateful سیستم‌ها حیاتی است.
داخلش باشد:
- چه چیزهایی backup می‌شوند
- کجا backup می‌گیرند
- schedule چیست
- retention چیست
- restore step چیست
- restore test rule چیست
- چه چیزهایی اصلاً backup نمی‌شوند

### `runbooks.md`
این فایل برای کارهای تکراری عملیاتی است.

مثال:
- restart service
- rotate logs
- renew cert
- free disk
- inspect container
- verify tunnel
- rotate token
- re-run failed deploy
- recover from full disk

### `security.md`
داخلش باشد:
- access boundary
- auth method
- secret handling rule
- firewall policy summary
- exposure rule
- fail2ban/WAF/rate limit اگر هست
- patch/update policy
- least privilege note
- log hygiene

### `monitoring.md`
داخلش باشد:
- metrics source
- logs source
- alert rules
- dashboards
- health endpointها
- what matters operationally
- noise vs real incident

### `incident-response.md`
وقتی uptime مهم است:
- severity levelها
- first response steps
- escalation
- rollback vs hotfix rule
- incident log rule
- postmortem rule

### `ci-cd.md`
وقتی pipeline داری:
- triggerها
- branch rule
- test gate
- build artifact
- deploy gate
- manual approval rule
- secret injection model

---

## پوشه `docs-for-ai/` – برای AI

این پوشه باید طوری نوشته شود که AI بتواند:
- config، compose، service file، firewall rule یا deploy script را امن‌تر تغییر دهد
- dependencyهای حساس را نشکند
- روی پورت، volume، path، env و restart behavior اشتباه نکند
- قبل از تغییر production-impacting config بداند چه چیزی را باید چک کند

### اصل مهم
در infrastructure، context ناقص برای AI می‌تواند باعث این خطاها شود:
- سرویس را restart می‌کند ولی dependency را ندیده
- پورت را عوض می‌کند و proxy را sync نمی‌کند
- volume path را تغییر می‌دهد و data از دست می‌رود
- firewall را باز می‌کند ولی scope را کنترل نمی‌کند
- config را اصلاح می‌کند ولی reload/restart/health check را جا می‌اندازد
پس این پوشه باید کوتاه ولی دقیق باشد.

### فایل‌های اجباری

| نام فایل | هدف |
|----------|-----|
| `project.md` | snapshot سریع پروژه برای AI |
| `map.md` | نقشه فایل‌ها، configها، scriptها و serviceها |
| `platform.md` | OS، runtime، nodeها، envها، portها، commandهای اصلی |
| `ai-common-mistakes.md` | اشتباهات رایج و ruleهای خطرناک |

### فایل‌های شرطی مهم

| نام فایل | کی لازم است |
|----------|-------------|
| `service-map.md` | وقتی چند سرویس یا daemon داری |
| `network-map.md` | وقتی proxy/tunnel/firewall/VPN مهم است |
| `deploy-rules.md` | وقتی deploy/reload/restart rule مهم است |
| `config-boundaries.md` | وقتی چند config به هم وابسته‌اند |
| `backup-rules.md` | وقتی volume/state/database داری |
| `security-rules.md` | وقتی exposure و secret handling مهم است |
| `port-summary.md` | تقریباً همیشه |
| `env-summary.md` | وقتی envهای متعدد داری |
| `incident-quick-actions.md` | وقتی recovery سریع مهم است |
| `monitoring-map.md` | وقتی metrics/logging/alerting داری |
| `automation-rules.md` | وقتی bash/ansible/script/pipeline automation داری |
| `proxy-rules.md` | وقتی nginx/caddy/traefik/tunnel/panel داری |
| `researches.md` | وقتی تصمیم‌های infra بر اساس آزمایش و مقایسه بوده‌اند |

---

## مرزبندی دقیق فایل‌های `docs-for-ai/`

### `project.md`
snapshot سریع برای AI:
- این stack چیست
- چند node/service دارد
- entry configها کجا هستند
- deploy/restart pattern چیست
- sensitive areaها کدام‌اند
- stateful componentها کدام‌اند
- الان چه mode یا phaseی فعال است

این فایل می‌تواند خلاصه‌ی `proposal.md` و `design.md` را تکرار کند.
این تکرار مجاز و لازم است.

### `map.md`
AI باید خیلی سریع بفهمد:
- `docker-compose.yml` کجاست
- nginx/caddy configها کجاست
- systemd unitها کجاست
- env fileها کجاست
- scriptها کجاست
- backup script کجاست
- monitoring config کجاست
- CI/CD fileها کجاست

### `platform.md`
این فایل باید facts اجرایی را فشرده بدهد:
- OS/distribution
- node/host names
- public vs private role
- runtime tools
- orchestrator if any
- package manager
- important portها
- service names
- log paths
- commandهای اصلی
- reload/restart/test commandها
- env file locations

### `service-map.md`
داخلش باشد:
- service name
- purpose
- host/container
- dependencies
- exposed ports
- data directory
- startup mechanism
- restart effect
- health check command

### `network-map.md`
داخلش باشد:
- ingress path
- domain to service mapping
- reverse proxy map
- TLS endpoint
- tunnel path
- firewall boundary
- internal-only services
- ports that must stay closed
- trust boundary

### `deploy-rules.md`
این فایل برای جلوگیری از خرابکاری AI مهم است.
داخلش باشد:
- deploy order
- pre-checkها
- backup-before-change rule
- reload vs restart rule
- migration or config validation rule
- post-deploy verification
- rollback trigger

### `config-boundaries.md`
خیلی مفید است.
مثال:
- اگر compose عوض شد، nginx هم باید چک شود
- اگر service port عوض شد، firewall و health check هم باید sync شوند
- اگر domain عوض شد، DNS/TLS/proxy هم باید بررسی شوند
- اگر volume path عوض شد، backup و permission هم باید چک شوند

### `port-summary.md`
باید خیلی صریح باشد:
- external ports
- internal ports
- admin-only ports
- deprecated ports
- forbidden exposure

### `env-summary.md`
برای AI مهم است:
- env name
- purpose
- sensitive or not
- where used
- default allowed or not
- must restart after change or not

### `backup-rules.md`
داخلش باشد:
- what is stateful
- backup path
- restore dependency
- do-not-delete paths
- rotation rule
- test restore reminder

### `security-rules.md`
نمونه ruleها:
- هیچ secret واقعی داخل repo نرود
- admin port public نشود
- TLS bypass موقت بدون flag و note انجام نشود
- default credential استفاده نشود
- root login rule
- least privilege
- file permission حساس
- config change بدون بررسی exposure انجام نشود

### `incident-quick-actions.md`
فایل خیلی کاربردی برای AI و آدم:
- service down → check process/log/port/dependency
- disk full → inspect logs/tmp/docker
- cert issue → verify DNS/time/renew logs
- tunnel down → verify process/outbound/firewall
- DB unavailable → check health/network/storage

### `ai-common-mistakes.md`
نمونه ruleها:
- اشتباه: service port را عوض نکن مگر proxy/firewall/health check هم sync شوند
- اشتباه: volume path را بدون backup note و permission check عوض نکن
- اشتباه: restart کامل را جای reload امن استفاده نکن
- اشتباه: admin interface را public expose نکن
- اشتباه: secret را داخل compose یا repo hardcode نکن
- اشتباه: docker prune یا cleanup را بدون بررسی volume/data اجرا نکن
- اشتباه: تغییر DNS/domain را بدون بررسی TLS و reverse proxy انجام نده
- اشتباه: log path یا retention را بدون اثر روی disk usage تغییر نده
- اشتباه: iptables/ufw را کورکورانه flush نکن

---

## پوشه `docs-personal/` – برای خودم

این پوشه داخل گیت نمی‌رود.

### فایل‌های پیشنهادی

| نام فایل | هدف |
|----------|-----|
| `current-platform.md` | IP واقعی، SSH path، tunnel path، provider panel، host note |
| `walkthrough.md` | گزارش جلسات — قالب: `write-docs-friendly/how-to-write-walkthrough.md`؛ مبنای بازه `/sync-docs` |
| `access-notes.md` | دسترسی‌ها، userها، نقش‌ها، panelها |
| `incident-notes.md` | رخدادهای واقعی و تجربه recovery |
| `secrets-and-credentials.md` | فقط در صورت اجبار و فقط local |
| `provider-notes.md` | نکات Hetzner/DO/OVH/Cloudflare/OpenWRT/panel |
| `server-inventory.md` | لیست nodeها، region، role، resources |
| `maintenance-notes.md` | کارهای دوره‌ای و یادآوری‌های محلی |

### قانون امنیتی
- secret واقعی، private key، token و credential تا جای ممکن در فایل متنی plain نگه‌داری نشود
- اگر ناچار به نگه‌داری local شدی، باید کاملاً gitignored و واضح علامت‌گذاری شده باشد
- repo باید بدون `docs-personal/` هم قابل فهم و قابل نگهداری بماند

---

## فایل‌های پیشنهادی بر اساس سطح پروژه

### برای `infra-lite`
فایل‌های کافی:
- `docs/proposal.md`
- `docs/design.md`
- `docs/tasks.md`
- `docs/how-to-use.md`
- `docs/project-file-index.md`
- `docs/topology.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs-for-ai/project.md`
- `docs-for-ai/map.md`
- `docs-for-ai/platform.md`
- `docs-for-ai/port-summary.md`
- `docs-for-ai/ai-common-mistakes.md`

### برای `infra-standard`
فایل‌های پیشنهادی:
- همه موارد `infra-lite`
- `docs/services.md`
- `docs/networking.md`
- `docs/runbooks.md`
- `docs/troubleshooting.md`
- `docs/backup-and-restore.md`
- `docs/monitoring.md`
- `docs/environments.md`
- `docs/ci-cd.md`
- `docs/access-and-roles.md`
- `docs-for-ai/service-map.md`
- `docs-for-ai/network-map.md`
- `docs-for-ai/deploy-rules.md`
- `docs-for-ai/config-boundaries.md`
- `docs-for-ai/env-summary.md`
- `docs-for-ai/security-rules.md`
- `docs-for-ai/backup-rules.md`

### برای `infra-complex`
فایل‌های پیشنهادی:
- همه موارد `infra-standard`
- `docs/incident-response.md`
- `docs/change-log.md`
- `docs/proxy-and-tunnels.md`
- `docs/openwrt-notes.md`
- `docs-for-ai/proxy-rules.md`
- `docs-for-ai/monitoring-map.md`
- `docs-for-ai/incident-quick-actions.md`
- `docs-for-ai/automation-rules.md`
- `docs-for-ai/researches.md`

---

## قانون تکرار اطلاعات

### تکرار مجاز است اگر:
- AI بدون آن config خطرناک را اشتباه تغییر می‌دهد
- برای عملیات سریع لازم است portها، pathها و dependencyها در چند مرجع خلاصه باشند
- نسخه انسانی و نسخه AI از deployment/network/security باید با سطح جزئیات متفاوت وجود داشته باشند
- recovery و runbook summary برای سرعت عمل نیاز به تکرار کنترل‌شده دارد

### تکرار غیرمجاز است اگر:
- دو منبع متناقض برای port، domain، volume path یا service dependency بسازی
- همان config dump را بی‌دلیل در چند فایل کپی کنی
- source of truth برای topology یا service map مبهم شود

### الگوی درست
- `docs/topology.md` → توضیح انسانی ساختار
- `docs-for-ai/network-map.md` → خلاصه عملی dependencyها و مسیرها
- `docs/deployment.md` → روند انسانی deploy
- `docs-for-ai/deploy-rules.md` → ruleهای صریح برای تغییر امن
- `docs/security.md` → توضیح امنیت انسانی
- `docs-for-ai/security-rules.md` → ruleهای تغییر و ممنوعیت‌ها

---

## دستور `/sync-docs-infra`

هر وقت یکی از این‌ها تغییر کرد باید sync انجام شود:
- service جدید
- port جدید
- domain/subdomain جدید
- reverse proxy rule
- firewall rule
- compose/systemd/config file
- env variable
- backup path
- deploy pipeline
- monitoring/alert rule
- node جدید
- tunnel/VPN config

### کارهایی که `/sync-docs-infra` باید انجام دهد
0. **اول** آخرین بلوک `docs-personal/walkthrough.md` را بخوان؛ بازه را با `git diff <HASH>..HEAD` (+ uncommitted) تعیین کن
1. چک کند `proposal.md` هنوز با هدف setup هم‌خوان است
2. چک کند `design.md` هنوز معماری واقعی را درست توضیح می‌دهد
3. `project-file-index.md` را با فایل‌های واقعی sync کند
4. `architecture-and-structure.md` را برای فایل‌های affected به‌روز کند (اگر وجود دارد)
5. اگر port/domain/proxy تغییر کرده، `topology.md`، `networking.md` و `docs-for-ai/network-map.md` را علامت بزند یا sync کند
6. اگر service جدید آمده، `services.md` و `service-map.md` را به‌روز کند
7. اگر env یا config path عوض شده، `platform.md` و `env-summary.md` را sync کند
8. اگر deploy flow عوض شده، `deployment.md` و `deploy-rules.md` را به‌روز کند
9. اگر stateful path یا volume عوض شده، `backup-and-restore.md` و `backup-rules.md` را بررسی کند
10. اگر monitoring/alert عوض شده، `monitoring.md` و `monitoring-map.md` را علامت بزند
11. پوشه‌های `docs/change/` تمام‌شده را با پیشوند تاریخ شمسی rename کند
12. بلوک جدید walkthrough (قالب `how-to-write-walkthrough.md` + هش کامیت) اضافه کند

### قانون
این دستور حق ندارد rule امنیتی، exposure یا cleanup خطرناک را از خودش اختراع کند.
فقط sync، هشدار، و update کم‌خطر.

---

## چک‌لیست شروع پروژه infrastructure

- [ ] سطح پروژه مشخص شده: `infra-lite` یا `infra-standard` یا `infra-complex`
- [ ] پوشه `docs/` ساخته شده
- [ ] پوشه `docs-for-ai/` ساخته شده
- [ ] پوشه `docs-personal/` ساخته شده
- [ ] `docs-personal/` داخل `.gitignore` است
- [ ] فایل‌های اجباری `docs/` ساخته شده‌اند
- [ ] فایل‌های اجباری `docs-for-ai/` ساخته شده‌اند
- [ ] `topology.md` ساخته شده
- [ ] `deployment.md` ساخته شده
- [ ] `security.md` ساخته شده
- [ ] serviceها و portهای اصلی مستند شده‌اند
- [ ] اگر stateful data وجود دارد، `backup-and-restore.md` ساخته شده
- [ ] اگر monitoring وجود دارد، `monitoring.md` ساخته شده
- [ ] اگر CI/CD یا automation وجود دارد، `ci-cd.md` یا `automation-rules.md` ساخته شده
- [ ] اگر tunnel/proxy/VPN وجود دارد، فایل مربوطه ساخته شده
- [ ] command یا rule مربوط به `/sync-docs-infra` تعریف شده
- [ ] `scripts/README.md` و در صورت تست خودکار `tests/README.md` — قواعد: [`Scripts-and-tests-standard.md`](./Scripts-and-tests-standard.md)

---

## قانون نهایی

- واقعیت نهایی، config و runtime واقعی سیستم است
- داکیومنت باید به nodeها، serviceها، pathها و deploy واقعی برسد
- AI نباید برای فهم dependency، port، service restart effect و boundaryهای امنیتی کل repo و سرور را حدس بزند
- انسان نباید برای recovery یا deploy مجبور شود فقط از روی compose، nginx conf و systemd unitها نتیجه‌گیری کند
- هر فایل فقط یک نقش اصلی دارد
- تکرار لازم را حذف نکن، تناقض را حذف کن