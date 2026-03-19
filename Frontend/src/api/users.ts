import { http } from "./http";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type Me = {
  _id: string;
  fullName: string;
  email: string;
  profile?: unknown;
};

export const apiMe = async () => {
  const res = await http.get<ApiResponse<Me>>("/api/users/me");
  return res.data;
};

