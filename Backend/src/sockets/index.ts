import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import type { ServerToClientEvents, ClientToServerEvents, SocketData } from "../types/socket.js";
import { verifyToken } from "../utils/jwt.js";
import { registerChatHandlers } from "./chat.socket.js";
import { registerPresenceHandlers } from "./presence.socket.js";
import { logger } from "../utils/logger.js";

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
    httpServer,
    {
      cors: { origin: "*" },
    }
  );

  // JWT authentication middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const decoded = verifyToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.data.userId})`);

    registerChatHandlers(io, socket);
    registerPresenceHandlers(io, socket);
  });

  return io;
};
