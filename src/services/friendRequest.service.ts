import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js"
import { ApiError } from "../utils/ApiError.js";
import { FriendRequestStatus, NotificationType } from "../types/enums.js";

export const sendFriendRequest = async(fromUserId: string, toUserId: string)=>{
    if(fromUserId === toUserId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    // check recipient exists
    const toUser = await User.findById(toUserId);
    if(!toUser){
        throw new ApiError(404, "User not found");
    }

    // check already friends
    const fromUser = await User.findById(fromUserId);
    if(fromUser?.friends.some((id)=>id.toString()=== toUserId)){
        throw new ApiError(409, "You are already friends");
    }

    // check duplicate or reverse request
    const existing = await FriendRequest.findOne({
        $or: [
            { fromUser: fromUserId,  toUser: toUserId},
            { fromUser: toUserId, toUser: fromUserId},
        ],
    });

    if(existing){
        throw new ApiError(409, "Friend request already exists");
    }

    const request = await FriendRequest.create({
        fromUser: fromUserId,
        toUser: toUserId,
    })

    // create notification for recipient
    await Notification.create({
        userId: toUserId,
        type: NotificationType.FRIEND_REQUEST,
        referenceId: request._id,
    })

    return request;
}

// Accept or reject a friend request
export const respondToFriendRequest = async(
    requestId: string,
    userId: string,
    action: "accept" | "reject"
) =>{
    const request = await FriendRequest.findById(requestId);

    if(!request){
        throw new ApiError(404, "Friend request not found");
    }

    // Only the recipient can respond
    if(request.toUser.toString() !== userId) {
        throw new ApiError(403, "Not authorized to respond to this request");
    }

    if(request.status !== FriendRequestStatus.PENDING){
        throw new ApiError(400, "Request is already accepted or rejected");
    }

    if(action === "accept") {
        request.status = FriendRequestStatus.ACCEPTED;
        await request.save();

        // Add each other as friends
        await User.findByIdAndUpdate(request.fromUser, {
            $addToSet: { friends: request.toUser },
        });

        await User.findByIdAndUpdate(request.toUser, {
            $addToSet: { friends: request.fromUser },
        });

        // Notify the sender
        await Notification.create({
            userId: request.fromUser,
            type: NotificationType.FRIEND_ACCEPTED,
            referenceId: request._id,
        });
    } else {
        request.status = FriendRequestStatus.REJECTED;
        await request.save();
    }

    return request;
}

// Get all pending requests received by a user
export const getPendingRequests = async(userId: string) =>{
    return FriendRequest.find({
        toUser: userId,
        status: FriendRequestStatus.PENDING,
    }).populate("fromUser", "fullName email profile.avatar");
};

// Get all friends of a user
export const getFriendsList = async(userId: string) =>{
    const user = await User.findById(userId).populate(
        "friends",
        "fullName email profile.avatar isOnline lastSeen"
    );

    if(!user) throw new ApiError(404, "User not found");

    return user.friends;
}