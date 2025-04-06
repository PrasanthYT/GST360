"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Plus, Trash2, Upload, Calculator, Info, Package } from 'lucide-react'
import { DatePicker } from "@/components/ui/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useInventory } from "@/contexts/inventory-context"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getProduct, updateProduct } = useInventory()
  const productId = params.id

  // Get product from context
  const product = getProduct(productId)

  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState(
    product || {
      name: "",
      sku: "",
      description: "",
      category: "",
      brand: "",
      uom: "",
      images: [],
      mrp: 0,
      costPrice: 0,
      profitMargin: 0,
      hsnCode: "",
      totalGstRate: 0,
      gstIncluded: false,
      isInterState: false,
      taxType: "",
      quantity: 0,
      reorderLevel: 0,
      warehouseLocation: "",
      batchNo: "",
      expiryDate: null,
      supplier: "",
      supplierGSTIN: "",
      supplierContact: "",
      invoiceNo: "",
      invoiceDate: null,
      igstRate: 0,
      cgstRate: 0,
      sgstRate: 0,
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If product not found, redirect to inventory page
  useEffect(() => {
    if (!product) {
      router.push("/dashboard/inventory")
    } else {
      setFormData(product)
    }
  }, [product, router])

  // Update profit margin when mrp or costPrice changes
  useEffect(() => {
    if (formData.costPrice > 0) {
      const profitMargin = ((formData.mrp - formData.costPrice) / formData.costPrice) * 100
      setFormData((prev) => ({ ...prev, profitMargin }))
    }
  }, [formData.mrp, formData.costPrice])

  // Update GST rates when totalGstRate changes
  useEffect(() => {
    if (formData.isInterState) {
      setFormData((prev) => ({
        ...prev,
        igstRate: prev.totalGstRate,
        cgstRate: 0,
        sgstRate: 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        igstRate: 0,
        cgstRate: prev.totalGstRate / 2,
        sgstRate: prev.totalGstRate / 2,
      }))
    }
  }, [formData.totalGstRate, formData.isInterState])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date ? date.toISOString() : null }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic info validation
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.sku.trim()) newErrors.sku = "SKU is required"

    // Pricing validation
    if (formData.mrp <= 0) newErrors.mrp = "MRP must be greater than 0"
    if (formData.costPrice <= 0) newErrors.costPrice = "Cost price must be greater than 0"

    // GST validation
    if (!formData.hsnCode.trim()) newErrors.hsnCode = "HSN code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update the product
      updateProduct(productId, formData)

      toast({
        title: "Product Updated",
        description: "The product has been updated successfully.",
        variant: "success",
      })

      router.push("/dashboard/inventory")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/inventory")
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & GST</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                      {errors.name && <span className="text-red-500 text-xs ml-2">{errors.name}</span>}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Stationery">Stationery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                        <SelectTrigger id="brand">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apple">Apple</SelectItem>
                          <SelectItem value="Samsung">Samsung</SelectItem>
                          <SelectItem value="HP">HP</SelectItem>
                          <SelectItem value="Dell">Dell</SelectItem>
                          <SelectItem value="Logitech">Logitech</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
                        {errors.sku && <span className="text-red-500 text-xs ml-2">{errors.sku}</span>}
                      </Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Enter SKU"
                        className={errors.sku ? "border-red-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uom">Unit of Measure</Label>
                      <Select value={formData.uom} onValueChange={(value) => handleSelectChange("uom", value)}>
                        <SelectTrigger id="uom">
                          <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nos">Nos</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Gm">Gm</SelectItem>
                          <SelectItem value="Ltr">Ltr</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="Box">Box</SelectItem>
                          <SelectItem value="Pair">Pair</SelectItem>
                          <SelectItem value="Set">Set</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {formData.images && formData.images.length > 0 ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-32 w-32 bg-gray-100 rounded-md border flex items-center justify-center">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Drag & drop images here or click to browse</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="mr-2 h-4 w-4" /> Add Images
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setActiveTab("pricing")}>Continue to Pricing & GST</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & GST Tab */}
        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mrp">
                        MRP (₹) <span className="text-red-500">*</span>
                        {errors.mrp && <span className="text-red-500 text-xs ml-2">{errors.mrp}</span>}
                      </Label>
                      <Input
                        id="mrp"
                        name="mrp"
                        type="number"
                        placeholder="0.00"
                        value={formData.mrp || ""}
                        onChange={handleInputChange}
                        className={errors.mrp ? "border-red-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costPrice">
                        Cost Price (₹) <span className="text-red-500">*</span>
                        {errors.costPrice && <span className="text-red-500 text-xs ml-2">{errors.costPrice}</span>}
                      </Label>
                      <Input
                        id="costPrice"
                        name="costPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.costPrice || ""}
                        onChange={handleInputChange}
                        className={errors.costPrice ? "border-red-500" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 text-xs text-blue-600"
                        onClick={() => {
                          // Open profit calculator
                        }}
                      >
                        <Calculator className="h-3 w-3" />
                        Calculate
                      </Button>
                    </div>
                    <Input
                      id="profitMargin"
                      name="profitMargin"
                      type="number"
                      placeholder="0.00"
                      value={formData.profitMargin.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">GST Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hsnCode">
                        HSN Code <span className="text-red-500">*</span>
                        {errors.hsnCode && <span className="text-red-500 text-xs ml-2">{errors.hsnCode}</span>}
                      </Label>
                      <div className="relative">
                        <Input
                          id="hsnCode"
                          name="hsnCode"
                          placeholder="Enter HSN Code"
                          value={formData.hsnCode}
                          onChange={handleInputChange}
                          className={errors.hsnCode ? "border-red-500" : ""}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-8">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">HSN Code</h4>
                              <p className="text-sm text-muted-foreground">
                                Harmonized System of Nomenclature (HSN) code is a 6-digit uniform code that classifies
                                goods for taxation purposes.
                              </p>
                              <a
                                href="https://cbic-gst.gov.in/gst-goods-services-rates.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Look up HSN codes
                              </a>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gstRate">
                        GST Rate <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.totalGstRate.toString()}
                        onValueChange={(value) => handleSelectChange("totalGstRate", value)}
                      >
                        <SelectTrigger id="gstRate">
                          <SelectValue placeholder="Select GST Rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="0.05">5%</SelectItem>
                          <SelectItem value="0.12">12%</SelectItem>
                          <SelectItem value="0.18">18%</SelectItem>
                          <SelectItem value="0.28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="gstIncluded"
                        checked={formData.gstIncluded}
                        onCheckedChange={(checked) => handleSwitchChange("gstIncluded", checked)}
                      />
                      <Label htmlFor="gstIncluded">GST Included in Price</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isInterState"
                        checked={formData.isInterState}
                        onCheckedChange={(checked) => handleSwitchChange("isInterState", checked)}
                      />
                      <Label htmlFor="isInterState">Inter-State Supply (IGST)</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxType">Tax Type</Label>
                      <Select value={formData.taxType} onValueChange={(value) => handleSelectChange("taxType", value)}>
                        <SelectTrigger id="taxType">
                          <SelectValue placeholder="Select Tax Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Composition">Composition</SelectItem>
                          <SelectItem value="Exempt">Exempt</SelectItem>
                          <SelectItem value="Nil-Rated">Nil Rated</SelectItem>
                          <SelectItem value="Non-GST">Non-GST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  Back to Basic Info
                </Button>
                <Button onClick={() => setActiveTab("inventory")}>Continue to Inventory</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stock Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Current Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        placeholder="0"
                        value={formData.quantity || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reorderLevel">Reorder Level</Label>
                      <Input
                        id="reorderLevel"
                        name="reorderLevel"
                        type="number"
                        placeholder="5"
                        value={formData.reorderLevel || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouseLocation">Warehouse Location</Label>
                    <Input
                      id="warehouseLocation"
                      name="warehouseLocation"
                      placeholder="e.g., Rack A, Shelf 3"
                      value={formData.warehouseLocation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batchNo">Batch Number</Label>
                      <Input
                        id="batchNo"
                        name="batchNo"
                        placeholder="Enter batch number"
                        value={formData.batchNo}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <DatePicker
                        date={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                        onDateChange={(date) => handleDateChange("expiryDate", date)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Inventory Settings</h3>

                  <div className="space-y-2">
                    <Label>Stock Alerts</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="lowStockAlert" defaultChecked />
                      <Label htmlFor="lowStockAlert">Enable low stock alerts</Label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label>Stock Visibility</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="showStock" defaultChecked />
                      <Label htmlFor="showStock">Show stock status to customers</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("pricing")}>
                  Back to Pricing & GST
                </Button>
                <Button onClick={() => setActiveTab("variants")}>Continue to Variants</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Variant
                  </Button>
                </div>

                <div className="border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">No variants added yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add variants if your product comes in different sizes, colors, or other options.
                  </p>
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" /> Add Your First Variant
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("inventory")}>
                  Back to Inventory
                </Button>
                <Button onClick={() => setActiveTab("supplier")}>Continue to Supplier</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Tab */}
        <TabsContent value="supplier" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Supplier Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier Name</Label>
                    <Select value={formData.supplier} onValueChange={(value) => handleSelectChange("supplier", value)}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech Distributors">Tech Distributors</SelectItem>
                        <SelectItem value="Office World">Office World</SelectItem>
                        <SelectItem value="Global Supplies">Global Supplies</SelectItem>
                        <SelectItem value="Premium Furniture">Premium Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplierGSTIN">Supplier GSTIN</Label>
                    <Input
                      id="supplierGSTIN"
                      name="supplierGSTIN"
                      placeholder="Enter supplier GSTIN"
                      value={formData.supplierGSTIN}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplierContact">Supplier Contact</Label>
                    <Input
                      id="supplierContact"
                      name="supplierContact"
                      placeholder="Enter supplier contact"
                      value={formData.supplierContact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Purchase Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceNo">Invoice Number</Label>
                    <Input
                      id="invoiceNo"
                      name="invoiceNo"
                      placeholder="Enter invoice number"
                      value={formData.invoiceNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <DatePicker
                      date={formData.invoiceDate ? new Date(formData.invoiceDate) : undefined}
                      onDateChange={(date) => handleDateChange("invoiceDate", date)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("variants")}>
                  Back to Variants
                </Button>
                <Button onClick={handleSave} className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

