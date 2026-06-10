/** Design tokens extracted from Figma (docs/figma-screen-map.md). */
export const colors = {
  primary: "#1e5896",
  primaryLight: "#55a7ff",
  primaryMuted: "#e8f0f9",

  text: "#252525",
  textSecondary: "#404a5d",
  textMuted: "#8a93a3",
  textInverse: "#ffffff",

  background: "#f8f8f9",
  surface: "#ffffff",
  surfaceMuted: "#f3f4f7",

  border: "#f0f0f0",
  borderStrong: "#eaeaea",

  success: "#009933",
  successMuted: "#e6f5ec",
  warning: "#ffae00",
  warningMuted: "#fff7e6",
  danger: "#e02d3c",
  dangerMuted: "#fdeaec",
} as const;

export type ColorToken = keyof typeof colors;
