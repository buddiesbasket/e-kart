import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import config from './config/config';
import { successHandler, errorHandler } from './utils/logger';
import path from 'path';
import { AuthenticatedRequest } from '@middlewares/auth';
import TokenBlacklist from '@models/TokenBlacklist';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import User from '@models/User';
import { initializeTokenCleanup } from '@utils/tokenCleanup';

// Create Express application
const app: Application = express();

// Connect to MongoDB
connectDB();

const cleanupJob = initializeTokenCleanup();

// Optional: Handle graceful shutdown
process.on('SIGTERM', () => {
  cleanupJob();
  process.exit(0);
});

process.on('SIGINT', () => {
  cleanupJob();
  process.exit(0);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(successHandler);
app.use(errorHandler);

// Routes
// Add this early in your middleware chain
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request for ${req.path}`);
  next();
});

// Your existing routes
app.use('/api/auth', authRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Serve static assets if in production
if (config.nodeEnv === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../frontend/dist/frontend')));

  // Handle SPA
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(
      path.join(__dirname, '../../frontend/dist/frontend/index.html')
    );
  });
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ msg: 'Token revoked' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
