# Manual Setup Steps

Infrastructure that requires account access and cannot be automated from the repo.

## Supabase (created)

- Project ref: `cpzbnkyqigqcssqjzhoh` (org Mosi, eu-west-1)
- Dashboard: https://supabase.com/dashboard/project/cpzbnkyqigqcssqjzhoh
- Migrations are applied via MCP/CLI from `supabase/migrations/`

## Resend SMTP (email OTP) — TODO

1. Create a Resend account and verify the sending domain (e.g. `auth.arteesans.ng`)
2. Add SPF/DKIM/DMARC DNS records that Resend provides
3. Supabase Dashboard → Project Settings → Auth → SMTP:
   - Host: `smtp.resend.com`, Port: `465`
   - Username: `resend`, Password: your Resend API key
   - Sender: `Arteesans <auth@arteesans.ng>`
4. Authentication → Email Templates → customize the OTP template (code-based, not magic link)

Until SMTP is configured, Supabase's built-in email (rate-limited, dev-only) delivers OTPs.

## EAS (Expo builds) — TODO

```bash
cd apps/mobile
npx eas login
npx eas init        # links the project, writes projectId into app.json
```

`eas.json` profiles (development/preview/production) are already in the repo.

## FCM (Android push) — TODO

1. Create a Firebase project, add an Android app with package name from `app.json`
2. Download `google-services.json` into `apps/mobile/`
3. Upload the FCM V1 service account key: `npx eas credentials` → Android → Push notifications

iOS push uses APNs via EAS credentials (`npx eas credentials` → iOS).

## Google Maps / Places

1. Enable **Places API** and **Geocoding API** in Google Cloud Console
2. Put the key in `apps/mobile/.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

## Environment files

Copy `.env.example` → `.env` in `apps/mobile` and `apps/admin`. The Supabase URL and
anon key are pre-filled in the examples; the service role key (admin only) is in the
Supabase dashboard under Project Settings → API keys.
