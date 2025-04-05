"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Package,
  Truck,
  BarChart3,
  AlertTriangle,
  FileText,
  Minus,
} from "lucide-react";
import { useInventory } from "@/contexts/inventory-context";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ViewProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { getProduct, deleteProduct, adjustStock } = useInventory();
  const productId = params.id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);

  // Get product from context
  const product = getProduct(productId);

  // If product not found, redirect to inventory page
  if (!product) {
    router.push("/dashboard/inventory");
    return null;
  }

  const handleEdit = () => {
    router.push(`/dashboard/inventory/edit-product/${productId}`);
  };

  const handleBack = () => {
    router.push("/dashboard/inventory");
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteProduct(productId);
    toast({
      title: "Product Deleted",
      description: `${product.name} has been deleted successfully.`,
      variant: "success",
    });
    router.push("/dashboard/inventory");
  };

  const handleStockAdjustment = () => {
    setStockAdjustment(0);
    setStockDialogOpen(true);
  };

  const confirmStockAdjustment = () => {
    if (stockAdjustment !== 0) {
      adjustStock(productId, stockAdjustment);
      toast({
        title: "Stock Updated",
        description: `${product.name} stock ${
          stockAdjustment > 0 ? "increased" : "decreased"
        } by ${Math.abs(stockAdjustment)}.`,
        variant: "success",
      });
    }
    setStockDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Product Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleEdit}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {product.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      In Stock: {product.quantity}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      SKU: {product.sku}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ₹{product.mrp.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cost: ₹{product.costPrice.toLocaleString()} | Margin:{" "}
                    {product.profitMargin.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & GST</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="supplier">Supplier</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Brand</h3>
                      <p className="text-sm">{product.brand}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Unit of Measure</h3>
                      <p className="text-sm">{product.uom}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Created On</h3>
                      <p className="text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Last Updated</h3>
                      <p className="text-sm">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">MRP</h3>
                      <p className="text-sm">₹{product.mrp.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Cost Price</h3>
                      <p className="text-sm">
                        ₹{product.costPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Profit Margin</h3>
                      <p className="text-sm">
                        {product.profitMargin.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">HSN Code</h3>
                      <p className="text-sm">{product.hsnCode}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">GST Rate</h3>
                      <p className="text-sm">{product.totalGstRate * 100}%</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">GST Included</h3>
                      <p className="text-sm">
                        {product.gstIncluded ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Inter-State Supply</h3>
                      <p className="text-sm">
                        {product.isInterState
                          ? "Yes (IGST)"
                          : "No (CGST + SGST)"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Tax Type</h3>
                      <p className="text-sm">{product.taxType}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Current Stock</h3>
                      <p className="text-sm">
                        {product.quantity} {product.uom}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Reorder Level</h3>
                      <p className="text-sm">
                        {product.reorderLevel} {product.uom}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Warehouse Location</h3>
                      <p className="text-sm">
                        {product.warehouseLocation || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Batch Number</h3>
                      <p className="text-sm">
                        {product.batchNo || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button className="gap-2" onClick={handleStockAdjustment}>
                      <Plus className="h-4 w-4" /> Adjust Stock
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="supplier" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Supplier</h3>
                      <p className="text-sm">
                        {product.supplier || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Supplier GSTIN</h3>
                      <p className="text-sm">
                        {product.supplierGSTIN || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Supplier Contact</h3>
                      <p className="text-sm">
                        {product.supplierContact || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Invoice Number</h3>
                      <p className="text-sm">
                        {product.invoiceNo || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Invoice Date</h3>
                      <p className="text-sm">
                        {product.invoiceDate
                          ? new Date(product.invoiceDate).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Product Image</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="rounded-md border object-contain w-full max-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleStockAdjustment}
              >
                <Plus className="h-4 w-4" /> Add Stock
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" /> Create Purchase Order
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Generate Barcode
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" /> View Sales History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Stock Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-green-100 p-1.5 text-green-600">
                  <Plus className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Stock Added</p>
                  <p className="text-xs text-muted-foreground">
                    10 units added on Nov 5, 2023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-100 p-1.5 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Reached reorder level on Oct 25, 2023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                  <Truck className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Initial Stock</p>
                  <p className="text-xs text-muted-foreground">
                    20 units added on Oct 15, 2023
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="w-full text-xs">
                View Full History
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Update the stock quantity for "{product.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label className="text-right w-24">Current Stock:</Label>
              <span className="font-medium">{product.quantity}</span>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="adjustment" className="text-right w-24">
                Adjustment:
              </Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStockAdjustment((prev) => prev - 1)}
                  disabled={stockAdjustment <= -product.quantity}
                  className="h-8 w-8 rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="adjustment"
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0;
                    if (value >= -product.quantity) {
                      setStockAdjustment(value);
                    }
                  }}
                  className="h-8 w-20 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStockAdjustment((prev) => prev + 1)}
                  className="h-8 w-8 rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-right w-24">New Stock:</Label>
              <span className="font-medium">
                {product.quantity + stockAdjustment}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStockAdjustment}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
