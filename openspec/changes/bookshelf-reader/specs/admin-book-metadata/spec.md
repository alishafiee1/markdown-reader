## ADDED Requirements

### Requirement: Admin-only metadata edit

Only users with role `admin` SHALL call `PATCH /api/admin/books/:path` to set title, description, and cover color. Non-admin requests MUST return 403 with Persian message per ui-behavior.md.

#### Scenario: Admin updates title and color (E2E-ADMIN-01)

- **WHEN** admin saves a blue color cover and custom Persian title
- **THEN** library grid immediately shows the updated card
- **AND** metadata is stored in `book_metadata` table

### Requirement: Cover image upload

Admins SHALL upload cover images via `POST /api/admin/books/:path/cover` using multer. Max size 2MB; allowed types jpeg, png, webp. Files stored in `data/covers/` with safe derived filename.

#### Scenario: Oversized image rejected

- **WHEN** admin uploads a file larger than 2MB
- **THEN** server rejects with Persian message asking for a smaller file
- **AND** modal stays open for retry

### Requirement: Metadata sync index

`POST /api/sync-index` (admin) SHALL scan `content/docs` and fill empty `book_metadata` fields from first lines of files. Startup MAY run a lightweight sync without blocking requests for long periods.

#### Scenario: New file gets default title

- **WHEN** sync-index runs and a new `.md` file has no metadata row
- **THEN** title and description are extracted from first non-empty lines

### Requirement: Seed admin and password reminder

On first boot with no admin user, system SHALL create user `admino` with hashed password. Admin account page SHALL show banner to change default password on production servers.

#### Scenario: First boot creates admin

- **WHEN** database initializes with no users
- **THEN** one admin user `admino` exists with hashed password
