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

# فایروال UFW، مخفی‌سازی پورت‌ها و مقابله با حملات (Fail2ban)

> **تمثیل کاربردی:** سیستم‌عامل لینوکس مانند یک **دژ نظامی** است. این دژ هزاران درگاه (پورت) دارد. ابزار UFW مانند فرمانده نگهبانان دژ است که مشخص می‌کند کدام درها باز و کدام درها کاملاً جوش‌داده و بسته شوند. اما اگر یک مهاجم بیاید و هزاران بار رمز ورود را روی یک درِ باز امتحان کند چه؟ اینجاست که دستیار امنیتی به نام Fail2ban وارد می‌شود تا فرد مهاجم را شناسایی و برای همیشه به سیاه‌چال (لیست بن) بیندازد!

## ۱. فایروال UFW (Uncomplicated Firewall)

دسترسی به پورت‌ها در لینوکس، مرز بین امنیت و فاجعه است. اسکنرهای هوشمند فیلترینگ دائماً به پورت‌های باز سرورهای ایرانی سرک می‌کشند. 
**یک اشتباه مرگبار:** اگر شما پنل 3x-ui را نصب کنید و پورت آن (مثلا ۲۰۵۳ یا ۱۰۱۰۰) را برای عموم اینترنت (Anywhere) باز بگذارید، اسکنرها با ارسال یک پکت HTTP متوجه وجود سیستم فیلترشکن شده و آی‌پی سرور شما را درجا مسدود (Blacklist) می‌کنند.

### راهکار مخفی‌سازی پورت (Port Hiding):
شما با UFW باید پورت پنل مدیریت را روی **اینترنت عمومی ببندید** و آن را صرفاً برای شبکه داخلی (LAN) باز کنید.
```bash
sudo ufw deny 10100/tcp   # هیچ‌کس در اینترنت عمومی حق دیدن پنل را ندارد
sudo ufw allow from 192.168.1.0/24 to any port 10100  # فقط سیستم‌های داخل خانه/شرکت دسترسی دارند
```

### چگونه از راه دور به پنل مخفی وصل شویم؟ (SSH Tunneling)
وقتی پورت بسته است، شما می‌توانید از طریق تونل امن SSH به سرور وصل شوید. SSH به شما یک مسیر کاملاً رمزنگاری شده در پورت ۲۲ می‌دهد تا بتوانید پورت‌های داخلی لینوکس را روی کامپیوتر شخصی خودتان باز کنید.

---

## ۲. نگهبان هوشمند: Fail2ban

باز بودن پورت SSH (پورت ۲۲) برای دسترسی شما ضروری است، اما همین پورت روزانه هزاران بار مورد حمله ربات‌های کرکر (Brute-force) قرار می‌گیرد که می‌خواهند رمز عبور لینوکس شما را حدس بزنند.

نرم‌افزار `Fail2ban` یک سرویس ناظر است که به صورت مداوم فایل‌های لاگ سیستم را می‌خواند. عملکرد آن به این شکل است:
1. ربات مهاجم تلاش می‌کند با رمز `12345` وارد شود. خطا می‌دهد.
2. لاگ لینوکس می‌نویسد: "تلاش ناموفق از آی‌پی 5.5.5.5".
3. این کار ۳ بار تکرار می‌شود.
4. Fail2ban وارد عمل شده و به UFW دستور می‌دهد: **"آی‌پی 5.5.5.5 را درجا و به طور کامل از نزدیک شدن به این سرور محروم (Ban) کن!"**

نصب و کانفیگ Fail2ban یکی از ارزان‌ترین و سریع‌ترین روش‌ها برای بالا بردن چشمگیر امنیت سرورهای لینوکسی در برابر هکرهای خودکار است.
