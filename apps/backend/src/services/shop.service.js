import * as shopModel from '#models/shop.model.js';
import logger from '#utils/logger.js';

export const createShop = async (userId, shopData) => {
  const existing = await shopModel.findShopBySellerId(userId);
  if (existing) {
    logger.warn('Shop creation failed — seller already has a shop', { userId });
    throw new Error('You already have a shop. Only one shop per seller is allowed.');
  }
  return await shopModel.createShop({
    ...shopData,
    sellerId: userId,
  });
};

export const getShopById = async (shopId) => {
  const shop = await shopModel.findShopById(shopId);
  if (!shop) throw new Error('Shop not found');
  return shop;
};

export const getShopByCurrentUser = async (userId) => {
  const shop = await shopModel.findShopBySellerId(userId);
  return shop || null;
};

export const getAllShops = async (page = 1, limit = 10, filters = {}) => {
  return await shopModel.getAllShops(page, limit, filters);
};

export const updateShop = async (shopId, userId, updateData) => {
  const shop = await shopModel.findShopById(shopId);
  if (!shop) throw new Error('Shop not found');
  if (shop.sellerId.toString() !== userId.toString()) {
    throw new Error('You can only update your own shop');
  }
  return await shopModel.updateShop(shopId, updateData);
};

export const deleteShop = async (shopId, userId) => {
  const shop = await shopModel.findShopById(shopId);
  if (!shop) throw new Error('Shop not found');
  if (shop.sellerId.toString() !== userId.toString()) {
    throw new Error('You can only delete your own shop');
  }
  return await shopModel.deleteShop(shopId);
};
