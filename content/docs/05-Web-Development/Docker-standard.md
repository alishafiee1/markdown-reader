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

## ویژگی‌های یک «داکر خوب» برای اجرای یک برنامه (سرفصل وار)

برای اینکه یک برنامه در داکر درست و حرفه‌ای اجرا بشه، کافیه این ۸ ویژگی رو توی کانتینرت داشته باشی. بقیه چیزا فرعیه.

---

### ۱. **اندازه کوچک (بسته سبک)**
- چرا مهمه؟ دانلود و اجراش سریعه، دیسک کمتری اشغال می‌کنه.
- چطور بدستش میارم؟ از `alpine` یا `slim` به عنوان پایه استفاده کن. لایه‌های اضافه نساز. کش نصب پکیج رو موقع `RUN` پاک کن.

### ۲. **قابلیت حمل (Portable)**
- یعنی بسته رو هر جای دیگه هم ببری، بدون تغییر کار کنه.
- چطور؟ از متغیرهای محیطی برای تنظیمات استفاده کن، نه فایل پیکربندی سخت کد شده. مسیرهای ثابت (absolute) رو درون کانتینر نداشته باش.

### ۳. **مدیریت داده با ولوم (Volume-ready)**
- برنامه باید داده‌هایی که باید بمونه (مثل دیتابیس، فایل آپلودی) رو در یک مسیر مشخص داخل کانتینر ذخیره کنه. مثلاً `/data`.
- اگه ادمین بعداً یه ولوم به این مسیر ببنده، داده‌ها موقع حذف کانتینر از بین نرن.

### ۴. **بررسی سلامت (Healthcheck)**
- داکر می‌تونه هر چند ثانیه یکبار چک کنه آیا برنامه هنوز زنده است یا نه.
- در Dockerfile اضافه کن:  
  `HEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1`
- اگه برنامه کرش کنه، داکر می‌دونه و می‌تونه خودکار ری‌استارت کنه.

### ۵. **لاگ به خروجی استاندارد (log to stdout/stderr)**
- برنامه نباید لاگ رو توی فایل بریزه (مگر به عنوان یک گزینه اضافی). لاگ‌هاش رو چاپ کنه روی خروجی استاندارد (`console.log` یا `print`).
- داکر خودش این لاگ‌ها رو جمع می‌کنه و با `docker logs` نشون میده. برای عیب‌یابی عالیه.

### ۶. **غیر root اجرا شدن**
- برنامه نباید با کاربر `root` توی کانتینر اجرا بشه.
- توی Dockerfile قبل از `CMD` یه کاربر معمولی بساز و بهش دسترسی بده. این کار امنیت کانتینر رو خیلی بالا می‌بره.

### ۷. **پورت مشخص و مستند**
- اگه برنامهات سرویس شبکه است، پورت مورد نظرش رو (مثلاً ۳۰۰۰ یا ۸۰) توی Dockerfile با `EXPOSE` اعلام کن.
- اگه برنامه به چند پورت نیاز داره، همه رو بنویس.

### ۸. **قابلیت ری‌استارت خودکار (Restart Policy)**
- توی دستور `docker run` از `--restart=always` یا `--restart=unless-stopped` استفاده کن.
- با این کار اگر کانتینر crash کنه یا سرور ری‌استارت بشه، داکر خودش دوباره اجراش می‌کنه.

---

### خلاصه توی یک نگاه

| ویژگی | فرمول ساده |
|--------|--------------|
| کوچک | پایه `alpine` + پاک کردن کش |
| قابل حمل | متغیر محیطی به جای فایل تنظیم |
| ولوم | داده توی `/data` یا مشابه |
| سلامت | `HEALTHCHECK` توی Dockerfile |
| لاگ | چاپ روی stdout/stderr |
| امن | کاربر غیر root |
| پورت | `EXPOSE` |
| ری‌استارت | `--restart=always` |

اگه کانتینرت این ۸ تا رو داشته باشه، می‌تونی با خیال راحت بگی **«داکر من خوب و حرفه‌ای است»**. 😊