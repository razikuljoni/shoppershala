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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';

export default function InventoryPanel({
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
                                aria-label="Edit product"
                                className="p-1.5 rounded-lg text-(--color-muted-foreground) hover:text-(--color-foreground) hover:bg-border transition-colors"
                                onClick={() => onEditProduct(p)}
                              >
                                <Edit size={13} />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    aria-label="Delete product"
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
