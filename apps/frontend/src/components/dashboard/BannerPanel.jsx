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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { Image, Plus, Trash2 } from 'lucide-react';
import BannerForm from './BannerForm';

export default function BannerPanel({
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
                                  aria-label="Delete banner"
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
