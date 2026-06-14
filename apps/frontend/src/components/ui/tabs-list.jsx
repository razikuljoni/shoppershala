import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const TabsList = ({ className, ref, ...props }) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-start rounded-[var(--radius-sm)] bg-[var(--color-muted)] p-1 text-[var(--color-muted-foreground)]',
      className,
    )}
    {...props}
  />
);
TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
