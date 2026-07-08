import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { DollarSign, Layers, Package, Percent, ShoppingCart, TrendingUp } from 'lucide-react';
import { Suspense, lazy } from 'react';
import StatCard from './StatCard';

const LazyTrendChart = lazy(() =>
  import('@/components/DashboardCharts').then((mod) => ({ default: mod.TrendChart })),
);
const LazyCategoryPieChart = lazy(() =>
  import('@/components/DashboardCharts').then((mod) => ({ default: mod.CategoryPieChart })),
);
const LazyTopProductsBarChart = lazy(() =>
  import('@/components/DashboardCharts').then((mod) => ({ default: mod.TopProductsBarChart })),
);

export default function AnalyticsPanel({ analytics, analyticsLoading }) {
  return (
    <TabsContent value="analytics" className="space-y-6">
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`$${(analytics?.salesAnalytics?.totalRevenue || 0).toFixed(2)}`}
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Orders"
              value={analytics?.salesAnalytics?.totalOrders || 0}
              iconColor="text-[var(--color-success)]"
              iconBg="bg-[rgba(16,185,129,0.15)]"
            />
            <StatCard
              icon={Percent}
              label="Avg Order Value"
              value={`$${(analytics?.salesAnalytics?.averageOrderValue || 0).toFixed(2)}`}
              iconColor="text-[var(--color-warning)]"
              iconBg="bg-[rgba(245,158,11,0.15)]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp size={15} className="text-(--color-primary)" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <LazyTrendChart monthlySalesTrend={analytics?.monthlySalesTrend} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Layers size={15} className="text-(--color-primary)" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <LazyCategoryPieChart
                    categorySales={analytics?.categorySales}
                    totalRevenue={analytics?.salesAnalytics?.totalRevenue}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package size={15} className="text-(--color-primary)" />
                Top 5 Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <LazyTopProductsBarChart topProducts={analytics?.topProducts} />
              </Suspense>
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
