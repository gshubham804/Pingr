import { Schema, model, Types } from "mongoose";

const ConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },

    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],

    lastMessage: {
      type: Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

// Helps prevent duplicate 1-to-1 conversations
ConversationSchema.index({ participants: 1 }, { unique: false });

export const Conversation = model("Conversation", ConversationSchema);
