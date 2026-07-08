import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { useForm } from '@tanstack/react-form';
import { Store } from 'lucide-react';

/* ---------------------------------------------------------------
   Shop Tab Panel (Seller)
   --------------------------------------------------------------- */
export default function ShopPanel({ shopQuery, createShopMutation, updateShopMutation }) {
  const shop = shopQuery?.data?.data ?? null;
  const shopLoading = shopQuery?.isLoading ?? false;
  const shopError = shopQuery?.error ?? null;

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      banner: '',
      contactEmail: '',
      contactPhone: '',
    },
    onSubmit: async ({ value }) => {
      const shopData = {
        name: value.name,
        description: value.description,
        logo: value.logo || null,
        banner: value.banner || null,
        contactEmail: value.contactEmail || null,
        contactPhone: value.contactPhone || null,
      };
      if (shop) {
        await updateShopMutation.mutateAsync({ id: shop._id, shopData });
      } else {
        await createShopMutation.mutateAsync(shopData);
      }
    },
  });

  if (shopLoading) {
    return (
      <TabsContent value="shop">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="shop">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Store size={15} className="text-(--color-primary)" />
            {shop ? 'My Shop' : 'Create Your Shop'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shopError && (
            <div className="mb-4 rounded-lg border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm text-[#f87171]">
              Failed to load shop data. You can still create a shop below.
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Shop Name</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your brand name"
                    required
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <textarea
                    aria-label="Shop description"
                    className="input-base min-h-20 resize-y"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell customers about your shop…"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="logo">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Logo URL</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="banner">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Banner URL</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              )}
            </form.Field>
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="contactEmail">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="shop@example.com"
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="contactPhone">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>Contact Phone</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+1 555 0123"
                    />
                  </div>
                )}
              </form.Field>
            </div>
            <Button
              type="submit"
              disabled={createShopMutation.isPending || updateShopMutation.isPending}
            >
              {shop ? 'Update Shop' : 'Create Shop'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
