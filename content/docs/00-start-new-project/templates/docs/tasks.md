<div dir="rtl" style="text-align:right;">

# tasks — MenuHub فاز ۱

> **نمونهٔ `docs/tasks.md`**  
> راهنما: [how-to-write-task.md](../../how-to-write-task.md) | design: [design.md](./design.md)

> **تموم شدن فاز ۱:** E2E-P-01 و E2E-D-01 سبز + ۳ رستوران تست روی staging

---

## فاز ۰ — پایه

> **ریسک:** دیتابیس و deploy — ارجاع design §۶

- [ ] ۰.۱ ساختار پروژه + DB (رستوران + منو)
- [ ] ۰.۲ seed: ۳ رستوران، یکی با تخفیف
- [ ] ۰.۳ `/health` → OK
- [ ] ۰.۴ تست: health همیشه 200
- [ ] ۰.۵ **تموم شدن فاز:** deploy dev + health سبز

---

## فاز ۱ — لیست و جستجو `[اول]`

> **ریسک:** لیست خالی یا کند — design §۸

- [ ] ۱.۱ API لیست + جستجوی نام
- [ ] ۱.۲ فیلتر تخفیف امروز
- [ ] ۱.۳ صفحهٔ اصلی: کارت + loading + empty
- [ ] ۱.۴ جستجو و فیلتر UI `(بعد از ۱.۳)`
- [ ] ۱.۵–۱.۸ تست خودکار و E2E لیست
- [ ] ۱.۹ **تموم شدن فاز:** تست‌ها سبز

---

## فاز ۲ — منو و سفارش `[اول]`

> **ریسک:** لینک سفارش خراب

- [ ] ۲.۱ API منو + چک active
- [ ] ۲.۲ صفحهٔ منو
- [ ] ۲.۳ دکمه سفارش → `orderUrl` تب جدید `(بعد از ۲.۲)`
- [ ] ۲.۴–۲.۸ تست و E2E-P-01
- [ ] ۲.۹ **تموم شدن فاز:** E2E-P-01 سبز

---

## فاز ۳ — launch `[اختیاری]`

- [ ] ۳.۱ ۱۰ رستوران واقعی
- [ ] ۳.۲ تست موبایل
- [ ] ۳.۳ **تموم شدن:** معیار §۷ proposal

</div>

<style>
body, p, h1, h2, h3, h4, h5, h6, li, ul, ol { font-family: 'Segoe UI', Segoe, Tahoma, Geneva, Verdana, sans-serif !important; direction: rtl; text-align: right; }
pre, code { direction: ltr; text-align: left; }
.markdown-body table, .markdown-preview-section table, table { direction: rtl !important; text-align: right !important; width: 100%; border-collapse: collapse; }
.markdown-body th, .markdown-body td, table th, table td { text-align: right !important; direction: rtl; vertical-align: top; padding: 0.35em 0.5em; }
table td code, table th code { direction: ltr; unicode-bidi: embed; text-align: right !important; display: inline-block; }
.task-list-item input[type="checkbox"], input.task-list-item-checkbox { margin: 0 0.5em 0 0 !important; }
</style>
