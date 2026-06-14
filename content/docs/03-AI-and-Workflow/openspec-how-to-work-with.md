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



بر اساس آخرین مستندات OpenSpec (نسخه 1.0 و بالاتر)، این framework تغییرات بنیادی داشته و دستورات قدیمی مثل `/openspec-propose` دیگر کار نمی‌کنند. در ادامه چرخه صحیح کار با OpenSpec در Cursor و نحوه به‌روزرسانی مستندات را توضیح می‌دهم.

---

## 🚨 نکته مهم: تغییرات نسخه 1.0

در نسخه‌های قبل از 1.0، دستورات به صورت `/openspec:propose`، `/openspec:apply` و `/openspec:archive` بودند. اما از نسخه 1.0 به بعد، این دستورات به طور کامل حذف شده‌اند و با سیستم **action-based** جدید جایگزین شده‌اند .

**برای مهاجرت به نسخه جدید، کافی است اجرا کنید:**
```bash
openspec init
```
این دستور به‌طور خودکار فایل‌های قدیمی را پاکسازی کرده و ساختار جدید را ایجاد می‌کند .

---

## 📁 دستورات صحیح OpenSpec در Cursor

در **Cursor**، دستورات با خط تیره (`-`) نوشته می‌شوند، نه اسلش (`/`) :

| دستور | عملکرد |
|-------|---------|
| `/opsx-propose` | ایجاد یک تغییر و تولید همزمان همه مستندات (پیشنهاد، طراحی، وظایف) |
| `/opsx-explore` |探索 و بررسی ایده‌ها قبل ازcommit کردن به یک تغییر |
| `/opsx-new` | شروع یک تغییر جدید (فقط اسکلت) |
| `/opsx-continue` | ایجاد گام‌به‌گام مستندات بعدی بر اساس وابستگی‌ها |
| `/opsx-ff` | Fast-forward: ایجاد یک‌باره همه مستندات برنامه‌ریزی |
| `/opsx-apply` | پیاده‌سازی وظایف از روی tasks.md |
| `/opsx-verify` | اعتبارسنجی اینکه پیاده‌سازی با مستندات مطابقت دارد |
| `/opsx-sync` | همگام‌سازی specهای دلتا با specهای اصلی |
| `/opsx-archive` | بایگانی یک تغییر تکمیل‌شده |
| `/opsx-onboard` | آموزش گام‌به‌گام ۱۵ دقیقه‌ای برای کار با OpenSpec |

> **توجه:** اگر این دستورات را در Cursor ندارید، ابتدا پروژه را با `openspec init` مقداردهی اولیه کنید و گزینه Cursor را انتخاب کنید .

---

## 🔄 چرخه کامل کار با OpenSpec در Cursor

### مرحله 1: شروع یک تغییر جدید

**روش سریع (پیشنهادی برای اکثر موارد):**
```
/opsx-propose اضافه کردن احراز هویت دو مرحله‌ای
```
این دستور یک‌باره همه چیز را می‌سازد: proposal.md، design.md، tasks.md و delta specs .

**روش گام‌به‌گام (برای تغییرات پیچیده):**
```
/opsx-new اضافه کردن قابلیت جستجوی پیشرفته
/opsx-continue   (تا زمانی که همه مستندات ساخته شوند)
```

### مرحله 2: بررسی و تأیید مستندات

فایل‌های ساخته شده در مسیر `openspec/changes/[name-of-change]/` را باز کن و مرور کن:
- **proposal.md**: چرا و چه چیزی را می‌خواهیم بسازیم؟
- **design.md**: تصمیمات فنی و معماری
- **tasks.md**: لیست وظایف قابل اجرا
- **specs/**: سناریوهای دقیق با فرمت Given/When/Then

اگر نیاز به تغییر داری، مستقیماً فایل‌ها را ویرایش کن. OpenSpec از ویرایش دلخواه پشتیبانی می‌کند .

### مرحله 3: پیاده‌سازی
```
/opsx-apply
```
AI شروع به پیاده‌سازی وظایف از tasks.md می‌کند. هر تسک که کامل شد، در فایل tasks.md تیک بزن .

### مرحله 4: اعتبارسنجی قبل از بایگانی
```
/opsx-verify
```
بررسی می‌کند که آیا همه کدهای نوشته شده با مستندات مطابقت دارند یا خیر .

### مرحله 5: بایگانی (تکمیل کار)
```
/opsx-archive
```
این دستور به طور خودکار:
1. تغییر را به `changes/archive/YYYY-MM-DD-[name]/` منتقل می‌کند
2. delta specs را با specs اصلی ادغام می‌کند
3. specهای اصلی را به‌روز می‌کند تا وضعیت فعلی سیستم را منعکس کنند 

---

## 📝 چطور مستندات را هنگام ایجاد تغییرات جدید به‌روزرسانی کنیم؟

### اصل کلیدی: مستندات زنده (Living Documentation)

در OpenSpec، مستندات **نه فقط برای راه‌اندازی اولیه، بلکه در طول کل چرخه حیات پروژه** به‌روز می‌شوند.

### زمان به‌روزرسانی هر سند:

| سند | زمان به‌روزرسانی |
|-----|-----------------|
| **proposal.md** | قبل از شروع کدنویسی؛ اگر نیازها تغییر کرد، آن را ویرایش کن |
| **design.md** | وقتی تصمیمات فنی عوض می‌شوند یا راه‌حل بهتری پیدا می‌شود |
| **tasks.md** | در حین پیاده‌سازی: بعد از اتمام هر تسک تیک بزن، اگر تسک جدید لازم شد اضافه کن |
| **specs/** | اگر یک سناریوی جدید یا شرط مرزی جدید کشف شد، به specs اضافه کن |

### فرآیند به‌روزرسانی هنگام تغییرات جدید:

**سناریو 1: می‌خواهی قابلیتی را به یک تغییر موجود اضافه کنی**
```bash
# مستقیماً فایل‌ها را در مسیر تغییر ویرایش کن:
openspec/changes/your-change-name/proposal.md   # محدوده را به‌روز کن
openspec/changes/your-change-name/tasks.md      # تسک‌های جدید اضافه کن
openspec/changes/your-change-name/specs/        # specs جدید اضافه کن
```

**سناریو 2: یک تغییر کامل شد و بعد متوجه باگ یا قابلیت جدید شدی**
```bash
# یک تغییر جدید ایجاد کن که روی همان بخش از کد کار می‌کند:
/opsx-propose رفع باگ در ماژول احراز هویت
```
در proposal.md جدید، به تغییر قبلی ارجاع بده و توضیح بده که چه چیزی را اصلاح می‌کند.

**سناریو 3: یک تغییر طولانی‌مدت (long-running) داری**
```bash
# بدون بایگانی کردن، specs را همگام‌سازی کن:
/opsx-sync
```
این دستور specsهای دلتا را با specs اصلی ادغام می‌کند بدون اینکه تغییر را بایگانی کند .

---

## 🛠️ ابزارهای کمکی برای مستندسازی بهتر

### Doccraft
یک لایه روی OpenSpec که مستندات را حرفه‌ای‌تر می‌کند:
```bash
npx doccraft init
```
امکانات: ثبت تصمیمات معماری (ADR)، مدیریت داستان‌های محصول، و مستندسازی جلسات کاری .

### SDD-Tools
تکمیل‌کننده OpenSpec برای تحلیل کیفیت:
```bash
sdd-tools impact analyze openspec/changes/mi-cambio/
sdd-tools testgap analyze openspec/changes/mi-cambio/
sdd-tools review check openspec/changes/mi-cambio/
```
این ابزار گزارش‌هایی از ریسک، شکاف‌های تست، و کیفیت کد تولید می‌کند .

---

## 📊 خلاصه: چرخه به‌روزرسانی مستندات در یک نگاه

```
شروع تغییر جدید
      │
      ▼
/opsx-propose یا /opsx-new → ساخت proposal, design, tasks, specs
      │
      ▼
بازبینی و ویرایش دستی مستندات (در صورت نیاز)
      │
      ▼
/opsx-apply → پیاده‌سازی (در حین کار، tasks.md را تیک بزن)
      │
      ▼
/opsx-verify → تأیید نهایی
      │
      ▼
/opsx-archive → ادغام specs اصلی و بایگانی
      │
      ▼
specs اصلی به‌روز شد ← تغییر بعدی می‌تواند از آن استفاده کند
```

---

## ⚠️ خطاهای رایج

| مشکل | راه‌حل |
|-------|--------|
| دستور `/opsx-propose` کار نمی‌کند | `openspec init` را اجرا کن و Cursor را انتخاب کن |
| دستورات قدیمی `/openspec:propose` را می‌بینی | از نسخه 1.0 به بعد حذف شده‌اند. از دستورات جدید استفاده کن |
| specs بعد از archive به‌روز نمی‌شوند | مطمئن شو که delta specs در تغییر به درستی نوشته شده‌اند |

---

اگر نیاز به راهنمایی بیشتر در مورد هر کدام از این مراحل داری، بپرس تا با مثال عملی توضیح دهم.