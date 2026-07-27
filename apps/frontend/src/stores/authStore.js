import { api, setAuthToken, clearAuthToken } from '@/utils/api';
import { create } from 'zustand';
import useWishlistStore from './wishlistStore';

const useAuthStore = create((set) => ({
  currentUser: null,
  authLoading: true,

  setAuthLoading: (loading) => set({ authLoading: loading }),

  setUser: (user) => set({ currentUser: user }),

  updateUser: (updates) =>
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    })),

  login: async (user) => {
    set({ currentUser: user });
    try {
      const [userRes, wishRes] = await Promise.all([
        api.users.getById(user.id),
        api.wishlist.get(),
      ]);
      set((state) => ({
        currentUser: {
          ...state.currentUser,
          name: userRes.data.name,
          balance: userRes.data.balance || 0,
        },
      }));
      if (wishRes.data?.products) {
        useWishlistStore.getState().setWishlist(wishRes.data.products.map((p) => p._id));
      }

      return wishRes.data?.products?.map((p) => p._id) || [];
    } catch {
      return [];
    }
  },

  checkAuthToken: async () => {
    try {
      const res = await api.auth.whoami();
      if (res.data.token) setAuthToken(res.data.token);
      const base = {
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
        balance: 0,
      };
      set({ currentUser: base });
      const [userRes, wishRes] = await Promise.all([
        api.users.getById(res.data.id),
        api.wishlist.get(),
      ]);
      set({
        currentUser: {
          ...base,
          name: userRes.data.name,
          balance: userRes.data.balance || 0,
        },
      });
      const wishlistIds = wishRes.data?.products?.map((p) => p._id) || [];
      if (wishlistIds.length > 0) {
        useWishlistStore.getState().setWishlist(wishlistIds);
      }
      return wishlistIds;
    } catch {
      set({ currentUser: null });
      return [];
    } finally {
      set({ authLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      void 0;
    }
    clearAuthToken();
    localStorage.clear();
    sessionStorage.clear();
    set({ currentUser: null });
    useWishlistStore.getState().clear();
  },
}));

export default useAuthStore;
