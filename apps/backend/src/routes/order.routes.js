import * as orderController from '#controllers/order.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/', authenticate, orderController.getAllOrders);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.patch('/:id', authenticate, validate(updateOrderSchema), orderController.updateOrder);
router.delete('/:id', authenticate, orderController.deleteOrder);

export default router;
