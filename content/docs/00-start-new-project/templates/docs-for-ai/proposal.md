# MenuHub — proposal (AI summary)

> Sample `docs-for-ai/proposal.md` — English, compact. Source: `docs/proposal.md`.

## Product

Restaurant menu directory with "discount today" filter. Order/payment stays on restaurant's own link (WhatsApp/site).

## Users (phase 1)

| Role | Priority |
|------|----------|
| Customer (browse menus) | P0 |
| Restaurant owner (edit menu) | P2 |
| Admin | manual only |

## MVP scope IN

- Public list + search + `discountToday` filter
- Menu page per restaurant + external `orderUrl` (new tab)
- Persian, responsive web, Tehran pilot

## MVP scope OUT

- In-app cart, payment, delivery tracking
- Native mobile app, maps, user ratings
- Loyalty points (archived — `docs/archive/loyalty-points/`)
- Restaurant GPS map (shelved — `docs/archive/restaurant-map/`)
- User reviews/ratings (rejected — `docs/archive/user-reviews/`)

## Success

- 10 restaurants with fresh menus in month 1
- Customer finds discounted restaurant in < 2 min (5-user test)

## Critical E2E

| ID | Flow | Done when |
|----|------|-----------|
| E2E-P-01 | Home → discount filter → menu → order link | Menu shows discount badge, order opens |

## Risks

- Stale menus → trust loss (HIGH)
- Broken `orderUrl` → bad UX (HIGH)
