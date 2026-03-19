import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { useTheme } from "./src/theme/useTheme";
import { useAuthStore } from "./src/state/authStore";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const theme = useTheme();
  const { hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ActivityIndicator />
        </View>
        <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
});
