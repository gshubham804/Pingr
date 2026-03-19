import { useState } from "react";
import { Alert, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { apiLogin } from "../api/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await apiLogin({ email, password });
      if (!res.success || !res.data) {
        Alert.alert("Login failed", res.message || "Unknown error");
        return;
      }
      await setAuth(res.data.token, res.data.user);
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Pingr</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Sign in to continue</Text>

        <View style={{ marginTop: theme.spacing.lg }}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@domain.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

          <Button title={loading ? "Signing in..." : "Sign in"} onPress={onLogin} disabled={loading || !email || !password} />
          <Button
            title="Create an account"
            variant="secondary"
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
});

