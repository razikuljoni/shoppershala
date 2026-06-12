import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';
import * as service from '#services/review.service.js';

export const createReview = asyncHandler(async (req, res) => {
  const result = await service.createReview(req.user.userId, req.body);
  res.status(201).json({
    message: 'Review created successfully',
    data: result,
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { reviews, total } = await service.getAllReviews(page, limit);
  res.status(200).json({
    message: 'Reviews retrieved successfully',
    status: 'ok',
    data: reviews,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

export const getReviewById = asyncHandler(async (req, res) => {
  const review = await service.getReviewById(req.params.id);
  res.status(200).json({ message: 'Review retrieved successfully', status: 'ok', data: review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const result = await service.updateReview(req.params.id, req.user.userId, req.body);
  res.status(200).json({ message: 'Review updated successfully', status: 'ok', data: result });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await service.deleteReview(req.params.id, req.user.userId);
  res.status(200).json({ message: 'Review deleted successfully', status: 'ok' });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await service.getProductReviews(req.params.productId, page, limit);
  res.status(200).json({
    message: 'Product reviews retrieved successfully',
    status: 'ok',
    data: result,
  });
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { reviews, total } = await service.getUserReviews(req.user.userId, page, limit);
  res.status(200).json({
    message: 'User reviews retrieved successfully',
    status: 'ok',
    data: reviews,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});
