import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton rounded-[var(--radius-sm)]', className)} {...props} />;
}

export { Skeleton };
