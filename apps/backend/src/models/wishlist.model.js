import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'wishlists';

export const findWishlistByUserId = async (userId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ userId: new ObjectId(userId) });
};

export const createWishlist = async (wishlistData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(wishlistData);
  return result;
};

export const addProductToWishlist = async (userId, productId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { userId: new ObjectId(userId) },
    {
      $addToSet: { products: new ObjectId(productId) },
      $set: { updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date(), userId: new ObjectId(userId) },
    },
    { upsert: true },
  );
  return result;
};

export const removeProductFromWishlist = async (userId, productId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { userId: new ObjectId(userId) },
    {
      $pull: { products: new ObjectId(productId) },
      $set: { updatedAt: new Date() },
    },
  );
  return result;
};

export const clearWishlist = async (userId) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ userId: new ObjectId(userId) }, { $set: { products: [] } });
  return result;
};

export const getWishlistWithProducts = async (userId) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetails.categoryId',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          products: '$productDetails',
        },
      },
    ])
    .toArray();
  return result[0] || null;
};

export const checkProductInWishlist = async (userId, productId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).findOne({
    userId: new ObjectId(userId),
    products: { $in: [new ObjectId(productId)] },
  });
  return result;
};
