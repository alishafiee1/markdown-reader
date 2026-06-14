# MenuHub — architecture & structure (AI)

> Sample `docs-for-ai/architecture-and-structure.md`. File map for navigation.

## Layout

```
menuhub/
├── server/src/
│   ├── index.ts          # bootstrap, mount routes
│   ├── routes/
│   │   ├── restaurants.ts  # list API
│   │   └── menu.ts         # menu API
│   └── db/                 # connection, seed
├── client/src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── MenuPage.tsx
│   └── components/
│       └── RestaurantCard.tsx
├── docs/                   # human docs (Persian)
└── docs-for-ai/            # this folder
```

## Entry points

- **Server:** `server/src/index.ts`
- **Client:** `client/src/main.tsx` → router `/`, `/r/:id`

## Doc sync

After code changes run `/sync-docs`; baseline from `docs-personal/walkthrough.md` last commit hash.

## Related human docs

- `docs/design.md` — flows and decisions
- `docs/architecture-and-structure.md` — longer explanations in Persian
