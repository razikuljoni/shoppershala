import * as categoryController from '#controllers/category.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/', authenticate, validate(createCategorySchema), categoryController.createCategory);
router.get('/', authenticate, categoryController.getAllCategories);
router.get('/:id', authenticate, categoryController.getCategoryById);
router.patch(
  '/:id',
  authenticate,
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete('/:id', authenticate, categoryController.deleteCategory);

export default router;
