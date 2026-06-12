import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(orderData);
  return result;
};

export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments(filters);
  const orders = await db
    .collection(COLLECTION_NAME)
    .find(filters)
    .skip(skip)
    .limit(limit)
    .toArray();
  return { orders, total };
};

export const findOrderById = async (orderId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) });
};

export const updateOrder = async (orderId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(orderId) }, { $set: updateData });
  return result;
};

export const deleteOrder = async (orderId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(orderId) });
  return result;
};

export const findOrdersByUserId = async (userId, page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const filter = { userId: userId };
  const total = await db.collection(COLLECTION_NAME).countDocuments(filter);
  const orders = await db
    .collection(COLLECTION_NAME)
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray();
  return { orders, total };
};
