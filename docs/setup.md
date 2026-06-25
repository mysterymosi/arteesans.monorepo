# Manual Setup Steps

Infrastructure that requires account access and cannot be automated from the repo.

## Supabase (created)

- Project ref: `cpzbnkyqigqcssqjzhoh` (org Mosi, eu-west-1)
- Dashboard: https://supabase.com/dashboard/project/cpzbnkyqigqcssqjzhoh
- Migrations are applied via MCP/CLI from `supabase/migrations/`
- Edge Functions: `send-push`, `notify-request-created`, `notify-artisan-application` in `supabase/functions/`

## Resend SMTP (email OTP) — TODO

1. Create a Resend account and verify the sending domain (e.g. `auth.arteesans.ng`)
2. Add SPF/DKIM/DMARC DNS records that Resend provides
3. Supabase Dashboard → Project Settings → Auth → SMTP:
   - Host: `smtp.resend.com`, Port: `465`
   - Username: `resend`, Password: your Resend API key
   - Sender: `Arteesans <auth@arteesans.ng>`
4. Authentication → Email Templates → customize the OTP template (code-based, not magic link)

Until SMTP is configured, Supabase's built-in email (rate-limited, dev-only) delivers OTPs.

## EAS (Expo builds)

```bash
cd apps/mobile
npx eas login
```

`eas.json` profiles (development/preview/production) and EAS project ID are already in [apps/mobile/app.config.ts](/apps/mobile/app.config.ts).

## Push notifications (FCM + APNs)

### Android (FCM)

1. Firebase project **arteesans-75ef6** — Android app package **`com.arteesans.app`** (from `app.config.ts`)
2. `google-services.json` lives in `apps/mobile/`
3. Upload the **FCM HTTP v1 service account key** (Firebase → Project settings → Service accounts → Generate new private key):
   ```bash
   cd apps/mobile
   npx eas credentials
   ```
   → Android → your build profile → **Push Notifications**

This is **not** the same JSON as the Play Store submission service account.

### iOS (APNs)

```bash
cd apps/mobile
npx eas credentials
```

→ iOS → your build profile → configure **Push Notifications** (APNs key or certificate via EAS).

### Deploy Edge Functions

```bash
supabase functions deploy send-push
supabase functions deploy notify-request-created
supabase functions deploy notify-artisan-application
```

`send-push` is service-role only. Mobile apps call the authenticated `notify-*` functions after request creation or artisan onboarding submit.

### Test on device

Push tokens are not registered on simulators. Use a physical device with a development or preview EAS build.

## Google Maps / Places

1. Enable **Places API** and **Geocoding API** in Google Cloud Console
2. Put the key in `apps/mobile/.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

## Environment files

Copy `.env.example` → `.env` in `apps/mobile` and `apps/admin`. The Supabase URL and
anon key are pre-filled in the examples; the service role key (admin only) is in the
Supabase dashboard under Project Settings → API keys.
