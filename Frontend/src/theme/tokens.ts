export const forestTokens = {
  colors: {
    primary: "#10B981",
    primaryDark: "#059669",
    accent: "#0F172A",

    backgroundLight: "#F1F5F9",
    backgroundDark: "#0B1220",
    surfaceLight: "#FFFFFF",
    surfaceDark: "#111827",

    textPrimaryLight: "#0F172A",
    textPrimaryDark: "#E5E7EB",
    textSecondaryLight: "#475569",
    textSecondaryDark: "#94A3B8",

    borderLight: "#E2E8F0",
    borderDark: "#1F2937",

    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  typography: {
    title: 24,
    subtitle: 16,
    body: 14,
    caption: 12,
  },
} as const;

export type ThemeTokens = typeof forestTokens;
