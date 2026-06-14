import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(99,102,241,0.25)] bg-[rgba(99,102,241,0.15)] text-[hsl(243_75%_78%)]',
        secondary:
          'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]',
        destructive: 'border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.12)] text-[#f87171]',
        success: 'border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.12)] text-[#34d399]',
        warning: 'border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.12)] text-[#fbbf24]',
        outline: 'border-[var(--color-border)] text-[var(--color-muted-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
