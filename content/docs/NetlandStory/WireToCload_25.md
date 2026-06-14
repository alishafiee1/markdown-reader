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

### فصل بیست و پنجم: پروژه‌های عملی

---

#### بخش اول: مقدمه

در این فصل، دانشی را که در فصول مختلف کسب کرده‌ایم، در قالب پروژه‌های عملی به کار می‌گیریم. هر پروژه یک سناریوی واقعی است که از ابتدا تا انتها پیاده‌سازی می‌شود. این پروژه‌ها به ترتیب از ساده به پیچیده طراحی شده‌اند.

---

#### پروژه ۱: راه‌اندازی یک شبکه خانگی با MikroTik

**هدف:** راه‌اندازی یک روتر MikroTik برای استفاده در منزل یا اداره‌ی کوچک.

**سناریو:** یک مودم اینترنت (ADSL، فیبر یا همراه) داریم و می‌خواهیم اینترنت را بین چند دستگاه تقسیم کنیم.

**مراحل اجرا:**

**۱. تنظیمات اولیه (ریست و اتصال)**

```
# ریست کردن به تنظیمات کارخانه (در صورت نیاز)
/system reset-configuration no-defaults=yes

# مشاهده‌ی اینترفیس‌ها
/interface print
```

**۲. ایجاد Bridge برای شبکه‌ی داخلی**

```
/interface bridge add name=bridge-local
/interface bridge port add interface=ether2 bridge=bridge-local
/interface bridge port add interface=ether3 bridge=bridge-local
/interface bridge port add interface=ether4 bridge=bridge-local
```

**۳. تنظیم آدرس IP برای شبکه‌ی داخلی**

```
/ip address add address=192.168.1.1/24 interface=bridge-local
```

**۴. راه‌اندازی DHCP Server**

```
/ip pool add name=dhcp-pool ranges=192.168.1.10-192.168.1.254
/ip dhcp-server add name=dhcp1 interface=bridge-local address-pool=dhcp-pool
/ip dhcp-server network add address=192.168.1.0/24 gateway=192.168.1.1 dns-server=8.8.8.8,1.1.1.1
```

**۵. تنظیم WAN (اینترنت ورودی)**

```
# اگر ارائه‌دهنده IP ثابت می‌دهد:
/ip address add address=203.0.113.2/24 interface=ether1

# اگر ارائه‌دهنده IP پویا می‌دهد (DHCP):
/ip dhcp-client add interface=ether1 disabled=no
```

**۶. تنظیم NAT برای اشتراک اینترنت**

```
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade
```

**۷. تنظیم DNS**

```
/ip dns set servers=8.8.8.8,1.1.1.1 allow-remote-requests=yes
```

**۸. تنظیم رمز عبور برای امنیت**

```
/user set admin password=YourStrongPassword123
```

**آزمایش:**
- یک دستگاه را به پورت `ether2` وصل کنید.
- بررسی کنید IP خودکار گرفته است (`192.168.1.x`).
- پینگ به `8.8.8.8` و `google.com` را تست کنید.

---

#### پروژه ۲: ایجاد Hotspot (وای‌فای با صفحه ورود)

**هدف:** راه‌اندازی یک شبکه‌ی وای‌فای عمومی که کاربران برای اتصال باید نام کاربری و رمز وارد کنند.

**سناریو:** یک کافی‌شاپ یا هتل می‌خواهد اینترنت رایگان یا با رمز موقت در اختیار مشتریان قرار دهد.

**مراحل اجرا:**

**۱. راه‌اندازی اولیه روتر (مانند پروژه ۱)**

**۲. فعال‌سازی Hotspot روی اینترفیس داخلی**

```
/ip hotspot profile set [find] login-by=http-chap
/ip hotspot add interface=bridge-local address-pool=dhcp-pool profile=default
```

**۳. ایجاد کاربران**

```
/ip hotspot user add name=user1 password=pass123
/ip hotspot user add name=user2 password=pass456
```

**۴. ایجاد کاربر موقت با زمان محدود (اختیاری)**

```
/ip hotspot user add name=guest1 password=guest123 limit-uptime=2h
```

**۵. سفارشی‌سازی صفحه‌ی ورود (اختیاری)**

- فایل‌های HTML صفحه‌ی ورود در پوشه‌ی `hotspot` ذخیره می‌شوند.
- می‌توانید لوگو و متن را تغییر دهید.

**۶. محدودیت سرعت برای کاربران Hotspot (اختیاری)**

```
/ip hotspot profile set [find] rate-limit=5M/2M
```

**آزمایش:**
- با یک دستگاه به وای‌فای متصل شوید.
- مرورگر را باز کنید. صفحه‌ی ورود Hotspot ظاهر می‌شود.
- با کاربری که ساخته‌اید وارد شوید.

---

#### پروژه ۳: فیلتر کردن دسترسی به اینترنت برای کودکان

**هدف:** محدود کردن دسترسی اینترنت برای یک دستگاه خاص (مثلاً گوشی کودک) بر اساس زمان و محتوا.

**سناریو:** یک خانواده می‌خواهد دسترسی فرزند خود به اینترنت را فقط در ساعت‌های مشخص و با فیلتر کردن سایت‌های نامناسب محدود کند.

**مراحل اجرا:**

**۱. شناسایی دستگاه (آدرس MAC یا IP)**

- از **IP → ARP** آدرس MAC دستگاه کودک را پیدا کنید.

**۲. ایجاد محدودیت زمانی (فقط در ساعت‌های مشخص)**

```
# اجازه دادن به دستگاه از ۴ تا ۸ عصر
/ip firewall filter add chain=forward src-address=192.168.1.100 time=16h-20h action=accept

# رد بقیه‌ی ساعات
/ip firewall filter add chain=forward src-address=192.168.1.100 action=drop
```

**۳. محدود کردن سرعت برای جلوگیری از مصرف زیاد**

```
/queue simple add name=child-limit target=192.168.1.100 max-limit=5M/2M
```

**۴. فیلتر کردن سایت‌های نامناسب (با استفاده از لیست سیاه)**

```
# ایجاد لیست سیاه از سایت‌های ممنوع
/ip firewall address-list add list=bad-sites address=example-bad-site.com

# مسدود کردن دسترسی به لیست سیاه
/ip firewall filter add chain=forward dst-address-list=bad-sites action=drop
```

**۵. فیلتر کردن بر اساس کلمات کلیدی (پیشرفته)**

```
# مسدود کردن درخواست‌های DNS حاوی کلمات خاص
/ip firewall filter add chain=forward protocol=tcp dst-port=53 content="badword" action=drop
```

**آزمایش:**
- دستگاه کودک را در ساعت غیرمجاز تست کنید (اینترنت قطع باشد).
- دستگاه را در ساعت مجاز تست کنید (اینترنت وصل باشد).

---

#### پروژه ۴: اتصال دو دفتر با VPN

**هدف:** برقراری ارتباط امن بین دو دفتر در دو شهر مختلف از طریق اینترنت.

**سناریو:** یک شرکت دو شعبه دارد (دفتر مرکزی در تهران، شعبه در اصفهان). می‌خواهیم شبکه‌ی دو دفتر را به هم متصل کنیم تا کارمندان بتوانند منابع را به اشتراک بگذارند.

**مراحل اجرا (Site-to-Site VPN با L2TP/IPsec):**

**۱. تنظیمات روتر دفتر مرکزی (سرور VPN)**

```
# فعال‌سازی L2TP Server
/interface l2tp-server server set enabled=yes

# ایجاد پروفایل برای کاربران VPN
/ppp profile add name=vpn-profile local-address=10.10.10.1 remote-address=10.10.10.2-10.10.10.100

# ایجاد کاربر برای دفتر شعبه
/ppp secret add name=office-isfahan password=strongpass profile=vpn-profile

# باز کردن پورت در فایروال
/ip firewall filter add chain=input protocol=udp dst-port=1701 action=accept
/ip firewall filter add chain=input protocol=ipsec-esp action=accept
/ip firewall filter add chain=input protocol=udp dst-port=500 action=accept
/ip firewall filter add chain=input protocol=udp dst-port=4500 action=accept
```

**۲. تنظیمات روتر دفتر شعبه (کلاینت VPN)**

```
# اتصال به سرور VPN
/interface l2tp-client add name=l2tp-connect user=office-isfahan password=strongpass connect-to=203.0.113.1

# اضافه کردن مسیر برای دسترسی به شبکه‌ی دفتر مرکزی
/ip route add dst-address=192.168.1.0/24 gateway=l2tp-connect
```

**۳. اضافه کردن مسیر در دفتر مرکزی برای دسترسی به شبکه‌ی شعبه**

```
/ip route add dst-address=192.168.2.0/24 gateway=10.10.10.2
```

**آزمایش:**
- از یک دستگاه در دفتر شعبه، یک دستگاه در دفتر مرکزی را پینگ کنید.
- به اشتراک‌گذاری فایل بین دو دفتر را تست کنید.

---

#### پروژه ۵: پشتیبان‌گیری و بازگردانی تنظیمات در کمتر از ۵ دقیقه

**هدف:** ایجاد یک روش سریع برای پشتیبان‌گیری از تنظیمات روتر و بازگردانی آن در زمان کوتاه.

**سناریو:** قبل از هر تغییر بزرگ در تنظیمات روتر، یک پشتیبان تهیه می‌کنیم تا در صورت بروز مشکل، سریعاً به حالت قبل برگردیم.

**مراحل اجرا:**

**۱. پشتیبان‌گیری باینری (Backup)**

- در WinBox، به **Files** بروید.
- روی **Backup** کلیک کنید.
- نام فایل: `config-backup-2024-01-01.backup`
- روی **Backup** کلیک کنید.
- فایل را با **Download** روی کامپیوتر ذخیره کنید.

**از طریق خط فرمان:**
```
/system backup save name=config-backup-2024-01-01
```

**۲. پشتیبان‌گیری متنی (Export)**

```
/export file=config-export-2024-01-01
```

**۳. بازگردانی از Backup**

- در WinBox، به **Files** بروید.
- فایل backup را با **Upload** به دستگاه منتقل کنید.
- روی فایل راست‌کلیک کنید و **Restore** را انتخاب کنید.
- تأیید کنید.

**از طریق خط فرمان:**
```
/system backup load name=config-backup-2024-01-01.backup
```

**۴. بازگردانی از Export**

```
/import file-name=config-export-2024-01-01.rsc
```

**۵. پشتیبان‌گیری خودکار با Script (اختیاری)**

```
/system script add name=auto-backup source={
    /system backup save name=auto-backup
    /tool e-mail send to="admin@example.com" subject="Daily Backup" file=auto-backup.backup
}
/system scheduler add name=daily-backup start-time=00:00:00 interval=1d script=auto-backup
```

**آزمایش:**
- یک تغییر کوچک در تنظیمات ایجاد کنید.
- Backup را بازگردانی کنید.
- بررسی کنید که تنظیمات به حالت قبل برگشته است.

---

#### بخش دوم: جمع‌بندی پروژه‌ها

| پروژه | مهارت اصلی | زمان تخمینی |
|-------|-----------|-------------|
| راه‌اندازی شبکه خانگی | تنظیمات پایه MikroTik | ۲۰ دقیقه |
| ایجاد Hotspot | مدیریت کاربران | ۳۰ دقیقه |
| فیلتر کردن برای کودکان | فایروال و محدودیت زمانی | ۲۰ دقیقه |
| اتصال دو دفتر با VPN | مسیریابی و VPN | ۴۵ دقیقه |
| پشتیبان‌گیری سریع | مدیریت و بازیابی | ۱۰ دقیقه |

---

#### بخش سوم: نکات پایانی

**۱. قبل از هر تغییر**
- همیشه یک Backup بگیرید
- تغییرات را در ساعت‌های کم‌ترافیک اعمال کنید
- یک راه بازگشت (Rollback) داشته باشید

**۲. مستندسازی**
- تنظیمات مهم را در یک فایل متنی ذخیره کنید
- تاریخ تغییرات را ثبت کنید
- رمزهای عبور را در جای امن نگه‌داری کنید

**۳. تست قبل از پیاده‌سازی**
- اگر امکان دارد، ابتدا در محیط آزمایشی تست کنید
- تغییرات را یک‌باره اعمال نکنید (تدریجی پیش بروید)
- پس از هر تغییر، عملکرد شبکه را بررسی کنید

**۴. یادگیری بیشتر**
- مستندات رسمی MikroTik: `help.mikrotik.com`
- انجمن‌های کاربری MikroTik
- دوره‌های آموزشی MTCNA (MikroTik Certified Network Associate)

---

**پایان فصل بیست و پنجم**

**پایان کتاب نتلند: داستان اینترنت به زبان آدمیزاد**