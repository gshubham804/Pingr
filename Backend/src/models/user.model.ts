import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    profile: {
      avatar: {
        type: String,
        default: null,
      },
      bio: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
    },

    friends: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    blockedUsers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", UserSchema);
