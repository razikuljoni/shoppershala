import logger from '#utils/logger.js';
import * as bannerService from '#services/banner.service.js';
import { asyncHandler } from '#middlewares/asyncHandler.middleware.js';

export const createBanner = asyncHandler(async (req, res) => {
  const result = await bannerService.createBanner(req.body);

  logger.info('Banner created', {
    bannerId: result._id || result.id,
    title: req.body.title,
    by: req.user?.username,
  });

  res.status(201).json({
    message: 'Banner created successfully',
    status: 'ok',
    data: result,
  });
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { banners, total } = await bannerService.getAllBanners(page, limit);

  res.status(200).json({
    message: 'Banners retrieved successfully',
    status: 'ok',
    data: banners,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await bannerService.getActiveBanners();

  res.status(200).json({
    message: 'Active banners retrieved successfully',
    status: 'ok',
    data: banners,
  });
});

export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await bannerService.getBannerById(req.params.id);
  if (!banner) {
    return res.status(404).json({ error: 'Banner not found' });
  }
  res.status(200).json({
    message: 'Banner retrieved successfully',
    status: 'ok',
    data: banner,
  });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const updated = await bannerService.updateBanner(req.params.id, req.body);
  if (updated.matchedCount === 0) {
    logger.warn('Banner update failed — not found', {
      bannerId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Banner not found' });
  }
  logger.info('Banner updated', {
    bannerId: req.params.id,
    changes: Object.keys(req.body),
    by: req.user?.username,
  });
  res.status(200).json({
    message: 'Banner updated successfully',
    status: 'ok',
  });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const result = await bannerService.deleteBanner(req.params.id);
  if (result.deletedCount === 0) {
    logger.warn('Banner delete failed — not found', {
      bannerId: req.params.id,
      by: req.user?.username,
    });
    return res.status(404).json({ error: 'Banner not found' });
  }
  logger.info('Banner deleted', { bannerId: req.params.id, by: req.user?.username });
  res.status(200).json({ message: 'Banner deleted successfully', status: 'ok' });
});
