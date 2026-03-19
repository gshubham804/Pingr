import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["new_message", "friend_request", "friend_accepted"],
      required: true,
    },

    referenceId: {
      type: Types.ObjectId,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

export const Notification = model("Notification", NotificationSchema);
