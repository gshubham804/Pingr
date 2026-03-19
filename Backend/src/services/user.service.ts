import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

// Get a single user's public profile
export const getUserProfile = async(userId: string) =>{
    const user = await User.findById(userId).select(
        "fullName email profile isOnline lastSeen friends");

        if(!user) throw new ApiError(404, "User not found");
        return user;
};

// Update authenticated user's profile
export const updateUserProfile = async(
    userId: string,
    updates: { fullName?:string; profile?: { bio?: string;
        location?:string; avatar?:string
    }}
) =>{
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates},
        { new: true, runValidators: true}
    ).select("fullName email profile");

    if(!user) throw new ApiError(404, "User not found");
    return user;
}

// Search users by name or email (excludes self)
export const searchUsers = async(query: string, currentUserId: string)=>{
    if(!query || query.trim().length<2){
        throw new ApiError(400, "Search query must be at least 2 characters");
    }

    const regex = new RegExp(query.trim(), "i");
    const users = await User.find({
        _id: {$ne: currentUserId},
        $or: [{ fullName: regex}, { email: regex}],
    })
    .select("fullName email profile.avatar isOnline")
    .limit(20);

    return users;
}