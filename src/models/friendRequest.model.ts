import { Schema, Types, model } from "mongoose";

const FriendRequestSchema = new Schema(
  {
    fromUser: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    toUser: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  },
);

// Prevent duplicate requests
FriendRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export const FriendRequest = model("FriendRequest", FriendRequestSchema);
