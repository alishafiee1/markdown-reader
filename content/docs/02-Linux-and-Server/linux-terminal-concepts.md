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

# 📚 آموزش کامل دستورات خط فرمان لینوکس (برای مبتدیان)

## مقدمه: خط فرمان چیست؟

خط فرمان (Terminal) مثل **مغز کامپیوتر شماست که با آن حرف می‌زنید**. به جای کلیک کردن با ماوس، دستور می‌نویسید و Enter می‌زنید.

---

## 🎯 دستورات پایه (همیشه به کارتان می‌آید)

### 📁 کار با فایل‌ها و پوشه‌ها

```bash
pwd                    # کجایم؟ (مسیر فعلی را نشان می‌دهد)
ls                     # چه چیزی اینجاست؟ (لیست فایل‌ها)
ls -la                 # لیست کامل با جزئیات
cd Desktop             # برو به پوشه Desktop
cd ..                  # برو یک سطح بالا
cd ~                   # برو به خانه (home)
mkdir myfolder         # پوشه جدید بساز
rm file.txt            # فایل را پاک کن
rm -rf folder          # پوشه را کامل پاک کن (قدرتمند!)
cp file1 file2         # کپی کن
mv file1 file2         # انتقال یا تغییر نام
nano file.txt          # ویرایش فایل با ویرایشگر nano
cat file.txt           # محتویات فایل را نشان بده
```

### 🔍 جستجو و کمک

```bash
man ls                 # راهنمای دستور ls (بزن Q برای خروج)
--help                 # تقریبا هر دستوری را با --help اجرا کن
which python           # پایتون کجا نصب شده؟
find . -name "*.txt"   # همه فایل‌های txt را پیدا کن
grep "text" file.txt   # جستجوی متن در فایل
```

---

## 📦 دستورات نصب نرم‌افزار (مهم!)

### 1️⃣ **apt** (اوبونتو/دبیان - مدیریت بسته‌های سیستمی)

```bash
# به روز رسانی لیست بسته‌ها
sudo apt update

# نصب یک نرم‌افزار
sudo apt install python3
sudo apt install git
sudo apt install nano

# حذف نرم‌افزار
sudo apt remove python3

# جستجو در مخازن
apt search python

# آپدیت همه نرم‌افزارها
sudo apt upgrade
```

> 💡 **sudo چیست؟** = "Super User DO" - مثل اجازه گرفتن از مدیر برای نصب

### 2️⃣ **pip** (مدیر پکیج‌های پایتون)

```bash
# نصب یک پکیج پایتون
pip install flask
pip install requests

# نصب نسخه خاص
pip install numpy==1.21.0

# حذف پکیج
pip uninstall flask

# لیست پکیج‌های نصب شده
pip list

# ذخیره پکیج‌ها در فایل
pip freeze > requirements.txt

# نصب از فایل
pip install -r requirements.txt

# آپگرید pip خودش
pip install --upgrade pip
```

### 3️⃣ **npm** (Node Package Manager - برای جاوااسکریپت)

```bash
# نصب یک پکیج (محلی)
npm install express

# نصب سراسری (برای ابزارهای خط فرمان)
npm install -g nodemon

# نصب از فایل package.json
npm install

# دیدن پکیج‌های نصب شده
npm list

# حذف پکیج
npm uninstall express

# اجرای اسکریپت از package.json
npm run start
```

### 4️⃣ **snap** (نرم‌افزارهای بسته‌بندی شده اوبونتو)

```bash
# نصب
sudo snap install code --classic

# لیست
snap list

# بروزرسانی
sudo snap refresh
```

### 5️⃣ **flatpak** (نرم‌افزارهای چند توزیعی)

```bash
# نصب
flatpak install flathub com.spotify.Client

# اجرا
flatpak run com.spotify.Client
```

---

## 🔧 دستورات مدیریت سیستم

```bash
# اطلاعات سیستم
uname -a               # نسخه لینوکس
df -h                  # فضای دیسک (انسان‌خوان)
free -h                # حافظه رم
top                    # پردازش‌های در حال اجرا (Q برای خروج)
htop                   # نسخه زیباتر top (باید نصب کنید)
ps aux                 # لیست همه پردازش‌ها

# مجوزها
chmod +x script.sh     # قابل اجرا کردن فایل
chmod 755 file         # تنظیم مجوزها
sudo !                 # دوباره آخرین دستور را با sudo اجرا کن

# شبکه
ping google.com        # تست اتصال
ifconfig               # نمایش آی‌پی‌ها (یا ip addr)
curl example.com       # درخواست HTTP بفرست
wget https://file.zip  # دانلود فایل
```

---

## 🐍 دستورات پایتون (ویژه)

```bash
# اجرا
python3 script.py
python3 -c "print('hello')"   # اجرای یک خط

# محیط مجازی
python3 -m venv venv           # ساخت
source venv/bin/activate       # فعال‌سازی (لینوکس)
venv\Scripts\activate          # فعال‌سازی (ویندوز)
deactivate                     # غیرفعال‌سازی

# ماژول‌ها
python3 -m pip install x       # اجرای pip با پایتون
python3 -m http.server 8000    # شروع سرور ساده
```

---

## 📊 جدول مقایسه: apt vs pip vs npm

| ویژگی | apt | pip | npm |
|--------|-----|-----|-----|
| **برای چیست؟** | نرم‌افزارهای سیستم | پکیج‌های پایتون | پکیج‌های جاوااسکریپت |
| **نیاز به sudo؟** | ✅ بله | ❌ خیر (در محیط مجازی) | ❌ خیر |
| **مخزن اصلی** | Ubuntu repos | PyPI | npm registry |
| **فایل تنظیمات** | - | requirements.txt | package.json |
| **مثال** | `apt install git` | `pip install django` | `npm install react` |

---

## 💡 میانبرها و ترفندها

```bash
Tab                     # تکمیل خودکار (بسیار مفید!)
Ctrl + C               # متوقف کردن دستور در حال اجرا
Ctrl + Z               # متوقف کردن (pause)
Ctrl + L               # پاک کردن صفحه (مثل clear)
Ctrl + D               # خروج از ترمینال
Ctrl + R               # جستجو در تاریخچه دستورات
Up/Down Arrow          # دستورات قبلی/بعدی
!!                     # تکرار آخرین دستور
!python                # تکرار آخرین دستوری که با python شروع شده
```

---

## 🎯 سناریوهای عملی

### سناریو ۱: نصب و راه‌اندازی یک پروژه پایتون

```bash
# 1. اپدیت سیستم
sudo apt update

# 2. نصب پایتون و git
sudo apt install python3 python3-pip git

# 3. کلون پروژه
git clone https://github.com/example/project.git
cd project

# 4. ساخت محیط مجازی
python3 -m venv venv
source venv/bin/activate

# 5. نصب وابستگی‌ها
pip install -r requirements.txt

# 6. اجرا
python app.py
```

### سناریو ۲: دانلود و نصب ابزار از گیت‌هاب

```bash
# 1. دانلود
git clone https://github.com/tool/tool.git
cd tool

# 2. اگر پایتون است
pip install .

# 3. اگر Node.js است
npm install
npm run build

# 4. نصب سراسری
sudo make install
```

### سناریو ۳: عیب‌یابی "دستور پیدا نشد"

```bash
# ببینید دستور کجاست
which python3
which pip

# اگر چیزی نشان نداد، نصب کنید
sudo apt install python3

# یا شاید باید محیط را فعال کنید
source venv/bin/activate
```

---

## 🚨 خطاهای رایج و راه حل

| خطا | علت | راه حل |
|-----|-----|--------|
| `command not found` | نرم‌افزار نصب نیست | `apt install` یا `pip install` |
| `permission denied` | دسترسی نداری | از `sudo` استفاده کن |
| `No module named...` | پکیج پایتون نصب نیست | `pip install` |
| `pip: command not found` | pip نصب نیست | `sudo apt install python3-pip` |
| `E: Unable to locate` | اسم پکیج اشتباه است | `apt search` برای پیدا کردن |

---

## 📝 خلاصه دستوراتی که حتما باید بدانید

```bash
# حیاتی ترین دستورات
pwd                    # کجایم؟
ls -la                 # چه خبره اینجا؟
cd /path               # برو به...
sudo apt install X     # نصب کن
python3 script.py      # اجرا کن
source venv/bin/activate  # فعالسازی محیط مجازی
Ctrl + C               # بسه! بایست!
```

---

## 🎓 تمرین عملی

```bash
# 1. یک پوشه جدید بسازید
mkdir practice
cd practice

# 2. یک فایل بسازید
echo "Hello Linux" > test.txt

# 3. محتویات را ببینید
cat test.txt

# 4. یک محیط مجازی بسازید
python3 -m venv venv
source venv/bin/activate

# 5. یک پکیج نصب کنید
pip install cowsay

# 6. اجرا کنید
python3 -m cowsay "Hello!"

# 7. خارج شوید
deactivate
cd ..
rm -rf practice
```

---

## 🔗 منابع یادگیری بیشتر

- **تمرین آنلاین:** [ExplainShell.com](https://explainshell.com) - هر دستور را توضیح می‌دهد
- **بازی یادگیری:** [Bandit (overthewire.org)](https://overthewire.org) - بازی یادگیری لینوکس
- **کتاب:** "The Linux Command Line" by William Shotts

---

**نکته نهایی:** ۹۰٪ کارهایی که در ویندوز با ماوس انجام می‌دهید، در لینوکس با ۱-۲ دستور سریع‌تر انجام می‌شود. فقط تمرکز کنید و صبور باشید! 🐧