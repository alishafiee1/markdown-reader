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


**نکته مهم:** در تمام دستورات زیر، نام پورت (`/dev/ttyUSB0` در لینوکس یا `COM3` در ویندوز) را مطابق با سیستم خود تغییر دهید.

---

### 1. دستورات ضروری و روزمره (Essential Commands)
این دستورات برای کارهای اصلی مانند فِلَش کردن، پاک کردن و دریافت اطلاعات اولیه استفاده می‌شوند و تقریباً در هر پروژه‌ای به کار می‌روند.

- **`flash_id`** (شناسایی فلش)
    - **توضیح:** اطلاعات سازنده و شناسه حافظه فلش را نمایش می‌دهد. اولین قدم برای اطمینان از ارتباط صحیح با برد است.
    - **مثال:** `esptool --port COM3 flash_id`

- **`write_flash`** (نوشتن روی فلش - فِلَش کردن)
    - **توضیح:** مهم‌ترین دستور برای آپلود کردن فریم‌ور یا باینری روی برد در آدرس مشخص شده.
    - **مثال:** `esptool --port /dev/ttyUSB0 write_flash 0x1000 firmware.bin`

- **`erase_flash`** (پاک کردن کامل فلش)
    - **توضیح:** معادل فرمت کردن فلش؛ کل داده‌ها را پاک می‌کند. معمولاً قبل از آپلود یک فریم‌ور جدید برای جلوگیری از تداخل داده‌ها انجام می‌شود.
    - **مثال:** `esptool --port COM3 erase_flash`

- **`chip_id`** (دریافت شناسه چیپ)
    - **توضیح:** شناسه منحصر‌به‌فرد چیپ اصلی (ESP32) را از حافظه فقط‌خواندنی (OTP) می‌خواند.
    - **مثال:** `esptool --port /dev/ttyUSB0 chip_id`

- **`read_mac`** (خواندن آدرس MAC)
    - **توضیح:** آدرس مک سخت‌افزاری دستگاه را نمایش می‌دهد.
    - **مثال:** `esptool --port COM3 read_mac`

---

### 2. دستورات پیشرفته اما پرکاربرد (Advanced but Common)
این دستورات برای کارهای تخصصی‌تر مانند بکاپ‌گیری یا عیب‌یابی استفاده می‌شوند.

- **`read_flash`** (خواندن محتویات فلش)
    - **توضیح:** یک بکاپ کامل از کل حافظه فلش یا یک محدوده مشخص تهیه می‌کند و در یک فایل ذخیره می‌نماید.
    - **مثال (خواندن کل فلش 4 مگابایتی):** `esptool --port /dev/ttyUSB0 read_flash 0 0x400000 backup.bin`

- **`verify_flash`** (تأیید صحت داده)
    - **توضیح:** داده‌های داخل فلش را با یک فایل باینری محلی مقایسه می‌کند تا از صحت آپلود اطمینان حاصل شود.
    - **مثال:** `esptool --port COM3 verify_flash 0x1000 firmware.bin`

- **`erase_region`** (پاک کردن محدوده خاص)
    - **توضیح:** فقط یک بخش خاص از فلش (مثلاً تنظیمات ذخیره شده) را پاک می‌کند. آدرس و سایز باید مضرب 4096 بایت باشد.
    - **مثال:** `esptool --port /dev/ttyUSB0 erase_region 0x9000 0x4000`

---

### 3. دستورات تخصصی و مدیریت حافظه (Specialist & Memory)
این دستورات معمولاً برای توسعه‌دهندگان حرفه‌ای یا هنگام کار با بوت‌لودر سطح پایین مفید هستند.

- **`image_info`** (اطلاعات ایمیج)
    - **توضیح:** اطلاعات داخل یک فایل باینری (مثل بوت‌لودر یا اپلیکیشن) مانند نوع چیپ، نقطه ورود و چک‌سام را نمایش می‌دهد.
    - **مثال:** `esptool image_info bootloader.bin`

- **`run`** (اجرای کد)
    - **توضیح:** به بوت‌لودر ROM دستور می‌دهد برنامه موجود در فلش را اجرا کند (برد را ریست مجازی می‌کند).
    - **مثال:** `esptool --port COM3 run`

- **`read_mem`** (خواندن مستقیم از حافظه)
    - **توضیح:** یک آدرس دلخواه از حافظه (RAM یا رجیسترها) را می‌خواند. برای دیباگ پیشرفته استفاده می‌شود.
    - **مثال:** `esptool --port /dev/ttyUSB0 read_mem 0x3FF44000`

- **`write_mem`** (نوشتن مستقیم در حافظه)
    - **توضیح:** مقداری را در یک آدرس حافظه دلخواه می‌نویسد. یک عمل سطح پایین و خطرناک است.
    - **مثال:** `esptool --port COM3 write_mem 0x60000 0xdeadbeef`

- **`dump_mem`** (ذخیره محتویات حافظه به فایل)
    - **توضیح:** مشابه `read_mem` است اما خروجی را مستقیماً در یک فایل باینری ذخیره می‌کند.
    - **مثال:** `esptool --port /dev/ttyUSB0 dump_mem 0x3FF44000 0x1000 dump.bin`

- **`load_ram`** (اجرای کد در RAM)
    - **توضیح:** یک ایمیج را در RAM بارگذاری کرده و اجرا می‌کند (بدون نوشتن در فلش). معمولاً برای اجرای Stub استفاده می‌شود.
    - **مثال:** `esptool load_ram stub.bin`

---

### 4. دستورات کاربردی در ساخت فایل (Building & Utility)
این دستورات به جای ارتباط با برد، برای پردازش فایل‌های باینری روی کامپیوتر شما استفاده می‌شوند.

- **`elf2image`** (تبدیل ELF به باینری)
    - **توضیح:** یک فایل اجرایی استاندارد `.elf` (خروجی کامپایلر) را به فایل باینری قابل فِلَش کردن تبدیل می‌کند.
    - **مثال:** `esptool elf2image --flash_freq 40m --flash_mode dio firmware.elf`

- **`merge_bin`** (ادغام فایل‌های باینری)
    - **توضیح:** چندین فایل باینری با آدرس‌های جداگانه را در یک فایل واحد ترکیب می‌کند تا در یک مرحله فِلَش شوند.
    - **مثال:** `esptool merge_bin -o merged.bin 0x1000 app.bin 0x8000 partitions.bin`

- **`make_image`** (ساخت ایمیج از فایل خام)
    - **توضیح:** یک فایل ایمیج باینری استاندارد برای ESP از فایل‌های خام (بدون هدر) می‌سازد.
    - **مثال:** `esptool make_image -o my_image.bin 0x1000 raw_data.bin`

---

### 5. گزینه‌های جانبی (گزارش) (Reporting & Misc)

- **`version`** (نسخه)
    - **توضیح:** نسخه نصب شده `esptool` را نمایش می‌دهد.
    - **مثال:** `esptool version`

- **`get_security_info`** (دریافت اطلاعات امنیتی)
    - **توضیح:** اطلاعات مربوط به قابلیت‌های امنیتی چیپ (مانند Secure Boot یا Flash Encryption) را نمایش می‌دهد.
    - **مثال:** `esptool --port /dev/ttyUSB0 get_security_info`

اگر سوال دیگری در مورد نحوه استفاده از این دستورات دارید، در خدمتتان هستم.