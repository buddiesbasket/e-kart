import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '@config/config';
import User from '@models/User';
import { AuthenticatedRequest } from '@middlewares/auth';
import TokenBlacklist from '@models/TokenBlacklist';

interface TokenPayload {
  user: {
    id: string;
  };
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  const {fullName, email, phone, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ username: fullName, email, phone, password });
    await user.save();

    // Create JWT with proper typing
    const payload: TokenPayload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiration
    } as jwt.SignOptions);

    return res.status(201).json({ token });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT with proper typing
    const payload: TokenPayload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    } as jwt.SignOptions);

    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, phone: user.phone } });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send('Server error');
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    return res.json(user);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send('Server error');
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const token = req.header('x-auth-token');
    const refreshToken = req.body.refreshToken;

    if (!token) {
      return res.status(400).json({ msg: 'No token provided' });
    }

    // Add token to blacklist
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      await TokenBlacklist.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      });
    }

    // Remove refresh token from user
    if (refreshToken) {
      await User.findByIdAndUpdate(req.user?.id, {
        $pull: { refreshTokens: refreshToken }
      });
    }

    return res.json({ msg: 'Logged out successfully' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send('Server error');
  }
};

export const logoutAll = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // Clear all refresh tokens
    await User.findByIdAndUpdate(req.user?.id, {
      $set: { refreshTokens: [] }
    });

    return res.json({ msg: 'Logged out from all devices' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send('Server error');
  }
};