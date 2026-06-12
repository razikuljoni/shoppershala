import * as controller from '#controllers/wishlist.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { addToWishlistSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.get('/', authenticate, controller.getWishlist);
router.post('/add', authenticate, validate(addToWishlistSchema), controller.addToWishlist);
router.delete('/remove/:productId', authenticate, controller.removeFromWishlist);
router.delete('/clear', authenticate, controller.clearWishlist);
router.get('/check/:productId', authenticate, controller.checkProductInWishlist);

export default router;
