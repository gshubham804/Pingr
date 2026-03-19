import { useEffect, useRef, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { useChatStore } from "../state/chatStore";
import { apiGetMessages, type Message } from "../api/chat";
import { socket } from "../config/socket";
import Avatar from "../components/Avatar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<MainStackParamList, "ChatRoom">;

function TickIcon({ status }: { status: Message["status"] }) {
  if (status.readAt) return <Text style={{ color: "#10B981", fontSize: 10 }}>✓✓</Text>;
  if (status.deliveredAt) return <Text style={{ color: "#94A3B8", fontSize: 10 }}>✓✓</Text>;
  return <Text style={{ color: "#94A3B8", fontSize: 10 }}>✓</Text>;
}

export default function ChatRoomScreen({ route, navigation }: Props) {
  const { conversationId, participantName } = route.params;
  const theme = useTheme();
  const myId = useAuthStore((s) => s.user?._id);
  const { messages, setMessages, addMessage } = useChatStore();
  const convMessages = messages[conversationId] ?? [];

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    navigation.setOptions({ title: participantName });
  }, [participantName, navigation]);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGetMessages(conversationId);
      if (res.success && res.data) setMessages(conversationId, res.data);
    } catch {
      Alert.alert("Error", "Could not load messages.");
    } finally {
      setLoading(false);
    }
  }, [conversationId, setMessages]);

  useEffect(() => {
    loadMessages();

    if (!socket.connected) socket.connect();

    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (msg: Message) => {
      addMessage(conversationId, msg);
      setIsTyping(false);
    };

    const handleTypingStart = ({ userId }: { userId: string }) => {
      if (userId !== myId) setIsTyping(true);
    };

    const handleTypingStop = ({ userId }: { userId: string }) => {
      if (userId !== myId) setIsTyping(false);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing_start", handleTypingStart);
    socket.on("typing_stop", handleTypingStop);

    return () => {
      socket.emit("leave_conversation", conversationId);
      socket.off("new_message", handleNewMessage);
      socket.off("typing_start", handleTypingStart);
      socket.off("typing_stop", handleTypingStop);
    };
  }, [conversationId, myId, addMessage, loadMessages]);

  const handleChangeText = (v: string) => {
    setText(v);
    socket.emit("typing_start", { conversationId });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId });
    }, 1500);
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit("send_message", {
      conversationId,
      content: { type: "text", body: trimmed },
    });
    setText("");
  };

  const renderBubble = ({ item }: { item: Message }) => {
    const isMe = item.senderId === myId;
    return (
      <View
        style={[
          styles.bubbleWrapper,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMe ? theme.colors.primary : theme.colors.surface,
              borderColor: isMe ? theme.colors.primary : theme.colors.border,
              borderBottomRightRadius: isMe ? 4 : theme.radii.lg,
              borderBottomLeftRadius: isMe ? theme.radii.lg : 4,
            },
          ]}
        >
          <Text
            style={{
              color: isMe ? "#fff" : theme.colors.textPrimary,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {item.content.body}
          </Text>
          <View style={styles.bubbleMeta}>
            <Text style={[styles.timeText, { color: isMe ? "rgba(255,255,255,0.7)" : theme.colors.textSecondary }]}>
              {new Date(item.status.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {isMe && <TickIcon status={item.status} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          color={theme.colors.primary}
          size="large"
        />
      ) : (
        <FlatList
          ref={listRef}
          data={convMessages}
          keyExtractor={(item) => item._id}
          renderItem={renderBubble}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {isTyping && (
        <View style={[styles.typingRow, { backgroundColor: theme.colors.background }]}>
          <Avatar name={participantName} size={20} />
          <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
            {participantName} is typing…
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputRow,
          { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.border,
            },
          ]}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Message…"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          disabled={!text.trim()}
          style={[
            styles.sendBtn,
            { backgroundColor: text.trim() ? theme.colors.primary : theme.colors.border },
          ]}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 12, paddingVertical: 12, gap: 6 },
  bubbleWrapper: { flexDirection: "row", marginVertical: 2 },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  bubbleMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timeText: { fontSize: 10 },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  typingText: { fontSize: 12, fontStyle: "italic" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: { color: "#fff", fontSize: 16, marginLeft: 2 },
});
