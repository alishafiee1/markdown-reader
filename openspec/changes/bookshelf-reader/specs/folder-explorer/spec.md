## ADDED Requirements

### Requirement: Safe one-level folder browse

The system SHALL expose `GET /api/browse?path=` returning folders and text files (`.md`, `.txt`) for exactly one directory level under `content/docs`. Empty `path` means library root.

#### Scenario: Root listing (E2E-LIB-01 setup)

- **WHEN** client requests `GET /api/browse` with no path
- **THEN** response includes folder entries and book file entries for the root of `content/docs`
- **AND** each book entry includes title, description, and cover hint from metadata or first file lines

#### Scenario: Navigate into subfolder

- **WHEN** client requests `GET /api/browse?path=linux/permissions`
- **THEN** response lists only direct children of that folder
- **AND** does not include sibling or parent folder contents

### Requirement: Path traversal blocked

The system SHALL reject any browse or doc path containing `..`, absolute paths, or paths resolving outside `content/docs` with HTTP 400 and no filesystem access.

#### Scenario: Traversal attempt rejected

- **WHEN** client requests `GET /api/browse?path=../../etc/passwd`
- **THEN** server returns HTTP 400
- **AND** no file outside `content/docs` is read

### Requirement: Breadcrumb library UI

The library page SHALL display the current path as clickable breadcrumb segments (Home › folder › subfolder) and a grid of folder icons and book cards.

#### Scenario: Breadcrumb navigation (E2E-LIB-01)

- **WHEN** user opens a folder then clicks a parent segment in the breadcrumb
- **THEN** library shows that folder level without losing the library context
- **AND** back from reader returns to the same folder, not home

### Requirement: Deep link to book path

The library and reader SHALL support URL query `?path=` so a book can be opened via direct link.

#### Scenario: Direct link opens book

- **WHEN** user opens the app with `?path=00-start-new-project/readme.md`
- **THEN** the reader page loads that document
