import { Pressable, StyleSheet, Text, ViewStyle, ActivityIndicator } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, loading, variant = "primary", style }: Props) {
  const theme = useTheme();

  const bg = variant === "primary" ? theme.colors.primary : "transparent";
  const borderColor = variant === "secondary" ? theme.colors.border : bg;
  const textColor = variant === "primary" ? "#FFFFFF" : theme.colors.textPrimary;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          borderRadius: theme.radii.md,
          opacity: isDisabled ? 0.6 : 1,
          flexDirection: "row",
        },
        style,
      ]}
    >
      {loading && <ActivityIndicator size="small" color={textColor} style={{ marginRight: 8 }} />}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
});

