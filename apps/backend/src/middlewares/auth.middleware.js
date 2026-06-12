import { verifyToken } from '#utils/jwt.util.js';
import logger from '#utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Authentication failed', {
      message: err.message,
      requestId: req.id,
      ip: req.ip,
      url: req.originalUrl,
    });
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
