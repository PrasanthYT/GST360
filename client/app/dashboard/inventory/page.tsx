"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Truck,
  RefreshCw,
} from "lucide-react";
import { ProductList } from "@/components/inventory/product-list";
import { ProductFilters } from "@/components/inventory/product-filters";
import { DateRange } from "@/components/dashboard/date-range";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/contexts/inventory-context";

export default function InventoryPage() {
  const router = useRouter();
  const { products } = useInventory();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  // Calculate inventory stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p) => p.quantity <= p.reorderLevel && p.quantity > 0
  ).length;
  const outOfStockItems = products.filter((p) => p.quantity === 0).length;
  const inventoryValue = products.reduce(
    (total, p) => total + p.costPrice * p.quantity,
    0
  );
  const categories = [...new Set(products.map((p) => p.category))].length;

  const handleAddProduct = () => {
    router.push("/dashboard/inventory/add-product");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Inventory Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your products, stock levels, and inventory insights
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <Card className="border-blue-200 hover:border-blue-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Across {categories} categories
                </span>
                <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1"
        >
          <Card className="border-amber-200 hover:border-amber-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Below reorder level
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-auto gap-1 text-xs text-amber-600"
                >
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="border-green-200 hover:border-green-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{inventoryValue.toLocaleString()}
              </div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Total value of inventory
                </span>
                <Badge className="ml-2 bg-green-100 text-green-700 border-green-200">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5.2%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="border-purple-200 hover:border-purple-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockItems}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Items need reordering
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-auto gap-1 text-xs text-purple-600"
                >
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products by name, SKU, or category..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <DateRange className="hidden md:block" />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border rounded-lg p-4 bg-card"
        >
          <ProductFilters />
        </motion.div>
      )}

      {/* Product List */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>

          <Select
            defaultValue="newest"
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-4">
          <ProductList searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="low-stock" className="mt-4">
          <ProductList filter="low-stock" searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="out-of-stock" className="mt-4">
          <ProductList filter="out-of-stock" searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
