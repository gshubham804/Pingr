import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);

  const navTheme = theme.mode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerShadowVisible: false,
          headerTintColor: theme.colors.textPrimary,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {token ? (
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Pingr" }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Welcome back" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Create account" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

