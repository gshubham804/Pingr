import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getMessages,
} from "../services/chat.service.js";

// POST /api/chat/conversations/:userId
export const startConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const conversation = await getOrCreateConversation(req.user!.userId, userId);
    res.status(200).json(new ApiResponse(200, "Conversation ready", conversation));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// GET /api/chat/conversations
export const getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conversations = await getUserConversations(req.user!.userId);
    res.status(200).json(new ApiResponse(200, "Conversations fetched", conversations));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// POST /api/chat/conversations/:conversationId/messages
export const postMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conversationId = req.params.conversationId as string;
    const message = await sendMessage(
      conversationId,
      req.user!.userId,
      req.body.content
    );
    res.status(201).json(new ApiResponse(201, "Message sent", message));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// GET /api/chat/conversations/:conversationId/messages?page=1
export const listMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const conversationId = req.params.conversationId as string;
    const messages = await getMessages(conversationId, req.user!.userId, page);
    res.status(200).json(new ApiResponse(200, "Messages fetched", messages));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};
