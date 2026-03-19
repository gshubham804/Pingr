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
import { useFriendStore } from "../state/friendStore";
import {
  apiGetPendingRequests,
  apiRespondFriendRequest,
  type FriendRequest,
} from "../api/friends";
import { apiGetFriends } from "../api/friends";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import { useState } from "react";

export default function FriendRequestsScreen() {
  const theme = useTheme();
  const { pendingRequests, setPendingRequests, removeRequest, setFriends } = useFriendStore();
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGetPendingRequests();
      if (res.success && res.data) setPendingRequests(res.data);
    } catch {
      Alert.alert("Error", "Could not load friend requests.");
    } finally {
      setLoading(false);
    }
  }, [setPendingRequests]);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (request: FriendRequest, action: "accept" | "reject") => {
    setResponding((p) => ({ ...p, [request._id]: true }));
    try {
      await apiRespondFriendRequest(request._id, action);
      removeRequest(request._id);
      if (action === "accept") {
        // Refresh friends list
        const res = await apiGetFriends();
        if (res.success && res.data) setFriends(res.data);
      }
    } catch {
      Alert.alert("Error", `Could not ${action} request.`);
    } finally {
      setResponding((p) => ({ ...p, [request._id]: false }));
    }
  };

  const renderItem = ({ item }: { item: FriendRequest }) => {
    const busy = responding[item._id] ?? false;
    return (
      <View
        style={[
          styles.row,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Avatar uri={item.fromUser.profile?.avatar} name={item.fromUser.fullName} size={50} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
            {item.fromUser.fullName}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {item.fromUser.email}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
            })}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => respond(item, "accept")}
            disabled={busy}
            style={[styles.acceptBtn, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.btnText}>{busy ? "…" : "Accept"}</Text>
          </Pressable>
          <Pressable
            onPress={() => respond(item, "reject")}
            disabled={busy}
            style={[styles.rejectBtn, { borderColor: theme.colors.border }]}
          >
            <Text style={[styles.btnText, { color: theme.colors.textPrimary }]}>
              {busy ? "…" : "Decline"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

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
        data={pendingRequests}
        keyExtractor={(r) => r._id}
        renderItem={renderItem}
        contentContainerStyle={pendingRequests.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState
            iconName="user-plus"
            title="No pending requests"
            subtitle="When someone sends you a friend request, it'll appear here."
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
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  email: { fontSize: 12, marginTop: 2 },
  time: { fontSize: 11, marginTop: 4 },
  actions: { gap: 6 },
  acceptBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  rejectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  btnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});
