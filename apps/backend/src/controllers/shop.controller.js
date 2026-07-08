import logger from '#utils/logger.js';
import * as shopService from '#services/shop.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createShop = asyncHandler(async (req, res) => {
  const result = await shopService.createShop(req.user.id, req.body);

  logger.info('Shop created', {
    shopId: result.insertedId,
    name: req.body.name,
    sellerId: req.user.id,
  });

  res.status(201).json({
    message: 'Shop created successfully',
    status: 'ok',
    data: { id: result.insertedId },
  });
});

export const getMyShop = asyncHandler(async (req, res) => {
  const shop = await shopService.getShopByCurrentUser(req.user.id);
  res.status(200).json({
    message: 'Shop retrieved successfully',
    status: 'ok',
    data: shop,
  });
});

export const getShopById = asyncHandler(async (req, res) => {
  const shop = await shopService.getShopById(req.params.id);
  res.status(200).json({
    message: 'Shop retrieved successfully',
    status: 'ok',
    data: shop,
  });
});

export const getAllShops = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {};

  const { shops, total } = await shopService.getAllShops(page, limit, filters);

  res.status(200).json({
    message: 'Shops retrieved successfully',
    status: 'ok',
    data: shops,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

export const updateShop = asyncHandler(async (req, res) => {
  const updated = await shopService.updateShop(req.params.id, req.user.id, req.body);
  if (updated.matchedCount === 0) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  logger.info('Shop updated', { shopId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'Shop updated successfully', status: 'ok' });
});

export const deleteShop = asyncHandler(async (req, res) => {
  const result = await shopService.deleteShop(req.params.id, req.user.id);
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  logger.info('Shop deleted', { shopId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'Shop deleted successfully', status: 'ok' });
});
