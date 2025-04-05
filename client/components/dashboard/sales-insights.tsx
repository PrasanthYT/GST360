"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
} from "lucide-react";

export function SalesInsights() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="overflow-hidden border-blue-200 transition-all duration-300 hover:shadow-md hover:border-blue-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Sales Insights
              <Badge
                variant="outline"
                className="ml-2 bg-blue-100 text-blue-700 border-blue-300"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                New
              </Badge>
            </CardTitle>
            <CardDescription>
              Detailed analysis of your sales performance
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-4">
            <TabsList className="h-10 w-full justify-start bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className={`rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                  activeTab === "overview" ? "border-primary" : ""
                }`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className={`rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                  activeTab === "products" ? "border-primary" : ""
                }`}
              >
                Top Products
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className={`rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                  activeTab === "customers" ? "border-primary" : ""
                }`}
              >
                Top Customers
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="p-4 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InsightCard
                title="Total Revenue"
                value="₹14,85,430"
                change={8.2}
                icon={DollarSign}
                color="text-green-600"
                bgColor="bg-green-100"
              />
              <InsightCard
                title="Average Order"
                value="₹12,450"
                change={3.1}
                icon={DollarSign}
                color="text-blue-600"
                bgColor="bg-blue-100"
              />
              <InsightCard
                title="Conversion Rate"
                value="24.8%"
                change={-2.3}
                icon={Percent}
                color="text-amber-600"
                bgColor="bg-amber-100"
              />
              <InsightCard
                title="Growth Rate"
                value="18.5%"
                change={5.4}
                icon={TrendingUp}
                color="text-indigo-600"
                bgColor="bg-indigo-100"
              />
            </div>
          </TabsContent>
          <TabsContent value="products" className="p-4 pt-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{product.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      {product.growth > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">
                            +{product.growth}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-600" />
                          <span className="text-red-600">
                            {product.growth}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="customers" className="p-4 pt-6">
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{customer.spent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function InsightCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgColor,
}: InsightCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className={`rounded-full ${bgColor} p-1.5`}>
          <Icon className={`h-3.5 w-3.5 ${color}`} />
        </div>
        <div className="flex items-center gap-1 text-xs">
          {change > 0 ? (
            <>
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{change}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span className="text-red-600">{change}%</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

const topProducts = [
  {
    name: "Laptop - Model X",
    category: "Electronics",
    revenue: 245000,
    growth: 12.5,
  },
  { name: "Office Chair", category: "Furniture", revenue: 128000, growth: 8.3 },
  {
    name: "Accounting Software License",
    category: "Software",
    revenue: 98500,
    growth: -2.1,
  },
  {
    name: "Printer Ink Cartridge",
    category: "Office Supplies",
    revenue: 76200,
    growth: 5.7,
  },
];

const topCustomers = [
  { name: "ABC Enterprises", location: "Mumbai", spent: 345000, orders: 28 },
  { name: "XYZ Corporation", location: "Delhi", spent: 287500, orders: 23 },
  {
    name: "Global Solutions Ltd",
    location: "Bangalore",
    spent: 124800,
    orders: 15,
  },
  { name: "Tech Innovators", location: "Hyderabad", spent: 98700, orders: 12 },
];
