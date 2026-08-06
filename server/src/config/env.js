const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().optional(),
  MONGO_URL: z.string().optional(),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
}).transform((data) => {
  const connectionString = data.MONGO_URI || data.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_URL;
  if (!connectionString) {
    throw new Error('Neither MONGO_URI nor MONGO_URL is provided in environment variables');
  }
  return {
    ...data,
    MONGO_URI: connectionString,
    MONGO_URL: connectionString
  };
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment Variable Validation Errors:', result.error.format());
    process.exit(1);
  }
  return result.data;
};

module.exports = parseEnv();
