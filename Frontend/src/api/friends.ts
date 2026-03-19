import { http } from "./http";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type FriendUser = {
  _id: string;
  fullName: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string | null;
  profile?: { avatar: string | null; bio: string; location: string };
};

export type FriendRequest = {
  _id: string;
  from: FriendUser;
  to: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export const apiGetFriends = async () => {
  const res = await http.get<ApiResponse<FriendUser[]>>("/api/friends");
  return res.data;
};

export const apiSendFriendRequest = async (toUserId: string) => {
  const res = await http.post<ApiResponse<FriendRequest>>(`/api/friends/request/${toUserId}`);
  return res.data;
};

export const apiRespondFriendRequest = async (
  requestId: string,
  action: "accept" | "reject"
) => {
  const res = await http.put<ApiResponse<FriendRequest>>(
    `/api/friends/request/${requestId}/respond`,
    { action }
  );
  return res.data;
};

export const apiGetPendingRequests = async () => {
  const res = await http.get<ApiResponse<FriendRequest[]>>("/api/friends/requests/pending");
  return res.data;
};
