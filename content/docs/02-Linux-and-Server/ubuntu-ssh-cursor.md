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

/* RTL tables --- visual column order for RTL readers; cell text direction per column type */
table {
    direction: rtl;
    text-align: right;
    width: 100%;
    border-collapse: collapse;
    margin-inline-start: 0;
    margin-inline-end: auto;
}

thead th,
tbody td {
    vertical-align: top;
    padding: 0.35em 0.5em;
    unicode-bidi: isolate;
}

/* Header row: both titles are Persian in these docs */
thead th {
    direction: rtl;
    text-align: right;
}

/*
  Body row column 1: tool / path names — mostly Latin; RTL on this cell scrambles English + `code`.
  Body row column 2: Persian descriptions.
*/
tbody td:first-child {
    direction: ltr;
    text-align: start;
}

tbody td:last-child {
    direction: rtl;
    text-align: right;
}

/* Inline identifiers inside Persian cells stay LTR without breaking surrounding RTL */
tbody td:last-child code {
    direction: ltr;
    unicode-bidi: isolate;
    text-align: left;
    display: inline-block;
    max-width: 100%;
    word-break: break-word;
}

/* Code in the first (Latin) column: keep normal inline flow */
tbody td:first-child code {
    direction: ltr;
    unicode-bidi: isolate;
    text-align: left;
    display: inline;
}
</style>

## اتصال با Cursor به اوبونتو جدید (خلاصه و مرحله‌به‌مرحله)

**کل ماجرا یعنی چی؟** می‌خوای از ویندوز «درِ پشتی امن» به اوبونتو وصل بشی، بعد Cursor همون‌جا (روی خود اوبونتو) پوشهٔ پروژه رو باز کنه؛ انگار کیبورد و ادیتورت رفته اون طرف، ولی صفحه هنوز همین‌جاست.

| ابزار / مفهوم | به زبون خودمونی |
|----------------|------------------|
| **SSH** | تونل امن برای زدن دستور و باز کردن فایل روی ماشین دور؛ مثل تماس رمزنگاری‌شده به جای درِ باز. |
| **OpenSSH Server** (`openssh-server`) | برنامه‌ای روی اوبونتو که می‌گه «بیا از بیرون وصل شو»؛ بدون اون کسی از شبکه نمی‌تونه SSH بزنه. |
| **`ssh` (روی ویندوز)** | کلاینت؛ همون چیزی که از PowerShell یا CMD می‌زنی تا «بری تو» اوبونتو. |
| **`ssh-keygen`** | جفت کلید می‌سازه: یکی **خصوصی** (فقط تو)، یکی **عمومی** (می‌ذاری روی سرور). |
| **`authorized_keys`** | دفترچهٔ «این کلیدها رو قبول کن» روی اوبونتو؛ اگر کلیدت اینجا باشه، معمولاً دیگه هر بار رمز نمی‌خواد. |
| **`~/.ssh/config`** | دفترچهٔ میانبر ویندوز: به‌جای تایپ IP و کاربر، یه اسم کوتاه مثل `ubuntu-ash` می‌زنی. |
| **Cursor + Remote SSH** | همون VS Code Remote؛ ادیتور رو به SSH وصل می‌کنه تا فایل‌ها و ترمینال **روی اوبونتو** باشن. |

---

### ۱) روی اوبونتو جدید

**این مرحله چیکار می‌کنیم؟** آدرس ماشین رو پیدا می‌کنیم، درِ SSH رو باز می‌کنیم، و مطمئن می‌شیم یه کاربر عادی برای ورود داریم.

- **IP** یعنی آدرس خونهٔ اوبونتو توی شبکه؛ الان برای این ماشین **`192.168.88.95`** است. با `ip a` می‌توانی دوباره چک کنی؛ یا از تنظیمات گرافیکی شبکه بگیر.
- **`apt` / `sudo apt`** مدیر نصب بستهٔ اوبونتوست؛ `update` فهرست بسته‌ها رو تازه می‌کنه، `install` چیزی رو نصب می‌کنه.
- **`openssh-server`** همون سرویس «بیا از بیرون SSH بزن».
- **`systemctl enable --now ssh`** یعنی سرویس SSH همین الان روشن بشه و بعد از ری‌استارت هم خودکار بالا بیاد.
- **کاربر (User)** همون اکانتیه که باهاش لاگین می‌کنی؛ اینجا **`ash`** است؛ رمزش رو برای اولین اتصال (قبل از کلید) لازم داری.

---

### ۲) روی ویندوز (کلید SSH)

**این مرحله چیکار می‌کنیم؟** یه «مدارک هویتی رمزنگاری‌شده» می‌سازیم یا از قبلی استفاده می‌کنیم، بعد **نسخهٔ عمومی** رو می‌فرستیم روی اوبونتو تا سرور بگه «آها، این ویندوز خودتی».

- **`id_ed25519`** = کلید **خصوصی** (مثل رمز کارت بانک؛ به هیچ‌کس نده).
- **`id_ed25519.pub`** = کلید **عمومی** (مثل کپی مدرک؛ می‌ذاری روی سرور).
- **PowerShell** همون ترمینال آبی ویندوزه؛ `ssh-keygen` رو معمولاً اینجا می‌زنی.
- **`ssh-keygen -t ed25519`** یعنی با الگوریتم **Ed25519** (سبک و امن) کلید بساز؛ `-C` فقط یه برچسبه (مثلاً ایمیل یا اسم دستگاه).

**اگر این فایل‌ها را از قبل داری** (`id_ed25519` و `id_ed25519.pub`)، ساخت دوباره لازم نیست. **اگر نداری**، در PowerShell این را بزن (مسیر پیش‌فرض را با Enter قبول کن؛ برای passphrase هم می‌توانی خالی بگذاری یا رمز بگذاری):

```text
ssh-keygen -t ed25519 -C "alish-windows"
```

بعد از ساخت، فایل‌ها معمولاً این‌جا هستند: **`%USERPROFILE%\.ssh\id_ed25519`** و **`id_ed25519.pub`** (مثلاً زیر `C:\Users\alish\.ssh\`).

**انتقال کلید عمومی به اوبونتو** (یک بار؛ اینجا هنوز با **رمز کاربر** وارد می‌شی):

**PowerShell** (متغیر محیطی با `$env:`):

```text
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh ash@192.168.88.95 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

**CMD** (همان پنجرهٔ سیاه با پرامپت `C:\Users\...>`؛ مسیر کاربر با **`%USERPROFILE%`**، نه `$env:`):

```text
type %USERPROFILE%\.ssh\id_ed25519.pub | ssh ash@192.168.88.95 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

یا مسیر کامل بدون متغیر:

```text
type C:\Users\alish\.ssh\id_ed25519.pub | ssh ash@192.168.88.95 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

- **`type ...`** محتوای فایل `.pub` رو چاپ می‌کنه.
- **`|` (pipe)** خروجی رو می‌فرسته به ورودی دست بعدی.
- **`ssh ash@192.168.88.95 ...`** از ویندوز به همین اوبونتو وصل می‌شه و **یک خط فرمان** روی سرور اجرا می‌کنه.
- **`mkdir -p ~/.ssh`** پوشهٔ مخفی SSH رو می‌سازه اگر نباشه.
- **`cat >> authorized_keys`** متن کلید عمومی رو **آخر فایل** اضافه می‌کنه (کلید قبلی رو پاک نکنه).
- **`chmod 700` / `chmod 600`** دسترسی فایل‌ها رو سفت می‌کنه که اوبونتو اذیتت نکنه و امن‌تر باشه.

این دستور برای **کاربر `ash`** و IP **`192.168.88.95`** آماده است؛ اگر روی اوبونتو کاربر یا IP عوض شد، همان بخش `ssh` را عوض کن.

---

### ۳) فایل کانفیگ SSH در ویندوز

**این مرحله چیکار می‌کنیم؟** به ویندوز می‌گیم: «وقتی گفتم `ubuntu-ash`، برو **`192.168.88.95`**، با کاربر **`ash`**، با همین کلید». دیگه لازم نیست هر بار IP را حفظ کنی.

مسیر: **`C:\Users\alish\.ssh\config`**

```sshconfig
Host ubuntu-ash
    HostName 192.168.88.95
    User ash
    IdentityFile C:\Users\alish\.ssh\id_ed25519
    IdentitiesOnly yes
```

- **`Host`** اسم **لقب**ه؛ هر چی دوست داری بذار.
- **`HostName`** آدرس واقعی (IP یا دامنه).
- **`User`** همون کاربری که روی اوبونتو داری.
- **`IdentityFile`** می‌گه با **کدوم کلید خصوصی** وارد شو.
- **`IdentitiesOnly yes`** یعنی فقط همین کلید رو امتحان کن؛ کمک می‌کنه گیر نکنی به کلیدهای اضافی ویندوز.

اگر پورت SSH را عوض کرده‌اید، خط `Port 2222` (مثال) را هم اضافه کنید.

---

### ۴) تست از ترمینال ویندوز

**این مرحله چیکار می‌کنیم؟** قبل از Cursor، مطمئن می‌شیم «درِ پشتی» واقعاً بازه.

```text
ssh ubuntu-ash
```

- **`ssh`** همون کلاینته؛ اینجا با **لقب**ی که در `config` نوشتی وصل می‌شی.

اگر بدون خطا وارد شوید، SSH درست است.

---

### ۵) داخل Cursor

**این مرحله چیکار می‌کنیم؟** خود ادیتور رو می‌چسبونیم به همون اتصال SSH؛ یعنی فایل‌ها و ترمینال از این به بعد **روی اوبونتو** اجرا می‌شن.

- **افزونه Remote - SSH** بسته‌ایه که به Cursor می‌گه «میزبان راه دور باز کن».
- **`F1`** پالت دستورهاست؛ از اینجا دستور **Connect to Host** رو پیدا می‌کنی و **`ubuntu-ash`** را انتخاب کن (همان `Host` داخل `config`).
- **fingerprint** اولین بار یعنی «اثر انگشت سرور»؛ برای اینکه مطمئن شی به **همون** ماشین وصل شدی نه یکی قلابی؛ یک بار تأیید می‌کنی.
- **مسیر پلتفرم** اگر پرسید، یعنی می‌خواد بدونه SSH ویندوز کجاست؛ معمولاً با پیش‌فرض اوکیه.

---

### فایل‌های مهم

| فایل | نقش |
|--------|-----|
| `C:\Users\alish\.ssh\id_ed25519` | کلید **خصوصی** (محفوظ بماند؛ commit نشود) |
| `C:\Users\alish\.ssh\id_ed25519.pub` | کلید **عمومی**؛ روی سرور در `authorized_keys` |
| `C:\Users\alish\.ssh\config` | نام میزبان، IP، کاربر، مسیر کلید |
| روی اوبونتو: `~/.ssh/authorized_keys` | لیست کلیدهای مجاز برای ورود |

### ریسک‌ها (خیلی کوتاه)

- به‌اشتراک‌گذاشتن **`id_ed25519`** (بدون `.pub`) امنیت را از بین می‌برد.
- اگر **`PermitRootLogin`** یا فایروال اشتباه تنظیم شود، ممکن است قفل شوید؛ قبل از تغییرات حساس یک نشست SSH باز نگه دارید.

---

**واژه‌ها:** **SSH** پروتکل شِل امن روی شبکه؛ **OpenSSH** همان برنامهٔ سرور/کلاینت روی لینوکس؛ **کلید عمومی/خصوصی** مثل قفل و کلید؛ **`authorized_keys`** فهرست کلیدهایی که اجازهٔ ورود بدون رمز (یا با رمز کمتر) می‌دهند؛ **Remote SSH** در Cursor/VS Code یعنی باز کردن پوشهٔ پروژه روی همان ماشین لینوکس از راه دور؛ **Ed25519** نوع الگوریتم ساخت کلید؛ **pipe** (`|`) وصل کردن خروجی یک دستور به ورودی دستور بعدی؛ **fingerprint** اثر انگشت دیجیتال سرور برای تشخیص جعل.

**میزبان این سند:** IP **`192.168.88.95`**، کاربر **`ash`**، نام لقب SSH پیشنهادی **`ubu-ash`** (در Cursor همان را برای Connect to Host بزن).



