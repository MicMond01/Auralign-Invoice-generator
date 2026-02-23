import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 41000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 58000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 84320 },
];

const RevenueChart = () => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <defs>
        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}   />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false}
        tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
      <Tooltip
        formatter={(v: any) => [`$${Number(v || 0).toLocaleString()}`, "Revenue"]}
        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
      />
      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revGradient)" />
    </AreaChart>
  </ResponsiveContainer>
);

export default RevenueChart;
