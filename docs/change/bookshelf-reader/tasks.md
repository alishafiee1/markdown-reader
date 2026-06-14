<div dir="rtl" style="text-align:right;">

# تسک‌ها — BookShelf Reader

> طبق [design.md](./design.md) و [ui-behavior.md](./ui-behavior.md)

**یک خط:** قدم‌های ساخت کتابخانهٔ مارک‌داون با explorer، تم‌های مطالعه، auth اختیاری و deploy روی پورت ۴۰۰۱.

**فازها:** ۰ پایه و DB → ۱ explorer و مطالعه → ۲ تم و UI → ۳ auth و progress → ۴ ادمین و جلد → ۵ جستجو و deploy → ۶ تست و جمع‌بندی

---

## فاز ۰ — پایه، schema و پورت

> **ریسک:** اگر bind روی 127.0.0.1 بماند، روی سرور از بیرون دیده نمی‌شود.

- [ ] ۰.۱ schema جدید: `users`, `sessions`, `user_preferences`, `book_metadata`, `reading_progress` در `db/schema.sql`
- [ ] ۰.۲ migration/init: اگر DB نبود بساز؛ seed ادمین `admino` با hash امن (رمز اولیه طبق design)
- [ ] ۰.۳ `server.js`: `PORT` پیش‌فرض **4001** برای production؛ bind `0.0.0.0` وقتی `NODE_ENV=production` یا `HOST=0.0.0.0`
- [ ] ۰.۴ سرویس `browse-tree.js`: لیست امن یک سطح از `content/docs`
- [ ] ۰.۵ تست خودکار: path با `..` → 400
- [ ] ۰.۶ **تموم شدن فاز:** `GET /api/browse` ریشه لیست پوشه‌ها را برمی‌گرداند

---

## فاز ۱ — Explorer و خواندن سند

> **ریسک:** sync قدیمی فقط سطح اول — باید با browse جایگزین شود.

- [ ] ۱.۱ `GET /api/doc?path=` — خواندن فایل + رندر HTML
- [ ] ۱.۲ استخراج title/description از خطوط اول یا heading (تابع مشترک با metadata)
- [ ] ۱.۳ UI کتابخانه: breadcrumb، grid پوشه/کارت کتاب
- [ ] ۱.۴ کلیک کتاب → صفحهٔ مطالعه؛ بازگشت breadcrumb درست
- [ ] ۱.۵ URL با `?path=` برای deep link
- [ ] ۱.۶ تست E2E دستی: `content/docs/00-start-new-project/readme.md` باز و نمایش داده شود
- [ ] ۱.۷ **تموم شدن فاز:** مرور زیرپوشه‌ها مثل اکسپلورر کار کند

---

## فاز ۲ — ظاهر BookShelf و تم‌های مطالعه

> طبق [reading-themes-guide.md](./reading-themes-guide.md) و ui-behavior

- [ ] ۲.۱ CSS tokens: پوسته تیره اپ (`--bg-black`, `--accent-blue`, …)
- [ ] ۲.۲ صفحهٔ خانه: جستجو، categories از پوشه‌های سطح اول، bottom nav
- [ ] ۲.۳ چهار تم مطالعه + سه سطح اندازهٔ متن
- [ ] ۲.۴ حالت تمام‌صفحه + Esc
- [ ] ۲.۵ واکنش‌گرا: 375px، 768px، 1024px — بدون اسکرول افقی
- [ ] ۲.۶ جایگزینی ایموجی‌های فعلی با SVG
- [ ] ۲.۷ `prefers-reduced-motion` و contrast تم‌ها
- [ ] ۲.۸ تست دستی: هر چهار تم روی یک سند فارسی/انگلیسی
- [ ] ۲.۹ **تموم شدن فاز:** ظاهر نزدیک به مرجع BookShelf

---

## فاز ۳ — حساب کاربری و ادامهٔ مطالعه

- [ ] ۳.۱ `POST register/login/logout`, `GET /api/me`
- [ ] ۳.۲ session cookie httpOnly
- [ ] ۳.۳ `PUT /api/progress` با debounce کلاینت
- [ ] ۳.۴ `GET /api/progress/recent` — حداکثر ۳ مورد
- [ ] ۳.۵ بخش «ادامه بده» در خانه برای کاربر لاگین
- [ ] ۳.۶ مهمان: `localStorage` برای تم + یک سند اخیر (اختیاری)
- [ ] ۳.۷ `PUT /api/me/preferences` برای تم و font scale
- [ ] ۳.۸ تست E2E: login → مطالعه → بستن → بازگشت → همان scroll
- [ ] ۳.۹ **تموم شدن فاز:** سه کتاب آخر با موقعیت درست

---

## فاز ۴ — پنل ادمین و جلد کتاب

- [ ] ۴.۱ middleware نقش admin
- [ ] ۴.۲ `PATCH /api/admin/books/:path` — title, description, cover color
- [ ] ۴.۳ `POST .../cover` — multer، max 2MB، jpeg/png/webp
- [ ] ۴.۴ modal ویرایش در UI کتابخانه (فقط admin)
- [ ] ۴.۵ پیش‌نمایش جلد: رنگ یا عکس؛ fallback خطوط اول md
- [ ] ۴.۶ banner «رمز پیش‌فرض را عوض کنید» برای admino
- [ ] ۴.۷ تست دستی: آپلود جلد + نمایش در grid
- [ ] ۴.۸ **تموم شدن فاز:** ادمین metadata کامل

---

## فاز ۵ — جستجو و همگام‌سازی

- [ ] ۵.۱ `GET /api/search?q=` روی title, description, filename
- [ ] ۵.۲ جستجوی درون‌متنی در صفحهٔ مطالعه + highlight
- [ ] ۵.۳ `POST /api/sync-index` — بازسازی metadata خالی از درخت
- [ ] ۵.۴ startup: sync-index سبک (بدون block طولانی)
- [ ] ۵.۵ تست: جستجوی «nginx» نتیجه از چند پوشه
- [ ] ۵.۶ **تموم شدن فاز:** هر دو نوع جستجو کار کند

---

## فاز ۶ — Deploy، تست، مستندات

- [ ] ۶.۱ به‌روز `README.md` و [`docs/server-deploy.md`](../../server-deploy.md)
- [ ] ۶.۲ فایل `.env.example` با PORT=4001
- [ ] ۶.۳ تست API با `MD_READER_RUN_TESTS=1` — browse, auth, progress
- [ ] ۶.۴ smoke: `curl http://localhost:4001/api/browse`
- [ ] ۶.۵ حذف UI قدیمی drawer/apload عمومی (طبق proposal)
- [ ] ۶.۶ **تموم شدن فاز:** روی سرور `192.168.88.50:4001` قابل دسترس

---

## بعد از پیاده‌سازی

- `/sync-docs` → بایگانی با نام `1405-XX-XX-bookshelf-reader` وقتی کار تمام شد
- رمز admin production در `docs-personal/` نگه داشته شود نه در git عمومی

---

## اولویت اگر وقت کم است

1. فاز ۰ + ۱ + ۲ (explorer + UI + تم) — حداقل محصول قابل استفاده  
2. فاز ۳ (ادامه مطالعه)  
3. فاز ۴ (ادمین جلد)  
4. فاز ۵ (جستجو)  

</div>

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
}
.markdown-body th,
.markdown-body td,
table th,
table td {
  text-align: right !important;
  direction: rtl;
  padding: 0.35em 0.5em;
}
.task-list-item input[type="checkbox"] {
  margin: 0 0.5em 0 0 !important;
}
</style>
