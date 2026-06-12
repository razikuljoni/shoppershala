import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartStore from '@/stores/cartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, PackageOpen, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const updateCartQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const items = Object.values(cart);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[var(--color-border)] flex items-center justify-center">
          <PackageOpen size={36} className="text-[var(--color-muted-foreground)]" />
        </div>
        <div>
          <h2
            className="text-xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your cart is empty
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Start adding products to see them here.
          </p>
        </div>
        <Link to="/">
          <Button>
            <ShoppingCart size={16} /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Shopping Cart
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="text-[var(--color-destructive)] border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.08)]"
        >
          <Trash2 size={14} /> Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-start">
                      <Link
                        to={`/product/${product._id}`}
                        className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.03)] border border-[var(--color-border)] flex items-center justify-center"
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingCart
                            size={20}
                            className="text-[var(--color-muted-foreground)]"
                          />
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-sm font-semibold text-[var(--color-foreground)] hover:text-[hsl(243_75%_78%)] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                          ${product.price?.toFixed(2)} each
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                            <button
                              className="px-2.5 py-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                              onClick={() => updateCartQuantity(product._id, quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-sm font-bold text-[var(--color-foreground)] border-x border-[var(--color-border)]">
                              {quantity}
                            </span>
                            <button
                              className="px-2.5 py-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                              onClick={() => updateCartQuantity(product._id, quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[var(--color-foreground)]">
                              ${(product.price * quantity).toFixed(2)}
                            </span>
                            <button
                              className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                              onClick={() => removeFromCart(product._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[84px]">
            <CardContent className="p-5 space-y-4">
              <h3
                className="font-bold text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Order Summary
              </h3>

              <div className="space-y-2 text-sm">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex justify-between text-[var(--color-muted-foreground)]"
                  >
                    <span className="truncate mr-2">
                      {product.name} ×{quantity}
                    </span>
                    <span className="shrink-0">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-[var(--color-foreground)]">
                <span>Total</span>
                <span className="text-lg">${subtotal.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                Checkout <ArrowRight size={16} />
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
