// User model - Database operations only
import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'users';

export const createUser = async (userData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(userData);
  return result;
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments();
  const users = await db.collection(COLLECTION_NAME).find({}).skip(skip).limit(limit).toArray();
  return { users, total };
};

export const findUserByUsername = async (username) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ username });
};

export const findUserById = async (userId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
};

export const findUserByEmail = async (email) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ email });
};

export const updateUser = async (userId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
  return result;
};

export const deleteUser = async (userId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });
  return result;
};

export const isUserExists = async (username, email) => {
  const db = await getDb();
  const existingUser = await db.collection(COLLECTION_NAME).findOne({
    $or: [{ username }, { email }],
  });
  return existingUser;
};
