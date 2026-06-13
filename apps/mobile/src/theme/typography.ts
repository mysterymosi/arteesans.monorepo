/** Outfit — embedded at build time via expo-font config plugin in app.json. */
export const fonts = {
  family: "Outfit",
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.family,
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
  },
  h2: { fontFamily: fonts.family, fontSize: 16, fontWeight: "500" as const },
  body: { fontFamily: fonts.family, fontSize: 14, fontWeight: "400" as const },
  bodySmall: {
    fontFamily: fonts.family,
    fontSize: 12,
    fontWeight: "400" as const,
  },
  label: { fontFamily: fonts.family, fontSize: 14, fontWeight: "500" as const },
  caption: {
    fontFamily: fonts.family,
    fontSize: 11,
    fontWeight: "300" as const,
  },
} as const;
