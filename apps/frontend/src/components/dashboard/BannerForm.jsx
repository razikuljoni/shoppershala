import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';

export default function BannerForm({ onSubmit, initialValues }) {
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
