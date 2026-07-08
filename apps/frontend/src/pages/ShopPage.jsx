import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useShop } from '@/hooks/useApi';
import { Mail, Package, Phone, Store } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ShopPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useShop(id);
  const shop = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <Store size={48} className="text-(--color-muted-foreground) opacity-40" />
        <h2 className="text-xl font-bold text-(--color-foreground)">Shop not found</h2>
        <Link to="/">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Shop Header */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-[rgba(255,255,255,0.02)]">
        {shop.banner && (
          <div className="h-40 md:h-56 overflow-hidden">
            <img src={shop.banner} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className={`p-6 ${shop.banner ? '' : 'pt-6'}`}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-border flex items-center justify-center shrink-0 overflow-hidden">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <Store size={28} className="text-(--color-muted-foreground)" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl md:text-3xl font-bold text-(--color-foreground)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {shop.name}
              </h1>
              {shop.description && (
                <p className="text-sm text-(--color-muted-foreground) mt-1 max-w-2xl">
                  {shop.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-(--color-muted-foreground)">
                {shop.contactEmail && (
                  <span className="inline-flex items-center gap-1">
                    <Mail size={12} /> {shop.contactEmail}
                  </span>
                )}
                {shop.contactPhone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone size={12} /> {shop.contactPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this shop — for now show message since product-shop linking needs seed update */}
      <div>
        <h2
          className="text-lg font-bold text-(--color-foreground) mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Products
        </h2>

        <Card>
          <CardContent className="py-12 text-center text-(--color-muted-foreground)">
            <Package size={32} className="mx-auto mb-3 opacity-40" />
            <p>This shop has not listed any products yet.</p>
            <p className="text-xs mt-1">After linking products to a shop, they will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
