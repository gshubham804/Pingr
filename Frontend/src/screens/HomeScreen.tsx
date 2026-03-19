import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { apiMe } from "../api/users";

export default function HomeScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuthStore();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await apiMe();
        if (!res.success || !res.data) return;
        setUser(res.data);
      } catch (e: any) {
        Alert.alert("Failed to load profile", e?.message ?? "Network error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>You’re signed in</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {loading ? "Loading profile..." : user ? `${user.fullName} (${user.email})` : "Profile not loaded yet"}
      </Text>

      <Button title="Sign out" variant="secondary" onPress={() => signOut()} style={{ marginTop: theme.spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});

