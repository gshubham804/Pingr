import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { useFriendStore } from "../state/friendStore";
import { useChatStore } from "../state/chatStore";
import {
  apiSearchUsers,
  type UserProfile,
} from "../api/users";
import {
  apiGetFriends,
  apiSendFriendRequest,
} from "../api/friends";
import { apiStartConversation } from "../api/chat";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/RootNavigator";

type NavProp = NativeStackNavigationProp<MainStackParamList>;

type RequestStatus = "none" | "sending" | "sent";

export default function PeopleScreen() {
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const myId = useAuthStore((s) => s.user?._id);
  const { friends, setFriends } = useFriendStore();
  const { addConversation } = useChatStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [requestStatus, setRequestStatus] = useState<Record<string, RequestStatus>>({});

  const loadFriends = useCallback(async () => {
    try {
      const res = await apiGetFriends();
      if (res.success && res.data) setFriends(res.data);
    } catch {
      /** silent */
    }
  }, [setFriends]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await apiSearchUsers(q);
      setResults(res.data ?? []);
    } catch {
      /** silent */
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 350);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const addFriend = async (userId: string) => {
    setRequestStatus((p) => ({ ...p, [userId]: "sending" }));
    try {
      await apiSendFriendRequest(userId);
      setRequestStatus((p) => ({ ...p, [userId]: "sent" }));
    } catch {
      Alert.alert("Error", "Could not send friend request.");
      setRequestStatus((p) => ({ ...p, [userId]: "none" }));
    }
  };

  const openChat = async (user: UserProfile) => {
    try {
      const res = await apiStartConversation(user._id);
      if (res.success && res.data) {
        addConversation(res.data);
        navigation.navigate("ChatRoom", {
          conversationId: res.data._id,
          participantName: user.fullName,
        });
      }
    } catch {
      Alert.alert("Error", "Could not open chat.");
    }
  };

  const isFriend = (userId: string) => friends.some((f) => f._id === userId);

  const renderSearchResult = ({ item }: { item: UserProfile }) => {
    if (item._id === myId) return null;
    const friend = isFriend(item._id);
    const status = requestStatus[item._id] ?? "none";
    return (
      <View
        style={[
          styles.row,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Avatar uri={item.profile?.avatar} name={item.fullName} size={46} />
        <View style={styles.rowInfo}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{item.fullName}</Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{item.email}</Text>
        </View>
        {friend ? (
          <Pressable
            onPress={() => openChat(item)}
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: theme.colors.primary + "15", opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Feather name="message-circle" size={18} color={theme.colors.primary} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => status === "none" && addFriend(item._id)}
            disabled={status !== "none"}
            style={[
              styles.btn,
              {
                backgroundColor:
                  status === "sent"
                    ? theme.colors.border
                    : status === "sending"
                    ? theme.colors.border
                    : theme.colors.primary,
              },
            ]}
          >
            {status === "none" && <Feather name="user-plus" size={14} color="#FFF" style={{ marginRight: 6 }} />}
            <Text style={[styles.btnText, { color: status === "sent" ? theme.colors.textSecondary : "#fff" }]}>
              {status === "sent" ? "Sent" : status === "sending" ? "…" : "Add"}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderFriend = ({ item }: { item: UserProfile }) => (
    <Pressable
      onPress={() => openChat(item)}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.colors.border : theme.colors.surface, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={{ marginRight: 12 }}>
        <Avatar uri={item.profile?.avatar} name={item.fullName} size={50} />
        {item.isOnline && (
          <View style={[styles.onlineDot, { borderColor: theme.colors.surface }]} />
        )}
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{item.fullName}</Text>
        <Text style={[styles.email, { color: item.isOnline ? theme.colors.success : theme.colors.textSecondary }]}>
          {item.isOnline ? "Online" : "Offline"}
        </Text>
      </View>
      <View style={[styles.iconBtn, { backgroundColor: theme.colors.primary + "15" }]}>
        <Feather name="message-circle" size={18} color={theme.colors.primary} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Feather name="search" size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or email…"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
        />
        {searching && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>

      {query.trim() ? (
        <FlatList
          data={results.filter((u) => u._id !== myId)}
          keyExtractor={(u) => u._id}
          renderItem={renderSearchResult}
          contentContainerStyle={results.length === 0 ? { flex: 1 } : undefined}
          ListEmptyComponent={
            !searching ? (
              <EmptyState iconName="search" title="No users found" subtitle="Try a different name or email." />
            ) : null
          }
        />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(f) => f._id}
          renderItem={renderFriend}
          ListHeaderComponent={
            <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary, backgroundColor: theme.colors.background }]}>
              Friends · {friends.length}
            </Text>
          }
          contentContainerStyle={friends.length === 0 ? { flex: 1 } : undefined}
          ListEmptyComponent={
            <EmptyState iconName="users" title="No friends yet" subtitle="Search for people above to connect." />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", letterSpacing: 0.2 },
  email: { fontSize: 13, marginTop: 2 },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
  },
});
