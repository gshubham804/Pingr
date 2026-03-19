import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { useNotifStore } from "../state/notifStore";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import PeopleScreen from "../screens/PeopleScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FriendRequestsScreen from "../screens/FriendRequestsScreen";
import Badge from "../components/Badge";

// ----- Type definitions -----

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  ChatRoom: { conversationId: string; participantName: string };
  FriendRequests: undefined;
  // Tab screens exposed as stack screens for cross-tab navigation
  Chats: undefined;
  People: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Chats: undefined;
  People: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// ----- Navigators -----

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ----- Tab Icon helper -----

import { Feather } from "@expo/vector-icons";

function TabIcon({
  name,
  focused,
  primary,
}: {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
  primary: string;
}) {
  return (
    <Feather
      name={name}
      size={24}
      color={focused ? primary : "#94A3B8"}
    />
  );
}

// ----- Tab Navigator -----

function MainTabs() {
  const theme = useTheme();
  const unreadCount = useNotifStore((s) => s.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTintColor: theme.colors.textPrimary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: theme.mode === "dark" ? "#000" : theme.colors.primary,
          shadowOpacity: theme.mode === "dark" ? 0.3 : 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -5 },
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 4 },
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          title: "Chats",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="message-circle" focused={focused} primary={theme.colors.primary} />
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={PeopleScreen}
        options={{
          title: "People",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="users" focused={focused} primary={theme.colors.primary} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon name="bell" focused={focused} primary={theme.colors.primary} />
              <Badge count={unreadCount} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} primary={theme.colors.primary} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ----- Root Navigator -----

export default function RootNavigator() {
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);

  const navTheme = theme.mode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navTheme}>
      {token ? (
        <MainStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.surface },
            headerShadowVisible: false,
            headerTintColor: theme.colors.textPrimary,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <MainStack.Screen
            name="Tabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="ChatRoom"
            component={ChatRoomScreen}
            options={{ title: "Chat" }}
          />
          <MainStack.Screen
            name="FriendRequests"
            component={FriendRequestsScreen}
            options={{ title: "Friend Requests" }}
          />
        </MainStack.Navigator>
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.surface },
            headerShadowVisible: false,
            headerTintColor: theme.colors.textPrimary,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Welcome back" }}
          />
          <AuthStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Create account" }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
