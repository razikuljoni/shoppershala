import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'categories';

export const createCategory = async (categoryData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(categoryData);
  return result;
};

export const getAllCategories = async (page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments();
  const categories = await db
    .collection(COLLECTION_NAME)
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();
  return { categories, total };
};

export const findCategoryById = async (categoryId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(categoryId) });
};

export const findCategoryByName = async (name) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ name });
};

export const updateCategory = async (categoryId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(categoryId) }, { $set: updateData });
  return result;
};

export const deleteCategory = async (categoryId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(categoryId) });
  return result;
};
