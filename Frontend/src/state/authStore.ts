import { create } from "zustand";
import { secure } from "../storage/secure";

const TOKEN_KEY = "pingr.token";

export type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  profile?: unknown;
};

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;

  hydrate: () => Promise<void>;
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  token: null,
  user: null,

  hydrate: async () => {
    const token = await secure.get(TOKEN_KEY);
    // User can be fetched from `/api/users/me` after token hydration.
    set({ token, hydrated: true });
  },

  setAuth: async (token, user) => {
    await secure.set(TOKEN_KEY, token);
    set({ token, user });
  },

  setUser: (user) => {
    set({ user });
  },

  signOut: async () => {
    await secure.del(TOKEN_KEY);
    set({ token: null, user: null });
  },
}));

