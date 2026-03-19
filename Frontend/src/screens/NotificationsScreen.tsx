import { useEffect, useCallback } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../theme/useTheme";
import { useNotifStore } from "../state/notifStore";
import {
  apiGetNotifications,
  apiMarkRead,
  apiMarkAllRead,
  type AppNotification,
} from "../api/notifications";
import EmptyState from "../components/EmptyState";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../navigation/RootNavigator";

type NavProp = BottomTabNavigationProp<TabParamList, "Notifications">;

function notifIcon(type: AppNotification["type"]) {
  if (type === "friend_request") return "👋";
  if (type === "friend_accepted") return "🎉";
  return "💬";
}

function notifLabel(type: AppNotification["type"]) {
  if (type === "friend_request") return "Friend request";
  if (type === "friend_accepted") return "Friend request accepted";
  return "New message";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function NotificationsScreen() {
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const { notifications, setNotifications, markRead, markAllRead } = useNotifStore();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGetNotifications();
      if (res.success && res.data) setNotifications(res.data);
    } catch {
      Alert.alert("Error", "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, [setNotifications]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={async () => {
            await apiMarkAllRead();
            markAllRead();
          }}
          style={{ marginRight: 4 }}
        >
          <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: "700" }}>
            Mark all read
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, markAllRead]);

  const handleTap = async (n: AppNotification) => {
    if (!n.isRead) {
      await apiMarkRead(n._id);
      markRead(n._id);
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <Pressable
      onPress={() => handleTap(item)}
      style={[
        styles.row,
        {
          backgroundColor: item.isRead ? theme.colors.surface : theme.colors.primary + "12",
          borderBottomColor: theme.colors.border,
          borderLeftColor: item.isRead ? "transparent" : theme.colors.primary,
          borderLeftWidth: item.isRead ? 0 : 3,
        },
      ]}
    >
      <Text style={styles.icon}>{notifIcon(item.type)}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
          {notifLabel(item.type)}
        </Text>
        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
          {timeAgo(item.createdAt)}
        </Text>
      </View>
      {!item.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(n) => n._id}
        renderItem={renderItem}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState
            icon="🔔"
            title="All caught up!"
            subtitle="You have no notifications yet."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  icon: { fontSize: 28 },
  label: { fontSize: 14, fontWeight: "600" },
  time: { fontSize: 12, marginTop: 3 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
