import { requestId } from '#middlewares/requestId.middleware.js';
import analyticsRoutes from '#routes/analytics.routes.js';
import authRoutes from '#routes/auth.routes.js';
import categoryRoutes from '#routes/category.routes.js';
import orderRoutes from '#routes/order.routes.js';
import productRoutes from '#routes/product.routes.js';
import reviewRoutes from '#routes/review.routes.js';
import userRoutes from '#routes/user.routes.js';
import wishlistRoutes from '#routes/wishlist.routes.js';
import logger, { httpLogger } from '#utils/logger.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Assign unique ID to every request (for log correlation)
app.use(requestId);

// HTTP request logging (includes requestId automatically)
app.use(httpLogger);

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

// Register all routes under /api/v1
apiV1.use('/auth', authRoutes);
apiV1.use('/users', userRoutes);
apiV1.use('/categories', categoryRoutes);
apiV1.use('/products', productRoutes);
apiV1.use('/orders', orderRoutes);
apiV1.use('/reviews', reviewRoutes);
apiV1.use('/wishlist', wishlistRoutes);
apiV1.use('/analytics', analyticsRoutes);

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
