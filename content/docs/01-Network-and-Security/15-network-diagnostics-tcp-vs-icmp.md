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

# عیب‌یابی پیشرفته شبکه: تفاوت ICMP (Ping) و ارتباط TCP (Socket)

> **تمثیل کاربردی:** تصور کنید می‌خواهید بدانید آیا دوستتان در خانه است یا نه. یک راه این است که یک سنگ‌ریزه به پنجره او بزنید و منتظر بمانید تا او با دست تکان دادن پاسخ دهد (این دقیقا کار Ping است). اما راه دوم این است که درِ خانه او را بزنید، با او دست بدهید و یک مکالمه طولانی را آغاز کنید (این کار ارتباط سوکت TCP است).

## دروغی به نام `ping` در شبکه‌های فیلترشده!

سال‌هاست که مدیران شبکه برای تست اینکه آیا یک سرور اینترنت دارد یا خیر، از دستور معروف `ping 8.8.8.8` استفاده می‌کنند. دستور Ping از پروتکلی به نام **ICMP** استفاده می‌کند که صرفاً بسته‌های کوچکِ درخواست و پاسخ هستند.

**مشکل کجاست؟**
در سیستم فیلترینگ شدید و شبکه‌های بحرانی، سازمان‌های مسدودکننده (یا سیستم‌های DPI) معمولاً برای کنترل پهنای باند و محدودسازی ابزارهای دور زدن، پروتکل ICMP را **به طور کامل مسدود یا محدود (Drop)** می‌کنند. 
این یعنی وقتی شما سایتی مثل `aparat.com` را پینگ می‌کنید، ممکن است به شما خطای `Timeout` بدهد! این باعث می‌شود یک مدیر شبکه آماتور فکر کند که سرورش اینترنت ندارد! در حالی که اگر همان سایت را در مرورگر باز کند، در کمال تعجب می‌بیند سایت کاملاً لود می‌شود. مرورگرها از پینگ استفاده نمی‌کنند، آن‌ها از **TCP** استفاده می‌کنند!

## تست هوشمندانه با سوکت TCP (TCP Handshake)

برای اینکه درگیر دروغ‌های فیلترینگ نشویم، باید شبکه را مثل یک کلاینت واقعی تست کنیم. ارتباط TCP بر پایه پورت‌ها است (مثل پورت ۴۴۳ برای HTTPS).
وقتی ما با استفاده از زبان‌های برنامه‌نویسی (مثل پایتون و متد `socket.create_connection`) به پورت ۴۴۳ سایت دیجی‌کالا یا گوگل وصل می‌شویم، پروسه زیر رخ می‌دهد:
1. یک بسته همگام‌سازی (`SYN`) ارسال می‌شود.
2. سرور مقصد بسته تایید (`SYN-ACK`) را برمی‌گرداند.
3. اتصال به صورت کامل شکل می‌گیرد.

**مزیت بزرگ این روش:**
سیستم فیلترینگ نمی‌تواند ترافیک لایتمند (مانند Handshake پورت ۴۴۳) سایت‌های مجاز و داخلی (مثل آپارات و دیجی‌کالا) را ببندد، چون در این صورت کل اینترنت کشور از کار می‌افتد. بنابراین اگر پینگ شما خطای `100% Packet Loss` داد، اما اسکریپت تشخیص مبتنی بر TCP Socket به شما پیام داد که *"اتصال به پورت ۴۴۳ دیجی‌کالا برقرار شد"*, شما مطمئن می‌شوید که اینترنت سرور وصل است و مشکل فقط فیلترینگ پروتکل‌های جانبی است.

> [!TIP]
> **نکته کلیدی:** در توسعه ابزارهای تشخیص شبکه (Diagnostics)، همیشه به جای دستور `ping`، از تست اتصال به **پورت ۸۰ یا ۴۴۳** سایت‌های معتبر با سوکت‌های `TCP` استفاده کنید تا نتیجه‌ای ۱۰۰٪ واقعی دریافت کنید.
