import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'products';

export const createProduct = async (productData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(productData);
  return result;
};

export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments(filters);
  const products = await db
    .collection(COLLECTION_NAME)
    .find(filters)
    .skip(skip)
    .limit(limit)
    .toArray();
  return { products, total };
};

export const findProductById = async (productId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(productId) });
};

export const updateProduct = async (productId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(productId) }, { $set: updateData });
  return result;
};

export const deleteProduct = async (productId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(productId) });
  return result;
};

export const findProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const filter = { categoryId: new ObjectId(categoryId) };
  const total = await db.collection(COLLECTION_NAME).countDocuments(filter);
  const products = await db
    .collection(COLLECTION_NAME)
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray();
  return { products, total };
};
