import * as bannerController from '#controllers/banner.controller.js';
import { authenticate, authorizeAdmin } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createBannerSchema, updateBannerSchema } from '#utils/validation.schema.js';
import express from 'express';

const router = express.Router();

// Public: get active banners (no auth required)
router.get('/active', bannerController.getActiveBanners);

// Admin CRUD
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  validate(createBannerSchema),
  bannerController.createBanner,
);
router.get('/', authenticate, authorizeAdmin, bannerController.getAllBanners);
router.get('/:id', authenticate, authorizeAdmin, bannerController.getBannerById);
router.patch(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate(updateBannerSchema),
  bannerController.updateBanner,
);
router.delete('/:id', authenticate, authorizeAdmin, bannerController.deleteBanner);

export default router;
