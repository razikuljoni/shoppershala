import { api } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Helper for mutations with automatic toast alerts and query cache invalidation
const useNotifyMutation = (
  mutationFn,
  { successMessage, errorMessage, invalidateKeys = [] } = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (successMessage) {
        const msg =
          typeof successMessage === 'function' ? successMessage(data, variables) : successMessage;
        toast.success(msg);
      }
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      const msg = errorMessage || error.message || 'Action failed';
      toast.error(msg);
    },
  });
};

/* ------------------------------------------------------------------
   Authentication Hooks
   ------------------------------------------------------------------ */

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }) => api.auth.login(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Welcome back!');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => api.auth.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

/* ------------------------------------------------------------------
   Products Hooks
   ------------------------------------------------------------------ */

export const useProducts = (page = 1, limit = 10, categoryId = '', options = {}) => {
  return useQuery({
    queryKey: ['products', { page, limit, categoryId }],
    queryFn: () => api.products.getAll(page, limit, categoryId),
    ...options,
  });
};

export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateProduct = () => {
  return useNotifyMutation((productData) => api.products.create(productData), {
    successMessage: 'Product created!',
    invalidateKeys: [['products'], ['analytics-dashboard']],
  });
};

export const useUpdateProduct = () => {
  return useNotifyMutation(({ id, productData }) => api.products.update(id, productData), {
    successMessage: 'Product updated!',
    invalidateKeys: [['products'], ['product'], ['analytics-dashboard']],
  });
};

export const useDeleteProduct = () => {
  return useNotifyMutation((id) => api.products.delete(id), {
    successMessage: 'Product deleted',
    invalidateKeys: [['products'], ['analytics-dashboard']],
  });
};

/* ------------------------------------------------------------------
   Categories Hooks
   ------------------------------------------------------------------ */

export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(1, 100),
    ...options,
  });
};

export const useCreateCategory = () => {
  return useNotifyMutation((categoryData) => api.categories.create(categoryData), {
    successMessage: 'Category created!',
    invalidateKeys: [['categories']],
  });
};

export const useDeleteCategory = () => {
  return useNotifyMutation((id) => api.categories.delete(id), {
    successMessage: 'Category deleted',
    invalidateKeys: [['categories']],
  });
};

/* ------------------------------------------------------------------
   Orders Hooks
   ------------------------------------------------------------------ */

export const useMyOrders = (page = 1, limit = 10, options = {}) => {
  return useQuery({
    queryKey: ['my-orders', { page, limit }],
    queryFn: () => api.orders.getMyOrders(page, limit),
    ...options,
  });
};

export const useOrders = (page = 1, limit = 10, status = '', options = {}) => {
  return useQuery({
    queryKey: ['orders', { page, limit, status }],
    queryFn: () => api.orders.getAll(page, limit, status),
    ...options,
  });
};

export const useCreateOrder = () => {
  return useNotifyMutation((orderData) => api.orders.create(orderData), {
    successMessage: 'Order placed successfully!',
    invalidateKeys: [['my-orders'], ['orders'], ['users'], ['analytics-dashboard']],
  });
};

export const useUpdateOrder = () => {
  return useNotifyMutation(({ id, updateData }) => api.orders.update(id, updateData), {
    successMessage: 'Order updated',
    invalidateKeys: [['orders'], ['my-orders'], ['analytics-dashboard']],
  });
};

/* ------------------------------------------------------------------
   Reviews Hooks
   ------------------------------------------------------------------ */

export const useProductReviews = (productId, options = {}) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => api.reviews.getByProduct(productId),
    enabled: !!productId,
    ...options,
  });
};

export const useMyReviews = (options = {}) => {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => api.reviews.getMyReviews(),
    ...options,
  });
};

export const useCreateReview = (productId) => {
  return useNotifyMutation(
    ({ rating, comment }) => api.reviews.create(productId, rating, comment),
    {
      successMessage: 'Review submitted!',
      invalidateKeys: [['reviews', productId], ['product', productId], ['my-reviews']],
    },
  );
};

/* ------------------------------------------------------------------
   Users Hooks
   ------------------------------------------------------------------ */

export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.users.getAll(1, 100),
    ...options,
  });
};

export const useUpdateUser = (options = {}) => {
  return useNotifyMutation(({ id, userData }) => api.users.update(id, userData), {
    successMessage: 'Profile updated!',
    invalidateKeys: [['users'], ['user']],
    ...options,
  });
};

export const useUpdateUserRole = () => {
  return useNotifyMutation(({ id, role }) => api.users.update(id, { role }), {
    successMessage: (_, vars) => `Role updated to ${vars.role}!`,
    invalidateKeys: [['users']],
  });
};

export const useDeleteUser = () => {
  return useNotifyMutation((id) => api.users.delete(id), {
    successMessage: 'User deleted',
    invalidateKeys: [['users']],
  });
};

/* ------------------------------------------------------------------
   Shops Hooks
   ------------------------------------------------------------------ */

export const useMyShop = (options = {}) => {
  return useQuery({
    queryKey: ['my-shop'],
    queryFn: () => api.shops.getMyShop(),
    ...options,
  });
};

export const useShop = (id, options = {}) => {
  return useQuery({
    queryKey: ['shop', id],
    queryFn: () => api.shops.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateShop = () => {
  return useNotifyMutation((shopData) => api.shops.create(shopData), {
    successMessage: 'Shop created!',
    invalidateKeys: [['my-shop'], ['shops']],
  });
};

export const useUpdateShop = () => {
  return useNotifyMutation(({ id, shopData }) => api.shops.update(id, shopData), {
    successMessage: 'Shop updated!',
    invalidateKeys: [['my-shop'], ['shop'], ['shops']],
  });
};

/* ------------------------------------------------------------------
   Analytics Hooks
   ------------------------------------------------------------------ */

export const useAnalyticsDashboard = (options = {}) => {
  return useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.analytics.getDashboard(),
    ...options,
  });
};

/* ------------------------------------------------------------------
   Banners Hooks
   ------------------------------------------------------------------ */

export const useActiveBanners = (options = {}) => {
  return useQuery({
    queryKey: ['active-banners'],
    queryFn: () => api.banners.getActive(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useBanners = (page = 1, limit = 20, options = {}) => {
  return useQuery({
    queryKey: ['banners', { page, limit }],
    queryFn: () => api.banners.getAll(page, limit),
    ...options,
  });
};

export const useCreateBanner = () => {
  return useNotifyMutation((bannerData) => api.banners.create(bannerData), {
    successMessage: 'Banner created!',
    invalidateKeys: [['banners'], ['active-banners']],
  });
};

export const useUpdateBanner = () => {
  return useNotifyMutation(({ id, bannerData }) => api.banners.update(id, bannerData), {
    successMessage: 'Banner updated!',
    invalidateKeys: [['banners'], ['active-banners']],
  });
};

export const useDeleteBanner = () => {
  return useNotifyMutation((id) => api.banners.delete(id), {
    successMessage: 'Banner deleted',
    invalidateKeys: [['banners'], ['active-banners']],
  });
};
