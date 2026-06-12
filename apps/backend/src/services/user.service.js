import * as userModel from '#models/user.model.js';
import { hashPassword } from '#utils/password.util.js';

export const createUser = async (userData) => {
  const existingUser = await userModel.isUserExists(userData.username, userData.email);
  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  if (!userData.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hashPassword(userData.password);

  const userToCreate = {
    ...userData,
    password: hashedPassword,
    balance: userData.balance || 0,
    role: userData.role || 'buyer',
  };

  return await userModel.createUser(userToCreate);
};

export const getAllUsers = async (page = 1, limit = 10) => {
  return await userModel.getAllUsers(page, limit);
};

export const getUserById = async (userId) => {
  return await userModel.findUserById(userId);
};

export const updateUser = async (userId, updateData) => {
  return await userModel.updateUser(userId, updateData);
};

export const deleteUser = async (userId) => {
  return await userModel.deleteUser(userId);
};
