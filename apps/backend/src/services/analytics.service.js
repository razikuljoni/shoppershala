import * as analyticsModel from '#models/analytics.model.js';

export const getSalesAnalytics = async (startDate, endDate) => {
  return await analyticsModel.getSalesAnalytics(startDate, endDate);
};

export const getTopProducts = async (limit = 10) => {
  return await analyticsModel.getTopProducts(limit);
};

export const getCategorySales = async () => {
  return await analyticsModel.getCategorySales();
};

export const getUserStats = async (userId) => {
  return await analyticsModel.getUserOrderStats(userId);
};

export const getOrderStatusDistribution = async () => {
  return await analyticsModel.getOrderStatusDistribution();
};

export const getMonthlySalesTrend = async (year) => {
  return await analyticsModel.getMonthlySalesTrend(year);
};

export const getDashboardStats = async () => {
  const [salesAnalytics, topProducts, categorySales, orderStatusDistribution, monthlySalesTrend] =
    await Promise.all([
      analyticsModel.getSalesAnalytics(),
      analyticsModel.getTopProducts(5),
      analyticsModel.getCategorySales(),
      analyticsModel.getOrderStatusDistribution(),
      analyticsModel.getMonthlySalesTrend(),
    ]);

  return {
    salesAnalytics,
    topProducts,
    categorySales,
    orderStatusDistribution,
    monthlySalesTrend,
  };
};
