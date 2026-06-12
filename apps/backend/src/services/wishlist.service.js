import * as productModel from '#models/product.model.js';
import * as wishlistModel from '#models/wishlist.model.js';

export const getWishlist = async (userId) => {
  const wishlist = await wishlistModel.getWishlistWithProducts(userId);
  if (!wishlist) {
    return { userId, products: [], createdAt: new Date(), updatedAt: new Date() };
  }
  return wishlist;
};

export const addToWishlist = async (userId, productId) => {
  const product = await productModel.findProductById(productId);
  if (!product) throw new Error('Product not found');

  const exists = await wishlistModel.checkProductInWishlist(userId, productId);
  if (exists) throw new Error('Product already in wishlist');

  await wishlistModel.addProductToWishlist(userId, productId);
  return await wishlistModel.getWishlistWithProducts(userId);
};

export const removeFromWishlist = async (userId, productId) => {
  const product = await productModel.findProductById(productId);
  if (!product) throw new Error('Product not found');

  const result = await wishlistModel.removeProductFromWishlist(userId, productId);
  if (result.matchedCount === 0) throw new Error('Wishlist not found');

  return await wishlistModel.getWishlistWithProducts(userId);
};

export const clearWishlist = async (userId) => {
  await wishlistModel.clearWishlist(userId);
  return { message: 'Wishlist cleared successfully' };
};

export const checkProductInWishlist = async (userId, productId) => {
  const exists = await wishlistModel.checkProductInWishlist(userId, productId);
  return { inWishlist: !!exists };
};
