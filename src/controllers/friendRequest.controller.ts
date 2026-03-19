import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    sendFriendRequest,
    respondToFriendRequest,
    getPendingRequests,
    getFriendsList
} from "../services/friendRequest.service.js";

// POST /api/friends/request/:toUserId
export const sendRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const fromUserId = req.user!.userId;
        const { toUserId } = req.params;
        if (typeof toUserId !== "string") return next(new ApiError(400, "toUserId is required"));
        const request = await sendFriendRequest(fromUserId, toUserId);
        res.status(201).json(new ApiResponse(201, "Friend request sent", request));
    } catch (error) {
        next(new ApiError(500, "Internal server error"))
    }
}

// PUT /api/friends/request/:requestId/respond
export const respondRequest = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const userId = req.user!.userId;
        const { requestId } = req.params;
        const { action } = req.body;

        if (typeof requestId !== "string") return next(new ApiError(400, "requestId is required"));

        if(!["accept", "reject"].includes(action)) {
            return next(new ApiError(400, "action must be 'accept' or 'reject'"));
        }

        const request = await respondToFriendRequest(requestId, userId, action);
        res.status(200).json(new ApiResponse(200, `Request ${action}ed`, request))
    } catch (error) {
        next(new ApiError(500, "Internal server error"));
    }
}

// GET /api/friends/requests/pending
export const getPending = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const userId = req.user!.userId;
        const requests = await getPendingRequests(userId);
        res.status(200).json(new ApiResponse(200, "Pending requests fetched", requests));
    } catch (error) {
        next(new ApiError(500, "Internal server error"));
    }
}

// GET /api/friends
export const getFriends = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const userId = req.user!.userId;
        const friends = await getFriendsList(userId);
        res.status(200).json(new ApiResponse(200, "Friends list fetched", friends));
    } catch (error) {
        next(new ApiError(500, "Internal server error"));
    }
}