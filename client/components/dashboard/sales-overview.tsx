"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    setIsAnimated(true);

    // Show insights after chart animation
    const timer = setTimeout(() => {
      setShowInsights(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseOver = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setActiveMonth(data.activePayload[0].payload.name);
    }
  };

  const handleMouseLeave = () => {
    setActiveMonth(null);
  };

  // Calculate growth percentage
  const currentMonth = data[7]; // November
  const previousMonth = data[6]; // October
  const growthPercentage =
    ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium">Sales</span>
          </div>

          <Badge
            variant="outline"
            className="ml-2 gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px]">
              {growthPercentage.toFixed(1)}% vs last month
            </span>
          </Badge>
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
            onMouseMove={handleMouseOver}
            onMouseLeave={handleMouseLeave}
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
              activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 rounded-lg border bg-blue-50 p-2 dark:bg-blue-900/20"
        >
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-800">
              <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-medium text-blue-800 dark:text-blue-300">
                Sales Insight {activeMonth ? `for ${activeMonth}` : ""}
              </h4>
              <p className="text-[10px] text-blue-700 dark:text-blue-400">
                {activeMonth
                  ? `${activeMonth} shows ${
                      activeMonth === "Nov"
                        ? "a 12% decrease from October"
                        : "strong performance"
                    }`
                  : "November shows a 12% decrease from October. Consider running promotions to boost sales."}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 rounded-full bg-white px-2 py-1 text-[10px] text-blue-700 shadow-sm dark:bg-blue-800 dark:text-blue-300"
            >
              <span>Details</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
