import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAnalyticsDashboard,
  useBanners,
  useCategories,
  useCreateBanner,
  useCreateCategory,
  useCreateProduct,
  useCreateShop,
  useDeleteBanner,
  useDeleteCategory,
  useDeleteProduct,
  useDeleteUser,
  useMyShop,
  useOrders,
  useProducts,
  useUpdateBanner,
  useUpdateOrder,
  useUpdateProduct,
  useUpdateShop,
  useUpdateUserRole,
  useUsers,
} from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import { useForm } from '@tanstack/react-form';
import {
  BarChart3,
  DollarSign,
  Edit,
  Image,
  Layers,
  Package,
  Percent,
  Plus,
  Save,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
  Users2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ShopPanel from '../components/management-portal/shop';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/* ---------------------------------------------------------------
   Stat Card Component
   --------------------------------------------------------------- */
function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-[var(--color-primary)]',
  iconBg = 'bg-[rgba(99,102,241,0.15)]',
}) {
  return (
    <Card className="stat-card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <p className="text-xs text-(--color-muted-foreground) uppercase tracking-wider font-semibold mb-0.5">
            {label}
          </p>
          <p
            className="text-2xl font-bold text-(--color-foreground)"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------
   Revenue Area Chart (Recharts)
   --------------------------------------------------------------- */
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

function TrendChart({ monthlySalesTrend }) {
  if (!Array.isArray(monthlySalesTrend) || monthlySalesTrend.length === 0) {
    return (
      <p className="text-sm text-(--color-muted-foreground) text-center py-8">
        No sales trend data yet.
      </p>
    );
  }
  const data = Array.from({ length: 12 }).map((_, i) => {
    const m = monthlySalesTrend.find((t) => t.month === i + 1);
    return { name: MONTH_NAMES[i], revenue: m ? m.revenue : 0 };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------
   Category Sales Pie Chart (Recharts)
   --------------------------------------------------------------- */
function CategoryPieChart({ categorySales }) {
  if (!Array.isArray(categorySales) || categorySales.length === 0) {
    return (
      <p className="text-sm text-(--color-muted-foreground) text-center py-6">No category data.</p>
    );
  }
  const data = categorySales.map((cat) => ({
    name: cat.categoryName,
    value: cat.revenue,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(148,163,184,0.8)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------
   Top Products Bar Chart (Recharts)
   --------------------------------------------------------------- */
function TopProductsBarChart({ topProducts }) {
  if (!Array.isArray(topProducts) || topProducts.length === 0) {
    return <p className="text-sm text-(--color-muted-foreground)">No orders placed yet.</p>;
  }
  const data = topProducts.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
    revenue: p.revenue,
    sold: p.totalSold,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.8)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
            formatter={(value, name) => [
              name === 'revenue' ? `$${value.toFixed(2)}` : value,
              name === 'revenue' ? 'Revenue' : 'Units Sold',
            ]}
          />
          <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sold" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------
   Product Form with TanStack Form
   --------------------------------------------------------------- */
function ProductForm({ categories, onSubmit, onCancel, isEdit, initialValues }) {
  const form = useForm({
    defaultValues: initialValues || {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      imageUrl: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Product Name</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. UltraFit Gloves"
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
              aria-label="Product description"
              className="input-base min-h-20 resize-y"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Short description…"
            />
          </div>
        )}
      </form.Field>
      <div className="grid grid-cols-2 gap-3">
        <form.Field name="price">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="any"
                min="0.01"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="99.99"
                required
              />
            </div>
          )}
        </form.Field>
        <form.Field name="stock">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Stock Qty</Label>
              <Input
                type="number"
                min="0"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="50"
                required
              />
            </div>
          )}
        </form.Field>
      </div>
      <form.Field name="categoryId">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={field.state.value} onValueChange={(val) => field.handleChange(val)}>
              <SelectTrigger className="w-full" size="lg">
                <SelectValue placeholder="Choose Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>
      <form.Field name="imageUrl">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://…"
            />
          </div>
        )}
      </form.Field>
      <div className="flex gap-2 pt-1">
        {isEdit && (
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onCancel}>
            <X size={14} /> Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className={isEdit ? 'flex-2' : 'w-full'}>
          {isEdit ? (
            <>
              <Save size={14} /> Save
            </>
          ) : (
            <>
              <Plus size={14} /> Add Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------
   Analytics Tab Panel
   --------------------------------------------------------------- */
function AnalyticsPanel({ analytics, analyticsLoading }) {
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
                <TrendChart monthlySalesTrend={analytics?.monthlySalesTrend} />
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
                <CategoryPieChart
                  categorySales={analytics?.categorySales}
                  totalRevenue={analytics?.salesAnalytics?.totalRevenue}
                />
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
              <TopProductsBarChart topProducts={analytics?.topProducts} />
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}

/* ---------------------------------------------------------------
   Inventory Tab Panel
   --------------------------------------------------------------- */
function InventoryPanel({
  products,
  productsLoading,
  productsPage,
  productsTotalPages,
  categories,
  editProduct,
  onEditProduct,
  onCancelEdit,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onPageChange,
}) {
  return (
    <TabsContent value="inventory">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              {editProduct ? (
                <>
                  <Edit size={15} /> Edit Product
                </>
              ) : (
                <>
                  <Plus size={15} /> Add Product
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editProduct ? (
              <ProductForm
                categories={categories}
                onSubmit={onUpdateProduct}
                onCancel={onCancelEdit}
                isEdit
                initialValues={{
                  name: editProduct.name || '',
                  description: editProduct.description || '',
                  price: editProduct.price?.toString() || '',
                  stock: editProduct.stock?.toString() || '',
                  categoryId: editProduct.categoryId || '',
                  imageUrl: editProduct.images?.[0] || '',
                }}
              />
            ) : (
              <ProductForm
                categories={categories}
                onSubmit={onCreateProduct}
                isEdit={false}
                initialValues={{
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  categoryId: '',
                  imageUrl: '',
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Catalog Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-(--color-muted-foreground)">No products yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <div className="flex items-center gap-2.5">
                              {p.images?.[0] ? (
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                                  <Package size={12} className="text-(--color-muted-foreground)" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm">{p.name}</p>
                                <p className="text-[10px] text-(--color-muted-foreground)">
                                  {p.category?.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>${p.price.toFixed(2)}</td>
                          <td>
                            <Badge variant={p.stock > 0 ? 'success' : 'destructive'}>
                              {p.stock}
                            </Badge>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-border transition-colors"
                                onClick={() => onEditProduct(p)}
                              >
                                <Edit size={13} />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this product? This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-white hover:bg-destructive/90"
                                      onClick={() => onDeleteProduct(p._id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {productsTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={productsPage === 1}
                      onClick={() => onPageChange(productsPage - 1)}
                    >
                      Prev
                    </Button>
                    <span className="text-sm text-(--color-muted-foreground)">
                      Page {productsPage} of {productsTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={productsPage === productsTotalPages}
                      onClick={() => onPageChange(productsPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

/* ---------------------------------------------------------------
   Categories Tab Panel
   --------------------------------------------------------------- */
function CategoriesPanel({ categories, catForm, onDeleteCategory }) {
  return (
    <TabsContent value="categories">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Plus size={15} /> Add Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                catForm.handleSubmit();
              }}
              className="space-y-3"
            >
              <catForm.Field name="name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Sports & Fitness"
                      required
                    />
                  </div>
                )}
              </catForm.Field>
              <catForm.Field name="description">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea
                      aria-label="Category description"
                      className="input-base min-h-20 resize-y"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Short description…"
                    />
                  </div>
                )}
              </catForm.Field>
              <Button type="submit" size="sm" className="w-full">
                <Plus size={14} /> Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="font-medium">{c.name}</span>
                    </td>
                    <td className="text-(--color-muted-foreground) text-xs">
                      {c.description || '—'}
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this category? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => onDeleteCategory(c._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

/* ---------------------------------------------------------------
   Users Tab Panel (Admin)
   --------------------------------------------------------------- */
function UsersPanel({ users, usersLoading, currentUser, onRoleChange, onDeleteUser }) {
  return (
    <TabsContent value="users">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registered Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Balance</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {(u.name || u.username || '?').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{u.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="text-(--color-muted-foreground)">@{u.username}</td>
                      <td>
                        <Select
                          value={u.role}
                          onValueChange={(val) => onRoleChange(u._id, val)}
                          disabled={u._id === currentUser.id}
                        >
                          <SelectTrigger className="h-7 w-28" size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Buyer">Buyer</SelectItem>
                            <SelectItem value="Seller">Seller</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td>${(u.balance || 0).toFixed(2)}</td>
                      <td>
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors disabled:opacity-30"
                                disabled={u._id === currentUser.id}
                              >
                                <Trash2 size={13} />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                  onClick={() => onDeleteUser(u._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

/* ---------------------------------------------------------------
   Orders Tab Panel (Admin)
   --------------------------------------------------------------- */
function OrdersPanel({ ordersQuery, updateOrderMutation }) {
  const orders = ordersQuery.data?.data || [];
  const ordersLoading = ordersQuery.isLoading;

  const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const statusColors = {
    pending: 'bg-amber/15 text-amber',
    confirmed: 'bg-primary/15 text-primary',
    shipped: 'bg-[rgba(99,102,241,0.15)] text-[hsl(243_75%_78%)]',
    delivered: 'bg-success/15 text-success',
    cancelled: 'bg-destructive/15 text-destructive',
  };

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
                          className={`${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}
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
                              {statusOrder.map((s) => (
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

/* ---------------------------------------------------------------
   Banners Tab Panel (Admin)
   --------------------------------------------------------------- */
function BannerPanel({
  bannersQuery,
  createBannerMutation,
  updateBannerMutation,
  deleteBannerMutation,
}) {
  const bannersData = bannersQuery.data?.data || [];
  const bannersLoading = bannersQuery.isLoading;

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBannerMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateBannerMutation.mutateAsync({
        id: banner._id,
        bannerData: { active: !banner.active },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TabsContent value="banners">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Plus size={15} /> Add Banner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BannerForm
              onSubmit={async (val) => {
                await createBannerMutation.mutateAsync(val);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Banners</CardTitle>
          </CardHeader>
          <CardContent>
            {bannersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : bannersData.length === 0 ? (
              <p className="text-sm text-(--color-muted-foreground) text-center py-8">
                No banners yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Title</th>
                      <th>Order</th>
                      <th>Active</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannersData.map((b) => (
                      <tr key={b._id}>
                        <td>
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt=""
                              className="w-12 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-8 rounded bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                              <Image size={12} className="text-(--color-muted-foreground)" />
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="font-medium text-sm">{b.title}</span>
                          {b.subtitle && (
                            <p className="text-[10px] text-(--color-muted-foreground)">
                              {b.subtitle}
                            </p>
                          )}
                        </td>
                        <td className="text-sm">{b.order || 0}</td>
                        <td>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(b)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                b.active
                                  ? 'text-success hover:bg-[rgba(16,185,129,0.15)]'
                                  : 'text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-border'
                              }`}
                            >
                              <Badge variant={b.active ? 'success' : 'secondary'}>
                                {b.active ? 'ON' : 'OFF'}
                              </Badge>
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  type="button"
                                  className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this banner? This action cannot
                                    be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={() => handleDeleteBanner(b._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
      </div>
    </TabsContent>
  );
}

/* Banner Form sub-component */
function BannerForm({ onSubmit, initialValues }) {
  const form = useForm({
    defaultValues: initialValues || {
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
      linkText: '',
      order: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        title: value.title,
        subtitle: value.subtitle || undefined,
        imageUrl: value.imageUrl,
        link: value.link || undefined,
        linkText: value.linkText || undefined,
        order: value.order ? parseInt(value.order) : 0,
        active: true,
      });
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      <form.Field name="title">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Summer Sale"
              required
            />
          </div>
        )}
      </form.Field>
      <form.Field name="subtitle">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Up to 50% off"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="imageUrl">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Image URL *</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://…"
              required
            />
          </div>
        )}
      </form.Field>
      <form.Field name="link">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Link URL</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="/products"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="linkText">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Link Text</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Shop Now"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="order">
        {(field) => (
          <div className="space-y-1.5">
            <Label>Display Order</Label>
            <Input
              type="number"
              min="0"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="1"
            />
          </div>
        )}
      </form.Field>
      <Button type="submit" size="sm" className="w-full">
        <Plus size={14} /> Add Banner
      </Button>
    </form>
  );
}

/* ---------------------------------------------------------------
   Main Dashboard
   --------------------------------------------------------------- */
export default function Dashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [productsPage, setProductsPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  // Queries
  const categoriesQuery = useCategories();
  const analyticsQuery = useAnalyticsDashboard({ enabled: activeTab === 'analytics' });
  const productsQuery = useProducts(productsPage, 8, '', { enabled: activeTab === 'inventory' });
  const usersQuery = useUsers({ enabled: activeTab === 'users' && currentUser?.role === 'admin' });
  const myShopQuery = useMyShop({ enabled: activeTab === 'shop', retry: false });
  const ordersQuery = useOrders(1, 20, '', {
    enabled: activeTab === 'orders' && currentUser?.role === 'admin',
  });
  const bannersQuery = useBanners(1, 50, {
    enabled: activeTab === 'banners' && currentUser?.role === 'admin',
  });

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const updateUserRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();
  const createShopMutation = useCreateShop();
  const updateShopMutation = useUpdateShop();
  const updateOrderMutation = useUpdateOrder();
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  // Category form
  const catForm = useForm({
    defaultValues: { name: '', description: '' },
    onSubmit: async ({ value }) => {
      try {
        await createCategoryMutation.mutateAsync(value);
        catForm.reset();
      } catch (err) {
        console.error(err);
      }
    },
  });

  // Data mapping
  const categories = categoriesQuery.data?.data || [];
  const analytics = analyticsQuery.data?.data || null;
  const analyticsLoading = analyticsQuery.isLoading;

  const products = productsQuery.data?.data || [];
  const productsLoading = productsQuery.isLoading;
  const productsTotal = productsQuery.data?.pagination?.total || 0;
  const productsTotalPages = Math.ceil(productsTotal / 8) || 1;

  const users = usersQuery.data?.data || [];
  const usersLoading = usersQuery.isLoading;

  const handleCreateProduct = async (value) => {
    try {
      await createProductMutation.mutateAsync({
        name: value.name,
        description: value.description,
        price: parseFloat(value.price),
        stock: parseInt(value.stock),
        categoryId: value.categoryId,
        images: value.imageUrl ? [value.imageUrl] : [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (value) => {
    try {
      await updateProductMutation.mutateAsync({
        id: editProduct._id,
        productData: {
          name: value.name,
          description: value.description,
          price: parseFloat(value.price),
          stock: parseInt(value.stock),
          categoryId: value.categoryId,
          images: value.imageUrl ? [value.imageUrl] : [],
        },
      });
      setEditProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoleMutation.mutateAsync({ id: userId, role: newRole });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2
          className="text-2xl font-bold text-(--color-foreground)"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gradient-text">Management</span> Control Center
        </h2>
        <p className="text-sm text-(--color-muted-foreground) mt-1">
          Orchestrate products, categories, users, and review shop performance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto scrollbar-hide justify-start">
          <TabsTrigger value="analytics">
            <BarChart3 size={14} className="mr-1.5" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package size={14} className="mr-1.5" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Layers size={14} className="mr-1.5" />
            Categories
          </TabsTrigger>
          {['seller', 'admin'].includes(currentUser?.role) && (
            <TabsTrigger value="shop">
              <Store size={14} className="mr-1.5" />
              Shop
            </TabsTrigger>
          )}
          {currentUser?.role === 'admin' && (
            <TabsTrigger value="users">
              <Users2 size={14} className="mr-1.5" />
              Users
            </TabsTrigger>
          )}
          {currentUser?.role === 'admin' && (
            <TabsTrigger value="orders">
              <ShoppingCart size={14} className="mr-1.5" />
              Orders
            </TabsTrigger>
          )}
          {currentUser?.role === 'admin' && (
            <TabsTrigger value="banners">
              <Image size={14} className="mr-1.5" />
              Banners
            </TabsTrigger>
          )}
        </TabsList>

        <AnalyticsPanel analytics={analytics} analyticsLoading={analyticsLoading} />

        <InventoryPanel
          products={products}
          productsLoading={productsLoading}
          productsPage={productsPage}
          productsTotalPages={productsTotalPages}
          categories={categories}
          editProduct={editProduct}
          onEditProduct={setEditProduct}
          onCancelEdit={() => setEditProduct(null)}
          onCreateProduct={handleCreateProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onPageChange={setProductsPage}
        />

        <CategoriesPanel
          categories={categories}
          catForm={catForm}
          onDeleteCategory={handleDeleteCategory}
        />

        {currentUser?.role === 'admin' && (
          <UsersPanel
            users={users}
            usersLoading={usersLoading}
            currentUser={currentUser}
            onRoleChange={handleUserRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {currentUser?.role === 'admin' && (
          <OrdersPanel ordersQuery={ordersQuery} updateOrderMutation={updateOrderMutation} />
        )}

        {currentUser?.role === 'admin' && (
          <BannerPanel
            bannersQuery={bannersQuery}
            createBannerMutation={createBannerMutation}
            updateBannerMutation={updateBannerMutation}
            deleteBannerMutation={deleteBannerMutation}
          />
        )}

        <ShopPanel
          shopQuery={myShopQuery}
          createShopMutation={createShopMutation}
          updateShopMutation={updateShopMutation}
        />
      </Tabs>
    </div>
  );
}
