import { useColorScheme } from "react-native";
import { forestTokens } from "./tokens";

export type ThemeMode = "light" | "dark";

export type Theme = {
  mode: ThemeMode;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  radii: typeof forestTokens.radii;
  spacing: typeof forestTokens.spacing;
  typography: typeof forestTokens.typography;
};

export const useTheme = (): Theme => {
  const scheme = useColorScheme();
  const mode: ThemeMode = scheme === "dark" ? "dark" : "light";

  const c = forestTokens.colors;
  return {
    mode,
    colors: {
      primary: c.primary,
      primaryDark: c.primaryDark,
      accent: c.accent,
      background: mode === "dark" ? c.backgroundDark : c.backgroundLight,
      surface: mode === "dark" ? c.surfaceDark : c.surfaceLight,
      textPrimary: mode === "dark" ? c.textPrimaryDark : c.textPrimaryLight,
      textSecondary: mode === "dark" ? c.textSecondaryDark : c.textSecondaryLight,
      border: mode === "dark" ? c.borderDark : c.borderLight,
      success: c.success,
      warning: c.warning,
      error: c.error,
    },
    radii: forestTokens.radii,
    spacing: forestTokens.spacing,
    typography: forestTokens.typography,
  };
};
