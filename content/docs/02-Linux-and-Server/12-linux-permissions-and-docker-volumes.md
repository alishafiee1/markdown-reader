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

# مجوزهای لینوکس و فضاهای ذخیره‌سازی داکر (Docker Volumes)

> **تمثیل کاربردی:** لینوکس مانند یک **بانک فوق‌امنیتی** است. در این بانک، هر کارمند (کاربر) فقط می‌تواند صندوق امانات (فایل‌ها) خودش را باز کند. داکر (Docker) در این بانک مانند یک **باجه امنیتی سیار** است. شما به داکر می‌گویید در این باجه، نرم‌افزاری اجرا شود، اما از طرفی به این نرم‌افزار اجازه می‌دهید که به کشوی میز کار شما (فولدرهای روی هاست) دسترسی پیدا کند تا پرونده‌هایش را در آن ذخیره کند. این ارتباط جادویی با مفهومی به نام Volume برقرار می‌شود.

## داکر ולوم (Volume Mounting) چیست؟

کانتینرهای داکر ذاتاً **فرار و بی‌حافظه (Stateless)** هستند. اگر یک کانتینر پاک شود، تمام فایل‌های داخل آن هم برای همیشه نابود می‌شوند. برای اینکه اطلاعات حیاتی پنل (مانند رمز عبور کاربران یا تنظیمات دیتابیس `x-ui.db`) با پاک شدن داکر از بین نرود، ما یک پل ارتباطی بین کانتینر داکر و هارد دیسک اصلی سرور لینوکس ایجاد می‌کنیم. 

این پل در قالب کدی شبیه به این در تنظیمات داکر (`docker-compose.yml`) نمایان می‌شود:
```yaml
volumes:
  - /home/ash/3x-ui/db/:/etc/x-ui/
```
این خط به داکر می‌گوید: "پوشه `/etc/x-ui/` درون کانتینر خودت را دور بینداز و به جای آن، مستقیماً از پوشه `/home/ash/3x-ui/db/` روی هارد دیسک واقعی من استفاده کن!" 
نتیجه؟ هر تغییری در پنل بدهید، فوراً روی هارد لینوکس ذخیره می‌شود.

## بحران مجوزها (Permissions) و قفل دیتابیس

لینوکس بسیار سخت‌گیر است. فایل دیتابیس SQLite (`x-ui.db`) روی هارد شما یک مالک (Owner) دارد (مثلا کاربر `root` یا `ash`). وقتی نرم‌افزار داخل داکر می‌خواهد در این فایل چیزی بنویسد، لینوکس ابتدا کارت شناسایی داکر را چک می‌کند.

### خطای ترسناک: `database is locked` یا `readonly database`

اگر یک اسکریپت پایتون خارجی روی هاست سعی کند دیتابیس را مستقیماً ویرایش کند در حالی که داکر نیز آن دیتابیس را باز نگه داشته است، لینوکس یا موتور دیتابیس فوراً فایل را قفل (Lock) می‌کنند تا اطلاعات خراب نشود.
همچنین اگر داکر سعی کند فایلی را بخواند که شما با کاربر دیگری (بدون دسترسی خواندن/نوشتن برای عموم) ایجاد کرده‌اید، خطای Read-only دریافت می‌کند.

### راه‌حل طلایی:

1. **مدیریت صحیح دسترسی:** اگر فایلی را روی هاست ایجاد می‌کنید تا داکر آن را بخواند، مطمئن شوید که داکر اجازه خواندن و نوشتن آن را دارد. (مثلا با `chmod 644` یا `chmod 666` اگر نیاز به نوشتن است).
2. **عدم ویرایش همزمان:** هرگز دیتابیس `x-ui.db` را در حالی که پنل در حال کار است، به صورت مستقیم از طریق اسکریپت ویرایش نکنید (مگر با استفاده از اتصال‌های مجاز و رعایت Timeout). همیشه ابتدا کانتینر داکر را خاموش کنید (`docker stop`)، تغییرات را روی دیتابیس اعمال کنید، و دوباره کانتینر را روشن کنید.
