import * as shopController from '#controllers/shop.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createShopSchema, updateShopSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/', authenticate, validate(createShopSchema), shopController.createShop);
router.get('/', shopController.getAllShops);
router.get('/my', authenticate, shopController.getMyShop);
router.get('/:id', shopController.getShopById);
router.patch('/:id', authenticate, validate(updateShopSchema), shopController.updateShop);
router.delete('/:id', authenticate, shopController.deleteShop);

export default router;
