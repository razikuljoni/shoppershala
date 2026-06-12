import * as userService from '#services/user.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body);
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
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({
    message: 'User updated successfully',
    status: 'ok',
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted successfully', status: 'ok' });
});
