import { use } from 'react';

// Lazy-load recharts (~400kB) — only fetched when a chart component first renders
const rechartsPromise = import('recharts');

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

const tooltipStyle = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#f8fafc',
};

/* ---------------------------------------------------------------
   Revenue Area Chart (Recharts)
   --------------------------------------------------------------- */
export function TrendChart({ monthlySalesTrend }) {
  const { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } =
    use(rechartsPromise);

  if (!Array.isArray(monthlySalesTrend) || monthlySalesTrend.length === 0) {
    return (
      <p className="text-sm text-(--color-muted-foreground) text-center py-8">
        No sales trend data yet.
      </p>
    );
  }
  const data = Array.from({ length: 12 }).map((_, i) => {
    const m = monthlySalesTrend.find((t) => t.month === i + 1);
    return { name: MONTH_NAMES[i], revenue: m ? m.revenue : 0 };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------
   Category Sales Pie Chart (Recharts)
   --------------------------------------------------------------- */
export function CategoryPieChart({ categorySales }) {
  const { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } = use(rechartsPromise);

  if (!Array.isArray(categorySales) || categorySales.length === 0) {
    return (
      <p className="text-sm text-(--color-muted-foreground) text-center py-6">No category data.</p>
    );
  }
  const data = categorySales.map((cat) => ({
    name: cat.categoryName,
    value: cat.revenue,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name || `cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(148,163,184,0.8)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------
   Top Products Bar Chart (Recharts)
   --------------------------------------------------------------- */
export function TopProductsBarChart({ topProducts }) {
  const { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } =
    use(rechartsPromise);

  if (!Array.isArray(topProducts) || topProducts.length === 0) {
    return <p className="text-sm text-(--color-muted-foreground)">No orders placed yet.</p>;
  }
  const data = topProducts.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
    revenue: p.revenue,
    sold: p.totalSold,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.8)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              name === 'revenue' ? `$${value.toFixed(2)}` : value,
              name === 'revenue' ? 'Revenue' : 'Units Sold',
            ]}
          />
          <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sold" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
