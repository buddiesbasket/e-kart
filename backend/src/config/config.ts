export default {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/e-kart',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};