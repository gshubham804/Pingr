import { useState } from "react";
import { Alert, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { apiRegister } from "../api/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    try {
      setLoading(true);
      const res = await apiRegister({ fullName, email, password });
      if (!res.success || !res.data) {
        Alert.alert("Registration failed", res.message || "Unknown error");
        return;
      }
      await setAuth(res.data.token, res.data.user);
    } catch (e: any) {
      Alert.alert("Registration failed", e?.message ?? "Network error");
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
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Create account</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Start chatting in minutes</Text>

        <View style={{ marginTop: theme.spacing.lg }}>
          <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" autoCapitalize="words" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@domain.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

          <Button
            title={loading ? "Creating..." : "Create account"}
            onPress={onRegister}
            disabled={loading || !fullName || !email || !password}
          />
          <Button
            title="I already have an account"
            variant="secondary"
            onPress={() => navigation.navigate("Login")}
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
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
});

