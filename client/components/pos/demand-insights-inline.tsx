"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function POSDemandInsights() {
  const [activeTab, setActiveTab] = useState("trending");

  // Mock data for trending products
  const trendingProducts = [
    {
      id: "1",
      name: "Laptop - Model X",
      demandScore: 92,
      trend: "up",
      percentChange: 15,
      stockStatus: "In Stock",
    },
    {
      id: "4",
      name: "Accounting Software License",
      demandScore: 87,
      trend: "up",
      percentChange: 23,
      stockStatus: "In Stock",
    },
    {
      id: "2",
      name: "Office Chair",
      demandScore: 76,
      trend: "up",
      percentChange: 8,
      stockStatus: "In Stock",
    },
  ];

  // Mock data for inventory alerts
  const inventoryAlerts = [
    {
      id: "3",
      name: "Printer Ink Cartridge",
      currentStock: 8,
      recommendedStock: 20,
      urgency: "high",
    },
    {
      id: "5",
      name: "Desk Lamp",
      currentStock: 0,
      recommendedStock: 10,
      urgency: "medium",
    },
  ];

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="trending" className="flex-1 sm:flex-none">
          Trending Products
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex-1 sm:flex-none">
          Inventory Alerts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="trending" className="mt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm line-clamp-1">
                  {product.name}
                </h3>
                {product.trend === "up" ? (
                  <Badge className="bg-green-500 text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {product.percentChange}%
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-xs">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    {product.percentChange}%
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 mb-1">
                <Progress value={product.demandScore} className="h-2" />
                <span className="text-xs font-medium w-8">
                  {product.demandScore}%
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                {product.stockStatus}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="alerts" className="mt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventoryAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`rounded-full p-1.5 ${
                    alert.urgency === "high"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{alert.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {alert.currentStock === 0
                      ? "Out of stock"
                      : `Low stock: ${alert.currentStock} units`}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs">
                  Recommended:{" "}
                  <span className="font-medium">
                    {alert.recommendedStock} units
                  </span>
                </span>
                <Button size="sm" className="h-7 gap-1 text-xs">
                  <Package className="h-3 w-3" />
                  Order
                </Button>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
