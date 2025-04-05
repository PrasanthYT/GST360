"use client"

import Image from "next/image"
import { ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/contexts/inventory-context"

interface CompactProductCardProps {
  product: Product
  onAddToCart: () => void
}

export function CompactProductCard({ product, onAddToCart }: CompactProductCardProps) {
  // Determine stock status
  const isOutOfStock = product.quantity <= 0
  const isLowStock = product.quantity > 0 && product.quantity <= product.reorderLevel

  return (
    <Card
      className={`overflow-hidden border transition-all h-16 ${
        isOutOfStock
          ? "border-red-200 bg-red-50/50 dark:bg-red-950/10"
          : isLowStock
            ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10"
            : "border-green-200 hover:border-green-300"
      }`}
    >
      <div className="flex h-full">
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg?height=64&width=64"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <CardContent className="flex-1 p-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
            <span className="text-sm font-bold">₹{product.mrp.toFixed(0)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {isOutOfStock ? (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Out of stock
                </span>
              ) : (
                <span>Stock: {product.quantity}</span>
              )}
            </div>

            <Button
              size="sm"
              variant={isOutOfStock ? "outline" : "default"}
              disabled={isOutOfStock}
              onClick={onAddToCart}
              className="h-6 px-2 text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

