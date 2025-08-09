import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}