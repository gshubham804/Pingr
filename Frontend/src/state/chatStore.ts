import { create } from "zustand";
import type { Conversation, Message } from "../api/chat";

type ChatState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messages: {},

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [
        conversation,
        ...state.conversations.filter((c) => c._id !== conversation._id),
      ],
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const updatedMessages = [message, ...(state.messages[conversationId] ?? [])];
      
      const updatedConvos = state.conversations.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
          : c
      );

      updatedConvos.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
        conversations: updatedConvos,
      };
    }),
}));
