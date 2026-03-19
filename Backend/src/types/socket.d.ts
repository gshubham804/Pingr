// Typed Socket.io event maps

export interface ServerToClientEvents {
  "new_message": (message: MessagePayload) => void;
  "message_delivered": (data: { messageId: string }) => void;
  "message_read": (data: { messageId: string }) => void;
  "user_online": (data: { userId: string }) => void;
  "user_offline": (data: { userId: string; lastSeen: Date }) => void;
  "typing_start": (data: { conversationId: string; userId: string }) => void;
  "typing_stop": (data: { conversationId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
  "join_conversation": (conversationId: string) => void;
  "leave_conversation": (conversationId: string) => void;
  "send_message": (data: SendMessagePayload) => void;
  "typing_start": (data: { conversationId: string }) => void;
  "typing_stop": (data: { conversationId: string }) => void;
  "mark_delivered": (data: { messageId: string }) => void;
  "mark_read": (data: { messageId: string }) => void;
}

export interface SocketData {
  userId: string;
}

export interface MessagePayload {
  _id: string;
  conversationId: string;
  senderId: string;
  content: {
    type: "text" | "image" | "file";
    body: string;
  };
  status: {
    sentAt: Date;
    deliveredAt: Date | null;
    readAt: Date | null;
  };
}

export interface SendMessagePayload {
  conversationId: string;
  content: {
    type: "text" | "image" | "file";
    body: string;
  };
}
