import { getDb } from '#config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'banners';

export const createBanner = async (bannerData) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).insertOne(bannerData);
  return result;
};

export const getAllBanners = async (page = 1, limit = 10) => {
  const db = await getDb();
  const skip = (page - 1) * limit;
  const total = await db.collection(COLLECTION_NAME).countDocuments();
  const banners = await db
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return { banners, total };
};

export const getActiveBanners = async () => {
  const db = await getDb();
  return await db
    .collection(COLLECTION_NAME)
    .find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .toArray();
};

export const findBannerById = async (bannerId) => {
  const db = await getDb();
  return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(bannerId) });
};

export const updateBanner = async (bannerId, updateData) => {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: new ObjectId(bannerId) }, { $set: updateData });
  return result;
};

export const deleteBanner = async (bannerId) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(bannerId) });
  return result;
};
