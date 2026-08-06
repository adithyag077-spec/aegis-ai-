const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const corsOptions = require('./config/cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

const app = express();

// Trust reverse proxies (Render, Vercel, Cloudflare) for accurate rate limiting & client IP extraction
app.set('trust proxy', 1);

// Initialize MongoDB Connection (Atlas / Production Database)
connectDB();

// Request Correlation ID Middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors(corsOptions));

// Request Parsing & Logging
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Master API Routes Multiplexer
app.use('/api/v1', routes);

// Handle 404 Unmatched Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404, 'ROUTE_NOT_FOUND'));
});

// Centralized Operational Error Handling Middleware
app.use(errorMiddleware);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 AegisAI Cyber Defense Backend listening on port ${PORT} [Mode: ${env.NODE_ENV}]`);
});
