import jwt, { SignOptions } from 'jsonwebtoken';
import logger from './logger';
import ms, { StringValue } from 'ms';

// Define the token payload interface
interface TokenPayload {
  id: string;
}

// Define the decoded token interface
interface DecodedToken extends TokenPayload {
  iat?: number;
  exp?: number;
}

const generateToken = (userId: string): string => {
  try {
    // Validate environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    if (!process.env.JWT_EXPIRE) {
      throw new Error('JWT_EXPIRE is not defined in environment variables');
    }

    // Parse the expiration time
    const expireValue = process.env.JWT_EXPIRE.trim();
    let expiresIn: number; // We'll always convert to milliseconds

    // Check if it's a numeric string (seconds)
    if (/^\d+$/.test(expireValue)) {
      expiresIn = parseInt(expireValue, 10) * 1000; // Convert to milliseconds
    }
    // Otherwise parse as time string
    else {
      expiresIn = ms(expireValue as StringValue);
      if (typeof expiresIn !== 'number') {
        throw new Error(`Invalid JWT_EXPIRE format: ${expireValue}`);
      }
    }

    // Create token payload
    const payload: TokenPayload = { id: userId };

    // Create sign options - using seconds as number
    const options: SignOptions = {
      expiresIn: Math.floor(expiresIn / 1000), // Convert to seconds
      algorithm: 'HS256',
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
  } catch (error) {
    logger.error(`Error generating token: ${(error as Error).message}`);
    throw error;
  }
};

const verifyToken = (token: string): DecodedToken => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  } catch (error) {
    logger.error(`Error verifying token: ${(error as Error).message}`);
    throw error;
  }
};

export { generateToken, verifyToken, TokenPayload, DecodedToken };
