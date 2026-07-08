import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'shops';

export const createShop = async (shopData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne({
    ...shopData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
};

export const findShopById = async (shopId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(shopId) });
};

export const findShopBySellerId = async (sellerId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ sellerId: new ObjectId(sellerId) });
};

export const getAllShops = async (page = 1, limit = 10, filters = {}) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments(filters);
  const shops = await db
    .collection(COLLECTION_NAME)
    .find(filters)
    .skip(skip)
    .limit(limit)
    .toArray();
  return { shops, total };
};

export const updateShop = async (shopId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(shopId) }, { $set: { ...updateData, updatedAt: new Date() } });
  return result;
};

export const deleteShop = async (shopId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(shopId) });
};
