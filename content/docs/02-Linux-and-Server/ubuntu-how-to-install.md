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






# 🔄 راهنمای نهایی نصب Ubuntu Server 26.04 LTS روی مینی کامپیوتر HP

طبق درخواست شما، این راهنما بر اساس **آخرین نسخه Ubuntu 26.04 LTS** نوشته شده است. بله، شما درست می‌گویید - این نسخه در **۲۳ آوریل ۲۰۲۶** منتشر شده است و نام رمز آن **"Resolute Raccoon"** (راکون مصمم) است .


## 📋 فاز 0: تصویر درست و آماده‌سازی فلش

### قدم 1: فایل ISO شما صحیح است
فایل `ubuntu-26.04-live-server-amd64.iso` **آخرین نسخه LTS** است و تا **آوریل ۲۰۳۱** (۵ سال) پشتیبانی رایگان دارد .

### قدم 2: ساخت فلش بوت با Rufus (انتخاب DD Mode ضروری است)

**چرا DD Mode را انتخاب کنیم؟**  
مهم است بدانید که ISO Mode ساختار فایل را تغییر می‌دهد و باعث خطای Checksum در حین نصب می‌شود. DD Mode فایل را بایت به بایت کپی می‌کند و **۱۰۰٪ موفقیت بوت** را تضمین می‌کند.

**مراحل دقیق:**
1. فلش مموری (حداقل ۴ گیگابایت) را وصل کنید
2. Rufus را اجرا کنید
3. فایل ISO را انتخاب کنید
4. **هنگام باز شدن پنجره «ISOHybrid image detected»:**
   - گزینه **«Write in DD mode»** را انتخاب کنید

> **نکته مهم:** بعد از نوشتن با DD Mode، در ویندوز فلش غیرقابل شناسایی به نظر می‌رسد. این طبیعی است. بعد از نصب، می‌توانید آن را فرمت کنید.

### قدم 3: بوت شدن از فلش

1. فلش را به مینی پی‌سی وصل کنید
2. سیستم را روشن کنید و کلید **`ESC`** (برای HP) را چند بار بزنید تا منوی بوت ظاهر شود
3. گزینه USB Flash Drive را انتخاب کنید


## 💿 فاز 1: نصب Ubuntu Server 26.04 (مراحل کلیدی)

### صفحه انتخاب زبان
- `English` را انتخاب کنید (کلید Enter)

### صفحه نوع نصب
- `Ubuntu Server` را انتخاب کنید

### صفحه شبکه (مهمترین بخش برای سناریوی شما)

**توصیه:** حتماً در همین مرحله یک **Static IP** تنظیم کنید، چون Gateway شما همیشه باید یک آدرس ثابت داشته باشد.

**مراحل تنظیم Static IP:**
1. اینترفیس پیش‌فرض (مثلاً `enp0s3`) را انتخاب کنید
2. گزینه **«Edit IPv4»** را انتخاب کنید
3. روش را از `DHCP` به **`Manual`** تغییر دهید
4. اطلاعات زیر را وارد کنید:
   - **Subnet:** `192.168.1.0/24`
   - **Address:** `192.168.1.50` (IP مینی پی‌سی شما)
   - **Gateway:** `192.168.1.1` (آدرس مودم ADSL شما)
   - **Name Servers (DNS):** `8.8.8.8, 1.1.1.1`
5. **Save** کنید

### 📚 صفحه Mirror (آینه نرم‌افزاری) - توضیح مهم

**Mirror چیست؟ (خیلی ساده)**  
به زبان ساده، Mirror یک **نسخه کپی شده از سرور اصلی اوبونتو** در نقاط مختلف جهان است که نرم‌افزارها را دانلود می‌کند. وقتی شما دستور `apt install` را می‌زنید، اوبونتو از این سرورها برای گرفتن فایل‌ها استفاده می‌کند.

**در حین نصب چه گزینه‌ای انتخاب کنیم؟**

| گزینه | توضیح | وضعیت |
|-------|-------|--------|
| **پیش‌فرض (archive.ubuntu.com)** | سرور اصلی در خارج از کشور | معمولاً کند (به‌ویژه از ایران) |
| **وارد کردن دستی آدرس** | می‌توانید یک Mirror نزدیک به خودتان وارد کنید | سریع‌تر |

**آدرس Mirror های سریع برای ایران:**
- `http://mirror.iut.ac.ir/ubuntu` (دانشگاه صنعتی اصفهان)
- `http://repo.irandns.com/ubuntu`
- `http://ubuntu.ir/ubuntu`

**نحوه انتخاب:**
1. در صفحه Mirror، گزینه پیش‌فرض را پاک کنید
2. یکی از آدرس‌های بالا را تایپ کنید
3. یا همان گزینه پیش‌فرض (`http://archive.ubuntu.com`) را بپذیرید و بعداً بعد از نصب تغییر دهید

> **نکته:** اگر Mirror اشتباهی وارد کنید، نصب با خطا مواجه می‌شود. اگر مطمئن نیستید، همان گزینه پیش‌فرض را انتخاب کنید .

### صفحه پارتیشن‌بندی
- **«Use an entire disk»** را انتخاب کنید
- دیسک داخلی را انتخاب کنید
- **«Set up this disk as an LVM group»** را بزنید
- `Done` و سپس `Continue`

### صفحه پروفایل کاربری (حساس و مهم)

| فیلد | مقدار پیشنهادی |
|------|----------------|
| Your name | `admin` |
| Your server's name | `gateway` |
| Pick a username | `myuser` |
| Choose a password | یک رمز قوی (ترکیب حرف، عدد، سمبل) |
| Confirm your password | تکرار همان رمز |

> این رمز را در جای امن یادداشت کنید. بدون آن نمی‌توانید وارد سیستم شوید .

### صفحه Ubuntu Pro (پاسخ به سوال شما)

**خلاصه پاسخ:** رایگان است. برای استفاده شخصی روی حداکثر ۵ دستگاه **هیچ هزینه‌ای ندارد**.

**مقایسه دو گزینه:**

| گزینه | چه می‌دهد؟ | برای شما؟ |
|-------|-----------|-----------|
| **Skip** | ۵ سال بروزرسانی امنیتی رایگان | ✅ کافی است |
| **Enable** | +۵ سال امنیت اضافه + Livepatch (وصله زنده کرنل بدون ریستارت) | 👌 اختیاری |

**انتخاب من:** **Skip for now** را انتخاب کنید. اگر بعداً خواستید، یک حساب Ubuntu One رایگان بسازید و فعالش کنید.

### صفحه OpenSSH Server (توصیه اکید)

- با **Space**، گزینه **«Install OpenSSH server»** را انتخاب کنید
- `Done` را بزنید

### صفحه سرویس‌های اضافی
- هیچ کدام را انتخاب نکنید. `Done`

### منتظر بمانید تا نصب کامل شود
- حدود ۵-۱۰ دقیقه زمان می‌برد
- در انتها پیغام **«Installation complete»** را می‌بینید
- فلش را خارج کنید و **«Reboot Now»** را بزنید


## 🚀 فاز 2: بعد از نصب (ورود و تنظیمات اولیه)

### قدم 1: اولین ورود
- با نام کاربری و رمزی که ساختیـد وارد شوید

### قدم 2: بروزرسانی سیستم (اجباری)
```bash
sudo apt update && sudo apt upgrade -y
```

### قدم 3: نصب ابزارهای ضروری
```bash
sudo apt install -y net-tools wireless-tools curl wget git nano
```

### قدم 4: ریستارت کردن (برای اطمینان)
```bash
sudo reboot
```


## 🎯 فاز 3: قدم بعدی (پس از نصب موفق)

حالا اوبونتو روی مینی پی‌سی شما نصب شده است. برای تحقق سناریوی اصلی (دریافت اینترنت از وای‌فای و پخش به دستگاه‌های ورزشی از طریق پورت اترنت)، مراحل بعدی عبارتند از:

1. **اتصال وای‌فای به مودم ADSL** (دریافت اینترنت)
2. **راه‌اندازی DHCP Server روی پورت اترنت** (برای دستگاه‌های ورزشی)
3. **فعال کردن IP Forwarding و NAT** (ارسال ترافیک)
4. **نصب و تنظیم V2Ray** (فیلترشکن)


## 📌 خلاصه انتخاب‌های کلیدی

| مرحله | انتخاب درست |
|--------|-------------|
| فایل ISO | ubuntu-26.04-live-server-amd64.iso ✅ |
| بوت فلش | **DD Mode** (نه ISO Mode) |
| نوع نصب | Ubuntu Server |
| شبکه | Static IP (نه DHCP) |
| **Mirror** | `http://mirror.iut.ac.ir/ubuntu` (یا پیش‌فرض) |
| Ubuntu Pro | **Skip for now** |
| OpenSSH | **بله، نصب شود** |

موفق باشید. اگر در هر مرحله خطایی دیدید، پیغام آن را بنویسید تا دقیقاً راهنمایی کنم.