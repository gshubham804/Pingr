import { useState } from "react";
import { Alert, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
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
      const msg = e.response?.data?.message || e.message || "Network error";
      Alert.alert("Login failed", msg);
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
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + "20" }]}>
            <Feather name="message-circle" size={36} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Pingr</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Sign in to continue</Text>
        </View>

        <View style={{ marginTop: theme.spacing.lg }}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@domain.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

          <Button title="Sign in" onPress={onLogin} loading={loading} disabled={!email || !password} />
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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

