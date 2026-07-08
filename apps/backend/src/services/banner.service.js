import * as bannerModel from '#models/banner.model.js';

export const createBanner = async (bannerData) => {
  return await bannerModel.createBanner({
    ...bannerData,
    active: bannerData.active ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const getAllBanners = async (page = 1, limit = 10) => {
  return await bannerModel.getAllBanners(page, limit);
};

export const getActiveBanners = async () => {
  return await bannerModel.getActiveBanners();
};

export const getBannerById = async (bannerId) => {
  return await bannerModel.findBannerById(bannerId);
};

export const updateBanner = async (bannerId, updateData) => {
  return await bannerModel.updateBanner(bannerId, { ...updateData, updatedAt: new Date() });
};

export const deleteBanner = async (bannerId) => {
  return await bannerModel.deleteBanner(bannerId);
};
