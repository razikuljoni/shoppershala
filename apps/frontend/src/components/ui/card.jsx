import { cn } from '@/lib/utils';

const Card = ({ className, ref, ...props }) => (
  <div
    ref={ref}
    className={cn(
      'rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] backdrop-blur-xl shadow-sm transition-all duration-200',
      className,
    )}
    {...props}
  />
);
Card.displayName = 'Card';

const CardHeader = ({ className, ref, ...props }) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, ref, children, ...props }) => (
  <h3
    ref={ref}
    className={cn(
      'font-[var(--font-display)] text-lg font-bold text-[var(--color-foreground)]',
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({ className, ref, ...props }) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--color-muted-foreground)]', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ className, ref, ...props }) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ className, ref, ...props }) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
