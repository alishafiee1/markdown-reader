# MenuHub — tasks (AI checklist)

> Sample `docs-for-ai/tasks.md`. Mirror of `docs/tasks.md` — phased, testable.

## Phase 0 — foundation

- [ ] Project scaffold + DB models
- [ ] Seed: 3 restaurants, 1 with `discountToday=true`
- [ ] `GET /health` → 200
- [ ] **Done:** deployed to dev, health green

## Phase 1 — list + search `[P0]`

- [ ] `GET /restaurants` with `q`, `discountToday`
- [ ] HomePage: cards, skeleton, empty, error
- [ ] Tests: inactive hidden; discount filter works
- [ ] E2E: home → discount → at least one card
- [ ] **Done:** phase 1 tests green

## Phase 2 — menu + order `[P0]`

- [ ] `GET /restaurants/:id/menu` + active check
- [ ] MenuPage + order button → `orderUrl` `_blank`
- [ ] E2E-P-01 full path green
- [ ] **Done:** E2E-P-01 green

## Phase 3 — launch `[optional]`

- [ ] 10 real restaurants
- [ ] Mobile smoke test

**Note:** Endpoint names and file paths are authoritative here for OpenSpec/codegen — human story stays in `docs/`.
