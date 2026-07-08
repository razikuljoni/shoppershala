import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

const STATUS_ORDER = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-amber/15 text-amber',
  confirmed: 'bg-primary/15 text-primary',
  shipped: 'bg-[rgba(99,102,241,0.15)] text-[hsl(243_75%_78%)]',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-destructive/15 text-destructive',
};

export default function OrdersPanel({ ordersQuery, updateOrderMutation }) {
  const orders = ordersQuery.data?.data || [];
  const ordersLoading = ordersQuery.isLoading;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderMutation.mutateAsync({ id: orderId, updateData: { status: newStatus } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TabsContent value="orders">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-(--color-muted-foreground) text-center py-8">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="text-xs font-mono text-(--color-muted-foreground)">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="text-sm text-(--color-foreground) font-medium">
                        {order.userId?.slice(-8) || '—'}
                      </td>
                      <td className="text-sm">{order.items?.length || 0}</td>
                      <td className="text-sm font-bold">${(order.totalAmount || 0).toFixed(2)}</td>
                      <td>
                        <Badge
                          className={`${STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}`}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="text-xs text-(--color-muted-foreground)">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <Select
                            value={order.status}
                            onValueChange={(val) => handleStatusChange(order._id, val)}
                          >
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_ORDER.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
