import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export default function Button({ title, onPress, disabled, variant = "primary", style }: Props) {
  const theme = useTheme();

  const bg =
    variant === "primary"
      ? disabled
        ? theme.colors.border
        : theme.colors.primary
      : "transparent";

  const borderColor = variant === "secondary" ? theme.colors.border : bg;
  const textColor = variant === "primary" ? "#FFFFFF" : theme.colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          borderRadius: theme.radii.md,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
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

