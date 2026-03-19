import { http } from "./http";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type UserProfile = {
  _id: string;
  fullName: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string | null;
  profile?: {
    avatar: string | null;
    bio: string;
    location: string;
  };
  friends?: string[];
};

export type Me = UserProfile;

export const apiMe = async () => {
  const res = await http.get<ApiResponse<Me>>("/api/users/me");
  return res.data;
};

export const apiSearchUsers = async (q: string) => {
  const res = await http.get<ApiResponse<UserProfile[]>>(`/api/users/search?q=${encodeURIComponent(q)}`);
  return res.data;
};

export const apiGetProfile = async (userId: string) => {
  const res = await http.get<ApiResponse<UserProfile>>(`/api/users/${userId}`);
  return res.data;
};

export const apiUpdateProfile = async (body: {
  bio?: string;
  location?: string;
  avatar?: string;
}) => {
  const res = await http.put<ApiResponse<Me>>("/api/users/me", body);
  return res.data;
};

