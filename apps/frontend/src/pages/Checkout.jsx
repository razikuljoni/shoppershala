import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCreateOrder, useUpdateUser } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import useCartStore from '@/stores/cartStore';
import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateUser = useAuthStore((s) => s.updateUser);
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const [success, setSuccess] = useState(false);

  const createOrderMutation = useCreateOrder();
  const updateUserMutation = useUpdateUser({ successMessage: null });

  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const balance = currentUser?.balance || 0;
  const canAfford = balance >= subtotal;

  const form = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    onSubmit: async ({ value }) => {
      if (!canAfford) return;
      if (items.length === 0) return;

      try {
        const orderData = {
          items: items.map(({ product, quantity }) => ({
            productId: product._id,
            quantity,
            price: product.price,
          })),
          totalAmount: subtotal,
          shippingAddress: {
            street: value.street,
            city: value.city,
            state: value.state,
            zipCode: value.zipCode,
            country: value.country,
          },
        };

        await createOrderMutation.mutateAsync(orderData);

        const newBalance = balance - subtotal;
        await updateUserMutation.mutateAsync({
          id: currentUser.id,
          userData: { balance: newBalance },
        });
        updateUser({ balance: newBalance });

        clearCart();
        setSuccess(true);
      } catch (err) {
        console.error('Order placement failed:', err);
      }
    },
  });

  const loading = createOrderMutation.isPending || updateUserMutation.isPending;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center gap-6 animate-fade-in"
      >
        <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.15)] border-2 border-[rgba(16,185,129,0.4)] flex items-center justify-center">
          <CheckCircle size={36} className="text-[var(--color-success)]" />
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Order Placed!
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
            Your order for <strong>${subtotal.toFixed(2)}</strong> has been confirmed.
            <br />
            New wallet balance: <strong>${(balance - subtotal).toFixed(2)}</strong>
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/profile')}>View Orders</Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Cart
      </button>

      <h2
        className="text-2xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard size={18} className="text-[var(--color-primary)]" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="checkout-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                  )}
                />
                <form.Field
                  name="phone"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        placeholder="+1 555 0123"
                      />
                    </div>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field
                    name="street"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          name="street"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          placeholder="Main Street"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="city"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          placeholder="City"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="state"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          placeholder="State"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="zipCode"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          placeholder="Zip Code"
                        />
                      </div>
                    )}
                  />
                  <form.Field
                    name="country"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          placeholder="Country"
                        />
                      </div>
                    )}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3
                className="font-bold text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Order Summary
              </h3>

              <div className="space-y-2">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex justify-between text-sm text-[var(--color-muted-foreground)]"
                  >
                    <span className="truncate mr-2">
                      {product.name} ×{quantity}
                    </span>
                    <span className="shrink-0 font-medium text-[var(--color-foreground)]">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-[var(--color-foreground)]">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-2">
                  <Wallet size={15} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                    Wallet Balance
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    canAfford ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]'
                  }`}
                >
                  ${balance.toFixed(2)}
                </span>
              </div>

              {!canAfford && (
                <p className="text-xs text-[var(--color-destructive)]">
                  You need ${(subtotal - balance).toFixed(2)} more. Top up in your Profile.
                </p>
              )}

              <Badge
                variant={canAfford ? 'success' : 'destructive'}
                className="w-full justify-center py-1.5"
              >
                Payment via Wallet
              </Badge>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                size="lg"
                disabled={loading || !canAfford || items.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing…
                  </>
                ) : (
                  `Place Order — $${subtotal.toFixed(2)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
