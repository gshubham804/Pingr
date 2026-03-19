import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { initSocket } from "./sockets/index.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// Initialize Socket.io (with JWT auth + all handlers)
initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on PORT ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server failed to start: ${error}`);
    process.exit(1);
  }
};

startServer();
