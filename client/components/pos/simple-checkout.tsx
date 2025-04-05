"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Landmark,
  Check,
  Receipt,
  Printer,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import type { Product } from "@/contexts/inventory-context";

interface POSSimpleCheckoutProps {
  cartItems: { product: Product; quantity: number }[];
  subtotal: number;
  gstAmount: number;
  total: number;
  customer: any;
  onClose: () => void;
  onComplete: (paymentMethod: string) => void;
}

export function POSSimpleCheckout({
  cartItems,
  subtotal,
  gstAmount,
  total,
  customer,
  onClose,
  onComplete,
}: POSSimpleCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      // Simulate receipt printing delay
      setTimeout(() => {
        onComplete(paymentMethod);
      }, 1500);
    }, 1500);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Checkout</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-4 pt-2">
            {/* Customer Information */}
            {customer && (
              <div>
                <h3 className="text-sm font-medium mb-2">Customer</h3>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {customer.phone && `${customer.phone} • `}
                      {customer.gstin && `GSTIN: ${customer.gstin}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div>
              <h3 className="text-sm font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="font-medium">{quantity}x</span>{" "}
                      {product.name}
                    </span>
                    <span className="font-medium ml-4">
                      ₹{(product.mrp * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-3 gap-3"
              >
                <div>
                  <RadioGroupItem
                    value="card"
                    id="payment-card"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="payment-card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-2 h-6 w-6" />
                    Card
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="cash"
                    id="payment-cash"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="payment-cash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Wallet className="mb-2 h-6 w-6" />
                    Cash
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="bank"
                    id="payment-bank"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="payment-bank"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Landmark className="mb-2 h-6 w-6" />
                    Bank
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="gap-2 min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your transaction has been completed successfully.
            </p>

            <div className="w-full space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => onComplete(paymentMethod)}
              >
                <Receipt className="h-4 w-4" />
                View Receipt
              </Button>

              <Button
                className="w-full gap-2"
                onClick={() => onComplete(paymentMethod)}
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
