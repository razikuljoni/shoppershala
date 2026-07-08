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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';

export default function CategoriesPanel({ categories, catForm, onDeleteCategory }) {
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
                              aria-label="Delete category"
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
