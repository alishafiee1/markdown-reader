## ADDED Requirements

### Requirement: User registration

The system SHALL allow registration with username (min 3 characters) and password (min 4 characters). Usernames MUST be unique. Passwords MUST be stored as bcrypt hashes only.

#### Scenario: Duplicate username rejected

- **WHEN** user submits registration with an existing username
- **THEN** server returns an error message in Persian stating the username is taken
- **AND** no user record is created

### Requirement: Login and session

The system SHALL authenticate via `POST /api/auth/login` and issue an httpOnly session cookie valid approximately 30 days. `POST /api/auth/logout` clears the session. `GET /api/me` returns current user or 401.

#### Scenario: Successful login (E2E-AUTH-01)

- **WHEN** user submits valid credentials
- **THEN** session cookie is set
- **AND** account page shows welcome state with logout option
- **AND** brief success toast appears per ui-behavior.md

#### Scenario: Failed login

- **WHEN** user submits wrong password
- **THEN** error message appears below the form without clearing typed username

### Requirement: User preferences

Logged-in users SHALL persist reading theme and font scale via `PUT /api/me/preferences`. `GET /api/me` includes current preferences.

#### Scenario: Theme restored after login

- **WHEN** logged-in user sets theme to day, logs out, logs in again
- **THEN** reader applies day theme from server preferences

### Requirement: Guest local preferences

Guests SHALL store theme and font scale in `localStorage` on the same browser without server account.

#### Scenario: Guest theme persists on reload

- **WHEN** guest changes theme and reloads the page
- **THEN** the same theme is applied from local storage
