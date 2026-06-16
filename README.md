# Arteesans

Two-sided service marketplace connecting customers with verified artisans in Nigeria.

## Monorepo layout

```
arteesans/
├── apps/
│   ├── mobile/          # Expo app (customer + artisan, role-based routing)
│   └── admin/           # Next.js admin dashboard
├── packages/
│   ├── shared/          # Zod schemas, types, constants
│   └── supabase/        # Supabase client helpers, generated DB types
├── supabase/
│   ├── migrations/      # SQL schema, RLS, PostGIS
│   └── functions/       # Edge Functions
└── docs/                # Screen maps and project docs
```

## Stack

| Layer    | Choice                                                  |
| -------- | ------------------------------------------------------- |
| Mobile   | Expo (React Native) + Expo Router + NativeWind          |
| Admin    | Next.js App Router + shadcn/ui                          |
| Backend  | Supabase (Postgres + PostGIS, Auth, Realtime, Storage)  |
| Auth     | Email OTP via Supabase Auth + Resend SMTP               |
| Push     | Expo Notifications + FCM                                |
| Maps     | Google Places Autocomplete + Geocoding API              |
| Payments | Paystack (Phase 3)                                      |

## Getting started

```bash
npm install

# Mobile
npm run dev --workspace mobile

# Admin
npm run dev --workspace admin
```

Copy `.env.example` files in `apps/mobile` and `apps/admin` to `.env` and fill in values.
