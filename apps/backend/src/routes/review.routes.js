import * as controller from '#controllers/review.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createReviewSchema, updateReviewSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/', authenticate, validate(createReviewSchema), controller.createReview);
router.get('/', authenticate, controller.getAllReviews);
router.get('/my', authenticate, controller.getUserReviews);
router.get('/product/:productId', authenticate, controller.getProductReviews);
router.get('/:id', authenticate, controller.getReviewById);
router.patch('/:id', authenticate, validate(updateReviewSchema), controller.updateReview);
router.delete('/:id', authenticate, controller.deleteReview);

export default router;
