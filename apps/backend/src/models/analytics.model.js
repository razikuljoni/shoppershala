import { getDb } from '#config/db.js';

export const getSalesAnalytics = async (startDate, endDate) => {
  const db = await getDb();
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const result = await db
    .collection('orders')
    .aggregate([
      { $match: { ...matchStage, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
        },
      },
    ])
    .toArray();
  return result[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
};

export const getTopProducts = async (limit = 10) => {
  const db = await getDb();
  const result = await db
    .collection('orders')
    .aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $addFields: {
          'items.productIdObj': { $toObjectId: '$items.productId' },
        },
      },
      {
        $group: {
          _id: '$items.productIdObj',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          price: '$product.price',
          totalSold: 1,
          revenue: 1,
        },
      },
    ])
    .toArray();
  return result;
};

export const getCategorySales = async () => {
  const db = await getDb();
  const result = await db
    .collection('orders')
    .aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $addFields: {
          'items.productIdObj': { $toObjectId: '$items.productId' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productIdObj',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $addFields: {
          'product.categoryIdObj': { $toObjectId: '$product.categoryId' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categoryIdObj',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
    ])
    .toArray();
  return result;
};

export const getUserOrderStats = async (userId) => {
  const db = await getDb();
  const result = await db
    .collection('orders')
    .aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' },
        },
      },
    ])
    .toArray();
  return result[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0, lastOrderDate: null };
};

export const getOrderStatusDistribution = async () => {
  const db = await getDb();
  const result = await db
    .collection('orders')
    .aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ])
    .toArray();
  return result;
};

export const getMonthlySalesTrend = async (year = new Date().getFullYear()) => {
  const db = await getDb();
  const result = await db
    .collection('orders')
    .aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: '$_id',
          revenue: 1,
          orders: 1,
          _id: 0,
        },
      },
    ])
    .toArray();
  return result;
};
