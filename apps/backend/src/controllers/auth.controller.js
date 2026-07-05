import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';
import * as authService from '#services/auth.service.js';
import { verifyToken } from '#utils/jwt.util.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

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
