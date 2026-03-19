import { create } from "zustand";
import type { FriendUser, FriendRequest } from "../api/friends";

type FriendState = {
  friends: FriendUser[];
  pendingRequests: FriendRequest[];
  setFriends: (friends: FriendUser[]) => void;
  setPendingRequests: (requests: FriendRequest[]) => void;
  removeRequest: (requestId: string) => void;
};

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  pendingRequests: [],

  setFriends: (friends) => set({ friends }),

  setPendingRequests: (pendingRequests) => set({ pendingRequests }),

  removeRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId),
    })),
}));
