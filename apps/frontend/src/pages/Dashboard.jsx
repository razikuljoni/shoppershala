import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAnalyticsDashboard,
  useCategories,
  useCreateCategory,
  useCreateProduct,
  useDeleteCategory,
  useDeleteProduct,
  useDeleteUser,
  useProducts,
  useUpdateProduct,
  useUpdateUserRole,
  useUsers,
} from '@/hooks/useApi';
import useAuthStore from '@/stores/authStore';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import {
  BarChart3,
  DollarSign,
  Edit,
  Layers,
  Package,
  Percent,
  Plus,
  Save,
  ShoppingCart,
  TrendingUp,
  Trash2,
  Users2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
          <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider font-semibold mb-0.5">
            {label}
          </p>
          <p
            className="text-2xl font-bold text-[var(--color-foreground)]"
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
   Revenue Bar Chart (SVG)
   --------------------------------------------------------------- */
function TrendChart({ monthlySalesTrend }) {
  if (!monthlySalesTrend?.length) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)] text-center py-8">
        No sales trend data yet.
      </p>
    );
  }
  const monthly = Array.from({ length: 12 }).map((_, i) => {
    const m = monthlySalesTrend.find((t) => t.month === i + 1);
    return m ? m.revenue : 0;
  });
  const maxVal = Math.max(...monthly, 100);
  const W = 600;
  const H = 160;
  const barW = 34;
  const gap = 16;
  const padL = 44;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H + 40}`}
        className="w-full min-w-[480px]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(243 75% 65%)" />
            <stop offset="100%" stopColor="hsl(243 75% 45%)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = H * (1 - r) + 4;
          return (
            <g key={i}>
              <line
                x1={padL}
                y1={y}
                x2={W - 8}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4"
              />
              <text
                x={padL - 6}
                y={y + 4}
                fill="rgba(148,163,184,0.7)"
                fontSize="9"
                textAnchor="end"
              >
                ${(maxVal * r).toFixed(0)}
              </text>
            </g>
          );
        })}
        {monthly.map((val, idx) => {
          const x = padL + idx * (barW + gap) + 4;
          const bH = Math.max(val > 0 ? (val / maxVal) * H : 3, 3);
          const y = H - bH + 4;
          return (
            <g key={idx}>
              <rect x={x} y={y} width={barW} height={bH} rx="4" fill="url(#barGrad)" />
              {val > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  fill="rgba(248,250,252,0.8)"
                  fontSize="8"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  ${val.toFixed(0)}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={H + 22}
                fill="rgba(148,163,184,0.8)"
                fontSize="9"
                textAnchor="middle"
              >
                {MONTH_NAMES[idx]}
              </text>
            </g>
          );
        })}
      </svg>
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
      <form.Field
        name="name"
        children={(field) => (
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
      />
      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              className="input-base min-h-[80px] resize-y"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Short description…"
            />
          </div>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <form.Field
          name="price"
          children={(field) => (
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
        />
        <form.Field
          name="stock"
          children={(field) => (
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
        />
      </div>
      <form.Field
        name="categoryId"
        children={(field) => (
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select
              className="input-base h-10 px-3"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            >
              <option value="">Choose Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      <form.Field
        name="imageUrl"
        children={(field) => (
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
      />
      <div className="flex gap-2 pt-1">
        {isEdit && (
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onCancel}>
            <X size={14} /> Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className={isEdit ? 'flex-[2]' : 'w-full'}>
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

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const updateUserRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

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

  // Listeners for errors
  useEffect(() => {
    if (analyticsQuery.error) toast.error('Failed to load analytics');
  }, [analyticsQuery.error]);

  useEffect(() => {
    if (productsQuery.error) toast.error('Failed to load inventory');
  }, [productsQuery.error]);

  useEffect(() => {
    if (usersQuery.error) toast.error('Failed to load users');
  }, [usersQuery.error]);

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
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProductMutation.mutateAsync(id);
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
    if (!window.confirm('Delete this user?')) return;
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
          className="text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gradient-text">Management</span> Control Center
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
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
          {currentUser?.role === 'admin' && (
            <TabsTrigger value="users">
              <Users2 size={14} className="mr-1.5" />
              Users
            </TabsTrigger>
          )}
        </TabsList>

        {/* ─── Analytics ─── */}
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
                      <TrendingUp size={15} className="text-[var(--color-primary)]" />
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendChart monthlySalesTrend={analytics?.monthlySalesTrend} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Layers size={15} className="text-[var(--color-primary)]" />
                      Sales by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!analytics?.categorySales?.length ? (
                      <p className="text-sm text-[var(--color-muted-foreground)] text-center py-6">
                        No category data.
                      </p>
                    ) : (
                      analytics.categorySales.map((cat) => {
                        const pct =
                          (cat.revenue / (analytics.salesAnalytics?.totalRevenue || 1)) * 100;
                        return (
                          <div key={cat._id} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-[var(--color-foreground)]">
                                {cat.categoryName}
                              </span>
                              <span className="text-[var(--color-muted-foreground)]">
                                ${cat.revenue.toFixed(2)} ({pct.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={pct} />
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Package size={15} className="text-[var(--color-primary)]" />
                    Top 5 Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!analytics?.topProducts?.length ? (
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      No orders placed yet.
                    </p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Units</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topProducts.map((p, i) => (
                          <tr key={p.productId}>
                            <td>
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-[rgba(99,102,241,0.15)] text-[hsl(243_75%_78%)] text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <span className="font-medium">{p.name}</span>
                              </div>
                            </td>
                            <td>{p.totalSold} units</td>
                            <td className="font-bold">${p.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ─── Inventory ─── */}
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
                    onSubmit={handleUpdateProduct}
                    onCancel={() => setEditProduct(null)}
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
                    onSubmit={handleCreateProduct}
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
                  <p className="text-sm text-[var(--color-muted-foreground)]">No products yet.</p>
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
                                      <Package
                                        size={12}
                                        className="text-[var(--color-muted-foreground)]"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-sm">{p.name}</p>
                                    <p className="text-[10px] text-[var(--color-muted-foreground)]">
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
                                    className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                                    onClick={() => setEditProduct(p)}
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                                    onClick={() => handleDeleteProduct(p._id)}
                                  >
                                    <Trash2 size={13} />
                                  </button>
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
                          onClick={() => setProductsPage((p) => p - 1)}
                        >
                          Prev
                        </Button>
                        <span className="text-sm text-[var(--color-muted-foreground)]">
                          Page {productsPage} of {productsTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={productsPage === productsTotalPages}
                          onClick={() => setProductsPage((p) => p + 1)}
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

        {/* ─── Categories ─── */}
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
                  <catForm.Field
                    name="name"
                    children={(field) => (
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
                  />
                  <catForm.Field
                    name="description"
                    children={(field) => (
                      <div className="space-y-1.5">
                        <Label>Description</Label>
                        <textarea
                          className="input-base min-h-[80px] resize-y"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Short description…"
                        />
                      </div>
                    )}
                  />
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
                        <td className="text-[var(--color-muted-foreground)] text-xs">
                          {c.description || '—'}
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <button
                              className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                              onClick={() => {
                                if (!window.confirm('Delete this category?')) return;
                                deleteCategoryMutation.mutate(c._id);
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
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

        {/* ─── Users (Admin) ─── */}
        {currentUser?.role === 'admin' && (
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
                            <td className="text-[var(--color-muted-foreground)]">@{u.username}</td>
                            <td>
                              <select
                                value={u.role}
                                onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                                className="input-base h-7 px-2 text-xs"
                                disabled={u._id === currentUser.id}
                              >
                                <option value="Buyer">Buyer</option>
                                <option value="Seller">Seller</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </td>
                            <td>${(u.balance || 0).toFixed(2)}</td>
                            <td>
                              <div className="flex justify-end">
                                <button
                                  className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors disabled:opacity-30"
                                  onClick={() => handleDeleteUser(u._id)}
                                  disabled={u._id === currentUser.id}
                                >
                                  <Trash2 size={13} />
                                </button>
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
        )}
      </Tabs>
    </div>
  );
}
