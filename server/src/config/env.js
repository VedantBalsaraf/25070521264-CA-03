const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI'
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'CLIENT_URL',
  'JWT_EXPIRES_IN',
  'BCRYPT_ROUNDS'
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
  }

  if ((process.env.JWT_SECRET || '').length < 32 || process.env.JWT_SECRET.startsWith('change-me')) {
    console.error('JWT_SECRET must be a unique secret with at least 32 characters.');
    process.exit(1);
  }
};

export const config = {
  port: parseInt(process.env.PORT, 10) || 5100,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/borrowcircles',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5180'
};

export default config;
