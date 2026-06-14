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
table {
  direction: rtl;
  text-align: right;
  width: 100%;
  border-collapse: collapse;
}
thead th, tbody td {
  text-align: right;
  vertical-align: top;
  padding: 0.35em 0.5em;
}
table td code, table th code {
  direction: ltr;
  unicode-bidi: embed;
  text-align: left;
  display: inline-block;
}
</style>

<div dir="rtl" style="text-align:right;">

# ابزار `gh` چیست؟ (GitHub CLI)

## یک جمله

`gh` یعنی **GitHub CLI** — یک برنامهٔ خط فرمان که به‌جای باز کردن سایت GitHub در مرورگر، همان کارها را از ترمینال انجام می‌دهد.

---

## چرا اصلاً لازم است؟

| روش | چه می‌کنی |
|-----|-----------|
| **مرورگر** | می‌روی github.com → Releases → New release → فرم پر می‌کنی |
| **ترمینال با `gh`** | یک دستور می‌زنی و Release ساخته می‌شود |

هر دو به یک نتیجه می‌رسند؛ `gh` برای کسی که زیاد با ترمینال و اتوماسیون کار می‌کند راحت‌تر است.

---

## من چه چیزی نصب کردم؟

با این دستور نصب شد:

```powershell
winget install --id GitHub.cli
```

- **نام رسمی:** GitHub CLI  
- **نسخه نصب‌شده:** 2.93.0 (زمان نصب در جلسهٔ ModuleHub-cms)  
- **فایل اجرایی:** `gh.exe` — بعد از نصب در PATH ویندوز قرار می‌گیرد  

**چرا نصب کردم؟**  
برای ساخت **GitHub Release** از ترمینال (`gh release create`) — بدون باز کردن مرورگر.  
ولی برای کار کردن باید اول **لاگین** کنی (`gh auth login`). بدون لاگین فقط `git push` تگ کار کرد؛ خود Release ساخته نشد.

---

## `gh` چه کارهایی می‌کند؟

### ۱. Release (همان کاری که برای ModuleHub می‌خواستیم)

```powershell
gh release create v0.1.0 --title "v0.1.0" --notes "توضیح نسخه"
```

- صفحهٔ Release در GitHub می‌سازد  
- به تگ `v0.1.0` وصل می‌شود  
- می‌توانی فایل ZIP هم ضمیمه کنی (`--attach file.zip`)

### ۲. Pull Request

```powershell
gh pr create --title "عنوان" --body "توضیح"
gh pr list
gh pr merge 12
```

### ۳. Issue

```powershell
gh issue create --title "باگ" --body "شرح"
gh issue list
```

### ۴. Repo و اطلاعات

```powershell
gh repo view
gh repo clone alishafiee1/ModuleHub-cms
```

### ۵. Actions (CI)

```powershell
gh run list
gh run watch
```

### ۶. لاگین و احراز هویت

```powershell
gh auth login
gh auth status
```

بعد از لاگین، `gh` می‌تواند به‌جای تو با GitHub صحبت کند (ساخت Release، PR و غیره).

---

## تفاوت `git` و `gh`

| | `git` | `gh` |
|---|--------|------|
| **مالک** | ابزار عمومی گیت | مخصوص GitHub |
| **کار اصلی** | commit، branch، tag، push | Release، PR، Issue، Actions |
| **برای تگ** | `git tag` + `git push origin v0.1.0` ✅ | فقط Release را می‌سازد؛ تگ را `git` می‌سازد |
| **نیاز به لاگین** | credential گیت (اغلب از قبل داری) | `gh auth login` جداگانه |

در کار ModuleHub-cms:
- **`git`** → تگ `v0.1.0` ساخته و به GitHub فرستاده شد ✅  
- **`gh`** → قرار بود صفحهٔ Release بسازد؛ چون لاگین نبود، نشد ❌  

---

## چطور Release را کامل کنی؟

**روش ۱ — ترمینال:**

```powershell
gh auth login
cd "D:\2 Curent project git\ModuleHub-cms"
gh release create v0.1.0 --title "v0.1.0 — Initial release" --notes "نسخه اولیه ModuleHub CMS"
```

**روش ۲ — مرورگر:**  
https://github.com/alishafiee1/ModuleHub-cms/releases/new?tag=v0.1.0

---

## چک کردن نصب

```powershell
gh --version
gh auth status
```

---

## خلاصه عامیانه

`gh` مثل **دستیار GitHub در ترمینال** است: به‌جای کلیک در سایت، دستور می‌زنی.  
من آن را نصب کردم تا Release اولیهٔ ModuleHub را یک‌جا بسازم؛ تگ با `git` رفت بالا، ولی برای Release هنوز باید یک‌بار `gh auth login` بزنی یا از سایت دستی بسازی.

</div>
