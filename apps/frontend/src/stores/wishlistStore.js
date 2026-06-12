import { create } from 'zustand';
import { api } from '@/utils/api';
import { toast } from 'sonner';

const useWishlistStore = create((set, get) => ({
  wishlist: [],

  setWishlist: (ids) => set({ wishlist: ids }),

  clear: () => set({ wishlist: [] }),

  toggleWishlist: async (productId, currentUser) => {
    if (!currentUser) {
      toast.warning('Please sign in to manage your wishlist');
      return;
    }
    const inWishlist = get().wishlist.includes(productId);
    try {
      if (inWishlist) {
        await api.wishlist.remove(productId);
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      } else {
        await api.wishlist.add(productId);
        set((state) => ({ wishlist: [...state.wishlist, productId] }));
      }
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    }
  },
}));

export { useWishlistStore };
export default useWishlistStore;
