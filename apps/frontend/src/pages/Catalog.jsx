import BannerCarousel from '@/components/BannerCarousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories, useProducts } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import useCartStore from '@/stores/cartStore';
import useWishlistStore from '@/stores/wishlistStore';
import { AnimatePresence, m } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/* Tag display helpers */
const TAG_COLORS = {
  popular: 'bg-amber/15 text-amber border-amber/25',
  hot: 'bg-destructive/15 text-destructive border-destructive/25',
  'top-selling': 'bg-primary/15 text-primary border-primary/25',
  new: 'bg-success/15 text-success border-success/25',
};
const TAG_ICONS = {
  popular: TrendingUp,
  hot: Flame,
  'top-selling': Zap,
  new: null,
};
const TAG_LABELS = {
  popular: 'Popular',
  hot: 'Hot',
  'top-selling': 'Top Selling',
  new: 'New',
};

function ProductTags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map((tag) => {
        const Icon = TAG_ICONS[tag];
        return (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground border-border'}`}
          >
            {Icon && <Icon size={10} />}
            {TAG_LABELS[tag] || tag}
          </span>
        );
      })}
    </div>
  );
}
/* ------------------------------------------------------------------ */
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none rounded-t-(--radius)" />
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
            s <= Math.round(rating) ? 'text-warning fill-current' : 'text-[rgba(255,255,255,0.15)]'
          }
        />
      ))}
    </div>
  );
}

function ProductCard({ product, inCart, inWishlist, onAddToCart, onToggleWishlist, onBuyNow }) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden hover:border-border-hover hover:shadow-(--shadow-glow) transition-all duration-300 h-full flex flex-col py-0">
        <Link
          to={`/product/${product._id}`}
          className="relative block overflow-hidden bg-[rgba(255,255,255,0.02)] aspect-4/3"
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
              <Package size={36} className="text-(--color-muted-foreground) opacity-40" />
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
            <ProductTags tags={product.tags} />
            {discount && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                -{discount}%
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-[rgba(0,0,0,0.7)]">
                Out of Stock
              </Badge>
            )}
          </div>

          <button
            type="button"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              inWishlist
                ? 'bg-[rgba(239,68,68,0.9)] text-white'
                : 'bg-[rgba(0,0,0,0.5)] text-(--color-muted-foreground) opacity-0 group-hover:opacity-100 hover:text-[#f87171]'
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
            <h3 className="text-sm font-semibold text-(--color-foreground) line-clamp-2 group-hover/title:text-[hsl(243_75%_78%)] transition-colors">
              {product.name}
            </h3>
          </Link>

          {(product.rating > 0 || product.reviewCount > 0) && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating || 0} />
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                ({product.reviewCount || 0})
              </Badge>
            </div>
          )}

          {product.stock > 0 && (
            <div className="flex items-center gap-3 text-[10px] text-(--color-muted-foreground)">
              {product.totalSold > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {product.totalSold} sold
                </Badge>
              )}
              <Badge
                variant={isLowStock ? 'warning' : 'success'}
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {product.stock} in stock
                {isLowStock && ' — low'}
              </Badge>
            </div>
          )}

          <div className="mt-auto pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-(--color-foreground)">
                  ${product.price?.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="ml-2 text-xs text-(--color-muted-foreground) line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={inCart ? 'success' : 'default'}
                className="flex-1 h-8"
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart size={13} />
                {inCart ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8"
                disabled={product.stock === 0}
                onClick={() => onBuyNow(product)}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
export default function Catalog({ wishlistOnly = false }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useWishlistStore((s) => s.wishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const navigate = useNavigate();

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
  const wishlistSet = new Set(wishlist);

  let displayed = products;
  if (wishlistOnly) displayed = products.filter((p) => wishlistSet.has(p._id));
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayed = displayed.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
    );
  }

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!wishlistOnly && <BannerCarousel />}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-2xl font-bold text-(--color-foreground)"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {wishlistOnly ? '❤️ My Wishlist' : '🛍️ Shop Products'}
          </h2>
          <p className="text-sm text-(--color-muted-foreground) mt-0.5">
            {wishlistOnly
              ? `${displayed.length} saved item${displayed.length !== 1 ? 's' : ''}`
              : `${displayed.length} products found`}
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted-foreground)"
          />
          <Input
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {!wishlistOnly && (
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val === 'all' ? '' : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="min-w-45" size="lg">
              <SlidersHorizontal size={15} className="text-(--color-muted-foreground)" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-border flex items-center justify-center">
            <Package size={28} className="text-(--color-muted-foreground)" />
          </div>
          <div>
            <h3 className="font-semibold text-(--color-foreground)">
              {wishlistOnly ? 'Your wishlist is empty' : 'No products found'}
            </h3>
            <p className="text-sm text-(--color-muted-foreground) mt-1">
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
                inWishlist={wishlistSet.has(product._id)}
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
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
          <span className="text-sm text-(--color-muted-foreground)">
            Page <span className="font-bold text-(--color-foreground)">{page}</span> of {totalPages}
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
