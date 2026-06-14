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

# معماری مسیریابی هسته Xray: خروجی‌ها (Outbounds) و قانون‌گذاری

> **تمثیل کاربردی:** هسته Xray شبیه به یک **پایانه بزرگ مسافربری** است. مسافران (بسته‌های ترافیک) از درهای ورودی (Inbounds) مثل اتصال Reality وارد ترمینال می‌شوند. پس از بررسی بلیت، آن‌ها به یک **سالن توزیع مسافر (Routing)** وارد می‌شوند. در این سالن، مامورین راه‌آهن با توجه به مقصد مسافر، آن‌ها را به سمت درهای خروجی مناسب (Outbounds) هدایت می‌کنند تا از ترمینال خارج شوند.

## دروازه‌های خروجی (Outbounds)

هر فیلترشکن برای اینکه اینترنت را به شما برساند، باید ابتدا خودش اینترنت را از سرور دریافت کند. به این درگاه‌های خروج ترافیک از سرور به دنیای بیرون، Outbound می‌گویند.
در Xray، به صورت پیش‌فرض دو درگاه اصلی وجود دارد:
1. درگاه `direct` (با پروتکل freedom): به معنای دسترسی مستقیم و بدون سانسور به اینترنت. مسافرانی که از این در خارج می‌شوند، به طور مستقیم وارد اینترنت جهانی می‌شوند.
2. درگاه `block` (با پروتکل blackhole): سیاه‌چاله! هر بسته‌ای که به این درگاه هدایت شود، بلافاصله نابود می‌شود (برای بلاک کردن ترافیک مزاحم و تحریمی مثل سایتهای ایرانی).

## جادوی تفکیک شبکه در خروجی (sendThrough)

هنگامی که سرور شما در حالت Dual-WAN (دو مودم یا دو کارت شبکه) کار می‌کند، لینوکس ذاتاً تمایل دارد ترافیک را از مودم پیش‌فرض (که عموماً فیلتر است) خارج کند. اما ما می‌خواهیم فیلترشکنمان به اینترنت آزاد وصل شود!

راه‌حل در هسته Xray، ویژگی قدرتمندی به نام **`sendThrough`** است.
شما در بلوک تنظیمات `Outbounds` برای درگاه `direct` مشخص می‌کنید:
```json
{
  "protocol": "freedom",
  "settings": {},
  "tag": "direct",
  "sendThrough": "192.168.88.50"
}
```
این خط به این معناست: *"هر ترافیکی که از این درگاه به سمت اینترنت آزاد می‌رود، به جای استفاده از دروازه پیش‌فرض لینوکس، به زور در کارت شبکه‌ای با آی‌پی `192.168.88.50` (متصل به مودم آزاد) تزریق شود."*
این پارامتر، ضامن کارکرد صحیح سرورهای ترکیبی شماست!

## قوانین مسیریابی (Routing Rules)

سالن توزیع (Routing) دارای قوانینی است که مشخص می‌کند چه کسی باید از کدام درگاه خارج شود:
- **قانون Block:** اگر بسته‌ای به مقصد سایتی با دامنه `.ir` می‌رود، آن را به درگاه `block` (سیاه‌چاله) بفرست تا ترافیک کاربر به سایت‌های داخلی قطع شود و از سمت سازمان‌های دولتی شناسایی نشویم.
- **قانون Direct:** بقیه ترافیک را به درگاه `direct` بفرست تا کاربر بتواند در تلگرام و اینستاگرام بچرخد.
