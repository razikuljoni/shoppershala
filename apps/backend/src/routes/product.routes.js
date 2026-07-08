import * as productController from '#controllers/product.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/', authenticate, validate(createProductSchema), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id', authenticate, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

export default router;
