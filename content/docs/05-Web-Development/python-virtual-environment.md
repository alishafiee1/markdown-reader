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



# 📦 آموزش کامل محیط مجازی پایتون (Virtual Environment)

## محیط مجازی چیست؟ (توضیح خیلی ساده)

تصور کنید می‌خواهید چند رنگ مختلف را با آب مخلوط کنید:
- بدون محیط مجازی: همه رنگ‌ها را در یک ظرف می‌ریزید → قاطی می‌شوند → خراب می‌شوند
- با محیط مجازی: هر رنگ را در یک ظرف جداگانه → هیچ کدام قاطی نمی‌شوند → همه تمیز می‌مانند

**محیط مجازی = یک جعبه مجزا برای هر پروژه پایتونی شما**



 فرض کن روی لپ‌تاپت همزمان یه سایت، یه ربات تلگرام و یه پروژه هوش مصنوعی داری. هر کدوم به نسخه‌های مختلف کتابخونه‌ها (مثل Flask یا pandas) نیاز دارن. اگه همه رو روی همون پایتون اصلی ویندوز نصب کنی، زود قاطی می‌شن — یه پروژه کار می‌کنه، اون یکی خراب می‌شه.

 محیط مجازی یعنی برای **هر پروژه یه اتاق جدا** می‌سازی. تو اون اتاق فقط همون چیزایی که اون پروژه می‌خواد نصب می‌شن. پروژه‌ها به هم کاری ندارن، و اگه یه پروژه رو ول کنی، فقط همون پوشه رو پاک می‌کنی — بقیه سیستمت سالم می‌مونه.

 خلاصه: **قبل از شروع هر پروژه پایتون، یه venv بساز و فعالش کن** — مثل اینه که قبل از نقاشی، یه بوم تمیز جدا بذاری.

---

## 🤔 چرا به محیط مجازی نیاز داریم؟

| مشکل | راه حل |
|------|--------|
| پروژه A نیاز به نسخه 1.0 کتابخانه X دارد | محیط مجازی جدا برای پروژه A |
| پروژه B نیاز به نسخه 2.0 کتابخانه X دارد | محیط مجازی جدا برای پروژه B |
| نصب یک پکیج همه چیز را به هم می‌ریزد | هر محیط مجازی ایزوله است |
| حذف یک پروژه سخت است | فقط پوشه محیط را پاک می‌کنید |

---

## 📋 دستورات کاربردی (از ابتدا تا انتها)

### 1️⃣ ساختن محیط مجازی جدید

```bash
# دستور پایه
python3 -m venv نام_محیط

# مثال: ساختن محیط به اسم "myenv"
python3 -m venv myenv

# ساختن محیط در پوشه فعلی با اسم "venv" (مرسوم)
python3 -m venv venv
```

### 2️⃣ فعال کردن محیط مجازی

```bash
# در لینوکس/اوبونتو/Mac
source venv/bin/activate

# بعد از فعال شدن، جلوی ترمینال (venv) را می‌بینید
(venv) user@computer:~$
```

```bash
# در ویندوز (PowerShell)
venv\Scripts\activate

# در ویندوز (CMD)
venv\Scripts\activate.bat
```

### 3️⃣ نصب پکیج در داخل محیط

```bash
# اول محیط را فعال کنید، بعد:
pip install flask
pip install requests
pip install numpy pandas

# نصب چند پکیج با هم
pip install flask requests numpy

# نصب از فایل requirements.txt
pip install -r requirements.txt
```

### 4️⃣ دیدن پکیج‌های نصب شده

```bash
# لیست همه پکیج‌های نصب شده در محیط فعلی
pip list

# خروجی با جزئیات بیشتر
pip freeze

# ذخیره لیست پکیج‌ها در فایل (برای کپی کردن)
pip freeze > requirements.txt
```

### 5️⃣ خارج شدن از محیط مجازی

```bash
deactivate
```

### 6️⃣ حذف محیط مجازی (کامل)

```bash
# اول خارج شوید
deactivate

# سپس پوشه را حذف کنید
rm -rf venv
```

### 7️⃣ کپی کردن محیط برای جای دیگر

```bash
# روش 1: ذخیره لیست پکیج‌ها
source venv/bin/activate
pip freeze > requirements.txt

# در کامپیوتر مقصد:
python3 -m venv new_env
source new_env/bin/activate
pip install -r requirements.txt
```

---

## 🎯 سناریوهای عملی

### سناریو ۱: شروع یک پروژه جدید
```bash
mkdir myproject
cd myproject
python3 -m venv venv
source venv/bin/activate
pip install flask
# حالا کدنویسی کنید
```

### سناریو ۲: ادامه کار روی پروژه قبلی
```bash
cd myproject
source venv/bin/activate
python app.py
```

### سناریو ۳: انتقال پروژه به کامپیوتر دیگر
```bash
# در مبدأ
source venv/bin/activate
pip freeze > requirements.txt

# در مقصد (کامپیوتر جدید)
git clone پروژه
cd پروژه
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📊 جدول مقایسه: با/بدون محیط مجازی

| وضعیت | بدون محیط مجازی | با محیط مجازی |
|--------|----------------|---------------|
| نصب پکیج | `pip install flask` | `pip install flask` (همان) |
| محل نصب | سراسری سیستم | داخل پوشه `venv/` |
| تداخل با پروژه‌های دیگر | ❌ بله | ✅ خیر |
| نیاز به sudo | گاهی اوقات | ❌ هرگز |
| مدیریت نسخه‌های مختلف | ❌ غیرممکن | ✅ ممکن |
| پاک کردن آسان | ❌ سخت | ✅ فقط پوشه را پاک کن |

---

## 🔍 اشکالات رایج و راه حل

### خطا: `command not found: python`
```bash
# راه حل: از python3 استفاده کنید
python3 -m venv venv
```

### خطا: `No module named 'flask'`
```bash
# راه حل: اول محیط را فعال کنید
source venv/bin/activate  # لینوکس
pip install flask
```

### خطا: `ensurepip is not available`
```bash
# راه حل: نصب python3-venv
sudo apt install python3-venv
```

### فراموش کردم محیط را فعال کنم
```bash
# چک کنید: اگر (venv) جلوی ترمینال نیست، فعال کنید
source venv/bin/activate
```

---

## 💡 نکات طلایی

1. **اسم محیط را همیشه `venv` بگذارید** (مرسوم است و دیگران می‌فهمند)

2. **فایل `requirements.txt` را همیشه در git قرار دهید** (نه خود پوشه venv)

3. **پوشه `venv` را در `.gitignore` قرار دهید** (بزرگ است و نباید در git برود)
```bash
echo "venv/" >> .gitignore
```

4. **هر پروژه، یک محیط مجازی جداگانه** (هیچوقت از یک محیط برای دو پروژه استفاده نکنید)

5. **اسم پروژه را در محیط مجازی نگذارید** (بعداً فراموش می‌کنید کدام مال کدام است)

---

## ✅ خلاصه دستورات حیاتی (کارت یادداشت)

```bash
# ساخت
python3 -m venv venv

# فعال‌سازی
source venv/bin/activate          # لینوکس/Mac
venv\Scripts\activate              # ویندوز

# نصب پکیج
pip install package_name

# ذخیره پکیج‌ها
pip freeze > requirements.txt

# نصب از فایل
pip install -r requirements.txt

# خروج
deactivate

# حذف
rm -rf venv
```

---

## 🎓 تمرین عملی

```bash
# 1. یک محیط بسازید
python3 -m venv test_env

# 2. فعال کنید
source test_env/bin/activate

# 3. نصب کنید
pip install requests

# 4. ببینید نصب شده
pip list

# 5. ذخیره کنید
pip freeze > requirements.txt

# 6. خارج شوید
deactivate

# 7. محیط را پاک کنید
rm -rf test_env
```

---

**حالا برای پروژه term_mcp_deepseek خودتان:**

```bash
cd ~/term_mcp_deepseek
source venv/bin/activate
python server.py
```

اگر `(venv)` جلوی ترمینال دیدید، یعنی درست فعال شده است! 🎉