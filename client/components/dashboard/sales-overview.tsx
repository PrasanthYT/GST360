"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Apr",
    sales: 124000,
  },
  {
    name: "May",
    sales: 168000,
  },
  {
    name: "Jun",
    sales: 145000,
  },
  {
    name: "Jul",
    sales: 189000,
  },
  {
    name: "Aug",
    sales: 176000,
  },
  {
    name: "Sep",
    sales: 198000,
  },
  {
    name: "Oct",
    sales: 210000,
  },
  {
    name: "Nov",
    sales: 185000,
  },
  {
    name: "Dec",
    sales: 0,
  },
  {
    name: "Jan",
    sales: 0,
  },
  {
    name: "Feb",
    sales: 0,
  },
  {
    name: "Mar",
    sales: 0,
  },
];

export function SalesOverview() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => [
              `₹${value.toLocaleString()}`,
              "Sales",
            ]}
            labelFormatter={(label) => `${label} 2023`}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            fill="url(#colorSales)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
