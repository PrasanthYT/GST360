"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Define types
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  uom: string;

  // Price
  mrp: number;
  costPrice: number;
  profitMargin: number;

  // GST
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  totalGstRate: number;
  gstIncluded: boolean;
  isInterState: boolean;
  taxType: string;

  quantity: number;
  reorderLevel: number;
  warehouseLocation: string;

  variants: ProductVariant[];

  images: string[];

  // Supplier details
  supplier: string;
  supplierGSTIN: string;
  supplierContact: string;
  invoiceNo: string;
  invoiceDate: string;

  batchNo: string;
  expiryDate: string | null;

  createdAt: string;
  updatedAt: string;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  adjustStock: (id: string, adjustment: number) => void;
  loading: boolean;
  error: string | null;
}

// Create context
const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// Sample data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Laptop - Model X",
    description:
      "High-performance laptop with the latest processor and graphics card. Perfect for business and gaming.",
    brand: "TechBrand",
    category: "Electronics",
    sku: "LT-001",
    uom: "Nos",
    mrp: 45000,
    costPrice: 38000,
    profitMargin: 18.42,
    hsnCode: "8471",
    cgstRate: 0.09,
    sgstRate: 0.09,
    igstRate: 0.18,
    totalGstRate: 0.18,
    gstIncluded: true,
    isInterState: false,
    taxType: "Regular",
    quantity: 24,
    reorderLevel: 10,
    warehouseLocation: "Rack A, Shelf 3",
    variants: [],
    images: [
      "https://helios-i.mashable.com/imagery/articles/05djrP5PjtVB7CcMtvrTOAP/hero-image.fill.size_1200x1200.v1723100793.jpg",
    ],
    supplier: "Tech Distributors",
    supplierGSTIN: "27AAPFU0939F1ZV",
    supplierContact: "+91 9876543210",
    invoiceNo: "INV-2023-0124",
    invoiceDate: "2023-10-15",
    batchNo: "LT001-B1",
    expiryDate: null,
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-11-05T14:45:00Z",
  },
  {
    id: "2",
    name: "Office Chair",
    description:
      "Ergonomic office chair with adjustable height and lumbar support.",
    brand: "ComfortPlus",
    category: "Furniture",
    sku: "FN-056",
    uom: "Nos",
    mrp: 5200,
    costPrice: 3800,
    profitMargin: 36.84,
    hsnCode: "9401",
    cgstRate: 0.09,
    sgstRate: 0.09,
    igstRate: 0.18,
    totalGstRate: 0.18,
    gstIncluded: true,
    isInterState: false,
    taxType: "Regular",
    quantity: 15,
    reorderLevel: 8,
    warehouseLocation: "Rack B, Shelf 2",
    variants: [],
    images: ["https://cdn.moglix.com/p/djsrKBRPVjQIC-xxlarge.jpg"],
    supplier: "Premium Furniture",
    supplierGSTIN: "29AAPFU0939F1ZT",
    supplierContact: "+91 9876543211",
    invoiceNo: "INV-2023-0125",
    invoiceDate: "2023-10-18",
    batchNo: "FN056-B1",
    expiryDate: null,
    createdAt: "2023-10-18T11:20:00Z",
    updatedAt: "2023-11-02T09:15:00Z",
  },
  {
    id: "3",
    name: "Printer Ink Cartridge",
    description:
      "High-quality ink cartridge compatible with most printer models.",
    brand: "PrintMaster",
    category: "Office Supplies",
    sku: "PR-102",
    uom: "Nos",
    mrp: 1200,
    costPrice: 800,
    profitMargin: 50.0,
    hsnCode: "3215",
    cgstRate: 0.06,
    sgstRate: 0.06,
    igstRate: 0.12,
    totalGstRate: 0.12,
    gstIncluded: true,
    isInterState: false,
    taxType: "Regular",
    quantity: 8,
    reorderLevel: 10,
    warehouseLocation: "Rack C, Shelf 1",
    variants: [],
    images: [
      "https://5.imimg.com/data5/TS/RC/MY-50724072/printer-ink-cartridges.jpg",
    ],
    supplier: "Office World",
    supplierGSTIN: "07AAPFU0939F1ZU",
    supplierContact: "+91 9876543212",
    invoiceNo: "INV-2023-0126",
    invoiceDate: "2023-10-20",
    batchNo: "PR102-B1",
    expiryDate: "2024-10-20T00:00:00Z",
    createdAt: "2023-10-20T14:10:00Z",
    updatedAt: "2023-11-01T16:30:00Z",
  },
  {
    id: "4",
    name: "Accounting Software License",
    description:
      "Annual license for professional accounting software with GST compliance features.",
    brand: "FinancePro",
    category: "Software",
    sku: "SW-045",
    uom: "Nos",
    mrp: 8500,
    costPrice: 6000,
    profitMargin: 41.67,
    hsnCode: "8523",
    cgstRate: 0.09,
    sgstRate: 0.09,
    igstRate: 0.18,
    totalGstRate: 0.18,
    gstIncluded: true,
    isInterState: false,
    taxType: "Regular",
    quantity: 32,
    reorderLevel: 5,
    warehouseLocation: "Digital Assets",
    variants: [],
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2024/9/449553226/XB/KX/SP/228102984/busy-blue-edition-yearly-license.jpg",
    ],
    supplier: "Tech Distributors",
    supplierGSTIN: "27AAPFU0939F1ZV",
    supplierContact: "+91 9876543210",
    invoiceNo: "INV-2023-0127",
    invoiceDate: "2023-10-22",
    batchNo: "SW045-B1",
    expiryDate: null,
    createdAt: "2023-10-22T09:45:00Z",
    updatedAt: "2023-10-30T11:20:00Z",
  },
  {
    id: "5",
    name: "Desk Lamp",
    description:
      "LED desk lamp with adjustable brightness and color temperature.",
    brand: "LightWorks",
    category: "Office Supplies",
    sku: "LT-089",
    uom: "Nos",
    mrp: 850,
    costPrice: 550,
    profitMargin: 54.55,
    hsnCode: "9405",
    cgstRate: 0.06,
    sgstRate: 0.06,
    igstRate: 0.12,
    totalGstRate: 0.12,
    gstIncluded: true,
    isInterState: false,
    taxType: "Regular",
    quantity: 0,
    reorderLevel: 5,
    warehouseLocation: "Rack D, Shelf 3",
    variants: [],
    images: [
      "https://m.media-amazon.com/images/I/71D2YNJoNNL._AC_UF1000,1000_QL80_.jpg",
    ],
    supplier: "Global Supplies",
    supplierGSTIN: "33AAPFU0939F1ZS",
    supplierContact: "+91 9876543213",
    invoiceNo: "INV-2023-0128",
    invoiceDate: "2023-10-25",
    batchNo: "LT089-B1",
    expiryDate: null,
    createdAt: "2023-10-25T15:30:00Z",
    updatedAt: "2023-10-28T10:15:00Z",
  },
];

// Provider component
export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("inventory-products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (err) {
      console.error("Error loading products from localStorage:", err);
      setError("Failed to load products");
    }
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("inventory-products", JSON.stringify(products));
    } catch (err) {
      console.error("Error saving products to localStorage:", err);
      setError("Failed to save products");
    }
  }, [products]);

  // Add a new product
  const addProduct = (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const newProduct: Product = {
        ...product,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };

      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setLoading(false);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product");
      setLoading(false);
    }
  };

  // Update an existing product
  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setLoading(true);
    try {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                ...updatedFields,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );
      setLoading(false);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = (id: string) => {
    setLoading(true);
    try {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setLoading(false);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      setLoading(false);
    }
  };

  // Get a product by ID
  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  // Adjust stock quantity
  const adjustStock = (id: string, adjustment: number) => {
    setLoading(true);
    try {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                quantity: Math.max(0, product.quantity + adjustment),
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );
      setLoading(false);
    } catch (err) {
      console.error("Error adjusting stock:", err);
      setError("Failed to adjust stock");
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        adjustStock,
        loading,
        error,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

// Custom hook to use the inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
