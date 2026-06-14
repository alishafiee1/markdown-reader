# MenuHub — UI behavior (AI)

> Sample `docs-for-ai/ui-behavior.md`. Screen-level rules for implementation.

## Pages

| Route | Component | Role |
|-------|-----------|------|
| `/` | HomePage | List, search, discount toggle |
| `/r/:id` | MenuPage | Menu + order CTA |

## HomePage

- **Loading:** 3–6 skeleton cards; controls disabled
- **Empty:** "No restaurants found" + clear search/filter action
- **Error:** network message + retry button
- **Search:** debounce ~300ms
- **Preserve state:** returning from menu keeps `q` + `discountToday` (URL query preferred)

## MenuPage

- **Loading:** line skeletons
- **404 restaurant:** message + link back to `/`
- **Order button:** label "سفارش بده", opens `orderUrl` in new tab, `rel="noopener"`

## Copy (Persian UI)

| Key | Text |
|-----|------|
| network_error | اتصال برقرار نشد — دوباره تلاش کن |
| restaurant_gone | این رستوران دیگه در دسترس نیست |

## A11y

- Cards focusable; Enter activates
- Errors not color-only

## E2E mapping

E2E-P-01 = Home discount filter → MenuPage → order click (mock external URL in test)
