# MenuHub — design (AI spec)

> Sample `docs-for-ai/design.md`. Implements E2E-P-01 / E2E-D-01.

## Stack (example)

- API: Node + REST
- DB: PostgreSQL — `restaurants`, `menu_items`
- Client: React SPA

## Entities

**Restaurant:** `id`, `name`, `shortDesc`, `orderUrl`, `active`, `discountToday`, `tags[]` (future)

**MenuItem:** `id`, `restaurantId`, `name`, `price`, `discountedPrice?`

## API

| Method | Path | Query | Response |
|--------|------|-------|----------|
| GET | `/restaurants` | `q?`, `discountToday?` | `{ items: Restaurant[] }` — only `active=true` |
| GET | `/restaurants/:id/menu` | — | `{ restaurant, items }` or 404 if inactive |
| GET | `/health` | — | 200 OK |

## Rules

- Search `q`: max 100 chars, sanitized
- `orderUrl`: must be `http` or `https`
- List cache TTL: 5 min (menu not cached)
- DB unavailable → 503 + `traceId` in logs

## States (client)

`loading` | `ready` | `empty` | `error` — user messages in Persian UI copy (see `ui-behavior.md`)

## E2E scenarios

| ID | Steps | Assert |
|----|-------|--------|
| E2E-D-01 | Open `/` → toggle discount → open restaurant | Discount badge on menu items |
| E2E-D-03 | GET menu for inactive id | 404 + friendly message |

## Open change

- `foodType` filter → `docs/change/filter-by-food-type/` (not in phase 1 API yet)
