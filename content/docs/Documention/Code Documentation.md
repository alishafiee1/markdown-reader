

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

در ادامه هر چهار متن استاندارد را به صورت جداگانه و خلاصه ارائه می‌کنم. هر متن برای راهنمایی خودتان، تیم و حتی استفاده مستقیم هوش مصنوعی (به عنوان پرامپت یا قانون) طراحی شده است.

---

## 1. Code Documentation (مستندسازی کد)

**هدف:** توضیح «چیستی» و «چرایی» کد در سطح توابع، کلاس‌ها و ماژول‌ها، بدون توضیح «چگونه» (که خود کد نشان می‌دهد).

### قوانین اصلی (اصلی و مختصر)
- **هر فایل** در خط اول یک کامنت هدر با توضیح هدف فایل داشته باشد.  
  `// File: user_service.go – مدیریت عملیات مرتبط با کاربر`
- **هر کلاس/اینترفیس/ماژول صادرشده (exported)** یک داک‌استرینگ داشته باشد که نقش آن را در یک جمله توضیح دهد.
- **هر تابع عمومی (public)** یک داک‌استرینگ داشته باشد شامل:
  - شرح کاری که انجام می‌دهد (بدون تکرار نام تابع)
  - پارامترها (نام، نوع، معنی)
  - مقدار بازگشتی (نوع و معنی)
  - خطاهای احتمالی (در صورت وجود)
- **برای Python:** از `"""triple double quotes"""` با فرمت Google یا NumPy استفاده کنید.
- **برای Java/C#:** از `/** ... */` با تگ‌های `@param`، `@return`، `@throws` استفاده کنید.
- **برای JavaScript/TypeScript:** از `/** ... */` با تگ‌های JSDoc/TSDoc استفاده کنید.
- **برای Go:** کامنت باید با نام خود شناسه (identifier) شروع شود و بلافاصله بالای آن بیاید.
- **درون توابع پیچیده:** از کامنت‌های خطی `//` برای توضیح منطق غیربدیهی استفاده کنید، نه برای تکرار کد.
- **از توضیح اضافه (over-commenting) پرهیز کنید:** کد خودگواه (self-documenting) با نام‌گذاری خوب بهتر از صد کامنت است.

### مثال کوتاه (Python)
```python
def calculate_discount(price: float, percent: float) -> float:
    """محاسبه مبلغ تخفیف بر اساس قیمت و درصد.

    Args:
        price: قیمت اصلی محصول (مثلاً 100000)
        percent: درصد تخفیف (مثلاً 15 برای ۱۵ درصد)

    Returns:
        مبلغ تخفیف محاسبه‌شده.
    """
    return price * (percent / 100)
```

### ابزارهای اجباری برای تیم
- **Python:** `pydocstyle`, `flake8-docstrings`
- **JavaScript/TS:** `ESLint` + `eslint-plugin-jsdoc`
- **Java:** Checkstyle با ماژول Javadoc
- **Go:** `go lint` یا `staticcheck` (بررسی می‌کنند exportedها کامنت دارند)

---


**هدف:** استانداردهای طراحی، پیاده‌سازی و تحویل یک سرویس قابل اطمینان، نگهداشتنی و خودمستند.

### اصول معماری
- **نسخه‌گذاری از روز اول:** در مسیر (`/v1/...`) یا هدر (`Accept-version: 1`) انجام شود.
- **مستندات داخلی (خودمستند) را فراموش نکنید:** endpoint `/health` (برای سلامت)، `/metrics` (در صورت نیاز)، `/help` (راهنما).
- **ثبات در نام‌گذاری:** همه جای سرویس از یک سبک (مثلاً camelCase برای JSON، snake_case برای دیتابیس) استفاده کنید.
- **لاگ‌کردن استاندارد:** هر درخواست/پاسخ مهم را با شناسه یکتا (request-id) لاگ کنید.

### استانداردهای اجباری هنگام ساخت
1. **ابتدا مستندات OpenAPI را بنویسید** (طراحی قرارداد)، سپس کد را بر اساس آن پیاده کنید (طراحی قرارداد-محور).
2. **سرویس شما باید حداقل دارای endpointهای زیر باشد:**
   - `/health` – بررسی زنده بودن (لزوماً بدون احراز هویت)
   - `/ready` – بررسی آمادگی برای ترافیک (وابستگی‌ها)
   - `/help` یا `/info` – متادیتا و لینک به مستندات
3. **تمام ورودی‌ها را اعتبارسنجی کنید** و خطاهای معنادار برگردانید (نه جزئیات داخلی).
4. **از rate limiting و timeout استفاده کنید** و آن را در مستندات ذکر کنید.
5. **مستندات تغییرات (CHANGELOG.md)** را برای هر نسخه به‌روز کنید.

### قوانین خطا (Error Handling)
- **همیشه یک شناسه خطای یکتا** (مانند `ERR_USER_NOT_FOUND`) برگردانید.
- **هرگز stack trace را در پاسخ production نشان ندهید** (لاگ داخلی شود).
- **برای خطای اعتبارسنجی** لیست فیلدهای مشکل‌دار را برگردانید.
  ```json
  { "error": "VALIDATION_FAILED", "fields": { "email": "must be valid email" } }
  ```

### تست‌های ضروری قبل از انتشار
- **تست یکپارچگی:** صحت endpoint‌ها و کدهای وضعیت
- **تست تطابق مستندات:** در مقابل OpenAPI (با Dredd یا Schemathesis)
- **تست راهنما:** بررسی خروجی `--help` (در صورت وجود) و `GET /help`

### نمونه چک‌لیست برای تیم
- [ ] فایل OpenAPI ایجاد شده و معتبر است.
- [ ] endpoint `/help` اطلاعات اولیه را برمی‌گرداند.
- [ ] هر خطا شامل `code`, `message`, `help_url` است.
- [ ] مستندات Markdown در `/docs/api` برای هر سرویس وجود دارد.
- [ ] دستور `--help` (در صورت وجود CLI) مطابق استاندارد خروجی می‌دهد.
- [ ] تست تطابق (contract testing) با موفقیت اجرا می‌شود.

---

این چهار متن را می‌توانید در فایل‌های جداگانه (مانند `CODE_DOCS.md`, `INAPP_HELP.md`, `API_DOCS.md`, `SERVICE_GUIDELINES.md`) در مخزن پروژه قرار دهید. در صورت نیاز به نمونه‌های بیشتر یا جزئیات خاص برای زبان/فریم‌ورک خود، بپرسید.