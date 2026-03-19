import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
};

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
}: Props) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.mode === "dark" ? "#64748B" : "#94A3B8"}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
            borderRadius: theme.radii.md,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
});

