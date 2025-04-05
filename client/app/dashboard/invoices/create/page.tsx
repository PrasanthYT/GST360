"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Save, Download, Send } from "lucide-react";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock customer data
  const customers = [
    { id: "1", name: "ABC Enterprises", gstin: "27AAPFU0939F1ZV" },
    { id: "2", name: "XYZ Corporation", gstin: "29AAPFU0939F1ZT" },
    { id: "3", name: "Global Solutions Ltd", gstin: "07AAPFU0939F1ZU" },
    { id: "4", name: "Tech Innovators", gstin: "33AAPFU0939F1ZS" },
  ];

  // Mock product data
  const products = [
    {
      id: "1",
      name: "Laptop - Model X",
      hsn: "8471",
      price: 45000,
      gstRate: 18,
    },
    { id: "2", name: "Office Chair", hsn: "9401", price: 5200, gstRate: 18 },
    {
      id: "3",
      name: "Printer Ink Cartridge",
      hsn: "3215",
      price: 1200,
      gstRate: 12,
    },
    {
      id: "4",
      name: "Accounting Software License",
      hsn: "8523",
      price: 8500,
      gstRate: 18,
    },
  ];

  // Invoice items state
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: "1",
      product: "1",
      description: "Laptop - Model X",
      quantity: 1,
      price: 45000,
      gstRate: 18,
      total: 45000,
    },
  ]);

  // Add new item to invoice
  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: `item-${Date.now()}`,
        product: "",
        description: "",
        quantity: 1,
        price: 0,
        gstRate: 18,
        total: 0,
      },
    ]);
  };

  // Remove item from invoice
  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  // Update item in invoice
  const updateInvoiceItem = (id: string, field: string, value: any) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // If product is selected, update description, price, and gstRate
          if (field === "product" && value) {
            const selectedProduct = products.find((p) => p.id === value);
            if (selectedProduct) {
              updatedItem.description = selectedProduct.name;
              updatedItem.price = selectedProduct.price;
              updatedItem.gstRate = selectedProduct.gstRate;
            }
          }

          // Recalculate total
          updatedItem.total = updatedItem.quantity * updatedItem.price;

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Calculate invoice totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = invoiceItems.reduce(
    (sum, item) => sum + (item.total * item.gstRate) / 100,
    0
  );
  const total = subtotal + gstAmount;

  const handleSave = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/invoices");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Invoice
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/invoices")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Invoice
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="preview">Preview & Send</TabsTrigger>
        </TabsList>

        {/* Invoice Details Tab */}
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Invoice Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Basic invoice details
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-number">Invoice Number</Label>
                      <Input id="invoice-number" defaultValue="INV-2023-011" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-type">Invoice Type</Label>
                      <Select defaultValue="tax">
                        <SelectTrigger id="invoice-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tax">Tax Invoice</SelectItem>
                          <SelectItem value="proforma">
                            Proforma Invoice
                          </SelectItem>
                          <SelectItem value="credit">Credit Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-date">Invoice Date</Label>
                      <DatePicker date={new Date()} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <DatePicker
                        date={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">
                      Reference / PO Number (Optional)
                    </Label>
                    <Input
                      id="reference"
                      placeholder="Enter reference or PO number"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Customer Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Select or add customer details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input id="gstin" defaultValue="27AAPFU0939F1ZV" readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-address">Billing Address</Label>
                    <Textarea
                      id="billing-address"
                      defaultValue="123 Business Park, Sector 5, Noida, Uttar Pradesh, 201301"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setActiveTab("items")}>
                  Continue to Line Items
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Line Items Tab */}
        <TabsContent value="items" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead>Total (₹)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            value={item.product}
                            onValueChange={(value) =>
                              updateInvoiceItem(item.id, "product", value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">
                                Custom Item
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "quantity",
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16"
                            min="1"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "price",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.gstRate.toString()}
                            onValueChange={(value) =>
                              updateInvoiceItem(
                                item.id,
                                "gstRate",
                                Number.parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="GST %" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{item.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInvoiceItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={addInvoiceItem}
              >
                <Plus className="h-4 w-4" /> Add Item
              </Button>

              <div className="mt-6 flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST:</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Details
                </Button>
                <Button onClick={() => setActiveTab("preview")}>
                  Continue to Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Invoice Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600">
                      TAX INVOICE
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Invoice #: INV-2023-011
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due Date:{" "}
                      {new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold">Your Company Name</h3>
                    <p className="text-sm">123 Your Street, City</p>
                    <p className="text-sm">State, PIN: 123456</p>
                    <p className="text-sm">GSTIN: 27AAPFU0939F1ZV</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground">
                      Bill To:
                    </h3>
                    <p className="font-medium">ABC Enterprises</p>
                    <p className="text-sm">123 Business Park, Sector 5</p>
                    <p className="text-sm">Noida, Uttar Pradesh, 201301</p>
                    <p className="text-sm">GSTIN: 27AAPFU0939F1ZV</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground">
                      Ship To:
                    </h3>
                    <p className="font-medium">ABC Enterprises</p>
                    <p className="text-sm">123 Business Park, Sector 5</p>
                    <p className="text-sm">Noida, Uttar Pradesh, 201301</p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">
                            Price (₹)
                          </TableHead>
                          <TableHead className="text-right">GST %</TableHead>
                          <TableHead className="text-right">
                            Total (₹)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.description}
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{item.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.gstRate}%
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{item.total.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST:</span>
                        <span>₹{gstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-4">
                  <h3 className="font-bold text-sm">Notes:</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thank you for your business!
                  </p>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-sm">Terms & Conditions:</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment is due within 30 days.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("items")}>
                  Back to Items
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Send className="h-4 w-4" /> Send to Customer
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
