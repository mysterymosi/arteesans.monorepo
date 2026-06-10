# Figma Screen Map

**Figma file:** [ARTEESANS.NG](https://www.figma.com/design/04WNVGx3tWpjvQISi3PNGM/ARTEESANS.NG)
**File key:** `04WNVGx3tWpjvQISi3PNGM`

Sections: `CUSTOMER'S APP` (8:835), `ARTISAN'S APP` (36:2226), `ADMIN DASHBOARD` (36:7463).

> Note: the file includes admin dashboard designs — use them as reference for the
> Next.js admin (shadcn/ui) instead of designing from scratch.

## Design tokens (extracted)

| Token | Value |
|-------|-------|
| Font family | Outfit (Light 300, Regular 400, Medium 500, SemiBold 600) |
| Primary | `#1e5896` |
| Primary light | `#55a7ff` |
| Text primary | `#252525` |
| Text secondary | `#404a5d` |
| Background | `#f8f8f9` |
| Surface muted | `#f3f4f7` |
| Border | `#f0f0f0` / `#eaeaea` |
| Warning / in-process | `#ffae00` |
| Success | `#009933` |
| Type: H1 | Outfit SemiBold 20/100, ls -0.5 |
| Type: H2 | Outfit Medium 16/100 |

## Customer app

| Screen | Figma nodeId | Phase |
|--------|--------------|-------|
| Splash screen | 8:836 | 1 |
| Sign up | 8:847 | 1 |
| Log in | 8:2082 | 1 |
| Verification (OTP) | 8:2099 | 1 |
| Home screen | 8:893 | 1 |
| Request (form) | 8:2123 | 1 |
| Confirmed request | 8:2206 | 1 |
| Bookings | 8:2227 | 2 |
| Artisan profile | 8:2319 | 2 |
| Track | 8:2431 | 2 |
| Track 1–4 (states) | 33:1411, 33:1554, 33:1693, 33:1832 | 2 |
| Rate | 33:1971 | 2 |
| Chat | 8:2717 | 2 |
| Call | 8:2522 | 2 |
| Cancel job | 8:2616 | 2 |
| Side bar | 8:1059 | 1 |
| Notification | 8:1077 | 1 |
| Profile | 8:1147 | 1 |
| Edit profile | 8:1222 | 1 |
| Change password | 8:1315 | 1 |
| Saved addresses | 8:1399 | 1 |
| Add addresses | 8:1481 | 1 |
| Payment method | 8:1564 | 3 |
| Add payment method | 8:1653 | 3 |
| Notification settings | 8:1738 | 1 |
| Help & support | 8:1834, 8:1919 | 2 |
| Log out | 8:2007 | 1 |

## Artisan app

| Screen | Figma nodeId | Phase |
|--------|--------------|-------|
| Splash screen | 36:2227 | 1 |
| Sign up | 36:2238 | 1 |
| Log in | 36:2284 | 1 |
| Verification (OTP) | 36:2301 | 1 |
| Documentation (verification docs) | 36:2319, 36:2353, 36:2449, 36:2392 | 1 |
| Home screen (online) | 36:2476, 36:2575 | 2 |
| Home screen (offline) | 36:2699 | 2 |
| Job details (states 0–5) | 36:2798, 36:2899, 36:3000, 36:3101, 36:3202, 36:3303 | 2 |
| Chat | 36:3439, 36:3798, 36:3926 | 2 |
| Rate | 36:3407 | 2 |
| Side bar | 36:3471 | 1 |
| Notification | 36:3495, 36:4913 | 1 |
| Jobs (list states) | 36:3573, 36:3632, 36:3663, 36:3694 | 2 |
| Order detail | 36:3723 | 2 |
| Earnings | 36:3837 | 3 |
| Earnings history | 36:3893 | 3 |
| Profile | 36:3958 | 1 |
| Edit profile | 36:4042 | 1 |
| Change password | 36:4154 | 1 |
| Work location | 36:4257, 36:4354 | 1 |
| Payout settings | 36:4470, 36:4575 | 3 |
| Verification documents | 36:4678, 36:4792 | 1 |
| Support | 36:5028 | 2 |
| Logout | 36:5126 | 1 |

## Admin dashboard

Section node: `36:7463` — enumerate child frames with `get_metadata` when building admin pages in Phase 1.

## Workflow per screen

1. `get_design_context` + `get_screenshot` with the nodeId above
2. Adapt reference output to RN components + theme tokens in `apps/mobile/src/theme/`
3. Wire to Supabase; verify against screenshot
