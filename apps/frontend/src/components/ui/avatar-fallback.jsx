import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const AvatarFallback = ({ className, ref, ...props }) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.35)] text-[hsl(243_75%_78%)] font-bold text-sm',
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarFallback };
