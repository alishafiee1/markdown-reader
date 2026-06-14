# MenuHub — file & doc map (AI quick index)

> Sample `docs-for-ai/map.md` — one-screen orientation for agents.

## Read order

1. `proposal.md` — scope boundaries
2. `design.md` — API + rules
3. `tasks.md` — what to build next
4. `ui-behavior.md` — if touching frontend
5. `architecture-and-structure.md` — where code lives

## Active change folders

| Path | Status | Topic |
|------|--------|-------|
| `docs/change/filter-by-food-type/` | **open** (no date prefix) | food type filter chips |

## Closed change folders (dated — stay in `change/`)

| Path | Closed | Topic |
|------|--------|-------|
| `docs/change/1405-02-18-discount-today-filter/` | 1405-02-18 | `discountToday` API + UI toggle |
| `docs/change/1405-02-25-menu-page-order-link/` | 1405-02-25 | MenuPage + external order link (E2E-P-01) |

## Archive

| Path | Type | Reason |
|------|------|--------|
| `docs/archive/loyalty-points/` | rejected | cannot verify orders externally |
| `docs/archive/restaurant-map/` | shelved | GPS/map out of MVP scope; revisit after scale |
| `docs/archive/user-reviews/` | rejected | moderation burden; focus on menus + discounts |

## Conventions

- Human docs: `docs/` — Persian, casual
- AI docs: `docs-for-ai/` — English, this folder
- Personal log: `docs-personal/walkthrough.md` — not in git
- OpenSpec artifacts: generated from `docs-for-ai/`, not from long Persian prose

## Test IDs

E2E-P-01, E2E-D-01, E2E-D-03, E2E-C-01 (change folder)
