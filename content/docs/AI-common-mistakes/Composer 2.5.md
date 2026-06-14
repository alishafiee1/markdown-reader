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

# Composer 2.5 — خطاهای **عمومی**

> پروژه‌ای → `docs/AI-common-mistakes/` همان repo · مرجع: [`readme.md`](readme.md)

---

### [SHELL-001] متغیر محیطی PowerShell روی Linux
- **اشتباه:** `$env:VAR="1"` در راهنمای SSH Ubuntu
- **درست:** `export VAR=1` (bash) یا مقدار در `.env` + restart سرویس
- **زمینه:** ssh · ubuntu

### [DEPLOY-001] `npm run dev` روی سرور production
- **اشتباه:** `npm run dev` جایی که فقط `npm ci --omit=dev` نصب شده (`tsx` نیست)
- **درست:** `npm start` / systemd؛ `npm run dev` فقط لوکال با devDependencies
- **زمینه:** node · production

### [DEPLOY-002] راهنمای تست بدون تفکیک OS
- **اشتباه:** یک بلوک دستور فقط با سینتکس PowerShell
- **درست:** دو بلوک: **Windows لوکال** و **سرور Linux**
- **زمینه:** doc

### [SHELL-003] اسکریپت bash با CRLF روی Linux
- **اشتباه:** کپی/SCP فایل `.sh` از ویندوز بدون تبدیل خط · خطا: `set: pipefail: invalid option name`
- **درست:** `eol=lf` در `.gitattributes` · یا `sed -i 's/\r$//'` روی سرور قبل از اجرا
- **زمینه:** deploy · ubuntu · scp

### [DOC-001] داک `docs/` تلگرافی با جدول زیاد
- **اشتباه:** شروع با §۱ و جدول «نقش|نیاز» · bullet «ریسک: X — mitigation: Y» · چک‌لیست spec
- **درست:** داستان محور مثل `folder-card-management/proposal` · پاراگراف خودمونی · جدول حداقل — مرجع: `00-start-new-project/how-to-write-proposal.md` بخش «وقتی AI می‌نویسد»
- **زمینه:** docs · new-change · card-view

