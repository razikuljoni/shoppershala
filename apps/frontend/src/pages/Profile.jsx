import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMyOrders, useMyReviews, useUpdateUser } from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import { useForm } from '@tanstack/react-form';
import { Loader2, Package, PenLine, Plus, Shield, Star, User, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pending: 'warning',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
};

function ProfileOrders({ loading, orders }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={'order-skel-' + i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-(--color-muted-foreground)">
          No orders yet.
        </CardContent>
      </Card>
    );
  }
  return (
    <Accordion type="multiple" className="space-y-3">
      {orders.map((order) => (
        <AccordionItem
          key={order._id}
          value={order._id}
          className="border border-border rounded-lg overflow-hidden hover:border-border-hover transition-colors"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between flex-wrap gap-3 w-full mr-4">
              <div className="text-left">
                <p className="text-sm font-bold text-(--color-foreground)">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-(--color-muted-foreground) mt-0.5">
                  {order.items?.length || 0} item
                  {order.items?.length !== 1 ? 's' : ''}.{' '}
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-(--color-foreground)">
                  ${(order.totalAmount || 0).toFixed(2)}
                </span>
                <Badge variant={STATUS_COLORS[order.status] || 'secondary'}>{order.status}</Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Separator className="mb-3" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-(--color-muted-foreground) mb-2">
                <span>
                  Shipping: {order.shippingAddress?.country}, {order.shippingAddress?.street}{' '}
                  {order.shippingAddress?.city}
                </span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-(--color-muted-foreground) border-b border-border">
                    <th className="text-left py-1.5 font-medium">Product</th>
                    <th className="text-center py-1.5 font-medium">Qty</th>
                    <th className="text-right py-1.5 font-medium">Price</th>
                    <th className="text-right py-1.5 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr
                      key={item._id || (item.name ?? 'item') + '-' + (item.price ?? 0)}
                      className="border-b border-border/50"
                    >
                      <td className="py-2 text-(--color-foreground) font-medium">
                        {item?.name || 'Product'}
                      </td>
                      <td className="py-2 text-center text-(--color-muted-foreground)">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-(--color-muted-foreground)">
                        ${(item.price || 0).toFixed(2)}
                      </td>
                      <td className="py-2 text-right font-bold text-(--color-foreground)">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-2">
                <span className="text-sm font-bold text-(--color-foreground)">
                  Total: ${(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ProfileWallet({ currentUser, totalSpent, walletForm, topping, walletError }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet size={16} className="text-(--color-primary)" />
            Balance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-4xl font-bold text-(--color-foreground)">
              ${(currentUser?.balance || 0).toFixed(2)}
            </p>
            <p className="text-xs text-(--color-muted-foreground) mt-1">Available balance</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-(--color-muted-foreground)">Spending capacity</span>
              <span className="font-medium text-(--color-foreground)">
                {Math.min(100, Math.round((currentUser?.balance || 0) / 10))}%
              </span>
            </div>
            <Progress value={Math.min(100, Math.round((currentUser?.balance || 0) / 10))} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-(--color-muted-foreground)">Total spent</span>
            <span className="font-bold text-(--color-foreground)">${totalSpent.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus size={16} className="text-success" />
            Top Up Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              walletForm.handleSubmit();
            }}
            className="space-y-4"
          >
            {walletError && (
              <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-red-400">
                {walletError}
              </div>
            )}
            <walletForm.Field name="amount">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="100.00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </walletForm.Field>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 250, 500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => walletForm.setFieldValue('amount', String(v))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:border-border-hover text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
                >
                  +${v}
                </button>
              ))}
            </div>
            <Button type="submit" variant="success" className="w-full" disabled={topping}>
              {topping ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Processing…
                </>
              ) : (
                'Top Up'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileReviews({ loading, reviews }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={'review-skel-' + i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-(--color-muted-foreground)">
          No reviews yet.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <Card key={r._id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-(--color-foreground)">
                  {r.product?.name || 'Product'}
                </p>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= r.rating
                          ? 'text-warning fill-current'
                          : 'text-[rgba(255,255,255,0.15)]'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-(--color-muted-foreground)">{r.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProfileSettings({ profileForm, savingProfile, profileError }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User size={16} className="text-(--color-primary)" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            profileForm.handleSubmit();
          }}
          className="space-y-4 max-w-md"
        >
          {profileError && (
            <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-red-400">
              {profileError}
            </div>
          )}
          <profileForm.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="pname">Display Name</Label>
                <Input
                  id="pname"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
            )}
          </profileForm.Field>
          <profileForm.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="ppass">
                  New Password{' '}
                  <span className="text-(--color-muted-foreground) font-normal">
                    (leave blank to keep current)
                  </span>
                </Label>
                <Input
                  id="ppass"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            )}
          </profileForm.Field>
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateUser = useAuthStore((s) => s.updateUser);

  const myOrdersQuery = useMyOrders();
  const myReviewsQuery = useMyReviews();
  const saveProfileMutation = useUpdateUser();
  const topUpMutation = useUpdateUser({ successMessage: null });

  const [profileError, setProfileError] = useState(null);
  const [walletError, setWalletError] = useState(null);

  const ordersLoading = myOrdersQuery.isLoading || myReviewsQuery.isLoading;
  const orders = myOrdersQuery.data?.data || [];
  const myReviews = myReviewsQuery.data?.data || [];

  const savingProfile = saveProfileMutation.isPending;
  const topping = topUpMutation.isPending;

  const profileForm = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setProfileError(null);
      try {
        const payload = {};
        if (value.name.trim() && value.name !== currentUser.name) payload.name = value.name.trim();
        if (value.password) payload.password = value.password;
        if (Object.keys(payload).length === 0) {
          toast.info('No changes detected');
          return;
        }
        const res = await saveProfileMutation.mutateAsync({
          id: currentUser.id,
          userData: payload,
        });
        updateUser({
          name: res.data?.name || value.name.trim(),
        });
        profileForm.setFieldValue('password', '');
      } catch (err) {
        const msg = err.message || 'Failed to save profile';
        setProfileError(msg);
      }
    },
  });

  const walletForm = useForm({
    defaultValues: { amount: '' },
    onSubmit: async ({ value }) => {
      setWalletError(null);
      const amount = parseFloat(value.amount);
      if (!amount || amount <= 0 || isNaN(amount)) {
        const msg = 'Enter a valid amount';
        setWalletError(msg);
        toast.error(msg);
        return;
      }
      try {
        const newBalance = (currentUser?.balance || 0) + amount;
        await topUpMutation.mutateAsync({
          id: currentUser?.id,
          userData: { balance: newBalance },
        });
        updateUser({ balance: newBalance });
        walletForm.reset();
        toast.success(`Wallet topped up with $${amount.toFixed(2)}!`);
      } catch (err) {
        const msg = err.message || 'Top-up failed';
        setWalletError(msg);
      }
    },
  });

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar className="h-16 w-16 text-2xl ring-2 ring-(--color-primary) ring-offset-2 ring-offset-background">
              <AvatarFallback className="text-xl">
                {(currentUser?.name || currentUser?.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2
                className="text-xl font-bold text-(--color-foreground)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {currentUser?.name}
              </h2>
              <p className="text-sm text-(--color-muted-foreground)">@{currentUser?.username}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge
                  variant={
                    currentUser?.role === 'admin'
                      ? 'destructive'
                      : currentUser?.role === 'seller'
                        ? 'warning'
                        : 'default'
                  }
                >
                  <Shield size={10} />
                  {currentUser?.role}
                </Badge>
                <span className="text-sm text-(--color-muted-foreground)">
                  {orders.length} orders
                </span>
                <span className="text-sm text-(--color-muted-foreground)">
                  ${totalSpent.toFixed(2)} spent
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-(--color-muted-foreground) uppercase tracking-wider font-semibold">
                Wallet Balance
              </p>
              <p className="text-3xl font-bold text-(--color-foreground) mt-0.5">
                ${(currentUser?.balance || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders">
        <TabsList className="w-full overflow-x-auto scrollbar-hide">
          <TabsTrigger value="orders">
            <Package size={14} className="mr-1.5" />
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Wallet size={14} className="mr-1.5" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star size={14} className="mr-1.5" />
            Reviews ({myReviews.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <PenLine size={14} className="mr-1.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <ProfileOrders loading={ordersLoading} orders={orders} />
        </TabsContent>

        <TabsContent value="wallet">
          <ProfileWallet
            currentUser={currentUser}
            totalSpent={totalSpent}
            walletForm={walletForm}
            topping={topping}
            walletError={walletError}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <ProfileReviews loading={ordersLoading} reviews={myReviews} />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings
            profileForm={profileForm}
            savingProfile={savingProfile}
            profileError={profileError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
