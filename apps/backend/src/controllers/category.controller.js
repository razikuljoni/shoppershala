import * as categoryService from '#services/category.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  res.status(201).json({
    message: 'Category created successfully',
    status: 'ok',
    data: result,
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { categories, total } = await categoryService.getAllCategories(page, limit);

  res.status(200).json({
    message: 'Categories retrieved successfully',
    status: 'ok',
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.status(200).json({
    message: 'Category retrieved successfully',
    status: 'ok',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updated = await categoryService.updateCategory(req.params.id, req.body);
  if (updated.matchedCount === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.status(200).json({
    message: 'Category updated successfully',
    status: 'ok',
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.status(200).json({ message: 'Category deleted successfully', status: 'ok' });
});
