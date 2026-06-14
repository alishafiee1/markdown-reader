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

بله، درست متوجه شدید. در فصل بیست و دوم، بخش‌هایی از مفاهیم عملی IPv6 (مانند فرمت آدرس، انواع آدرس‌ها، SLAAC و...) را در بخش دوم (دنیای واقعی) گنجاندم، اما به صورت مختصر.

با توجه به اینکه طبق الگوی شما، فصل ۲۳ **نیاز به داستان ندارد** و جنبه‌ی فنی و پیکربندی عملی دارد، بهتر است این فصل را به صورت جداگانه و کامل ارائه دهم تا هم مفاهیم فنی IPv6 به طور جامع توضیح داده شود، هم کارگاه عملی جداگانه‌ای داشته باشد.

در ادامه، فصل ۲۳ را به صورت کامل و مستقل ارائه می‌کنم.

---

### فصل بیست و سوم: IPv6 در عمل

---

#### بخش اول: مقدمه

در فصل قبل با دلایل نیاز به IPv6 و مزایای آن آشنا شدیم. در این فصل، به صورت عملی با ساختار آدرس‌های IPv6، انواع آن، نحوه‌ی فعال‌سازی در MikroTik، و چالش‌های انتقال از IPv4 به IPv6 آشنا می‌شویم.

---

#### بخش دوم: ساختار آدرس IPv6

آدرس‌های IPv6 از ۱۲۸ بیت تشکیل شده‌اند که به ۸ بخش ۱۶ بیتی (هگزادسیمال) تقسیم می‌شوند.

**فرمت کلی:**
```
xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx
```

**مثال:**
```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

**قوانین اختصار:**
1. صفرهای ابتدایی هر بخش حذف می‌شوند: `0db8` → `db8`
2. یک بلوک متوالی از صفرها را می‌توان با `::` جایگزین کرد (فقط یک بار)

**مثال‌های اختصار:**
| آدرس کامل | آدرس مختصر |
|-----------|------------|
| `2001:0db8:0000:0000:0000:0000:0000:0001` | `2001:db8::1` |
| `2001:0db8:0000:0000:0000:8a2e:0370:7334` | `2001:db8::8a2e:370:7334` |
| `fe80:0000:0000:0000:0000:0000:0000:0001` | `fe80::1` |

---

#### بخش سوم: انواع آدرس‌های IPv6

| نوع آدرس | محدوده | کاربرد | معادل در داستان |
|----------|--------|--------|-----------------|
| **Unicast (تک‌نشانی)** | `2000::/3` (Global) | آدرس عمومی در اینترنت | پلاک عمومی ساختمان |
| **Unique Local (ULA)** | `fc00::/7` | شبکه‌های داخلی | پلاک خصوصی داخل سازمان |
| **Link Local** | `fe80::/10` | ارتباط در یک شبکه محلی | پلاک موقت برای ارتباط با همسایه |
| **Multicast (گروهی)** | `ff00::/8` | ارسال به گروهی از دستگاه‌ها | پلاک گروهی (مثلاً همه‌ی واحدهای یک طبقه) |
| **Anycast** | مشابه Unicast | نزدیک‌ترین دستگاه از یک گروه | پلاکی که به نزدیک‌ترین پستخانه اشاره می‌کند |

**۱. Global Unicast (آدرس عمومی)**
- شروع با `2000::/3` (یعنی از `2000::` تا `3fff:...`)
- قابل مسیریابی در اینترنت
- معادل آدرس عمومی IPv4

**۲. Unique Local Address (ULA) - آدرس محلی یکتا**
- شروع با `fd00::/8`
- فقط در شبکه‌های داخلی استفاده می‌شود
- معادل آدرس‌های خصوصی IPv4 (`192.168.x.x`، `10.x.x.x`)
- مزیت نسبت به IPv4: تضمین یکتایی (randomly generated)

**۳. Link Local Address (LLA) - آدرس محلی پیوند**
- شروع با `fe80::/10`
- فقط در همان شبکه‌ی محلی معنا دارد
- برای ارتباط بین دستگاه‌های همسایه (مثل ARP در IPv4)
- هر دستگاه به طور خودکار یک LLA دارد

---

#### بخش چهارم: فعال‌سازی IPv6 در MikroTik

**۱. فعال کردن IPv6 در RouterOS**

```
/ipv6 settings set disable-ipv6=no
```

**۲. مشاهده‌ی آدرس‌های IPv6 خودکار (Link Local)**

```
/ipv6 address print
```

خروجی نمونه:
```
Flags: X - disabled, I - invalid, D - dynamic, G - global, L - link-local 
#   ADDRESS                                     INTERFACE
0 DL fe80::1/64                                 bridge-local
1 D  2001:db8:1234:5678::1/64                   ether1
```

**۳. افزودن آدرس Global Unicast ثابت**

```
/ipv6 address add address=2001:db8:1234:5678::1/64 interface=bridge-local
```

**۴. افزودن آدرس Unique Local (ULA)**

```
/ipv6 address add address=fd00:1234:5678::1/64 interface=bridge-local
```

**۵. دریافت خودکار آدرس IPv6 از ارائه‌دهنده (DHCPv6 Client)**

```
/ipv6 dhcp-client add interface=ether1 request=address
```

**۶. فعال‌سازی SLAAC (Stateless Address Autoconfiguration)**

SLAAC به دستگاه‌ها اجازه می‌دهد بدون نیاز به DHCP، آدرس IPv6 خود را بسازند.

```
/ipv6 nd set [find] interface=bridge-local managed-address-configuration=no other-configuration=no
```

---

#### بخش پنجم: مسیریابی IPv6

**۱. مشاهده‌ی جدول مسیریابی IPv6**

```
/ipv6 route print
```

**۲. افزودن مسیر پیش‌فرض (Default Route)**

```
/ipv6 route add dst-address=::/0 gateway=fe80::1%ether1
```

**۳. افزودن مسیر ثابت**

```
/ipv6 route add dst-address=2001:db8:abcd::/64 gateway=2001:db8:1234::2
```

---

#### بخش ششم: فایروال IPv6

فایروال IPv6 در MikroTik مستقل از فایروال IPv4 است و در مسیر **IP → Firewall** تنظیمات مربوط به IPv4 و در **IPv6 → Firewall** تنظیمات IPv6 قرار دارد.

**قوانین پایه برای امنیت IPv6:**

**۱. اجازه دادن به ترافیک Link Local (مهم برای عملکرد شبکه)**

```
/ipv6 firewall filter add chain=input src-address=fe80::/10 action=accept
/ipv6 firewall filter add chain=forward src-address=fe80::/10 action=accept
```

**۲. اجازه دادن به ICMPv6 (برای عملکرد صحیح IPv6 ضروری است)**

```
/ipv6 firewall filter add chain=input protocol=icmpv6 action=accept
/ipv6 firewall filter add chain=forward protocol=icmpv6 action=accept
```

**۳. مسدود کردن ترافیک ورودی از اینترنت (به جز موارد مجاز)**

```
/ipv6 firewall filter add chain=input in-interface=ether1 action=drop
```

---

#### بخش هفتم: چالش‌های انتقال از IPv4 به IPv6

در دنیای واقعی، انتقال از IPv4 به IPv6 تدریجی است و روش‌های مختلفی دارد:

**۱. Dual Stack (پشته‌ی دوگانه)**

رایج‌ترین روش. دستگاه‌ها همزمان از IPv4 و IPv6 پشتیبانی می‌کنند.

| مزایا | معایب |
|-------|-------|
| ساده، سازگاری کامل | نیاز به دو آدرس (IPv4 و IPv6) |
| بدون سربار اضافی | زیرساخت باید هر دو را پشتیبانی کند |

**۲. Tunneling (تونل‌زنی)**

بسته‌های IPv6 درون بسته‌های IPv4 بسته‌بندی می‌شوند.

| روش | توضیح |
|-----|-------|
| **6to4** | تونل خودکار، نیاز به آدرس IPv4 عمومی |
| **Teredo** | تونل برای دستگاه‌های پشت NAT |
| **GRE/IPIP** | تونل دستی بین دو روتر |

**مثال: تونل 6to4 در MikroTik**

```
/interface 6to4 add name=6to4-tunnel local-address=192.168.1.1
/ipv6 address add address=2002:c0a8:0101::1/64 interface=6to4-tunnel
```

**۳. Translation (ترجمه)**

تبدیل بین دو پروتکل در لایه‌های بالاتر.

| روش | توضیح |
|-----|-------|
| **NAT64** | ترجمه IPv6 به IPv4 |
| **DNS64** | ترجمه درخواست DNS |

---

#### بخش هشتم: کارگاه عملی

**هدف:** پیاده‌سازی عملی IPv6 در MikroTik و تست اتصال.

**ابزار:** یک دستگاه MikroTik با دسترسی به اینترنت (یا شبیه‌ساز).

**مراحل:**

**۱. فعال‌سازی IPv6 و مشاهده‌ی Link Local Address**

- در WinBox، به **IPv6 → Settings** بروید.
- تیک **Disable IPv6** را بردارید.
- به **IPv6 → Addresses** بروید. آدرس `fe80::/64` را روی هر اینترفیس خواهید دید.

**۲. دریافت آدرس IPv6 از ارائه‌دهنده (DHCPv6 Client)**

- به **IPv6 → DHCP Client** بروید.
- روی **+** کلیک کنید.
- **Interface:** اینترفیس WAN (مثلاً `ether1`)
- **Request:** `address` را انتخاب کنید.
- روی **OK** کلیک کنید.
- پس از چند ثانیه، آدرس IPv6 Global دریافت خواهید کرد.

**۳. تنظیم مسیر پیش‌فرض IPv6**

- به **IPv6 → Routes** بروید.
- اگر مسیر پیش‌فرض خودکار اضافه نشد، دستی اضافه کنید:
  ```
  /ipv6 route add dst-address=::/0 gateway=fe80::1%ether1
  ```

**۴. فعال‌سازی SLAAC برای شبکه‌ی داخلی**

- به **IPv6 → ND** (Neighbor Discovery) بروید.
- روی اینترفیس `bridge-local` دوبار کلیک کنید.
- مطمئن شوید **Managed Address Configuration** و **Other Configuration** هر دو `no` هستند.
- دستگاه‌های داخلی به طور خودکار آدرس IPv6 می‌گیرند.

**۵. تنظیم فایروال پایه IPv6**

- به **IPv6 → Firewall → Filter Rules** بروید.
- قوانین زیر را اضافه کنید:

```
# اجازه دادن به ترافیک از شبکه داخلی به خارج
/ipv6 firewall filter add chain=forward src-address=fd00::/64 action=accept

# اجازه دادن به ترافیک از شبکه داخلی به اینترنت
/ipv6 firewall filter add chain=forward src-address=2001:db8:1234:5678::/64 action=accept

# مسدود کردن ترافیک ورودی از اینترنت
/ipv6 firewall filter add chain=input in-interface=ether1 action=drop
```

**۶. تست اتصال IPv6**

- از خط فرمان MikroTik:
  ```
  /ping 2001:4860:4860::8888
  ```
- از کامپیوتر پشت MikroTik:
  ```
  ping -6 2001:4860:4860::8888
  ```

**۷. مشاهده‌ی آدرس IPv6 اختصاص‌یافته به دستگاه‌ها**

- به **IPv6 → Neighbors** بروید.
- لیست دستگاه‌های همسایه و آدرس‌های IPv6 آن‌ها را مشاهده می‌کنید.

---

#### بخش نهم: جمع‌بندی

| مفهوم | توضیح |
|-------|-------|
| **ساختار IPv6** | ۱۲۸ بیت، ۸ بخش هگزادسیمال |
| **Global Unicast** | `2000::/3`، آدرس عمومی در اینترنت |
| **Unique Local (ULA)** | `fd00::/8`، آدرس خصوصی |
| **Link Local** | `fe80::/10`، ارتباط در شبکه‌ی محلی |
| **SLAAC** | پیکربندی خودکار آدرس بدون DHCP |
| **Dual Stack** | استفاده همزمان از IPv4 و IPv6 |
| **Tunneling** | بسته‌بندی IPv6 در IPv4 |

---

**پایان فصل بیست و سوم**