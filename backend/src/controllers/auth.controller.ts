import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import logger from '../utils/logger';
import { AppError } from '../middleware/error.middleware';

// Controller wrapper
const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const register = wrap(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  const result = await authService.register({ name, email, password, phone });
  res.status(201).json({ status: 'success', data: result });
});

const login = wrap(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json({ status: 'success', data: result });
});

const getMe = wrap(async (req: Request & { user?: any }, res: Response) => {
  if (!req.user?.id) throw new AppError('Not authenticated', 401);
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ status: 'success', data: { user } });
});

const logout = wrap(async (req: Request & { user?: any }, res: Response) => {
  // protected route -> req.user.id exists
  const userId = req.user?.id;
  const { refreshToken } = req.body;
  await authService.logout(userId, refreshToken);
  res.status(200).json({ status: 'success', data: { message: 'Logged out successfully' } });
});

const logoutAll = wrap(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id;
  await authService.logoutAll(userId);
  res.status(200).json({ status: 'success', data: { message: 'Logged out from all devices successfully' } });
});

export default { register, login, getMe, logout, logoutAll };
