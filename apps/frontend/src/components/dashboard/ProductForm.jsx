import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from '@tanstack/react-form';
import { Plus, Save, X } from 'lucide-react';

export default function ProductForm({ categories, onSubmit, onCancel, isEdit, initialValues }) {
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
