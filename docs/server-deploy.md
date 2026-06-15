<div dir="rtl" style="text-align:right;">

# راه‌اندازی روی سرور

**یک خط:** همین پروژه را مستقیم روی لینوکس (مثلاً `192.168.88.50`) با Node و پورت **۴۰۰۱** بالا می‌آوری — بدون CMS، بدون reverse proxy اجباری (هرچند nginx اختیاری است).

---

فرض کن روی سرور خانگی یا VPS با SSH وصل می‌شوی و می‌خواهی کتابخانهٔ `content/docs` را برای بقیهٔ شبکهٔ محلی باز کنی. کافی است Node نصب باشد، پروژه را ببری روی سرور، `npm install` و `npm start` — آدرس می‌شود `http://IP:4001`.

---

## پیش‌نیاز

- Node.js 18 یا بالاتر (`node -v`)
- git (برای clone) یا کپی فایل با scp/rsync
- پورت **۴۰۰۱** باز در فایروال (اگر از بیرون LAN می‌خوانی)

---

## نصب اولیه

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
export PORT=4001
export HOST=0.0.0.0
npm start
```

از مرورگر: `http://192.168.88.50:4001`

`Ctrl+C` برای توقف.

---

## اجرای دائم با pm2

```bash
npm install -g pm2
cd ~/markdown-reader
pm2 start server.js --name markdown-reader --env production
pm2 save
pm2 startup   # دستور systemd را اجرا کن
```

متغیر env در ecosystem (اختیاری) `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'markdown-reader',
    script: 'server.js',
    env: {
      PORT: 4001,
      HOST: '0.0.0.0',
      NODE_ENV: 'production',
    },
  }],
};
```

```bash
pm2 start ecosystem.config.cjs
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
Environment=PORT=4001
Environment=HOST=0.0.0.0
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
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## به‌روزرسانی محتوا

فایل‌های جدید را در `content/docs` بگذار. ایندکس متادیتا در **startup** به‌صورت خودکار (غیرمسدودکننده) اجرا می‌شود. برای بازسازی دستی:

```bash
curl -X POST -b "md_reader_session=..." http://127.0.0.1:4001/api/sync-index
```

(با کوکی نشست ادمین — یا از UI بعد از ورود admino)

---

## دیتابیس و داده

- SQLite: `data/articles.db` — در git نیست؛ روی سرور بماند
- بکاپ: `cp data/articles.db data/articles.db.bak`
- عکس جلد (فاز BookShelf): `data/covers/`

---

## امنیت ساده

- رمز ادمین seed را بعد از اولین ورود عوض کن
- اگر از اینترنت عمومی در دسترس است، پشت nginx با HTTPS و محدودیت IP فکر کن
- این پروژه برای شبکهٔ شخصی/تیمی طراحی شده، نه SaaS عمومی

---

## عیب‌یابی

| علامت | کار |
|--------|-----|
| `EADDRINUSE` | پورت 4001 اشغال است — `ss -tlnp \| grep 4001` |
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
