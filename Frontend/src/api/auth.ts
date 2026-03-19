import { http } from "./http";

export type AuthResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
      profile?: unknown;
    };
  };
};

export const apiRegister = async (input: { fullName: string; email: string; password: string }) => {
  const res = await http.post<AuthResponse>("/api/auth/register", input);
  return res.data;
};

export const apiLogin = async (input: { email: string; password: string }) => {
  const res = await http.post<AuthResponse>("/api/auth/login", input);
  return res.data;
};

