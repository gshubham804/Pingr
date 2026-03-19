import { Schema, model, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: {
        type: String,
        enum: ["text", "image", "file"],
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
    },

    status: {
      sentAt: {
        type: Date,
        default: Date.now,
      },
      deliveredAt: {
        type: Date,
        default: null,
      },
      readAt: {
        type: Date,
        default: null,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

export const Message = model("Message", MessageSchema);
