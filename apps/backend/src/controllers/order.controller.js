import logger from '#utils/logger.js';
import * as orderService from '#services/order.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder(req.user.userId, req.body);

  logger.info('Order created', {
    orderId: result._id || result.id,
    userId: req.user.userId,
    username: req.user.username,
    total: result.totalAmount || result.total,
    itemCount: result.items?.length,
  });

  res.status(201).json({
    message: 'Order created successfully',
    status: 'ok',
    data: result,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const { orders, total } = await orderService.getAllOrders(page, limit, filters);

  res.status(200).json({
    message: 'Orders retrieved successfully',
    status: 'ok',
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.status(200).json({
    message: 'Order retrieved successfully',
    status: 'ok',
    data: order,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const updated = await orderService.updateOrder(req.params.id, req.body);
  if (updated.matchedCount === 0) {
    logger.warn('Order update failed — not found', {
      orderId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Order not found' });
  }
  logger.info('Order updated', {
    orderId: req.params.id,
    changes: Object.keys(req.body),
    by: req.user?.username,
  });
  res.status(200).json({
    message: 'Order updated successfully',
    status: 'ok',
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  if (result.deletedCount === 0) {
    logger.warn('Order delete failed — not found', {
      orderId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Order not found' });
  }
  logger.info('Order deleted', { orderId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'Order deleted successfully', status: 'ok' });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { orders, total } = await orderService.getOrdersByUserId(req.user.userId, page, limit);

  res.status(200).json({
    message: 'My orders retrieved successfully',
    status: 'ok',
    data: orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
