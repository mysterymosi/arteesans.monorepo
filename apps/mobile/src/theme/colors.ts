/** Design tokens extracted from Figma (docs/figma-screen-map.md). */
export const colors = {
  primary: "#1e5896",
  primaryDark: "#083769",
  primaryLight: "#55a7ff",
  primaryMuted: "#e8f0f9",
  primarySubtle: "rgba(30, 88, 150, 0.1)",
  primaryGradient: ["#083769", "#1e5896"] as const,

  text: "#252525",
  textSecondary: "#404a5d",
  textMuted: "#8a93a3",
  textPlaceholder: "#949ba9",
  textInverse: "#ffffff",

  background: "#f8f8f9",
  surface: "#ffffff",
  surfaceMuted: "#f3f4f7",

  border: "#f0f0f0",
  borderStrong: "#eaeaea",
  borderInput: "#d0d5dd",

  success: "#009933",
  successMuted: "#e6f5ec",
  successSubtle: "rgba(0, 153, 51, 0.1)",

  warning: "#ffae00",
  warningMuted: "#fff7e6",
  warningSubtle: "rgba(255, 174, 0, 0.1)",

  danger: "#e02d3c",
  dangerMuted: "#fdeaec",
  dangerSubtle: "rgba(224, 45, 60, 0.1)",
} as const;

export type ColorToken = keyof typeof colors;
