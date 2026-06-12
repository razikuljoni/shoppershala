import { generateToken } from '#utils/jwt.util.js';
import { comparePassword, hashPassword } from '#utils/password.util.js';
import * as userModel from '#models/user.model.js';

export const registerUser = async (name, username, password, role = 'Buyer') => {
  const existingUser = await userModel.findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await hashPassword(password);

  const userData = {
    name,
    username,
    password: hashedPassword,
    role,
    balance: 0,
    createdAt: new Date(),
  };

  const result = await userModel.createUser(userData);
  return { userId: result.insertedId, username, name, role };
};

export const loginUser = async (username, password) => {
  const user = await userModel.findUserByUsername(username);
  if (!user) {
    throw new Error('User Does Not Exist!');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
  });

  return { token, user: { id: user._id, username: user.username, role: user.role } };
};
