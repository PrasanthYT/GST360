"use client";

import {
  ShoppingCart,
  AlertTriangle,
  Package,
  Smartphone,
  Shirt,
  Coffee,
  Utensils,
  BookOpen,
  Laptop,
  Home,
  Gift,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/contexts/inventory-context";

interface CompactProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function CompactProductCard({
  product,
  onAddToCart,
}: CompactProductCardProps) {
  // Determine stock status
  const isOutOfStock = product.quantity <= 0;
  const isLowStock =
    product.quantity > 0 && product.quantity <= product.reorderLevel;

  // Get appropriate icon based on product category
  const getProductIcon = () => {
    const category = product.category?.toLowerCase() || "";

    if (category.includes("electronics") || category.includes("gadget")) {
      return <Smartphone className="h-8 w-8" />;
    } else if (category.includes("clothing") || category.includes("apparel")) {
      return <Shirt className="h-8 w-8" />;
    } else if (category.includes("food") || category.includes("grocery")) {
      return <Coffee className="h-8 w-8" />;
    } else if (category.includes("kitchen") || category.includes("dining")) {
      return <Utensils className="h-8 w-8" />;
    } else if (category.includes("book") || category.includes("stationery")) {
      return <BookOpen className="h-8 w-8" />;
    } else if (category.includes("computer") || category.includes("laptop")) {
      return <Laptop className="h-8 w-8" />;
    } else if (category.includes("home") || category.includes("furniture")) {
      return <Home className="h-8 w-8" />;
    } else if (category.includes("gift") || category.includes("toy")) {
      return <Gift className="h-8 w-8" />;
    } else {
      return <Package className="h-8 w-8" />;
    }
  };

  return (
    <Card
      className={`overflow-hidden border transition-all hover:shadow-sm h-20 ${
        isOutOfStock
          ? "border-red-200 bg-red-50/50 dark:bg-red-950/10"
          : isLowStock
          ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10"
          : "border-green-200 hover:border-green-300"
      }`}
    >
      <div className="flex h-full">
        {/* Product Icon - Full height */}
        <div className="w-20 h-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          {getProductIcon()}
        </div>

        {/* Product Details - Centered content */}
        <div className="flex-1 p-3 flex flex-col justify-center h-full">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium text-sm line-clamp-1 mr-2">
              {product.name}
            </h3>
            <span className="text-sm font-bold whitespace-nowrap">
              ₹{product.mrp.toFixed(0)}
            </span>
          </div>

          <div className="text-xs text-muted-foreground mt-1">
            SKU: {product.sku} | {product.category}
          </div>

          <div className="flex justify-between items-center w-full mt-2">
            <div className="text-xs text-muted-foreground">
              {isOutOfStock ? (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Out of stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Low stock: {product.quantity}
                </span>
              ) : (
                <span className="text-green-600">
                  In stock: {product.quantity}
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant={isOutOfStock ? "outline" : "default"}
              disabled={isOutOfStock}
              onClick={onAddToCart}
              className="h-7 px-3 text-xs ml-2"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
