## ADDED Requirements

### Requirement: Document fetch and render

The system SHALL expose `GET /api/doc?path=` returning raw markdown, rendered HTML, document title, and optional heading TOC for valid book paths.

#### Scenario: Open book from library

- **WHEN** user taps a book card in the library
- **THEN** reader loads content via `/api/doc?path=`
- **AND** displays rendered markdown with correct RTL/LTR for mixed Persian and English

### Requirement: Four reading themes on reader card only

The reader SHALL offer four themes (`day`, `sepia`, `dim`, `night`) applied only to the reading card; app chrome (bottom nav, headers) stays dark. Color tokens per `docs/change/bookshelf-reader/reading-themes-guide.md`. Text contrast SHALL meet WCAG AA (4.5:1 body text).

#### Scenario: Theme switch (E2E-READ-01)

- **WHEN** user selects the sepia theme circle in the reader toolbar
- **THEN** only the reading card background and text colors change smoothly
- **AND** bottom navigation remains dark

### Requirement: Font scale levels

The reader SHALL provide three font scale levels (normal ~18px, large ~20px, extra-large ~22px) with line-height ~1.75. Logged-in users persist choice via preferences API.

#### Scenario: Increase font size

- **WHEN** user taps the larger-text control
- **THEN** body text in the reading card increases immediately

### Requirement: Fullscreen reading mode

The reader SHALL support fullscreen mode hiding top bar, bottom nav, and toolbar; only reading content remains. Exit via on-screen control or Escape key.

#### Scenario: Fullscreen toggle (E2E-READ-01)

- **WHEN** user enables fullscreen then presses Escape
- **THEN** chrome reappears and scroll position is preserved

### Requirement: In-document search

The reader SHALL provide in-page search with term highlight, match count (e.g. "3 of 12"), and prev/next navigation. Search runs client-side on rendered content.

#### Scenario: Find term in document

- **WHEN** user searches for a word present in the document
- **THEN** matches are highlighted and user can step between them
- **AND** if no match, message "not found on this page" is shown (per ui-behavior.md)

### Requirement: Reading progress bar

The reader SHALL show a thin progress indicator reflecting scroll position through the document.

#### Scenario: Scroll updates progress

- **WHEN** user scrolls through the document
- **THEN** progress bar updates to reflect approximate read position
