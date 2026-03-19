import { http } from "./http";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type MessageContent = {
  type: "text" | "image" | "file";
  body: string;
};

export type MessageStatus = {
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: MessageContent;
  status: MessageStatus;
};

export type ConversationParticipant = {
  _id: string;
  fullName: string;
  profile?: { avatar: string | null; bio: string; location: string };
  isOnline?: boolean;
};

export type Conversation = {
  _id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message | null;
  updatedAt: string;
};

export const apiGetConversations = async () => {
  const res = await http.get<ApiResponse<Conversation[]>>("/api/chat/conversations");
  return res.data;
};

export const apiStartConversation = async (userId: string) => {
  const res = await http.post<ApiResponse<Conversation>>(`/api/chat/conversations/${userId}`);
  return res.data;
};

export const apiGetMessages = async (conversationId: string, page = 1) => {
  const res = await http.get<ApiResponse<Message[]>>(
    `/api/chat/conversations/${conversationId}/messages?page=${page}`
  );
  return res.data;
};

export const apiSendMessage = async (
  conversationId: string,
  content: MessageContent
) => {
  const res = await http.post<ApiResponse<Message>>(
    `/api/chat/conversations/${conversationId}/messages`,
    { content }
  );
  return res.data;
};
