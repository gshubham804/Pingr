import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../config/constants.js";

export const generateToken = (userId: string): string =>{
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN }
    )
};


export const verifyToken = (token: string): jwt.JwtPayload =>{
    return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
}