import * as productModel from '#models/product.model.js';
import * as reviewModel from '#models/review.model.js';
import { ObjectId } from 'mongodb';

export const createReview = async (userId, reviewData) => {
  const { productId, rating, comment } = reviewData;

  const product = await productModel.findProductById(productId);
  if (!product) throw new Error('Product not found');

  const existingReview = await reviewModel.findUserReviewForProduct(userId, productId);
  if (existingReview) throw new Error('You have already reviewed this product');

  const review = {
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
    rating,
    comment,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await reviewModel.createReview(review);
  return await reviewModel.getProductAverageRating(productId);
};

export const getAllReviews = async (page, limit) => {
  return await reviewModel.getAllReviews(page, limit);
};

export const getReviewById = async (reviewId) => {
  const review = await reviewModel.findReviewById(reviewId);
  if (!review) throw new Error('Review not found');
  return review;
};

export const updateReview = async (reviewId, userId, updateData) => {
  const review = await reviewModel.findReviewById(reviewId);
  if (!review) throw new Error('Review not found');

  if (review.userId.toString() !== userId) {
    throw new Error('Not authorized to update this review');
  }

  await reviewModel.updateReview(reviewId, { ...updateData, updatedAt: new Date() });
  return await reviewModel.getProductAverageRating(review.productId);
};

export const deleteReview = async (reviewId, userId) => {
  const review = await reviewModel.findReviewById(reviewId);
  if (!review) throw new Error('Review not found');

  if (review.userId.toString() !== userId) {
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.productId;
  await reviewModel.deleteReview(reviewId);
  return await reviewModel.getProductAverageRating(productId);
};

export const getProductReviews = async (productId, page, limit) => {
  const product = await productModel.findProductById(productId);
  if (!product) throw new Error('Product not found');

  const result = await reviewModel.getReviewsByProductId(productId, page, limit);
  const ratingStats = await reviewModel.getProductAverageRating(productId);

  return { ...result, ...ratingStats };
};

export const getUserReviews = async (userId, page, limit) => {
  return await reviewModel.getReviewsByUserId(userId, page, limit);
};
