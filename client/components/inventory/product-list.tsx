"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/contexts/inventory-context";

interface ProductListProps {
  filter?: "all" | "low-stock" | "out-of-stock";
  searchQuery?: string;
}

export function ProductList({
  filter = "all",
  searchQuery = "",
}: ProductListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { products, deleteProduct, adjustStock, loading } = useInventory();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);

  // Filter products based on the selected filter and search query
  const filteredProducts = products
    .filter((product) => {
      // Apply filter
      if (filter === "low-stock") {
        return product.quantity <= product.reorderLevel && product.quantity > 0;
      } else if (filter === "out-of-stock") {
        return product.quantity === 0;
      }
      return true;
    })
    .filter((product) => {
      // Apply search query
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    });

  const handleEdit = (product: any) => {
    router.push(`/dashboard/inventory/edit-product/${product.id}`);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been deleted successfully.`,
        variant: "success",
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleStockAdjustment = (product: any) => {
    setSelectedProduct(product);
    setStockAdjustment(0);
    setStockDialogOpen(true);
  };

  const confirmStockAdjustment = () => {
    if (selectedProduct && stockAdjustment !== 0) {
      adjustStock(selectedProduct.id, stockAdjustment);
      toast({
        title: "Stock Updated",
        description: `${selectedProduct.name} stock ${
          stockAdjustment > 0 ? "increased" : "decreased"
        } by ${Math.abs(stockAdjustment)}.`,
        variant: "success",
      });
    }
    setStockDialogOpen(false);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>GST</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage
                          src={
                            product.images[0] ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.name}
                        />
                        <AvatarFallback className="rounded-md bg-primary/10">
                          {product.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ₹{product.mrp.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CP: ₹{product.costPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {product.totalGstRate * 100}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {product.quantity <= product.reorderLevel ? (
                        <Badge
                          variant={
                            product.quantity === 0 ? "destructive" : "outline"
                          }
                          className={
                            product.quantity === 0
                              ? ""
                              : "bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                          }
                        >
                          {product.quantity === 0 ? (
                            "Out of Stock"
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3" />
                              <span>Low Stock: {product.quantity}</span>
                            </>
                          )}
                        </Badge>
                      ) : (
                        <span className="font-medium">{product.quantity}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStockAdjustment(product)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Stock</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/dashboard/inventory/view-product/${product.id}`
                          )
                        }
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStockAdjustment(product)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
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
              Update the stock quantity for "{selectedProduct?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label className="text-right w-24">Current Stock:</Label>
              <span className="font-medium">
                {selectedProduct?.quantity || 0}
              </span>
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
                  disabled={stockAdjustment <= -selectedProduct?.quantity}
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
                    if (value >= -selectedProduct?.quantity) {
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
                {(selectedProduct?.quantity || 0) + stockAdjustment}
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
    </>
  );
}
