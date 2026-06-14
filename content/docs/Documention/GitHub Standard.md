
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

# راهنمای کامل ساخت مستندات پروژه (GitHub Standard)

***

## بخش اول: ساختار فایل‌های مستندات در ریپو

یک ریپوی استاندارد GitHub باید این فایل‌ها و پوشه‌ها را داشته باشد:

```
my-project/
│
├── README.md                  ← مهم‌ترین فایل - اولین چیزی که همه می‌بینند
├── CHANGELOG.md               ← تاریخچه تغییرات هر نسخه
├── CONTRIBUTING.md            ← راهنمای مشارکت در پروژه
├── CODE_OF_CONDUCT.md         ← قوانین رفتاری جامعه
├── LICENSE                    ← نوع لایسنس پروژه
├── SECURITY.md                ← گزارش باگ‌های امنیتی
│
├── docs/                      ← مستندات تخصصی و جزئیات
│   ├── getting-started.md
│   ├── installation.md
│   ├── api-reference.md
│   ├── architecture.md
│   └── diagrams/
│       └── system-flow.png
│
├── .github/                   ← تنظیمات خود GitHub
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/             ← GitHub Actions (CI/CD)
│       └── ci.yml
│
└── examples/                  ← نمونه کد و use case
    ├── basic_usage.py
    └── advanced_config.py
```

***

## بخش دوم: README.md - قلب مستندات

README مهم‌ترین فایل است. GitHub آن را مستقیم در صفحه اصلی ریپو نمایش می‌دهد.

### ساختار استاندارد README:

```markdown
# نام پروژه

<!-- Badges - نشان‌های اطلاعاتی بالای صفحه -->
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-yellow)
![Build](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)

<!-- یک خط توضیح ساده و واضح -->
> A lightweight admin API for managing Ubuntu servers over HTTP — educational use only.

---

## Table of Contents
- [About](#about)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## About
توضیح ۲ تا ۴ جمله‌ای که این پروژه چیست، چرا ساخته شده و چه مشکلی را حل می‌کند.

---

## Features
- [x] Run shell commands via HTTP
- [x] Read files remotely
- [x] List directories
- [x] Auto-close port on exit
- [ ] Authentication (planned)

---

## Requirements
- Python 3.8+
- Ubuntu 20.04+
- ufw installed

---

## Installation

```bash
git clone https://github.com/username/project.git
cd project
pip install -r requirements.txt
```

---

## Usage

```bash
python3 admin_api.py
```

Then open in browser:
```
http://YOUR_SERVER_IP:8889/help
```

---

## API Reference

| Endpoint | Method | Description | Example |
|----------|--------|-------------|---------|
| `/help` | GET | Show available endpoints | `/help` |
| `/run` | GET | Run a shell command | `/run?cmd=ls` |
| `/read` | GET | Read a file | `/read?path=/etc/hosts` |
| `/ls` | GET | List directory | `/ls?path=/home` |
| `/find` | GET | Find files | `/find?path=/&name=*.conf` |

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8889` | HTTP server port |
| `SUDO_PASS` | prompted | Root password for ufw |

---

## License
MIT License — see [LICENSE](LICENSE) file.
```

***

## بخش سوم: CHANGELOG.md

تاریخچه تمام تغییرات پروژه را نگه می‌دارد. فرمت استاندارد **Keep a Changelog** است:

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]
### Planned
- Token-based authentication
- Rate limiting

---

## [1.1.0] - 2026-05-23
### Added
- Auto port close on exit using atexit
- `/find` endpoint with depth parameter

### Changed
- Removed token requirement for educational mode

### Fixed
- Port not closing properly on Ctrl+C

---

## [1.0.0] - 2026-05-01
### Added
- Initial release
- Basic HTTP server with /run, /read, /ls endpoints
- sudo password prompt on startup
```

***

## بخش چهارم: CONTRIBUTING.md

برای پروژه‌های تیمی یا open source ضروری است:

```markdown
# Contributing Guide

Thank you for considering contributing!

## How to contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## Commit Message Convention (Conventional Commits)

Use this format:
```
type(scope): short description
```

Types:
- `feat` → new feature
- `fix` → bug fix
- `docs` → documentation only
- `refactor` → code refactoring
- `test` → adding tests
- `chore` → maintenance

Examples:
- `feat(api): add /find endpoint`
- `fix(server): close port on KeyboardInterrupt`
- `docs(readme): update API reference table`

## Code Style
- Use 4 spaces for indentation
- Add comments for complex logic
- Keep functions small and focused
```

***

## بخش پنجم: فایل‌های .github

### Issue Template (bug_report.md)
```markdown
---
name: Bug Report
about: Report a bug to help us improve
labels: bug
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Run `python3 admin_api.py`
2. Call endpoint `...`
3. See error

**Expected behavior**
What you expected to happen.

**Environment**
- OS: Ubuntu 26.04
- Python version: 3.x
- Project version: 1.x
```

### Pull Request Template
```markdown
## Description
Brief description of what this PR does.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
- [ ] I tested this locally
- [ ] All existing tests pass

## Related Issues
Closes #(issue number)
```

***

## بخش ششم: استانداردهای GitHub Badges

این نشان‌ها را بالای README قرار می‌دهند تا اطلاعات سریع نشان داده شود:

```markdown
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/github/license/username/repo)
![Stars](https://img.shields.io/github/stars/username/repo)
![Issues](https://img.shields.io/github/issues/username/repo)
![Last Commit](https://img.shields.io/github/last-commit/username/repo)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)
```

***

## بخش هفتم: Wiki در GitHub

برای مستندات طولانی‌تر، می‌توانی از **GitHub Wiki** استفاده کنی:

```
ریپو → Wiki → New Page

صفحات پیشنهادی:
- Home (صفحه اصلی)
- Installation Guide
- API Reference (کامل‌تر از README)
- Troubleshooting
- FAQ
- Roadmap
```

***

## بخش هشتم: نکات طلایی

### چه چیزهایی را حتماً مستند کنیم؟

| موضوع | اهمیت | کجا؟ |
|-------|--------|-------|
| نصب و راه‌اندازی | ضروری | README |
| هر endpoint یا تابع عمومی | ضروری | README / docs/ |
| تغییرات هر نسخه | ضروری | CHANGELOG |
| متغیرهای محیطی و config | مهم | README / docs/ |
| خطاهای رایج و رفع آن‌ها | مهم | docs/troubleshooting.md |
| معماری و دیاگرام | مفید | docs/architecture.md |
| نمونه کد | مفید | examples/ |

### قوانین کلی
1. **ساده بنویس** — مستندات برای انسان است نه ماشین
2. **به‌روز نگه دار** — مستندات قدیمی بدتر از نداشتن است
3. **مثال بزن** — هر endpoint یا تابع باید یک مثال واقعی داشته باشد
4. **فرض نکن** — همه چیز را توضیح بده، حتی چیزهایی که برایت بدیهی است
5. **نسخه‌بندی کن** — هر تغییر مهم در CHANGELOG ثبت شود

***

## خلاصه چک‌لیست پروژه

```
[ ] README.md با ساختار کامل
[ ] CHANGELOG.md
[ ] CONTRIBUTING.md
[ ] LICENSE
[ ] .github/ISSUE_TEMPLATE/bug_report.md
[ ] .github/ISSUE_TEMPLATE/feature_request.md
[ ] .github/PULL_REQUEST_TEMPLATE.md
[ ] docs/ برای توضیحات تخصصی
[ ] examples/ برای نمونه کد
[ ] Badges در بالای README
```

