"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Receipt,
  UserPlus,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/contexts/inventory-context";

interface POSSimpleCartProps {
  cartItems: { product: Product; quantity: number }[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  gstAmount: number;
  total: number;
  onCheckout: () => void;
  customer: any;
  onChangeCustomer: () => void;
}

export function POSSimpleCart({
  cartItems,
  updateQuantity,
  removeItem,
  clearCart,
  subtotal,
  gstAmount,
  total,
  onCheckout,
  customer,
  onChangeCustomer,
}: POSSimpleCartProps) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="h-full sticky top-20">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </CardTitle>
          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Customer Section */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Customer</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeCustomer}
            className="h-7 gap-1 text-xs"
          >
            {customer ? "Change" : "Add"}
          </Button>
        </div>

        {customer ? (
          <div className="mt-1 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-sm">{customer.name}</div>
              <div className="text-xs text-muted-foreground">
                {customer.phone}
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-1 gap-2 text-sm h-9"
            onClick={onChangeCustomer}
          >
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        )}
      </div>

      <CardContent className="p-0">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">
              Add products to begin checkout
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-26rem)]">
            <AnimatePresence initial={false}>
              {cartItems.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 border-b"
                >
                  <div className="flex gap-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted flex-shrink-0">
                      <Image
                        src={
                          product.images[0] ||
                          "/placeholder.svg?height=48&width=48"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {product.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-r-none"
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <div className="flex h-6 w-6 items-center justify-center text-xs font-medium">
                            {quantity}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-l-none"
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium text-sm">
                            ₹{(product.mrp * quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ₹{product.mrp.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="flex flex-col p-4 border-t mt-auto">
        <div className="space-y-1.5 w-full mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={cartItems.length === 0}
          >
            <Receipt className="h-4 w-4" />
            Save
          </Button>

          <Button
            className="w-full gap-2"
            size="default"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            <CreditCard className="h-4 w-4" />
            Checkout
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
