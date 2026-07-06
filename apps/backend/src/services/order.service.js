import logger from '#utils/logger.js';
import * as orderModel from '#models/order.model.js';
import * as productModel from '#models/product.model.js';
import { ObjectId } from 'mongodb';

export const createOrder = async (userId, orderData) => {
  const { items, shippingAddress } = orderData;

  if (!items || items.length === 0) {
    logger.warn('Order creation failed — no items', { userId });
    throw new Error('Order must contain at least one item');
  }

  let calculatedTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await productModel.findProductById(item.productId);
    if (!product) {
      logger.warn('Order creation failed — product not found', { productId: item.productId });
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      logger.warn('Order creation failed — insufficient stock', {
        productId: item.productId,
        productName: product.name,
        available: product.stock,
        requested: item.quantity,
      });
      throw new Error(
        `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
      );
    }

    const itemTotal = product.price * item.quantity;
    calculatedTotal += itemTotal;

    orderItems.push({
      productId: new ObjectId(item.productId),
      quantity: item.quantity,
      price: product.price,
      name: product.name,
    });

    await productModel.updateProduct(item.productId, {
      stock: product.stock - item.quantity,
      updatedAt: new Date(),
    });

    logger.info('Stock deducted', {
      productId: item.productId,
      productName: product.name,
      deducted: item.quantity,
      remaining: product.stock - item.quantity,
    });
  }

  const orderWithMeta = {
    userId: userId,
    items: orderItems,
    totalAmount: calculatedTotal,
    shippingAddress,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await orderModel.createOrder(orderWithMeta);

  logger.info('Order persisted', {
    orderId: result.insertedId,
    userId,
    totalAmount: calculatedTotal,
    itemCount: orderItems.length,
  });

  return {
    ...orderWithMeta,
    _id: result.insertedId,
  };
};

export const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  return await orderModel.getAllOrders(page, limit, filters);
};

export const getOrderById = async (orderId) => {
  const order = await orderModel.findOrderById(orderId);
  if (!order) throw new Error('Order not found');
  return order;
};

export const updateOrder = async (orderId, updateData) => {
  return await orderModel.updateOrder(orderId, { ...updateData, updatedAt: new Date() });
};

export const deleteOrder = async (orderId) => {
  return await orderModel.deleteOrder(orderId);
};

export const getOrdersByUserId = async (userId, page = 1, limit = 10) => {
  return await orderModel.findOrdersByUserId(userId, page, limit);
};
