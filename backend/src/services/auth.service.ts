import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';
import { Types } from 'mongoose';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

type UserResponse = Omit<IUser, 'password'> & {
  _id: Types.ObjectId | string;
};

interface AuthResponse {
  user: UserResponse;
  token: string;
}

interface LogoutResponse {
  message: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
      const user = await User.create(userData);
      const token = generateToken(user._id.toString());
      const userObj = user.toObject();
      delete (userObj as Partial<IUser>).password;
      return { user: userObj as any, token };
    } catch (error) {
      logger.error(`Error in register service: ${(error as Error).message}`);
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const { email, password } = loginData;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Incorrect email or password', 401);
      }
      const token = generateToken(user._id.toString());
      const userObj = user.toObject();
      delete (userObj as Partial<IUser>).password;
      return { user: userObj as any, token };
    } catch (error) {
      logger.error(`Error in login service: ${(error as Error).message}`);
      throw error;
    }
  }

  async getCurrentUser(userId: string): Promise<Omit<IUser, 'password'>> {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) throw new AppError('User not found', 404);
      return user.toObject() as Omit<IUser, 'password'>;
    } catch (error) {
      logger.error(`Error in getCurrentUser service: ${(error as Error).message}`);
      throw error;
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<LogoutResponse> {
    try {
      if (refreshToken) {
        await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } });
      }
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error(`Error in logout service: ${(error as Error).message}`);
      throw error;
    }
  }

  async logoutAll(userId: string): Promise<LogoutResponse> {
    try {
      await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
      return { message: 'Logged out from all devices successfully' };
    } catch (error) {
      logger.error(`Error in logoutAll service: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default new AuthService();
