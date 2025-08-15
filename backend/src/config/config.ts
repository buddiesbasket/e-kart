import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

interface Config {
  jwtSecret: Secret;
  jwtExpiration: string; // Changed to string only for simplicity
  refreshTokenSecret: Secret;
  refreshTokenExpiration: string; // Changed to string only for simplicity
  mongoUri: string;
  port: number;
  nodeEnv: string;
}

const config: Config = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/e-kart',
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;