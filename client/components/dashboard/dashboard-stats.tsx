"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStats() {
  const [mounted, setMounted] = useState(false);

  // Simulate loading animation of numbers
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card
          key={stat.title}
          className={cn(
            "overflow-hidden transition-all hover:shadow-md",
            !mounted && "opacity-0 translate-y-4",
            mounted &&
              `opacity-100 translate-y-0 transition-all duration-300 delay-${
                index * 100
              }`
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </span>
                  {stat.percentageChange && (
                    <span
                      className={cn(
                        "ml-1 text-xs font-medium",
                        stat.percentageChange > 0
                          ? "text-green-500"
                          : stat.percentageChange < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      )}
                    >
                      <span className="flex items-center">
                        {stat.percentageChange > 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(stat.percentageChange)}%
                      </span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {stat.subtext}
                </span>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  stat.iconBg
                )}
              >
                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
              </div>
            </div>
            {stat.progress !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{stat.progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", stat.progressColor)}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const statsData = [
  {
    title: "Total Sales",
    value: "₹14,85,430",
    percentageChange: 8.2,
    subtext: "vs. ₹13,72,450 last month",
    icon: TrendingUp,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    progress: 82,
    progressColor: "bg-blue-500",
  },
  {
    title: "Total Invoices",
    value: "1,284",
    percentageChange: 12.5,
    subtext: "vs. 1,141 last month",
    icon: FileText,
    iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    progress: 78,
    progressColor: "bg-indigo-500",
  },
  {
    title: "Filing Compliance",
    value: "96.5%",
    percentageChange: 2.8,
    subtext: "All returns up to date",
    icon: CheckCircle2,
    iconBg: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    progress: 96.5,
    progressColor: "bg-green-500",
  },
  {
    title: "Pending Tasks",
    value: "4",
    percentageChange: -33.3,
    subtext: "2 urgent tasks due soon",
    icon: Clock,
    iconBg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    progress: 40,
    progressColor: "bg-orange-500",
  },
];
