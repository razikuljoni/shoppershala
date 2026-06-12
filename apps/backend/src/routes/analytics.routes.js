import * as controller from '#controllers/analytics.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/dashboard', authenticate, controller.getDashboardStats);
router.get('/sales', authenticate, controller.getSalesAnalytics);
router.get('/top-products', authenticate, controller.getTopProducts);
router.get('/category-sales', authenticate, controller.getCategorySales);
router.get('/user-stats', authenticate, controller.getUserStats);
router.get('/user-stats/:userId', authenticate, controller.getUserStats);
router.get('/order-status', authenticate, controller.getOrderStatusDistribution);
router.get('/monthly-trend', authenticate, controller.getMonthlySalesTrend);

export default router;
