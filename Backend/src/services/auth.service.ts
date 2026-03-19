import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

interface RegisterInput {
    fullName: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

interface AuthResult {
    token: string;
    user: {
        _id: unknown;
        fullName: string;
        email: string;
        profile: unknown;
    }
}

export const registerUser = async(input: RegisterInput): Promise<AuthResult>=>{
    const {fullName, email, password} = input;

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({fullName, email, passwordHash});

    const token = generateToken(newUser._id.toString());

    return {
        token,
        user: {
            _id: newUser._id,
            fullName: newUser.fullName as string,
            email: newUser.email as string,
            profile: newUser.profile
        }
    }
}

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;
  // 1. Find user (include passwordHash)
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  // 2. Compare password
  const isValid = await comparePassword(password, user.passwordHash as string);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  // 3. Generate token
  const token = generateToken(user._id.toString());
  return {
    token,
    user: {
      _id: user._id,
      fullName: user.fullName as string,
      email: user.email as string,
      profile: user.profile,
    },
  };
};