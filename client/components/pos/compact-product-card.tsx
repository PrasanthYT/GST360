"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, AlertTriangle, ImageOff } from "lucide-react";
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
  // Client-side state for image loading
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine stock status
  const isOutOfStock = product.quantity <= 0;
  const isLowStock =
    product.quantity > 0 && product.quantity <= product.reorderLevel;

  // Default placeholder
  const placeholderImage = "/placeholder.svg?height=80&width=80";

  // Use placeholder if image fails to load
  const imageUrl = imageError
    ? placeholderImage
    : product.images[0] || placeholderImage;

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
        {/* Product Image - Full height */}
        <div className="relative w-20 h-full flex-shrink-0 bg-muted">
          {mounted ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
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
