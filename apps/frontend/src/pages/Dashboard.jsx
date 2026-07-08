import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { BarChart3, Image, Layers, Package, ShoppingCart, Store, Users2 } from 'lucide-react';
import { useState } from 'react';

import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import BannerPanel from '@/components/dashboard/BannerPanel';
import CategoriesPanel from '@/components/dashboard/CategoriesPanel';
import InventoryPanel from '@/components/dashboard/InventoryPanel';
import OrdersPanel from '@/components/dashboard/OrdersPanel';
import ShopPanel from '@/components/dashboard/ShopPanel';
import UsersPanel from '@/components/dashboard/UsersPanel';

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

  // Handlers
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
