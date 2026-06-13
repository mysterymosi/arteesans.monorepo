# Mobile — React Native Improvements

Reference checklist based on [vercel-react-native-skills](https://skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) (installed at `.agents/skills/vercel-react-native-skills/`).

Use this when refactoring auth, navigation, or monorepo setup. Items are ordered by priority.

**Status:** Items 1, 3–6 implemented (2026-06-11). Item 2 (Supabase version alignment) deferred by choice.

---

## Already aligned

| Area               | Status | Notes                                                                                    |
| ------------------ | ------ | ---------------------------------------------------------------------------------------- |
| Stack navigation   | ✓      | `expo-router` `Stack` uses native stack (`app/_layout.tsx`)                              |
| Pressable          | ✓      | Buttons and touch targets use `Pressable`, not `TouchableOpacity`                        |
| Styling            | ✓      | NativeWind + theme tokens in `src/theme/`                                                |
| `expo-image`       | ✓      | Used in `Avatar`; dependency present                                                     |
| React Compiler     | ✓      | `experiments.reactCompiler: true` in `app.json`                                          |
| Native deps in app | ✓      | `expo-linear-gradient`, Reanimated, etc. in `apps/mobile/package.json`                   |
| Conditional render | ✓      | Ternaries / explicit checks; avoid `{value && <Component />}` with falsy strings/numbers |

---

## 1. Native tab navigators (HIGH) — done

**Rule:** `navigation-native-navigators`

Migrated `(customer)/_layout.tsx` and `(artisan)/_layout.tsx` to `NativeTabs` from `expo-router/unstable-native-tabs` with SF Symbol / Material icons and theme tint colors.

---

## 2. Monorepo dependency versions (MEDIUM–HIGH) — skipped

**Rule:** `monorepo-single-dependency-versions`

Deferred — align `@supabase/supabase-js` across workspaces when convenient.

---

## 3. Font loading at build time (MEDIUM) — done

**Rule:** `fonts-config-plugin`

Outfit fonts copied to `assets/fonts/`. `expo-font` config plugin added in `app.json`. Removed `useFonts` gate from `app/_layout.tsx`.

**Note:** Rebuild the dev client (`npm run ios`) after pulling — fonts are embedded at native build time.

---

## 4. ScrollView + safe area on auth forms (MEDIUM) — done

**Rule:** `ui-safe-area-scroll`

Auth form screens use `contentInsetAdjustmentBehavior="automatic"` on root `ScrollView` instead of `SafeAreaView` wrappers.

---

## 5. Split auth context (MEDIUM) — done

**Rule:** `react-state-minimize`

`AuthProvider` split into `useAuthSession`, `useAuthProfile`, and `useAuthActions`. `useAuth()` remains as a convenience composite. Screens updated to use scoped hooks where appropriate.

---

## 6. Splash logo with `expo-image` (MEDIUM) — done

**Rule:** `ui-expo-image`

Splash (`welcome.tsx`) uses `assets/images/logo.png` via `expo-image`. Native splash background updated to `#0a1420` in `app.json`.

---

## 7. Minor cleanups (LOW)

| Item                | Status   | Notes                                                       |
| ------------------- | -------- | ----------------------------------------------------------- |
| OTP resend timer    | done     | Single interval + end-timestamp ref in `verify-otp.tsx`     |
| Button API          | open     | Compound `Button` + `ButtonText` optional refactor          |
| Legacy auth screens | open     | `role-select.tsx`, `complete-profile.tsx` kept as fallbacks |
| List performance    | deferred | FlashList when building home/bookings/jobs                  |

---

## Deferred (Phase 1+ screens)

Apply when implementing list-heavy UI:

- `list-performance-virtualize` — FlashList for large lists
- `list-performance-item-memo` — Memoize row components
- `list-performance-callbacks` — Stable `renderItem` / handlers
- `list-performance-inline-objects` — Avoid inline style objects in lists
- `list-performance-images` — `expo-image` with `recyclingKey` in lists

---

## Suggested implementation order

1. ~~Native tabs~~ ✓
2. Supabase version alignment — skipped
3. ~~Font config plugin~~ ✓
4. ~~ScrollView safe-area on auth forms~~ ✓
5. ~~Auth context split~~ ✓
6. ~~Splash `expo-image`~~ ✓

---

## References

- Skill index: `.agents/skills/vercel-react-native-skills/SKILL.md`
- Full rules: `.agents/skills/vercel-react-native-skills/AGENTS.md`
- Figma screen map: `docs/figma-screen-map.md`
- Mobile setup: `docs/setup.md`
