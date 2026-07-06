import { USER_TYPES } from '#constants/user.const.js';
import * as userModel from '#models/user.model.js';
import { generateToken } from '#utils/jwt.util.js';
import { comparePassword, hashPassword } from '#utils/password.util.js';

const buildAuthUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  role: user.role,
  name: user.name,
  email: user.email,
  phone: user.phone,
  balance: user.balance || 0,
});

export const registerUser = async ({
  name,
  email,
  phone,
  username,
  password,
  role = USER_TYPES.BUYER,
}) => {
  const existingUser = await userModel.findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const existingEmail = await userModel.findUserByEmail(email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const userData = {
    name,
    email,
    phone,
    username,
    password: hashedPassword,
    role,
    balance: 0,
    createdAt: new Date(),
  };

  const result = await userModel.createUser(userData);

  const authUser = {
    _id: result.insertedId,
    ...userData,
  };

  const token = generateToken({
    userId: result.insertedId.toString(),
    name,
    username,
    role,
    balance: 0,
  });

  return {
    token,
    user: buildAuthUser(authUser),
  };
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
    name: user.name,
    username: user.username,
    role: user.role,
    balance: user.balance || 0,
  });

  return { token, user: buildAuthUser(user) };
};
