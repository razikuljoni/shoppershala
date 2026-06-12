import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories, useProducts } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import useCartStore from '@/stores/cartStore';
import useWishlistStore from '@/stores/wishlistStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none rounded-t-[var(--radius)]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
/* ------------------------------------------------------------------ */

function StarRating({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? 'text-[var(--color-warning)] fill-current'
              : 'text-[rgba(255,255,255,0.15)]'
          }
        />
      ))}
    </div>
  );
}

function ProductCard({ product, inCart, inWishlist, onAddToCart, onToggleWishlist }) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 h-full flex flex-col">
        <Link
          to={`/product/${product._id}`}
          className="relative block overflow-hidden bg-[rgba(255,255,255,0.02)] aspect-[4/3]"
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={36} className="text-[var(--color-muted-foreground)] opacity-40" />
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
            {discount && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-destructive)] text-white">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(0,0,0,0.7)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]">
                Out of Stock
              </span>
            )}
          </div>

          <button
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              inWishlist
                ? 'bg-[rgba(239,68,68,0.9)] text-white'
                : 'bg-[rgba(0,0,0,0.5)] text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[#f87171]'
            }`}
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product._id);
            }}
          >
            <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
          </button>
        </Link>

        <div className="p-4 flex flex-col flex-1 gap-2">
          {product.category?.name && (
            <Badge variant="secondary" className="self-start text-[10px]">
              {product.category.name}
            </Badge>
          )}

          <Link to={`/product/${product._id}`} className="group/title">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-2 group-hover/title:text-[hsl(243_75%_78%)] transition-colors">
              {product.name}
            </h3>
          </Link>

          {(product.rating > 0 || product.reviewCount > 0) && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating || 0} />
              <span className="text-[10px] text-[var(--color-muted-foreground)]">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <div>
              <span className="text-base font-bold text-[var(--color-foreground)]">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="ml-2 text-xs text-[var(--color-muted-foreground)] line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              size="icon"
              variant={inCart ? 'success' : 'outline'}
              className="h-8 w-8"
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product)}
              title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
export default function Catalog({ wishlistOnly = false }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useWishlistStore((s) => s.wishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const productsQuery = useProducts(page, LIMIT, selectedCategory);
  const categoriesQuery = useCategories();

  const loading = productsQuery.isLoading || categoriesQuery.isLoading;
  const products = productsQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];
  const total = productsQuery.data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  useEffect(() => {
    if (productsQuery.error) {
      toast.error(productsQuery.error.message || 'Failed to load products');
    }
  }, [productsQuery.error]);

  let displayed = products;
  if (wishlistOnly) displayed = products.filter((p) => wishlist.includes(p._id));
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayed = displayed.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {wishlistOnly ? '❤️ My Wishlist' : '🛍️ Shop Products'}
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {wishlistOnly
              ? `${displayed.length} saved item${displayed.length !== 1 ? 's' : ''}`
              : `${displayed.length} products found`}
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
          />
          <Input
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {!wishlistOnly && (
          <div className="relative">
            <SlidersHorizontal
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="input-base h-10 pl-9 pr-10 appearance-none min-w-[180px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[var(--color-border)] flex items-center justify-center">
            <Package size={28} className="text-[var(--color-muted-foreground)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)]">
              {wishlistOnly ? 'Your wishlist is empty' : 'No products found'}
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              {wishlistOnly
                ? 'Browse the catalog and heart items you love.'
                : 'Try adjusting your search or category filter.'}
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                inCart={!!cart[product._id]}
                inWishlist={wishlist.includes(product._id)}
                onAddToCart={addToCart}
                onToggleWishlist={(id) => toggleWishlist(id, currentUser)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {!wishlistOnly && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-[var(--color-muted-foreground)]">
            Page <span className="font-bold text-[var(--color-foreground)]">{page}</span> of{' '}
            {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
