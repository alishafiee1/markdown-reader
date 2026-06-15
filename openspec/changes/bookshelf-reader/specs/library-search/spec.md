## ADDED Requirements

### Requirement: Library-wide search API

The system SHALL expose `GET /api/search?q=` searching book title, description, and filename across indexed metadata. Results include doc path, title, snippet, and folder name.

#### Scenario: Search finds book by keyword (E2E-HOME-01)

- **WHEN** user types "nginx" in home search and pauses typing
- **THEN** results list matching books from multiple folders
- **AND** tapping a result opens the reader for that book

#### Scenario: No results

- **WHEN** search query matches nothing
- **THEN** UI shows friendly empty message suggesting other terms or categories

### Requirement: Home search UI

The home page SHALL provide a full-width search bar with debounced results dropdown below the input (per ui-behavior.md).

#### Scenario: Debounced search

- **WHEN** user types quickly
- **THEN** search request fires after brief pause, not on every keystroke

### Requirement: Category pills from top-level folders

The home page SHALL show horizontal pills for each top-level folder under `content/docs`. "All" pill opens library root.

#### Scenario: Category navigation

- **WHEN** user taps a category pill named after a top-level folder
- **THEN** library opens at that folder path
