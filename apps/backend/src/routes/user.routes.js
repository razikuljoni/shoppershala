import * as userController from '#controllers/user.controller.js';
import { authenticate } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

router.post('/create', authenticate, validate(createUserSchema), userController.createUser);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.patch('/:id', authenticate, validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
