"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  AlertTriangle,
  FileCheck2,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/contexts/inventory-context";

// In a real implementation, we'd import these libraries
// import Tesseract from 'tesseract.js';
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function BillOcrParser() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [detectedProducts, setDetectedProducts] = useState<any[]>([]);
  const { toast } = useToast();
  const { addProduct } = useInventory();

  // Sample invoice parsing result - in a real implementation this would come from OCR
  const sampleExtractedData = {
    invoiceNumber: "INV-2023-0128",
    invoiceDate: "2023-10-25",
    supplierName: "Global Supplies",
    supplierGSTIN: "33AAPFU0939F1ZS",
    supplierContact: "+91 9876543213",
    products: [
      {
        name: "Desk Lamp LED",
        sku: "LT-089",
        hsn: "9405",
        quantity: 10,
        price: 550,
        gst: 12,
        total: 6160,
      },
      {
        name: "Printer Ink Cartridge HP",
        sku: "PR-103",
        hsn: "3215",
        quantity: 5,
        price: 800,
        gst: 12,
        total: 4480,
      },
      {
        name: "Notebook Premium",
        sku: "NB-042",
        hsn: "4820",
        quantity: 20,
        price: 120,
        gst: 12,
        total: 2688,
      },
    ],
    totalAmount: 13328,
    totalGST: 1428,
    grandTotal: 14756,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setExtractedData(null);
      setDetectedProducts([]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);

    // In a real implementation, this would use Tesseract.js and PDF.js
    // For this demo, we'll simulate the OCR process with a delay
    setTimeout(() => {
      setExtractedData(sampleExtractedData);
      setDetectedProducts(sampleExtractedData.products);
      setIsProcessing(false);

      toast({
        title: "Bill Processed Successfully",
        description: `Detected ${sampleExtractedData.products.length} products in invoice ${sampleExtractedData.invoiceNumber}`,
        variant: "success",
      });
    }, 2000);
  };

  const handleAddToInventory = () => {
    if (!detectedProducts.length) return;

    try {
      // Add each detected product to inventory
      detectedProducts.forEach((product) => {
        const newProduct = {
          name: product.name,
          description: `Added automatically from invoice ${extractedData.invoiceNumber}`,
          category: "Office Supplies", // Default category
          brand: "",
          sku: product.sku,
          uom: "Nos",

          mrp: Math.round(product.price * 1.2), // Estimate MRP as 20% more than cost
          costPrice: product.price,
          profitMargin: 20, // Estimate 20% profit

          hsnCode: product.hsn,
          cgstRate: product.gst / 200, // Half of GST
          sgstRate: product.gst / 200, // Half of GST
          igstRate: 0,
          totalGstRate: product.gst / 100,
          gstIncluded: true,
          isInterState: false,
          taxType: "Regular",

          quantity: product.quantity,
          reorderLevel: 5,
          warehouseLocation: "",

          variants: [],

          images: ["/placeholder.svg?height=200&width=200"],

          supplier: extractedData.supplierName,
          supplierGSTIN: extractedData.supplierGSTIN,
          supplierContact: extractedData.supplierContact,
          invoiceNo: extractedData.invoiceNumber,
          invoiceDate: new Date().toISOString(), // Current date in ISO format

          batchNo: "",
          expiryDate: null,
        };

        addProduct(newProduct);
      });

      toast({
        title: "Products Added to Inventory",
        description: `Successfully added ${detectedProducts.length} products to your inventory`,
        variant: "success",
      });

      // Reset the form
      setFile(null);
      setExtractedData(null);
      setDetectedProducts([]);
    } catch (error) {
      console.error("Error adding products:", error);
      toast({
        title: "Error",
        description: "Failed to add products to inventory",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Purchase Bill OCR
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload">Upload Bill</TabsTrigger>
            <TabsTrigger value="results" disabled={!extractedData}>
              Detected Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Invoice/Bill</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  file ? "border-green-300 bg-green-50" : ""
                }`}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop PDF invoice or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We'll automatically extract product data from your
                      supplier's bill
                    </p>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="bill-upload"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="bill-upload" className="cursor-pointer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        as="span"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Select PDF
                      </Button>
                    </Label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <FileCheck2 className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB - PDF Document
                      </p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Change File
                      </Button>
                      <Button
                        size="sm"
                        onClick={processFile}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          "Process Bill"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Supported file: PDF from most popular accounting/billing
                software
              </p>
            </div>

            {extractedData && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium">Bill Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Invoice Number
                    </Label>
                    <p className="font-medium">{extractedData.invoiceNumber}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Invoice Date
                    </Label>
                    <p className="font-medium">{extractedData.invoiceDate}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Supplier
                    </Label>
                    <p className="font-medium">{extractedData.supplierName}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Supplier GSTIN
                    </Label>
                    <p className="font-medium">{extractedData.supplierGSTIN}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Products Detected</h3>
                    <p className="text-sm text-muted-foreground">
                      We found {extractedData.products.length} products on this
                      bill
                    </p>
                  </div>

                  <Button onClick={handleAddToInventory} className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Inventory
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {detectedProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          HSN
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          GST
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {detectedProducts.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{product.name}</td>
                          <td className="px-4 py-3 text-sm font-mono">
                            {product.sku}
                          </td>
                          <td className="px-4 py-3 text-sm">{product.hsn}</td>
                          <td className="px-4 py-3 text-sm">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{product.price}
                          </td>
                          <td className="px-4 py-3 text-sm">{product.gst}%</td>
                          <td className="px-4 py-3 text-sm">
                            ₹{product.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Invoice Total</p>
                    <p className="text-xs text-muted-foreground">
                      Including GST of ₹{extractedData.totalGST}
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    ₹{extractedData.grandTotal}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleAddToInventory} className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Add All to Inventory
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No Products Detected</h3>
                <p className="text-muted-foreground mt-1">
                  We couldn't detect any products in the bill. Try uploading a
                  clearer image.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
