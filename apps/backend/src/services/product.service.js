import * as productModel from '#models/product.model.js';
import * as categoryModel from '#models/category.model.js';

export const createProduct = async (productData) => {
  const category = await categoryModel.findCategoryById(productData.categoryId);
  if (!category) throw new Error('Category not found');
  return await productModel.createProduct(productData);
};

export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  return await productModel.getAllProducts(page, limit, filters);
};

export const getProductById = async (productId) => {
  const product = await productModel.findProductById(productId);
  if (!product) throw new Error('Product not found');
  return product;
};

export const updateProduct = async (productId, updateData) => {
  if (updateData.categoryId) {
    const category = await categoryModel.findCategoryById(updateData.categoryId);
    if (!category) throw new Error('Category not found');
  }
  return await productModel.updateProduct(productId, updateData);
};

export const deleteProduct = async (productId) => {
  return await productModel.deleteProduct(productId);
};

export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const category = await categoryModel.findCategoryById(categoryId);
  if (!category) throw new Error('Category not found');
  return await productModel.findProductsByCategory(categoryId, page, limit);
};
