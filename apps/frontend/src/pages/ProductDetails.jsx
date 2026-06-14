import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateReview, useProduct, useProductReviews } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import useCartStore from '@/stores/cartStore';
import useWishlistStore from '@/stores/wishlistStore';
import { useForm } from '@tanstack/react-form';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import { ArrowLeft, Heart, Loader2, Minus, Package, Plus, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

function StarRating({ rating = 0, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating) ? 'text-warning fill-current' : 'text-[rgba(255,255,255,0.15)]'
          }
        />
      ))}
    </div>
  );
}

function ClickableStars({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="text-[rgba(255,255,255,0.2)] hover:text-warning transition-colors"
        >
          <Star size={20} className={s <= (hovered || value) ? 'text-warning fill-current' : ''} />
        </button>
      ))}
    </div>
  );
}

function ProductImageGallery({ images, productName, selectedImage, onSelectImage }) {
  return (
    <div className="space-y-3">
      <m.div
        key={selectedImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative aspect-square rounded-(--radius) overflow-hidden bg-[rgba(255,255,255,0.02)] border border-border"
      >
        {images?.[selectedImage] ? (
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-(--color-muted-foreground) opacity-30" />
          </div>
        )}
      </m.div>
      {images?.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <button
              type="button"
              key={img}
              aria-label={`View product image ${idx + 1}`}
              onClick={() => onSelectImage(idx)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedImage
                  ? 'border-(--color-primary)'
                  : 'border-border opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductInfo({
  product,
  quantity,
  setQuantity,
  avgRating,
  reviewsCount,
  inWishlist,
  onAddToCart,
  onToggleWishlist,
}) {
  return (
    <div className="space-y-5">
      {product.category?.name && <Badge variant="secondary">{product.category.name}</Badge>}

      <h1
        className="text-2xl md:text-3xl font-bold text-(--color-foreground)"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {product.name}
      </h1>

      <div className="flex items-center gap-3">
        <StarRating rating={avgRating} size={16} />
        <span className="text-sm text-(--color-muted-foreground)">
          {avgRating.toFixed(1)} ({reviewsCount} reviews)
        </span>
      </div>

      <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
        {product.description}
      </p>

      <Separator />

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-(--color-foreground)">
          ${product.price?.toFixed(2)}
        </span>
        {product.originalPrice > product.price && (
          <span className="text-lg text-(--color-muted-foreground) line-through">
            ${product.originalPrice?.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`status-dot ${product.stock > 0 ? 'status-dot-success' : 'status-dot-danger'}`}
        />
        <span className="text-sm font-medium text-(--color-muted-foreground)">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {product.stock > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="px-3 py-2 text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus size={14} />
            </button>
            <span className="px-4 py-2 text-sm font-bold text-(--color-foreground) border-x border-border">
              {quantity}
            </span>
            <button
              type="button"
              className="px-3 py-2 text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              <Plus size={14} />
            </button>
          </div>
          <Button className="flex-1" onClick={onAddToCart}>
            <ShoppingCart size={16} /> Add to Cart
          </Button>
          <Button
            variant={inWishlist ? 'destructive' : 'outline'}
            size="icon"
            onClick={onToggleWishlist}
          >
            <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const currentUser = useAuthStore((s) => s.currentUser);
  const addToCart = useCartStore((s) => s.addToCart);
  const wishlist = useWishlistStore((s) => s.wishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productQuery = useProduct(id);
  const reviewsQuery = useProductReviews(id);
  const createReviewMutation = useCreateReview(id);

  const reviewForm = useForm({
    defaultValues: { rating: 5, comment: '' },
    onSubmit: async ({ value }) => {
      if (!currentUser) {
        toast.warning('Please sign in to leave a review');
        return;
      }
      try {
        await createReviewMutation.mutateAsync({
          rating: value.rating,
          comment: value.comment,
        });
        reviewForm.reset();
      } catch (err) {
        console.error('Failed to submit review:', err);
      }
    },
  });

  const loading = productQuery.isLoading || reviewsQuery.isLoading;
  const product = productQuery.data?.data;
  const reviews = reviewsQuery.data?.data || {
    reviews: [],
    total: 0,
    averageRating: 0,
    totalReviews: 0,
  };
  const submittingReview = createReviewMutation.isPending;

  useEffect(() => {
    if (productQuery.error) {
      toast.error(productQuery.error.message || 'Failed to load product');
    }
  }, [productQuery.error]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`${quantity}× ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-(--radius)" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center py-24 text-(--color-muted-foreground)">Product not found.</div>
    );

  const inWishlist = wishlist.includes(product._id);
  const avgRating = reviews.averageRating;

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
        >
          <ArrowLeft size={15} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            avgRating={avgRating}
            reviewsCount={reviews?.totalReviews}
            inWishlist={inWishlist}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => toggleWishlist(product._id, currentUser)}
          />
        </div>

        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.total})</TabsTrigger>
            {currentUser && <TabsTrigger value="write">Write Review</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Category', product.category?.name],
                    ['Stock', product.stock],
                    ['SKU', product._id?.slice(-8).toUpperCase()],
                  ]
                    .filter(([, v]) => v != null)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-(--color-muted-foreground) uppercase tracking-wider font-semibold">
                          {k}
                        </dt>
                        <dd className="mt-1 text-sm text-(--color-foreground) font-medium">{v}</dd>
                      </div>
                    ))}
                </dl>
                {product.description && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
                      {product.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.reviews?.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-(--color-muted-foreground)">
                    No reviews yet. Be the first to review this product!
                  </CardContent>
                </Card>
              ) : (
                reviews?.reviews.map((r) => (
                  <Card key={r._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {(r.user?.name || r.user?.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-(--color-foreground)">
                            {r.user?.name || r.user?.username}
                          </span>
                          <StarRating rating={r.rating} size={12} />
                        </div>
                        <p className="text-sm text-(--color-muted-foreground)">{r.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {currentUser && (
            <TabsContent value="write">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      reviewForm.handleSubmit();
                    }}
                    className="space-y-4"
                  >
                    <reviewForm.Field name="rating">
                      {(field) => (
                        <div className="space-y-1.5">
                          <Label>Rating</Label>
                          <ClickableStars
                            value={field.state.value}
                            onChange={(r) => field.handleChange(r)}
                          />
                        </div>
                      )}
                    </reviewForm.Field>
                    <reviewForm.Field name="comment">
                      {(field) => (
                        <div className="space-y-1.5">
                          <Label htmlFor="comment">Comment</Label>
                          <textarea
                            id="comment"
                            className="input-base min-h-25 resize-y"
                            placeholder="Share your thoughts about this product…"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            aria-label="Comment"
                          />
                        </div>
                      )}
                    </reviewForm.Field>
                    <Button type="submit" disabled={submittingReview}>
                      {submittingReview ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> Submitting…
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </LazyMotion>
  );
}
