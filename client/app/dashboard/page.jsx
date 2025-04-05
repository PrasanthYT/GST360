"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesOverview } from "@/components/dashboard/sales-overview";
import { RecentFiled } from "@/components/dashboard/recent-filed";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Button } from "@/components/ui/button";
import { DateRange } from "@/components/dashboard/date-range";
import { TaskSummary } from "@/components/dashboard/task-summary";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { AchievementBanner } from "@/components/dashboard/achievement-banner";
import { ShortcutsWidget } from "@/components/dashboard/shortcuts-widget";
import { SalesInsights } from "@/components/dashboard/sales-insights";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Zap,
  Trophy,
  Gift,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [streakCount, setStreakCount] = useState(12);
  const [totalPoints, setTotalPoints] = useState(1250);

  useEffect(() => {
    // Trigger confetti when the page loads
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 500);

    // Hide welcome message after a delay
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Increment points when refreshing
      setTotalPoints((prev) => prev + 10);

      // Show a small confetti burst
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: 0.95, y: 0.1 },
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in-50 duration-500">
      <AchievementBanner />

      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm dark:from-blue-950/50 dark:to-indigo-950/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">Welcome back, Rahul!</h3>
                <p className="text-sm text-muted-foreground">
                  You're on a {streakCount}-day login streak! 🔥
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setShowWelcome(false)}
            >
              <Gift className="h-4 w-4" />
              <span>Claim Bonus</span>
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Dashboard
            </h1>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 gap-1"
            >
              <Trophy className="h-3 w-3" />
              <span className="text-xs">{totalPoints} Points</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's an overview of your business performance.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DateRange />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative overflow-hidden"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {!isRefreshing && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
            )}
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
      </div>

      <DashboardStats />

      {/* Shortcuts Widget */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <ShortcutsWidget />
        </CardContent>
      </Card>

      <ProgressTracker />

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList className="h-10">
            <TabsTrigger value="overview" className="relative">
              Overview
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select defaultValue="thisMonth">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-blue-200 transition-all duration-300 hover:shadow-md hover:border-blue-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Sales Analytics
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-100 text-blue-700 border-blue-300"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Interactive
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Monthly sales performance
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SalesOverview />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sales Insights Section - Added below Sales Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <SalesInsights />
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-amber-200 transition-all duration-300 hover:shadow-md hover:border-amber-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Upcoming Tasks
                          <Badge
                            variant="outline"
                            className="ml-2 bg-amber-100 text-amber-700 border-amber-300"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Interactive
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Tasks requiring your attention
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Calendar</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TaskSummary />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden border-green-200 transition-all duration-300 hover:shadow-md hover:border-green-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Recent Filed Returns
                          <Badge
                            variant="outline"
                            className="ml-2 bg-green-100 text-green-700 border-green-300"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Interactive
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Your recently filed GST returns
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecentFiled />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed business performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Advanced analytics module coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                  Comprehensive business reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Financial reports module coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
