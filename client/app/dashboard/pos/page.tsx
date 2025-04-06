"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Package,
  Users,
  UserPlus,
  BarChart3,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory, type Product } from "@/contexts/inventory-context";
import { CompactProductCard } from "@/components/pos/compact-product-card";
import { POSSimpleCart } from "@/components/pos/simple-cart";
import { POSSimpleCheckout } from "@/components/pos/simple-checkout";
import { POSCustomerSelect } from "@/components/pos/customer-select";
import { POSDemandInsights } from "@/components/pos/demand-insights-inline";
import { useToast } from "@/hooks/use-toast";

// Mock customer data
const mockCustomers = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    gstin: "27AAPFU0939F1ZV",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "9876543211",
    email: "priya@example.com",
    gstin: "29AAPFU0939F1ZT",
  },
  {
    id: "3",
    name: "Amit Kumar",
    phone: "9876543212",
    email: "amit@example.com",
    gstin: "07AAPFU0939F1ZU",
  },
];

export default function POSPage() {
  const router = useRouter();
  const { products } = useInventory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [points, setPoints] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  // Add a debug section to show all available products
  const [showDebug, setShowDebug] = useState(false);

  // Get unique categories from products
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ].filter(Boolean);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        // Check if we have enough stock
        if (existingItem.quantity >= product.quantity) {
          toast({
            title: "Stock limit reached",
            description: `Only ${product.quantity} units available in stock.`,
            variant: "destructive",
          });
          return prev;
        }

        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQuantity > product.quantity) {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.quantity} units available in stock.`,
        variant: "destructive",
      });
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.mrp * item.quantity,
    0
  );
  const gstAmount = cartItems.reduce((sum, item) => {
    const itemTotal = item.product.mrp * item.quantity;
    return sum + itemTotal * item.product.totalGstRate;
  }, 0);
  const total = subtotal + gstAmount;

  // Handle checkout
  const handleCheckout = () => {
    if (!selectedCustomer) {
      setShowCustomerSelect(true);
    } else {
      setShowCheckout(true);
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setShowCustomerSelect(false);

    if (cartItems.length > 0) {
      setShowCheckout(true);
    }
  };

  // Complete transaction
  const completeTransaction = (paymentMethod: string) => {
    // In a real app, this would process the payment and update inventory
    toast({
      title: "Sale complete!",
      description: `Payment of ₹${total.toFixed(2)} processed successfully.`,
      variant: "success",
    });

    // Clear cart and reset checkout
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Quick Sale</h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2 ml-auto md:ml-0"
            onClick={() => setShowCustomerSelect(true)}
          >
            {selectedCustomer ? (
              <>
                <Users className="h-4 w-4" />
                {selectedCustomer.name}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Add Customer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products section - takes 2/3 of the screen */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and category filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
                className="ml-auto"
              >
                {showDebug ? "Hide" : "Show"} All Products ({products.length})
              </Button>
            </div>
          </div>

          {/* Products grid */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <CompactProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {showDebug && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  All Products in Inventory ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {products.map((product) => (
                    <div key={product.id} className="p-2 border rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-blue-600">
                          ₹{product.mrp.toFixed(0)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        SKU: {product.sku} | Category: {product.category} |
                        Stock: {product.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demand Insights Section - Below Products */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Demand Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <POSDemandInsights />
            </CardContent>
          </Card>
        </div>

        {/* Cart section - takes 1/3 of the screen */}
        <div>
          <POSSimpleCart
            cartItems={cartItems}
            updateQuantity={updateCartItemQuantity}
            removeItem={removeFromCart}
            clearCart={clearCart}
            subtotal={subtotal}
            gstAmount={gstAmount}
            total={total}
            onCheckout={handleCheckout}
            customer={selectedCustomer}
            onChangeCustomer={() => setShowCustomerSelect(true)}
          />
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <POSSimpleCheckout
          cartItems={cartItems}
          subtotal={subtotal}
          gstAmount={gstAmount}
          total={total}
          customer={selectedCustomer}
          onClose={() => setShowCheckout(false)}
          onComplete={completeTransaction}
        />
      )}

      {/* Customer selection modal */}
      {showCustomerSelect && (
        <POSCustomerSelect
          customers={mockCustomers}
          onSelect={handleCustomerSelect}
          onClose={() => setShowCustomerSelect(false)}
        />
      )}
    </div>
  );
}
