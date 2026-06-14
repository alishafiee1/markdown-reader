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

**۱. Playwright (Python) چیست؟**

تصور کن یک ربات داری که دقیقاً مثل آدم‌ها با وب‌سایت کار می‌کند: دکمه‌ها را می‌زند، در فرم‌ها تایپ می‌کند، صفحه را اسکرول می‌کند و حتی می‌تواند عکس بگیرد ببیند چه دیده است. Playwright همان ربات است. یک کتابخانه در پایتون است که به تو اجازه می‌دهد تست‌های E2E (End-to-End) بنویسی؛ یعنی کل مسیر کاربر را از اول تا آخر شبیه‌سازی کنی.

**۲. کجا باید نصب و اجرا شود؟**

اینجا یک نکته فنی مهم است:

- **سرور اوبونتو (Ubuntu Server)** : چون پروژه آنجا اجرا می‌شود و تو از طریق Remote-SSH وصل شده‌ای، Playwright باید در همان سرور اوبونتو نصب شود.
- **چرا؟** چون Playwright باید بتواند به آدرس `localhost` یا IP سرور دسترسی داشته باشد تا داشبوردت را باز کند.

**۳. مشکل SSH و دیدن خروجی‌ها؟**

وقتی روی سرور اوبونتو هستی و احتمالاً هیچ رابط گرافیکی (GUI) مثل ویندوز نداری، Playwright به صورت **Headless** (بدون صفحه) اجرا می‌شود. یعنی مرورگر باز می‌شود ولی تو نمی‌بینی‌اش.

اما چطور خروجی را ببینی؟ Playwright ابزارهای عالی برای این کار دارد:

- **HTML Report** : گزارش‌هایی که در مرورگر خودت (روی لپ‌تاپ ویندوز) باز می‌کنی و مرحله به مرحله تست را می‌بینی.
- **Screenshots** : عکس از لحظه شکست تست یا موفقیت.
- **Videos** : ضبط ویدیو از کل عملیات تست.
- **Trace Viewer** : یک ابزار حرفه‌ای که مثل دیباگر عمل می‌کند.

**تداخل با SSH** : هیچ تداخلی ندارد. تو از طریق SSH کدها را منتقل می‌کنی، دستور اجرای تست را می‌دهی، و Playwright در پس‌زمینه سرور کارش را می‌کند.

</div>

<div dir="rtl" style="text-align:right;">

حتماً، قانون مربوط به چینش حروف (RTL و LTR) رو رعایت می‌کنم تا متن فارسی و کلمات انگلیسی مثل Playwright و Trace Viewer درست دیده بشن.

در مورد Trace Viewer که قبلاً بهش اشاره کردم، بذار خیلی ساده و قدم‌به‌قدم برات توضیح بدم:

### Trace Viewer چیست؟
تصور کن داری یه ویدیو از کل عملیات تست می‌بینی، اما نه فقط ویدیو! Trace Viewer یه ابزار خفن توی Playwright هست که مثل یه دیباگر (Debugger) یا ضبط‌کننده حرفه‌ای عمل می‌کنه. وقتی تستت اجرا میشه، Playwright می‌تونه یه Trace (ردپا) کامل از همه اتفاقاتی که افتاده ضبط کنه.

### چطور کار می‌کنه؟
۱.  **ضبط خودکار:** موقع اجرای تست، Trace Viewer همه چیز رو ذخیره می‌کنه:
    *   هر کلیک، تایپ یا اسکرولی که انجام شده.
    *   هر درخواستی که مرورگر به سرور زده (Network Requests).
    *   پیام‌های کنسول (Console Logs) که ممکنه خطا داشته باشن.
    *   حتی عکس‌های لحظه‌ای (Snapshots) از صفحه در هر ثانیه.

۲.  **دیدن خروجی (روی ویندوز):** بعد از اینکه تست روی سرور اوبونتو تموم شد، فایل‌های ضبط شده رو می‌تونی روی لپ‌تاپ ویندوزیت باز کنی. با دستور زیر می‌تونی این فایل رو توی مرورگر خودت (روی ویندوز) باز کنی و مثل یه فیلم تعاملی جلو و عقب بری:
    <pre><code>playwright show-trace trace.zip</code></pre>

### چرا برای سناریوی تو عالیه؟
*   **بدون نیاز به مانیتور روی سرور:** چون سرور اوبونتو شاید مانیتور یا رابط گرافیکی نداشته باشه، Trace Viewer فایل رو ضبط می‌کنه و تو روی ویندوز با خیال راحت بررسی می‌کنی.
*   **دیباگ دقیق:** اگه تست جایی خطا بده، می‌تونی دقیقاً بری روی اون ثانیه، ببینی صفحه چی نشون می‌داده، چه خطایی توی کنسول بوده و چه درخواستی به سرور رفته.

### تفاوتش با Screenshot و Video چیه؟
*   **Screenshot:** فقط یه عکس ساده از لحظه شکسته.
*   **Video:** یه فیلم معمولیه که فقط تصویر رو نشون میده.
*   **Trace Viewer:** یه ابزار تعاملی هست. تو می‌تونی روی المان‌های صفحه کلیک کنی، کد HTML رو ببینی و دقیقاً بفهمی چرا تست شکست خورده.

---

حالا که هم Playwright رو فهمیدی و هم Trace Viewer رو، آماده‌ایم که بریم سراغ **ایجاد اولین تست**؟ یا سوال دیگه‌ای در مورد نحوه ضبط و دیدن این فایل‌ها روی ویندوز داری؟


