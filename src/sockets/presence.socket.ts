import type { Server, Socket } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents, SocketData } from "../types/socket.js";
import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.js";

export const registerPresenceHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
) => {
  const userId = socket.data.userId;

  // Mark user online on connect
  const setOnline = async () => {
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: null });
    socket.broadcast.emit("user_online", { userId });
    logger.info(`User online: ${userId}`);
  };

  // Mark user offline on disconnect
  socket.on("disconnect", async () => {
    const lastSeen = new Date();
    await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
    socket.broadcast.emit("user_offline", { userId, lastSeen });
    logger.info(`User offline: ${userId}`);
  });

  setOnline();
};
