import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/constants.js";

export const hashPassword = async(password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> =>{
    return bcrypt.compare(plainPassword, hashedPassword);
}