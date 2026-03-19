import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { NotificationType } from "../types/enums.js";

// Get or create a private conversation between two users
export const getOrCreateConversation = async (userAId: string, userBId: string) => {
  // Check friendship
  const userA = await User.findById(userAId);
  if (!userA?.friends.some((id) => id.toString() === userBId)) {
    throw new ApiError(403, "You can only message friends");
  }

  let conversation = await Conversation.findOne({
    type: "private",
    participants: { $all: [userAId, userBId], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      type: "private",
      participants: [userAId, userBId],
    });
  }

  return conversation;
};

// Get all conversations for the current user
export const getUserConversations = async (userId: string) => {
  return Conversation.find({ participants: userId })
    .populate("participants", "fullName email profile.avatar isOnline lastSeen")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
};

// Send a message in a conversation
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: { type: "text" | "image" | "file"; body: string }
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found or not a participant");
  }

  const message = await Message.create({ conversationId, senderId, content });

  // Update lastMessage on conversation
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

  // Notify other participants
  const otherParticipants = conversation.participants.filter(
    (id) => id.toString() !== senderId
  );
  const notifications = otherParticipants.map((recipientId) => ({
    userId: recipientId,
    type: NotificationType.MESSAGE,
    referenceId: message._id,
  }));
  await Notification.insertMany(notifications);

  return message;
};

// Get paginated messages in a conversation
export const getMessages = async (
  conversationId: string,
  userId: string,
  page: number = 1,
  limit: number = 30
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found or not a participant");
  }

  const skip = (page - 1) * limit;

  return Message.find({ conversationId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("senderId", "fullName profile.avatar");
};
