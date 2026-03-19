import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";

type Props = {
  uri?: string | null;
  name?: string;
  size?: number;
};

export default function Avatar({ uri, name, size = 44 }: Props) {
  const theme = useTheme();
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { width: size, height: size, borderRadius: radius }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme.colors.primary + "30",
          borderWidth: 1.5,
          borderColor: theme.colors.primary + "60",
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          { color: theme.colors.primary, fontSize: size * 0.36 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initials: {
    fontWeight: "700",
  },
});
