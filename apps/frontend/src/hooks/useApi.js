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
    mutationFn: ({ name, username, password, role }) =>
      api.auth.register(name, username, password, role),
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

export const useCreateOrder = () => {
  return useNotifyMutation((orderData) => api.orders.create(orderData), {
    successMessage: 'Order placed successfully!',
    invalidateKeys: [['my-orders'], ['users'], ['analytics-dashboard']],
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
   Wishlist Hooks
   ------------------------------------------------------------------ */

export const useAddToWishlist = () => {
  return useNotifyMutation((productId) => api.wishlist.add(productId), {
    successMessage: 'Added to wishlist',
    invalidateKeys: [['wishlist']],
  });
};

export const useRemoveFromWishlist = () => {
  return useNotifyMutation((productId) => api.wishlist.remove(productId), {
    successMessage: 'Removed from wishlist',
    invalidateKeys: [['wishlist']],
  });
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
   Analytics Hooks
   ------------------------------------------------------------------ */

export const useAnalyticsDashboard = (options = {}) => {
  return useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.analytics.getDashboard(),
    ...options,
  });
};
