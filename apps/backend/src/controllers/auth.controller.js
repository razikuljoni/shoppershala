import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';
import * as authService from '#services/auth.service.js';
import { verifyToken } from '#utils/jwt.util.js';
import logger from '#utils/logger.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  logger.info('User registered', {
    userId: result._id || result.id,
    username: result.username,
    role: result.role,
  });

  res.cookie('token', result.token, COOKIE_OPTIONS);

  res.status(201).json({
    message: 'User registered successfully',
    status: 'ok',
    data: { user: result.user },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn('Login attempt with missing credentials', {
      username: !!username,
      password: !!password,
    });
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const result = await authService.loginUser(username, password);

  logger.info('Login successful', {
    userId: result.user._id || result.user.id,
    username: result.user.username,
    role: result.user.role,
  });

  res.cookie('token', result.token, COOKIE_OPTIONS);

  res.json({
    message: 'Login successful',
    status: 'ok',
    data: { user: result.user },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out', status: 'ok' });
});

export const whoAmI = asyncHandler(async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const decoded = verifyToken(token);

  logger.debug('Token decoded', {
    userId: decoded.userId,
    username: decoded.username,
    role: decoded.role,
  });

  res.json({
    message: 'Authenticated user',
    status: 'ok',
    data: { id: decoded.userId, username: decoded.username, role: decoded.role },
  });
});
