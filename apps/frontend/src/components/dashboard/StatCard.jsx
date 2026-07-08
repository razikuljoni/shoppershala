import { Card } from '@/components/ui/card';

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-[var(--color-primary)]',
  iconBg = 'bg-[rgba(99,102,241,0.15)]',
}) {
  return (
    <Card className="stat-card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <p className="text-xs text-(--color-muted-foreground) uppercase tracking-wider font-semibold mb-0.5">
            {label}
          </p>
          <p
            className="text-2xl font-bold text-(--color-foreground)"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
