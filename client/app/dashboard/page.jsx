"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesOverview } from "@/components/dashboard/sales-overview"
import { RecentFiled } from "@/components/dashboard/recent-filed"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Button } from "@/components/ui/button"
import { DateRange } from "@/components/dashboard/date-range"
import { TaskSummary } from "@/components/dashboard/task-summary"
import { Calendar, Download, FileText, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's an overview of your business performance.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DateRange />
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
      </div>

      <DashboardStats />

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList className="h-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
            <Card className="md:h-[350px]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>Monthly sales performance</CardDescription>
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
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Tasks</CardTitle>
                      <CardDescription>Tasks requiring your attention</CardDescription>
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Filed Returns</CardTitle>
                  <CardDescription>Your recently filed GST returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentFiled />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed business performance insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Advanced analytics module coming soon</p>
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
                <CardDescription>Comprehensive business reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Financial reports module coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

