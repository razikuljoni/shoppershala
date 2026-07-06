import logger from '#utils/logger.js';
import * as productService from '#services/product.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(req.body);
  const actor = req.user ? `${req.user.username}(${req.user.role})` : 'anonymous';

  logger.info('Product created', {
    productId: result._id || result.id,
    name: result.name,
    price: result.price,
    categoryId: result.categoryId,
    by: actor,
  });

  res.status(201).json({
    message: 'Product created successfully',
    status: 'ok',
    data: result,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {};

  if (req.query.categoryId) {
    filters.categoryId = req.query.categoryId;
  }

  const { products, total } = await productService.getAllProducts(page, limit, filters);

  res.status(200).json({
    message: 'Products retrieved successfully',
    status: 'ok',
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(200).json({
    message: 'Product retrieved successfully',
    status: 'ok',
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const updated = await productService.updateProduct(req.params.id, req.body);
  if (updated.matchedCount === 0) {
    logger.warn('Product update failed — not found', {
      productId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Product not found' });
  }
  logger.info('Product updated', {
    productId: req.params.id,
    changes: Object.keys(req.body),
    by: req.user?.username,
  });
  res.status(200).json({
    message: 'Product updated successfully',
    status: 'ok',
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  if (result.deletedCount === 0) {
    logger.warn('Product delete failed — not found', {
      productId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Product not found' });
  }
  logger.info('Product deleted', { productId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'Product deleted successfully', status: 'ok' });
});
