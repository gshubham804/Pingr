import { io } from "socket.io-client";
import { API_BASE_URL } from "./env";
import { useAuthStore } from "../state/authStore";

// Singleton socket – lazy-connected in the app root
export const socket = io(API_BASE_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: (cb) => {
    const token = useAuthStore.getState().token;
    cb({ token });
  },
});
