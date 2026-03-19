import type { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  SendMessagePayload,
} from "../types/socket.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { logger } from "../utils/logger.js";

export const registerChatHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
) => {
  const userId = socket.data.userId;

  // Join a conversation room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    logger.info(`User ${userId} joined conversation ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
    logger.info(`User ${userId} left conversation ${conversationId}`);
  });

  // Send a message
  socket.on("send_message", async (data: SendMessagePayload) => {
    try {
      const { conversationId, content } = data;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        logger.warn(`User ${userId} tried to send to unknown conversation ${conversationId}`);
        return;
      }

      const message = await Message.create({
        conversationId,
        senderId: userId,
        content,
      });

      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

      const populated = await message.populate("senderId", "fullName profile.avatar");

      if (!message.content) {
        logger.warn(`Message ${message._id} has no content, skipping emit`);
        return;
      }

      // Broadcast to all in the room (including sender)
      io.to(conversationId).emit("new_message", {
        _id: message._id.toString(),
        conversationId,
        senderId: userId,
        content: message.content,
        status: {
          sentAt: message.status?.sentAt ?? new Date(),
          deliveredAt: message.status?.deliveredAt ?? null,
          readAt: message.status?.readAt ?? null,
        },
      });

      logger.info(`Message sent in conversation ${conversationId} by ${userId}`);
    } catch (err) {
      logger.error(`send_message error: ${err}`);
    }
  });

  // Typing indicators
  socket.on("typing_start", ({ conversationId }) => {
    socket.to(conversationId).emit("typing_start", { conversationId, userId });
  });

  socket.on("typing_stop", ({ conversationId }) => {
    socket.to(conversationId).emit("typing_stop", { conversationId, userId });
  });

  // Mark message delivered
  socket.on("mark_delivered", async ({ messageId }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { "status.deliveredAt": new Date() },
        { new: true }
      );
      if (message) {
        io.to(message.conversationId.toString()).emit("message_delivered", { messageId });
      }
    } catch (err) {
      logger.error(`mark_delivered error: ${err}`);
    }
  });

  // Mark message read
  socket.on("mark_read", async ({ messageId }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { "status.readAt": new Date() },
        { new: true }
      );
      if (message) {
        io.to(message.conversationId.toString()).emit("message_read", { messageId });
      }
    } catch (err) {
      logger.error(`mark_read error: ${err}`);
    }
  });
};
