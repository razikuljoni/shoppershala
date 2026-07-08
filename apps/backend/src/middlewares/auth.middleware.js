import { verifyToken } from '#utils/jwt.util.js';
import logger from '#utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

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

export const authorizeAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    logger.warn('Admin authorization denied', {
      username: req.user?.username,
      role: req.user?.role,
      requestId: req.id,
      url: req.originalUrl,
    });
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
