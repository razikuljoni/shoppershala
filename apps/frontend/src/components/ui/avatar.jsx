import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const Avatar = ({ className, ref, ...props }) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
export { AvatarImage } from './avatar-image';
export { AvatarFallback } from './avatar-fallback';
