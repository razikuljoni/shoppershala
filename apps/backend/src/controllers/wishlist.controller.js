import * as service from '#services/wishlist.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await service.getWishlist(req.user.userId);
  res
    .status(200)
    .json({ message: 'Wishlist retrieved successfully', status: 'ok', data: wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await service.addToWishlist(req.user.userId, req.body.productId);
  res.status(200).json({ message: 'Product added to wishlist', status: 'ok', data: wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await service.removeFromWishlist(req.user.userId, req.params.productId);
  res.status(200).json({ message: 'Product removed from wishlist', status: 'ok', data: wishlist });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const result = await service.clearWishlist(req.user.userId);
  res.status(200).json({ message: result.message, status: 'ok' });
});

export const checkProductInWishlist = asyncHandler(async (req, res) => {
  const result = await service.checkProductInWishlist(req.user.userId, req.params.productId);
  res.status(200).json({ message: 'Check completed', status: 'ok', data: result });
});
