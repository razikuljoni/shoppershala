import { requestId } from '#middlewares/requestId.middleware.js';
import analyticsRoutes from '#routes/analytics.routes.js';
import authRoutes from '#routes/auth.routes.js';
import bannerRoutes from '#routes/banner.routes.js';
import categoryRoutes from '#routes/category.routes.js';
import orderRoutes from '#routes/order.routes.js';
import productRoutes from '#routes/product.routes.js';
import reviewRoutes from '#routes/review.routes.js';
import shopRoutes from '#routes/shop.routes.js';
import userRoutes from '#routes/user.routes.js';
import wishlistRoutes from '#routes/wishlist.routes.js';
import logger, { httpLogger } from '#utils/logger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDb } from '#config/db.js';

const app = express();

dotenv.config();

// Initialize DB connection for serverless environments (Vercel functions import this file)
// Call connectDb in a non-blocking top-level async IIFE so the connection persists across invocations.
(async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDb(process.env.MONGODB_URI);
    } else {
      logger.warn('MONGODB_URI not set; skipping DB connect');
    }
  } catch (err) {
    logger.error('Failed to initialize DB', { message: err.message, stack: err.stack });
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Assign unique ID to every request (for log correlation)
app.use(requestId);

// HTTP request logging (includes requestId automatically)
// app.use(httpLogger);

// Routes
app.get('/', (_req, res) => {
  res.json({
    statusCode: 200,
    status: 'ok',
    message: 'Server is Running',
  });
});

// ------------------ Routes ------------------
// Base route for all API endpoints
const apiV1 = express.Router();
app.use('/api/v1', apiV1);

apiV1.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register all routes under /api/v1
apiV1.use('/auth', authRoutes);
apiV1.use('/users', userRoutes);
apiV1.use('/categories', categoryRoutes);
apiV1.use('/products', productRoutes);
apiV1.use('/orders', orderRoutes);
apiV1.use('/reviews', reviewRoutes);
apiV1.use('/shops', shopRoutes);
apiV1.use('/wishlist', wishlistRoutes);
apiV1.use('/analytics', analyticsRoutes);
apiV1.use('/banners', bannerRoutes);

// 404 Handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    requestId: req.id,
  });
  res.status(404).json({ error: 'Not found' });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    requestId: req.id,
    body: redactForLog(req.body),
    query: req.query,
  });
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

function redactForLog(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitive = ['password', 'token', 'secret', 'key', 'authorization', 'auth'];
  const redacted = {};
  for (const [k, v] of Object.entries(obj)) {
    if (sensitive.some((s) => k.toLowerCase().includes(s))) {
      redacted[k] = '[REDACTED]';
    } else {
      redacted[k] = v;
    }
  }
  return redacted;
}

export default app;
