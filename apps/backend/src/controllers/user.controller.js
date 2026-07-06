import logger from '#utils/logger.js';
import * as userService from '#services/user.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body);

  logger.info('User created', {
    userId: result._id || result.id,
    username: result.username,
    role: result.role,
    by: req.user?.username,
  });

  res.status(201).json({
    message: 'User created successfully',
    status: 'ok',
    data: result,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { users, total } = await userService.getAllUsers(page, limit);

  res.status(200).json({
    message: 'Users retrieved successfully',
    status: 'ok',
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({
    message: 'User retrieved successfully',
    status: 'ok',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  if (!updatedUser || updatedUser.matchedCount === 0) {
    logger.warn('User update failed — not found', {
      targetUserId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'User not found' });
  }
  logger.info('User updated', {
    targetUserId: req.params.id,
    changes: Object.keys(req.body).filter((k) => k !== 'password'),
    by: req.user?.username,
  });
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    message: 'User updated successfully',
    status: 'ok',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  if (result.deletedCount === 0) {
    logger.warn('User delete failed — not found', {
      targetUserId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'User not found' });
  }
  logger.info('User deleted', { targetUserId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'User deleted successfully', status: 'ok' });
});
