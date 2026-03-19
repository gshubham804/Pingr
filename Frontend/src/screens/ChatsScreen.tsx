import { useEffect, useCallback } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { useChatStore } from "../state/chatStore";
import { apiGetConversations, type Conversation } from "../api/chat";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import type { MainStackParamList } from "../navigation/RootNavigator";

type NavProp = NativeStackNavigationProp<MainStackParamList>;

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ChatsScreen() {
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const myId = useAuthStore((s) => s.user?._id);
  const { conversations, setConversations } = useChatStore();

  const load = useCallback(async () => {
    try {
      const res = await apiGetConversations();
      if (res.success && res.data) setConversations(res.data);
    } catch {
      Alert.alert("Error", "Could not load conversations.");
    }
  }, [setConversations]);

  useEffect(() => {
    load();
  }, [load]);

  const getOther = (conv: Conversation) =>
    conv.participants.find((p) => p._id !== myId);

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = getOther(item);
    const lastMsg = item.lastMessage?.content?.body ?? "No messages yet";
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ChatRoom", {
            conversationId: item._id,
            participantName: other?.fullName ?? "Chat",
          })
        }
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: pressed
              ? theme.colors.border
              : theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={{ marginRight: 12 }}>
          <Avatar uri={other?.profile?.avatar} name={other?.fullName} size={50} />
          {other?.isOnline && (
            <View
              style={[styles.onlineDot, { borderColor: theme.colors.surface }]}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.rowHeader}>
            <Text
              style={[styles.name, { color: theme.colors.textPrimary }]}
              numberOfLines={1}
            >
              {other?.fullName ?? "Unknown"}
            </Text>
            <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
              {item.updatedAt ? timeLabel(item.updatedAt) : ""}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[styles.preview, { color: theme.colors.textSecondary }]}
          >
            {lastMsg}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={conversations.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState
            iconName="message-square"
            title="No conversations yet"
            subtitle="Find people in the People tab and start chatting."
          />
        }
      />

      {/* FAB */}
      <Pressable
        onPress={() => navigation.getParent()?.navigate("People")}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: theme.colors.primary, opacity: pressed ? 0.8 : 1 }
        ]}
      >
        <Feather name="edit-2" size={24} color="#FFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { fontSize: 15, fontWeight: "700", flex: 1 },
  time: { fontSize: 11, marginLeft: 8 },
  preview: { fontSize: 13, lineHeight: 18 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabIcon: { fontSize: 20 },
});
