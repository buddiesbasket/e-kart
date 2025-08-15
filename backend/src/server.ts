import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

// Configuration validation function
function validateJwtConfig() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment variables');
  }
  if (!process.env.JWT_EXPIRE) {
    throw new Error('JWT_EXPIRE is required in environment variables');
  }
  const expireValue = process.env.JWT_EXPIRE.trim();
  if (!/^(\d+|[1-9]\d*[smhdwy]|[\d.]+\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|weeks?|yrs?|years?))$/i.test(expireValue)) {
    throw new Error('Invalid JWT_EXPIRE format. Use seconds (number) or time string (e.g., "1h", "2d")');
  }
}

const PORT = process.env.PORT || 5000;

// Validate configuration before starting
try {
  validateJwtConfig();
  logger.info('JWT configuration validated successfully');
} catch (error) {
  logger.error(`Configuration validation failed: ${(error as Error).message}`);
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});