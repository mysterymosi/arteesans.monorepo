/** Outfit font (loaded in root layout via @expo-google-fonts/outfit). */
export const fonts = {
  light: "Outfit_300Light",
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
} as const;

export const typography = {
  h1: { fontFamily: fonts.semibold, fontSize: 20, letterSpacing: -0.5 },
  h2: { fontFamily: fonts.medium, fontSize: 16 },
  body: { fontFamily: fonts.regular, fontSize: 14 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 12 },
  label: { fontFamily: fonts.medium, fontSize: 14 },
  caption: { fontFamily: fonts.light, fontSize: 11 },
} as const;
