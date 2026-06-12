import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'reviews';

export const createReview = async (reviewData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(reviewData);
  return result;
};

export const getAllReviews = async (page = 1, limit = 10, filters = {}) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments(filters);
  const reviews = await db
    .collection(COLLECTION_NAME)
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .toArray();
  return { reviews, total };
};

export const findReviewById = async (reviewId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(reviewId) });
};

export const findUserReviewForProduct = async (userId, productId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
  });
};

export const updateReview = async (reviewId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(reviewId) }, { $set: updateData });
  return result;
};

export const deleteReview = async (reviewId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(reviewId) });
  return result;
};

export const getReviewsByProductId = async (productId, page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const filter = { productId: new ObjectId(productId) };
  const total = await db.collection(COLLECTION_NAME).countDocuments(filter);
  const reviews = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          'user.name': 1,
          'user.username': 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])
    .toArray();
  return { reviews, total };
};

export const getProductAverageRating = async (productId) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { productId: new ObjectId(productId) } },
      {
        $group: {
          _id: '$productId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ])
    .toArray();
  return result[0] || { averageRating: 0, totalReviews: 0 };
};

export const getReviewsByUserId = async (userId, page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const filter = { userId: new ObjectId(userId) };
  const total = await db.collection(COLLECTION_NAME).countDocuments(filter);
  const reviews = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          'product.name': 1,
          'product.price': 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])
    .toArray();
  return { reviews, total };
};
