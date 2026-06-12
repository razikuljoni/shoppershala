import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';
import * as authService from '#services/auth.service.js';
import { verifyToken } from '#utils/jwt.util.js';

export const register = asyncHandler(async (req, res) => {
  const { name, username, password, role } = req.body;
  console.log('controller -', req.body);

  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const result = await authService.registerUser(name, username, password, role);

  res.status(201).json({
    message: 'User registered successfully',
    status: 'ok',
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const result = await authService.loginUser(username, password);

  res.json({
    message: 'Login successful',
    status: 'ok',
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

export const whoAmI = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  res.json({
    message: 'Authenticated user',
    status: 'ok',
    data: { id: decoded.userId, username: decoded.username, role: decoded.role },
  });
});
