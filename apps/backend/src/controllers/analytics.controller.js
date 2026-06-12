import * as service from '#services/analytics.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await service.getDashboardStats();
  res
    .status(200)
    .json({ message: 'Dashboard stats retrieved successfully', status: 'ok', data: stats });
});

export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const analytics = await service.getSalesAnalytics(startDate, endDate);
  res
    .status(200)
    .json({ message: 'Sales analytics retrieved successfully', status: 'ok', data: analytics });
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const products = await service.getTopProducts(limit);
  res
    .status(200)
    .json({ message: 'Top products retrieved successfully', status: 'ok', data: products });
});

export const getCategorySales = asyncHandler(async (req, res) => {
  const sales = await service.getCategorySales();
  res
    .status(200)
    .json({ message: 'Category sales retrieved successfully', status: 'ok', data: sales });
});

export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const stats = await service.getUserStats(userId);
  res.status(200).json({ message: 'User stats retrieved successfully', status: 'ok', data: stats });
});

export const getOrderStatusDistribution = asyncHandler(async (req, res) => {
  const distribution = await service.getOrderStatusDistribution();
  res
    .status(200)
    .json({ message: 'Order status distribution retrieved', status: 'ok', data: distribution });
});

export const getMonthlySalesTrend = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const trend = await service.getMonthlySalesTrend(year);
  res.status(200).json({ message: 'Monthly sales trend retrieved', status: 'ok', data: trend });
});
