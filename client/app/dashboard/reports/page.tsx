"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  Percent,
  Package,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DateRange } from "react-day-picker";

// Dummy data for charts
const salesData = [
  { month: "Jan", sales: 65000 },
  { month: "Feb", sales: 59000 },
  { month: "Mar", sales: 80000 },
  { month: "Apr", sales: 81000 },
  { month: "May", sales: 56000 },
  { month: "Jun", sales: 55000 },
  { month: "Jul", sales: 40000 },
  { month: "Aug", sales: 70000 },
  { month: "Sep", sales: 90000 },
  { month: "Oct", sales: 110000 },
  { month: "Nov", sales: 95000 },
  { month: "Dec", sales: 120000 },
];

const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Furniture", value: 25 },
  { name: "Office Supplies", value: 15 },
  { name: "Software", value: 15 },
];

const taxData = [
  { month: "Jan", cgst: 5800, sgst: 5800, igst: 2400 },
  { month: "Feb", cgst: 5300, sgst: 5300, igst: 2100 },
  { month: "Mar", cgst: 7200, sgst: 7200, igst: 3000 },
  { month: "Apr", cgst: 7300, sgst: 7300, igst: 3100 },
  { month: "May", cgst: 5000, sgst: 5000, igst: 2200 },
  { month: "Jun", cgst: 4900, sgst: 4900, igst: 2000 },
  { month: "Jul", cgst: 3600, sgst: 3600, igst: 1500 },
  { month: "Aug", cgst: 6300, sgst: 6300, igst: 2600 },
  { month: "Sep", cgst: 8100, sgst: 8100, igst: 3400 },
  { month: "Oct", cgst: 9900, sgst: 9900, igst: 4100 },
  { month: "Nov", cgst: 8500, sgst: 8500, igst: 3600 },
  { month: "Dec", cgst: 10800, sgst: 10800, igst: 4500 },
];

const inventoryData = [
  { category: "Electronics", value: 245000 },
  { category: "Furniture", value: 128000 },
  { category: "Office Supplies", value: 76000 },
  { category: "Software", value: 98000 },
];

const customerGrowthData = [
  { month: "Jan", customers: 85 },
  { month: "Feb", customers: 90 },
  { month: "Mar", customers: 95 },
  { month: "Apr", customers: 100 },
  { month: "May", customers: 105 },
  { month: "Jun", customers: 110 },
  { month: "Jul", customers: 112 },
  { month: "Aug", customers: 118 },
  { month: "Sep", customers: 122 },
  { month: "Oct", customers: 125 },
  { month: "Nov", customers: 128 },
  { month: "Dec", customers: 132 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and analyze your business performance with detailed reports
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            className="w-full md:w-auto"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="sales">Sales Reports</SelectItem>
              <SelectItem value="tax">Tax Reports</SelectItem>
              <SelectItem value="inventory">Inventory Reports</SelectItem>
              <SelectItem value="customer">Customer Reports</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </p>
                <h3 className="text-2xl font-bold">₹1,24,568</h3>
                <p className="text-xs text-green-500 mt-1">
                  +12.5% from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tax Collected
                </p>
                <h3 className="text-2xl font-bold">₹22,423</h3>
                <p className="text-xs text-green-500 mt-1">
                  +8.3% from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Percent className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inventory Value
                </p>
                <h3 className="text-2xl font-bold">₹3,45,890</h3>
                <p className="text-xs text-amber-500 mt-1">
                  -2.1% from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Customers
                </p>
                <h3 className="text-2xl font-bold">128</h3>
                <p className="text-xs text-green-500 mt-1">
                  +5.7% from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Sales</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span className="hidden md:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Customer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                View your sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Sales",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                  Products with highest sales volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Product {i}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: PRD-{1000 + i}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₹{(10000 - i * 1000).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {50 - i * 5} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Distribution of sales across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary</CardTitle>
              <CardDescription>
                Overview of tax collected by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={taxData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cgst"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="CGST"
                    />
                    <Area
                      type="monotone"
                      dataKey="sgst"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="SGST"
                    />
                    <Area
                      type="monotone"
                      dataKey="igst"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="IGST"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Transactions</CardTitle>
                <CardDescription>Recent tax transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Invoice #{10000 + i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(2023, 0, i).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={i % 2 === 0 ? "default" : "outline"}>
                        {i % 2 === 0 ? "CGST" : "IGST"}
                      </Badge>
                      <p className="text-sm font-medium">
                        ₹{(i * 1250).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Current inventory levels and valuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 70,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <YAxis type="category" dataKey="category" width={100} />
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Value",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#82ca9d"
                      name="Inventory Value"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>Products that need reordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Product {i}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: PRD-{2000 + i}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">
                          Low Stock
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {i + 1} units left
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>
                  How quickly products are selling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Fast Moving", value: 60 },
                          { name: "Medium Moving", value: 25 },
                          { name: "Slow Moving", value: 15 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#facc15" />
                        <Cell fill="#f87171" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>
                New customer acquisition over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={customerGrowthData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>
                  Customers with highest purchase value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Customer {i}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: CUST-{1000 + i}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₹{(50000 - i * 5000).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {10 - i} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Repeat purchase analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "One-time", value: 40 },
                          { name: "Repeat", value: 35 },
                          { name: "Loyal", value: 25 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#93c5fd" />
                        <Cell fill="#60a5fa" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Reports generated in the last 30 days
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Monthly Sales Summary",
                type: "Sales",
                date: "2023-04-01",
              },
              { name: "Quarterly Tax Report", type: "Tax", date: "2023-03-31" },
              {
                name: "Inventory Valuation",
                type: "Inventory",
                date: "2023-03-28",
              },
              {
                name: "Customer Acquisition Report",
                type: "Customer",
                date: "2023-03-25",
              },
              {
                name: "Product Performance Analysis",
                type: "Sales",
                date: "2023-03-20",
              },
            ].map((report, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
