import * as categoryModel from '#models/category.model.js';

export const createCategory = async (categoryData) => {
  const existing = await categoryModel.findCategoryByName(categoryData.name);
  if (existing) {
    throw new Error('Category already exists');
  }

  return await categoryModel.createCategory(categoryData);
};

export const getAllCategories = async (page = 1, limit = 10) => {
  return await categoryModel.getAllCategories(page, limit);
};

export const getCategoryById = async (categoryId) => {
  return await categoryModel.findCategoryById(categoryId);
};

export const updateCategory = async (categoryId, updateData) => {
  return await categoryModel.updateCategory(categoryId, updateData);
};

export const deleteCategory = async (categoryId) => {
  return await categoryModel.deleteCategory(categoryId);
};
