"use client";

import { useEffect, useState } from "react";
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
  { name: "Apr", sales: 124000 },
  { name: "May", sales: 168000 },
  { name: "Jun", sales: 145000 },
  { name: "Jul", sales: 189000 },
  { name: "Aug", sales: 176000 },
  { name: "Sep", sales: 198000 },
  { name: "Oct", sales: 210000 },
  { name: "Nov", sales: 185000 },
  { name: "Dec", sales: 0 },
  { name: "Jan", sales: 0 },
  { name: "Feb", sales: 0 },
  { name: "Mar", sales: 0 },
];

export function SalesOverview() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium">Sales</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Financial Year 2023-24
        </div>
      </div>

      <div
        className={`h-[220px] w-full transition-opacity duration-500 ${
          isAnimated ? "opacity-100" : "opacity-0"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <Tooltip
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Sales",
              ]}
              labelFormatter={(label) => `${label} 2023`}
              contentStyle={{
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              fill="url(#colorSales)"
              stroke="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
