## ADDED Requirements

### Requirement: Debounced progress save for logged-in users

The system SHALL accept `PUT /api/progress` with `doc_path` and `scroll_ratio` (0–1). The client MUST debounce saves (~2 seconds after scroll stops). Saves are silent; no toast on success.

#### Scenario: Progress restored after return (E2E-AUTH-01)

- **WHEN** logged-in user reads halfway through a book, closes browser, returns later
- **THEN** opening the same book restores scroll near the saved position

#### Scenario: Offline save warning

- **WHEN** logged-in user scrolls but network is unavailable
- **THEN** a slim banner indicates progress will save when connection returns (per ui-behavior.md)

### Requirement: Continue reading section

`GET /api/progress/recent` SHALL return at most 3 most recently opened books for the logged-in user, each with title, cover, path, scroll_ratio, and progress display.

#### Scenario: Home shows three recent books

- **WHEN** logged-in user has opened 5 books
- **THEN** home "Continue reading" shows only the 3 most recent
- **AND** each card shows title, small cover, and progress percent

### Requirement: Guest continue reading limited

Guests without login SHALL see at most one locally stored recent book in continue section, or a prompt to log in for cross-device sync (per ui-behavior.md).

#### Scenario: Guest prompt to log in

- **WHEN** guest views home with no local recent book
- **THEN** continue section is hidden or shows login prompt for cloud sync
