<div dir="rtl" style="text-align:right;">

# راه‌اندازی روی سرور

**یک خط:** همین پروژه را مستقیم روی لینوکس (مثلاً `192.168.88.50`) با Node و پورت **۴۰۰۲** بالا می‌آوری — بدون CMS، بدون reverse proxy اجباری (هرچند nginx اختیاری است).

---

فرض کن روی سرور خانگی یا VPS با SSH وصل می‌شوی و می‌خواهی کتابخانهٔ `content/docs` را برای بقیهٔ شبکهٔ محلی باز کنی. کافی است Node نصب باشد، پروژه را ببری روی سرور، `npm install` و `npm start` — آدرس می‌شود `http://IP:4002`.

---

## پیش‌نیاز

- Node.js 18 یا بالاتر (`node -v`)
- git (برای clone) یا کپی فایل با scp/rsync
- پورت **۴۰۰۲** آزاد (یا پورت دیگری که با `PORT` تنظیم می‌کنی)
- پورت **۴۰۰۲** باز در فایروال سرور (اگر از بیرون LAN می‌خوانی)

---

## اجرای محلی (ویندوز — تست قبل از deploy)

فرض کن روی لپ‌تاپ می‌خواهی اول مطمئن شوی همه‌چیز کار می‌کند، بعد ببریش روی سرور.

```powershell
cd "D:\2 Curent project git\Ai_projects\markdown-reader-module"
npm install
npm start
```

مرورگر: `http://127.0.0.1:4002/`

پیش‌فرض `server.js` همان **۴۰۰۲** و bind روی **`0.0.0.0`** است؛ برای تست محلی معمولاً لازم نیست `PORT` و `HOST` را دستی بگذاری.

**توقف و آزاد کردن پورت**

- `Ctrl+C` در همان ترمینال — سرور graceful بسته می‌شود.
- بستن پنجرهٔ ترمینال (ویندوز) — با شنود `stdin-close` پورت آزاد می‌شود.
- اگر پروسهٔ یتیم ماند: `npm run stop` (همان پورت پیش‌فرض ۴۰۰۲ را پاک می‌کند).

اگر پورت اشغال بود (`EADDRINUSE`):

```powershell
npm run stop
npm start
```

**اسموک سریع** (باید JSON لیست پوشه‌ها برگردد):

```powershell
Invoke-RestMethod http://127.0.0.1:4002/api/browse
```

ورود ادمین اولیه: کاربر `admino` — رمز پیش‌فرض `admino` (با `ADMIN_SEED_PASSWORD` قابل عوض کردن).

---

## نصب اولیه (سرور لینوکس)

```bash
cd ~
git clone <repo-url> markdown-reader
cd markdown-reader
npm install
```

محتوای مارک‌داون باید داخل `content/docs/` باشد. اگر از ویندوز sync می‌کنی:

```powershell
scp -r "D:\...\markdown-reader-module\content\docs" ash@192.168.88.50:~/markdown-reader/content/
```

---

## اجرای دستی (تست)

```bash
export PORT=4002
export HOST=0.0.0.0
npm start
```

از مرورگر: `http://192.168.88.50:4002`

`Ctrl+C` برای توقف. روی لینوکس هم `npm run stop` پورت پیش‌فرض را آزاد می‌کند. اگر پورت گیر کرد: `npm run stop` (لینوکس/ویندوز).

---

## اجرای دائم با pm2

فایل `ecosystem.config.cjs` در ریشهٔ پروژه (یا همین محتوا را بساز):

```javascript
module.exports = {
  apps: [{
    name: 'markdown-reader',
    script: 'server.js',
    env: {
      PORT: 4002,
      HOST: '0.0.0.0',
      NODE_ENV: 'production',
      COOKIE_SECURE: 'true',
      TRUST_PROXY: '1',
      // ADMIN_SEED_PASSWORD: 'رمز-قوی-اولیه',
    },
  }],
};
```

```bash
npm install -g pm2
cd ~/markdown-reader
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # دستور systemd را اجرا کن
```

---

## systemd (بدون pm2)

فایل `/etc/systemd/system/markdown-reader.service`:

```ini
[Unit]
Description=Markdown Reader BookShelf
After=network.target

[Service]
Type=simple
User=ash
WorkingDirectory=/home/ash/markdown-reader
Environment=PORT=4002
Environment=HOST=0.0.0.0
Environment=NODE_ENV=production
Environment=COOKIE_SECURE=true
Environment=TRUST_PROXY=1
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now markdown-reader
sudo systemctl status markdown-reader
```

---

## nginx جلو (اختیاری)

اگر می‌خواهی از پورت 80 بخوانی:

```nginx
server {
    listen 80;
    server_name docs.local;

    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

اگر پروژه را روی اینترنت یا پشت HTTPS می‌گذاری، حتماً `NODE_ENV=production` و `COOKIE_SECURE=true` را هم بگذار. این دو مثل این‌اند که روی کوکی ورود کاربر یک برچسب «فقط از مسیر امن بفرست» می‌زنیم؛ یعنی مرورگر کوکی نشست را روی HTTP ساده نمی‌فرستد.

وقتی nginx جلوی Node است، `TRUST_PROXY=1` هم لازم است تا Express بداند درخواست واقعی از پشت proxy آمده. نمونهٔ حداقلی برای HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name docs.example.com;

    ssl_certificate /etc/letsencrypt/live/docs.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## به‌روزرسانی محتوا

فایل‌های جدید را در `content/docs` بگذار. ایندکس متادیتا در **startup** به‌صورت خودکار (غیرمسدودکننده) اجرا می‌شود. برای بازسازی دستی:

```bash
curl -X POST -b "md_reader_session=..." http://127.0.0.1:4002/api/sync-index
```

(با کوکی نشست ادمین — یا از UI بعد از ورود admino)

---

## دیتابیس و داده

- SQLite: `data/articles.db` — در git نیست؛ روی سرور بماند
- بکاپ: `cp data/articles.db data/articles.db.bak`
- عکس جلد (فاز BookShelf): `data/covers/`

---

## امنیت ساده

- کاربر seed: `admino` — رمز پیش‌فرض `admino`؛ در production با `ADMIN_SEED_PASSWORD` قبل از اولین `npm start` عوض کن
- اگر رمز seed را قبل از اولین اجرا عوض نکنی، برنامه فقط هشدار می‌دهد؛ endpoint تغییر رمز هنوز جزو فاز بعدی است
- `COOKIE_SECURE=true` و `TRUST_PROXY=1` را وقتی پشت HTTPS/nginx هستی فعال کن
- مسیرهای خواندن کتابخانه مثل `/api/browse`، `/api/doc` و `/api/search` عمداً عمومی‌اند؛ اما پیشرفت مطالعه، تنظیمات کاربر و کارهای ادمین نیاز به ورود دارند
- اگر از اینترنت عمومی در دسترس است، پشت nginx با HTTPS و محدودیت IP فکر کن
- این پروژه برای شبکهٔ شخصی/تیمی طراحی شده، نه SaaS عمومی

---

## عیب‌یابی

| علامت | کار |
|--------|-----|
| `EADDRINUSE` | پورت اشغال است — `npm run stop` · لینوکس: `ss -tlnp \| grep 4002` · ویندوز: `netstat -ano \| findstr :4002` |
| پورت بعد از بستن ترمینال هنوز اشغال است | `npm run stop` — یا node یتیم را با taskkill/kill متوقف کن |
| صفحه باز نمی‌شود از LAN | `HOST` باید `0.0.0.0` باشد، نه `127.0.0.1` |
| لیست خالی | `content/docs` خالی است یا sync نزدی |
| خطای sql.js | `npm install` دوباره؛ Node 18+ |

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
  font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important;
  direction: rtl;
  text-align: right;
}
pre, code { direction: ltr; text-align: left; }
table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
table th, table td { text-align: right !important; padding: 0.35em 0.5em; }
</style>
