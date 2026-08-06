const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Attempt to load .env from current directory, server directory, and root workspace directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DEFAULT_MONGO_URI = 'mongodb+srv://adithyaguptha077_db_user:VGLvpiTQEwuNDTTl@cluster0.aiiocfs.mongodb.net/aegis_ai_db?appName=Cluster0';
const DEFAULT_JWT_SECRET = 'aegis_cyber_security_super_secret_jwt_key_2026_x99!';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().default(DEFAULT_MONGO_URI),
  MONGO_URL: z.string().default(DEFAULT_MONGO_URI),
  JWT_SECRET: z.string().default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: z.string().default('24h'),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
}).transform((data) => {
  const connectionString = data.MONGO_URI || data.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_URL || DEFAULT_MONGO_URI;
  return {
    ...data,
    MONGO_URI: connectionString,
    MONGO_URL: connectionString
  };
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn('⚠️ Environment Variable Warning, using safe defaults:', result.error.format());
    return {
      PORT: process.env.PORT || '5000',
      NODE_ENV: process.env.NODE_ENV || 'development',
      MONGO_URI: process.env.MONGO_URI || DEFAULT_MONGO_URI,
      MONGO_URL: process.env.MONGO_URI || DEFAULT_MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
      JWT_EXPIRES_IN: '24h',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      CORS_ORIGIN: 'http://localhost:5173'
    };
  }
  return result.data;
};

module.exports = parseEnv();
