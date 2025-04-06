"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  TrendingUp,
  Award,
  Shield,
  Zap,
  AlertCircle,
  Send,
  FileCheck2,
  Clock,
  PartyPopper,
  Calendar,
  BarChart3,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Printer,
  Share2,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// Update the GSTRAnalysis interface to include the full GSTR1 data structure
interface GSTRAnalysis {
  summary: {
    totalInvoices: number;
    totalTaxableValue: number;
    totalIGST: number;
    totalCGST: number;
    totalSGST: number;
    totalInvoiceValue: number;
  };
  risks: string[];
  suggestions: string[];
  flags: string[];
}

// Add a new interface for the GSTR1 data
interface GSTR1Data {
  message?: string;
  data: {
    form: string;
    year: string;
    month: string;
    company: {
      gstin: string;
      legalName: string;
      tradeName: string;
    };
    filingPeriod: string;
    aggregateTurnover: number;
    table4: Array<{
      supplierGSTIN: string;
      invoiceDetails: Array<{
        invoiceNumber: string;
        invoiceDate: string;
        invoiceValue: number;
        taxableValue: number;
        integratedTax: number;
        centralTax: number;
        stateUtTax: number;
        cess: number;
        placeOfSupply: string;
      }>;
    }>;
    table7: any[];
    table12: Array<{
      hsnCode: string;
      description: string;
      uqc: string;
      totalQuantity: number;
      totalValue: number;
      totalTaxableValue: number;
      totalIntegratedTax: number;
      totalCentralTax: number;
      totalStateUtTax: number;
      totalCess: number;
    }>;
    _id: string;
    createdAt: string;
    __v: number;
  };
}

// First, let's update the interfaces to include GSTR-3B data structure
// Add these interfaces after the existing GSTR1Data interface

interface GSTR3BData {
  message?: string;
  data: {
    startDate: string;
    endDate: string;
    totalTaxableValue: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    productsSold: Array<{
      productId: string;
      name: string;
      hsnCode: string;
      quantity: number;
      taxableValue: number;
      cgst: number;
      sgst: number;
      igst: number;
    }>;
    transactionCount: number;
    hsnSummary: Array<{
      hsnCode: string;
      totalQuantity: number;
      totalValue: number;
      totalCGST: number;
      totalSGST: number;
      totalIGST: number;
    }>;
    _id: string;
    createdAt: string;
    __v: number;
  };
}

interface GSTR3BAnalysis {
  summary: {
    totalInvoices: number;
    totalTaxableValue: number;
    totalIGST: number;
    totalCGST: number;
    totalSGST: number;
    totalInvoiceValue: number;
  };
  risks: string[];
  suggestions: string[];
  flags: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
}

export default function GSTCompliancePage() {
  const [gstr1Data, setGstr1Data] = useState<GSTR1Data | null>(null);
  const [activeTab, setActiveTab] = useState("gstr1");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gstr1Analysis, setGstr1Analysis] = useState<GSTRAnalysis | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [complianceScore, setComplianceScore] = useState(85);
  const [showFilingSuccessDialog, setShowFilingSuccessDialog] = useState(false);
  const [showCARequestDialog, setShowCARequestDialog] = useState(false);
  const [caApprovalStatus, setCAApprovalStatus] = useState<
    "waiting" | "approved" | "rejected" | null
  >(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  // Now, add these state variables inside the component function
  // Add after the existing state variables

  const [gstr3bData, setGstr3bData] = useState<GSTR3BData | null>(null);
  const [isLoading3B, setIsLoading3B] = useState(false);
  const [isAnalyzing3B, setIsAnalyzing3B] = useState(false);
  const [gstr3bAnalysis, setGstr3bAnalysis] = useState<GSTR3BAnalysis | null>(
    null
  );
  const [showSuccess3B, setShowSuccess3B] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Refs for download functionality
  const reportRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  // Add refs for GSTR-3B download functionality
  const report3BRef = useRef<HTMLDivElement>(null);
  const analysis3BRef = useRef<HTMLDivElement>(null);

  // Function to handle direct JSON response
  const handleDirectResponse = (jsonResponse: GSTR1Data) => {
    setGstr1Data(jsonResponse);

    // Update current month and year from the response
    setCurrentMonth(jsonResponse.data.month);
    setCurrentYear(jsonResponse.data.year);

    // Simulate analysis after receiving direct response
    setTimeout(() => {
      const mockAnalysis: GSTRAnalysis = {
        summary: {
          totalInvoices: jsonResponse.data.table4.reduce(
            (sum, supplier) => sum + supplier.invoiceDetails.length,
            0
          ),
          totalTaxableValue: jsonResponse.data.table4
            .flatMap((s) => s.invoiceDetails)
            .reduce((sum, inv) => sum + inv.taxableValue, 0),
          totalIGST: jsonResponse.data.table4
            .flatMap((s) => s.invoiceDetails)
            .reduce((sum, inv) => sum + inv.integratedTax, 0),
          totalCGST: jsonResponse.data.table4
            .flatMap((s) => s.invoiceDetails)
            .reduce((sum, inv) => sum + inv.centralTax, 0),
          totalSGST: jsonResponse.data.table4
            .flatMap((s) => s.invoiceDetails)
            .reduce((sum, inv) => sum + inv.stateUtTax, 0),
          totalInvoiceValue: jsonResponse.data.table4
            .flatMap((s) => s.invoiceDetails)
            .reduce((sum, inv) => sum + inv.invoiceValue, 0),
        },
        risks: [],
        suggestions: [
          "Consider filing your GSTR-1 earlier in the month to avoid last-minute issues",
          "Maintain proper documentation for all B2B transactions for audit purposes",
        ],
        flags: [],
      };
      setGstr1Analysis(mockAnalysis);

      // Randomly set compliance score for demo purposes
      // In a real app, this would be calculated based on actual data
      const newScore = 85;
      setComplianceScore(newScore);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  // Update the generateGSTR1 function to handle the new data format
  const generateGSTR1 = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://gst360-n4ca.onrender.com/api/generate-gstr1/generate"
      );
      const data = await response.json();
      setGstr1Data(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating GSTR1:", error);
      setIsLoading(false);
    }
  };

  // Add these functions after the existing functions

  // Function to generate GSTR-3B
  const generateGSTR3B = async () => {
    setIsLoading3B(true);
    try {
      const response = await fetch("https://gst360-n4ca.onrender.com/api/gst/3b");
      const data = await response.json();
      setGstr3bData(data);

      // Set date range from response
      setStartDate(new Date(data.data.startDate).toLocaleDateString());
      setEndDate(new Date(data.data.endDate).toLocaleDateString());

      setIsLoading3B(false);
    } catch (error) {
      console.error("Error generating GSTR-3B:", error);
      setIsLoading3B(false);
    }
  };

  // Function to analyze GSTR-3B
  const analyzeGSTR3B = async () => {
    if (!gstr3bData) return;

    setIsAnalyzing3B(true);
    try {
      const response = await fetch("https://gst360-n4ca.onrender.com/api/analyse-gstr3b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gstr3bData),
      });

      const data = await response.json();
      // Parse the JSON string from the message
      const analysisJson = JSON.parse(
        data.analysis.replace("```json\n", "").replace("\n```", "")
      );
      setGstr3bAnalysis(analysisJson);
      setIsAnalyzing3B(false);

      // Show success message and trigger confetti
      setShowSuccess3B(true);
      setTimeout(() => setShowSuccess3B(false), 5000);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Update compliance score
      const newScore = Math.min(100, complianceScore + 5);
      setComplianceScore(newScore);
    } catch (error) {
      console.error("Error analyzing GSTR-3B:", error);
      setIsAnalyzing3B(false);
    }
  };

  // Function to download GSTR-3B as PDF
  const download3BAsPDF = () => {
    if (!report3BRef.current) return;

    html2canvas(report3BRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(18);
      pdf.text("GSTR-3B Report", pdfWidth / 2, 15, { align: "center" });
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Add analysis if available
      if (analysis3BRef.current && gstr3bAnalysis) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("GSTR-2B Analysis", pdfWidth / 2, 15, { align: "center" });

        html2canvas(analysis3BRef.current).then((analysisCanvas) => {
          const analysisImgData = analysisCanvas.toDataURL("image/png");
          pdf.addImage(
            analysisImgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          pdf.save(`GSTR2B_${startDate}_to_${endDate}.pdf`);
        });
      } else {
        pdf.save(`GSTR2B_${startDate}_to_${endDate}.pdf`);
      }
    });
  };

  // Function to download GSTR-3B as Excel
  const download3BAsExcel = () => {
    if (!gstr3bData) return;

    const workbook = XLSX.utils.book_new();

    // Products Sold Sheet
    const productsData = gstr3bData.data.productsSold.map((product) => ({
      "Product ID": product.productId,
      Name: product.name,
      "HSN Code": product.hsnCode,
      Quantity: product.quantity,
      "Taxable Value": product.taxableValue,
      CGST: product.cgst,
      SGST: product.sgst,
      IGST: product.igst,
      "Total Value":
        product.taxableValue + product.cgst + product.sgst + product.igst,
    }));

    const productsWorksheet = XLSX.utils.json_to_sheet(productsData);
    XLSX.utils.book_append_sheet(workbook, productsWorksheet, "Products Sold");

    // HSN Summary Sheet
    const hsnData = gstr3bData.data.hsnSummary.map((item) => ({
      "HSN Code": item.hsnCode,
      "Total Quantity": item.totalQuantity,
      "Total Value": item.totalValue,
      CGST: item.totalCGST,
      SGST: item.totalSGST,
      IGST: item.totalIGST,
      "Total Tax": item.totalCGST + item.totalSGST + item.totalIGST,
    }));

    const hsnWorksheet = XLSX.utils.json_to_sheet(hsnData);
    XLSX.utils.book_append_sheet(workbook, hsnWorksheet, "HSN Summary");

    // Summary Sheet
    const summaryData = [
      {
        "Start Date": new Date(gstr3bData.data.startDate).toLocaleDateString(),
        "End Date": new Date(gstr3bData.data.endDate).toLocaleDateString(),
        "Transaction Count": gstr3bData.data.transactionCount,
        "Total Taxable Value": gstr3bData.data.totalTaxableValue,
        "Total CGST": gstr3bData.data.totalCGST,
        "Total SGST": gstr3bData.data.totalSGST,
        "Total IGST": gstr3bData.data.totalIGST,
        "Total Tax":
          gstr3bData.data.totalCGST +
          gstr3bData.data.totalSGST +
          gstr3bData.data.totalIGST,
        "Total Value":
          gstr3bData.data.totalTaxableValue +
          gstr3bData.data.totalCGST +
          gstr3bData.data.totalSGST +
          gstr3bData.data.totalIGST,
      },
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

    // Generate Excel file
    XLSX.writeFile(workbook, `GSTR2B_${startDate}_to_${endDate}.xlsx`);
  };

  const analyzeGSTR1 = async () => {
    if (!gstr1Data) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("https://gst360-n4ca.onrender.com/api/analyse-gstr1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gstr1Data),
      });

      const data = await response.json();
      // Parse the JSON string from the message
      const analysisJson = JSON.parse(
        data.analysis.replace("```json\n", "").replace("\n```", "")
      );
      setGstr1Analysis(analysisJson);
      setIsAnalyzing(false);

      // Show success message and trigger confetti
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Update compliance score
      const newScore = Math.min(100, complianceScore + 5);
      setComplianceScore(newScore);
    } catch (error) {
      console.error("Error analyzing GSTR1:", error);
      setIsAnalyzing(false);
    }
  };

  const handleFileGSTR1 = () => {
    // Trigger confetti with more particles for a more impressive effect
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0"],
    });

    // Show success dialog
    setShowFilingSuccessDialog(true);
  };

  const handleSendToCA = () => {
    setShowCARequestDialog(true);
    setCAApprovalStatus("waiting");

    // Simulate CA response after 5 seconds
    setTimeout(() => {
      setCAApprovalStatus("approved");
    }, 5000);
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "At Risk";
  };

  const getComplianceBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-amber-100 text-amber-800 border-amber-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Download functions
  const downloadAsPDF = () => {
    if (!reportRef.current) return;

    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(18);
      pdf.text("GSTR-1 Report", pdfWidth / 2, 15, { align: "center" });
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Add analysis if available
      if (analysisRef.current && gstr1Analysis) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("GSTR-1 Analysis", pdfWidth / 2, 15, { align: "center" });

        html2canvas(analysisRef.current).then((analysisCanvas) => {
          const analysisImgData = analysisCanvas.toDataURL("image/png");
          pdf.addImage(
            analysisImgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          pdf.save(`GSTR1_${currentMonth}_${currentYear}.pdf`);
        });
      } else {
        pdf.save(`GSTR1_${currentMonth}_${currentYear}.pdf`);
      }
    });
  };

  const downloadAsExcel = () => {
    if (!gstr1Data) return;

    const workbook = XLSX.utils.book_new();

    // B2B Invoices Sheet
    const b2bData = gstr1Data.data.table4.flatMap((supplier) =>
      supplier.invoiceDetails.map((invoice) => ({
        "Supplier GSTIN": supplier.supplierGSTIN,
        "Invoice Number": invoice.invoiceNumber,
        "Invoice Date": invoice.invoiceDate,
        "Invoice Value": invoice.invoiceValue,
        "Taxable Value": invoice.taxableValue,
        IGST: invoice.integratedTax,
        CGST: invoice.centralTax,
        SGST: invoice.stateUtTax,
        Cess: invoice.cess,
        "Place of Supply": invoice.placeOfSupply,
      }))
    );

    const b2bWorksheet = XLSX.utils.json_to_sheet(b2bData);
    XLSX.utils.book_append_sheet(workbook, b2bWorksheet, "B2B Invoices");

    // HSN Summary Sheet
    const hsnData = gstr1Data.data.table12.map((item) => ({
      "HSN Code": item.hsnCode,
      Description: item.description,
      UQC: item.uqc,
      "Total Quantity": item.totalQuantity,
      "Total Value": item.totalValue,
      "Taxable Value": item.totalTaxableValue,
      IGST: item.totalIntegratedTax,
      CGST: item.totalCentralTax,
      SGST: item.totalStateUtTax,
      Cess: item.totalCess,
    }));

    const hsnWorksheet = XLSX.utils.json_to_sheet(hsnData);
    XLSX.utils.book_append_sheet(workbook, hsnWorksheet, "HSN Summary");

    // Summary Sheet
    const summaryData = [
      {
        Form: gstr1Data.data.form,
        "Filing Period": gstr1Data.data.filingPeriod,
        Month: gstr1Data.data.month,
        Year: gstr1Data.data.year,
        GSTIN: gstr1Data.data.company.gstin,
        "Legal Name": gstr1Data.data.company.legalName,
        "Trade Name": gstr1Data.data.company.tradeName,
        "Aggregate Turnover": gstr1Data.data.aggregateTurnover,
      },
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

    // Generate Excel file
    XLSX.writeFile(workbook, `GSTR1_${currentMonth}_${currentYear}.xlsx`);
  };

  // Process the direct JSON response if provided
  useEffect(() => {
    // This simulates receiving the JSON directly
    const mockDirectResponse: GSTR1Data = {
      message: "GSTR-1 generated and saved successfully",
      data: {
        form: "GSTR-1",
        year: "2025",
        month: "March",
        company: {
          gstin: "COMPANY_GSTIN",
          legalName: "Your Company Legal Name",
          tradeName: "Your Company Trade Name",
        },
        filingPeriod: "032025",
        aggregateTurnover: 2999,
        table4: [
          {
            supplierGSTIN: "22AABCU9603R1ZM",
            invoiceDetails: [
              {
                invoiceNumber: "INV_PROD-1002",
                invoiceDate: "10-03-2025",
                invoiceValue: 2999,
                taxableValue: 1800,
                integratedTax: 0,
                centralTax: 162,
                stateUtTax: 162,
                cess: 0,
                placeOfSupply: "22",
              },
            ],
          },
        ],
        table7: [],
        table12: [
          {
            hsnCode: "8519",
            description: "Wireless Bluetooth Headphones",
            uqc: "Nos",
            totalQuantity: 44,
            totalValue: 131956,
            totalTaxableValue: 79200,
            totalIntegratedTax: 0,
            totalCentralTax: 7128,
            totalStateUtTax: 7128,
            totalCess: 0,
          },
        ],
        _id: "67f158514a421a97332ba279",
        createdAt: "2025-04-05T16:20:33.769Z",
        __v: 0,
      },
    };

    handleDirectResponse(mockDirectResponse);
  }, []);

  // Add this useEffect to simulate receiving GSTR-3B data
  // Add after the existing useEffect

  useEffect(() => {
    // This simulates receiving the GSTR-3B JSON directly
    const mockGSTR3BResponse: GSTR3BData = {
      message: "GSTR-2B report generated and saved successfully",
      data: {
        startDate: "2025-04-01T00:00:00.000Z",
        endDate: "2025-04-20T00:00:00.000Z",
        totalTaxableValue: 14994,
        totalCGST: 1349.46,
        totalSGST: 1349.46,
        totalIGST: 0,
        productsSold: [
          {
            productId: "PROD-1002",
            name: "Wireless Bluetooth Headphones",
            hsnCode: "8519",
            quantity: 2,
            taxableValue: 4998,
            cgst: 449.82,
            sgst: 449.82,
            igst: 0,
          },
          {
            productId: "PROD-1002",
            name: "Wireless Bluetooth Headphones",
            hsnCode: "8519",
            quantity: 2,
            taxableValue: 4998,
            cgst: 449.82,
            sgst: 449.82,
            igst: 0,
          },
          {
            productId: "PROD-1002",
            name: "Wireless Bluetooth Headphones",
            hsnCode: "8519",
            quantity: 2,
            taxableValue: 4998,
            cgst: 449.82,
            sgst: 449.82,
            igst: 0,
          },
        ],
        transactionCount: 3,
        hsnSummary: [
          {
            hsnCode: "8519",
            totalQuantity: 6,
            totalValue: 14994,
            totalCGST: 1349.46,
            totalSGST: 1349.46,
            totalIGST: 0,
          },
        ],
        _id: "67f1738f01893f390dfd1c35",
        createdAt: "2025-04-05T18:16:47.712Z",
        __v: 0,
      },
    };

    // Set GSTR-3B data
    setGstr3bData(mockGSTR3BResponse);

    // Set date range from response
    setStartDate(
      new Date(mockGSTR3BResponse.data.startDate).toLocaleDateString()
    );
    setEndDate(new Date(mockGSTR3BResponse.data.endDate).toLocaleDateString());

    // Simulate analysis after receiving direct response
    setTimeout(() => {
      const mockAnalysis: GSTR3BAnalysis = {
        summary: {
          totalInvoices: 3,
          totalTaxableValue: 14994,
          totalIGST: 0,
          totalCGST: 1349.46,
          totalSGST: 1349.46,
          totalInvoiceValue: 17692.92,
        },
        risks: [],
        suggestions: [
          "Verify HSN code 8519 applicability for 'Wireless Bluetooth Headphones'.",
          "Ensure all invoices are correctly classified under respective tax rates.",
          "Reconcile the values with GSTR-1 and GSTR-2B to identify any discrepancies.",
        ],
        flags: [
          {
            type: "Quantity Check",
            description:
              "Consider verifying if the quantity of 6 for product PROD-1002 is reasonable for the given period.",
            severity: "Low",
          },
        ],
      };
      setGstr3bAnalysis(mockAnalysis);
    }, 1000);
  }, []);
  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      {(showSuccess || showSuccess3B) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-lg border bg-green-50 p-4 shadow-sm dark:bg-green-950/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">
                Analysis Complete!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your {showSuccess ? "GSTR-1" : "GSTR-3B"} has been analyzed
                successfully. Compliance score: {complianceScore}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            GST Compliance
          </h1>
          <p className="text-muted-foreground">
            Monitor and improve your GST compliance with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${getComplianceBadge(complianceScore)} gap-1 px-3 py-1`}
          >
            <Shield className="h-3.5 w-3.5 mr-1" />
            <span>Compliance Score: {complianceScore}%</span>
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200 gap-1 px-3 py-1"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>
              {currentMonth} {currentYear}
            </span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>
                  Monitor your GST filing status and compliance
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Print Report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
                <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
                <TabsTrigger value="gstr2b">GSTR-2B</TabsTrigger>
              </TabsList>
              <TabsContent value="gstr1" className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">GSTR-1 Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Outward supplies of goods and services
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateGSTR1}
                        disabled={isLoading}
                        className="gap-1"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span>Generate GSTR-1</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={analyzeGSTR1}
                        disabled={isAnalyzing || !gstr1Data}
                        className="gap-1"
                      >
                        {isAnalyzing ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        <span>Analyze</span>
                      </Button>
                    </div>
                  </div>

                  {gstr1Data && gstr1Analysis ? (
                    <div className="space-y-6">
                      {/* Government Report Style Header */}
                      <div
                        className="border rounded-lg overflow-hidden shadow-sm"
                        ref={reportRef}
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-4 border-b">
                          <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                              Government of India
                            </h3>
                            <h4 className="text-base font-semibold">
                              Goods and Services Tax Network
                            </h4>
                            <h2 className="text-xl font-bold mt-2">
                              GSTR-1 RETURN
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200"
                              >
                                {gstr1Data.data.month} {gstr1Data.data.year}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-800 border-green-200"
                              >
                                Filing Period: {gstr1Data.data.filingPeriod}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Company Information */}
                        <div className="p-4 border-b bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-blue-500" />
                            Company Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  GSTIN:
                                </span>
                                <span className="text-sm font-mono">
                                  {gstr1Data.data.company.gstin}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Legal Name:
                                </span>
                                <span className="text-sm">
                                  {gstr1Data.data.company.legalName}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Trade Name:
                                </span>
                                <span className="text-sm">
                                  {gstr1Data.data.company.tradeName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Aggregate Turnover:
                                </span>
                                <span className="text-sm font-mono">
                                  ₹
                                  {gstr1Data.data.aggregateTurnover.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 border-b bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                            Return Summary
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total Invoices
                              </p>
                              <p className="text-xl font-bold">
                                {gstr1Analysis.summary.totalInvoices}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Taxable Value
                              </p>
                              <p className="text-xl font-bold">
                                ₹
                                {gstr1Analysis.summary.totalTaxableValue.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total Invoice Value
                              </p>
                              <p className="text-xl font-bold">
                                ₹
                                {gstr1Analysis.summary.totalInvoiceValue.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                CGST
                              </p>
                              <p className="text-lg font-bold">
                                ₹
                                {gstr1Analysis.summary.totalCGST.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                SGST
                              </p>
                              <p className="text-lg font-bold">
                                ₹
                                {gstr1Analysis.summary.totalSGST.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                IGST
                              </p>
                              <p className="text-lg font-bold">
                                ₹
                                {gstr1Analysis.summary.totalIGST.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Table 4 - B2B Invoices */}
                        <div className="p-4 border-b bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            Table 4: B2B Invoices
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Supplier GSTIN
                                  </th>
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Invoice Number
                                  </th>
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Invoice Date
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Invoice Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Taxable Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    IGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    CGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    SGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Cess (₹)
                                  </th>
                                  <th className="border p-2 text-center text-xs font-medium">
                                    Place of Supply
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {gstr1Data.data.table4.length > 0 ? (
                                  gstr1Data.data.table4.flatMap((supplier) =>
                                    supplier.invoiceDetails.map(
                                      (invoice, idx) => (
                                        <tr
                                          key={`${supplier.supplierGSTIN}-${invoice.invoiceNumber}`}
                                          className={
                                            idx % 2 === 0
                                              ? "bg-white dark:bg-slate-950"
                                              : "bg-slate-50 dark:bg-slate-900"
                                          }
                                        >
                                          <td className="border p-2 text-xs font-mono">
                                            {supplier.supplierGSTIN}
                                          </td>
                                          <td className="border p-2 text-xs">
                                            {invoice.invoiceNumber}
                                          </td>
                                          <td className="border p-2 text-xs">
                                            {invoice.invoiceDate}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.invoiceValue.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.taxableValue.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.integratedTax.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.centralTax.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.stateUtTax.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-right">
                                            {invoice.cess.toLocaleString()}
                                          </td>
                                          <td className="border p-2 text-xs text-center">
                                            {invoice.placeOfSupply}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={10}
                                      className="border p-3 text-center text-sm text-muted-foreground"
                                    >
                                      No B2B invoice data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              {gstr1Data.data.table4.length > 0 && (
                                <tfoot>
                                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 font-medium">
                                    <td
                                      colSpan={3}
                                      className="border p-2 text-xs text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce(
                                          (sum, inv) => sum + inv.invoiceValue,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce(
                                          (sum, inv) => sum + inv.taxableValue,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce(
                                          (sum, inv) => sum + inv.integratedTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce(
                                          (sum, inv) => sum + inv.centralTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce(
                                          (sum, inv) => sum + inv.stateUtTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table4
                                        .flatMap((s) => s.invoiceDetails)
                                        .reduce((sum, inv) => sum + inv.cess, 0)
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs"></td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>

                        {/* Table 12 - HSN Summary */}
                        <div className="p-4 bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            Table 12: HSN Summary
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                                  <th className="border p-2 text-left text-xs font-medium">
                                    HSN Code
                                  </th>
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Description
                                  </th>
                                  <th className="border p-2 text-center text-xs font-medium">
                                    UQC
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total Quantity
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Taxable Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    IGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    CGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    SGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Cess (₹)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {gstr1Data.data.table12.length > 0 ? (
                                  gstr1Data.data.table12.map((item, idx) => (
                                    <tr
                                      key={item.hsnCode}
                                      className={
                                        idx % 2 === 0
                                          ? "bg-white dark:bg-slate-950"
                                          : "bg-slate-50 dark:bg-slate-900"
                                      }
                                    >
                                      <td className="border p-2 text-xs font-mono">
                                        {item.hsnCode}
                                      </td>
                                      <td className="border p-2 text-xs">
                                        {item.description}
                                      </td>
                                      <td className="border p-2 text-xs text-center">
                                        {item.uqc}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalQuantity.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalValue.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalTaxableValue.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalIntegratedTax.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalCentralTax.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalStateUtTax.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {item.totalCess.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={10}
                                      className="border p-3 text-center text-sm text-muted-foreground"
                                    >
                                      No HSN summary data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              {gstr1Data.data.table12.length > 0 && (
                                <tfoot>
                                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 font-medium">
                                    <td
                                      colSpan={3}
                                      className="border p-2 text-xs text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.totalQuantity,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) => sum + item.totalValue,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.totalTaxableValue,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.totalIntegratedTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.totalCentralTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.totalStateUtTax,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {gstr1Data.data.table12
                                        .reduce(
                                          (sum, item) => sum + item.totalCess,
                                          0
                                        )
                                        .toLocaleString()}
                                    </td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>

                        {/* Document Footer */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-4 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Generated on: {new Date().toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={downloadAsPDF}
                            >
                              <FilePdf className="h-3.5 w-3.5" />
                              <span>Download PDF</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={downloadAsExcel}
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5" />
                              <span>Download Excel</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Section - Now below the GSTR1 report */}
                      <div
                        className="border rounded-lg overflow-hidden shadow-sm"
                        ref={analysisRef}
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-900/20 p-4 border-b">
                          <div className="flex items-center justify-center">
                            <h3 className="text-lg font-bold">
                              AI-Powered GSTR-1 Analysis
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 space-y-4 bg-white dark:bg-slate-950">
                          {/* Analysis Cards */}
                          {gstr1Analysis.risks.length > 0 && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Compliance Risks Detected</AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr1Analysis.risks.map((risk, index) => (
                                    <li key={index}>{risk}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr1Analysis.suggestions.length > 0 && (
                            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300">
                              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <AlertTitle>
                                Suggestions for Improvement
                              </AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr1Analysis.suggestions.map(
                                    (suggestion, index) => (
                                      <li key={index}>{suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr1Analysis.flags.length > 0 && (
                            <Alert variant="warning">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Potential Issues</AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr1Analysis.flags.map((flag, index) => (
                                    <li key={index}>{flag}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr1Analysis.risks.length === 0 &&
                            gstr1Analysis.suggestions.length === 0 &&
                            gstr1Analysis.flags.length === 0 && (
                              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle>Perfect Compliance</AlertTitle>
                                <AlertDescription>
                                  No issues detected in your GSTR-1. Great job
                                  maintaining compliance!
                                </AlertDescription>
                              </Alert>
                            )}
                        </div>
                      </div>

                      {/* Conditional Action Button based on compliance score */}
                      <div className="flex justify-center mt-6">
                        {complianceScore < 40 ? (
                          <Button
                            onClick={handleSendToCA}
                            className="gap-2 bg-amber-600 hover:bg-amber-700 px-8 py-6 text-lg"
                            size="lg"
                          >
                            <Send className="h-5 w-5" />
                            <span>Send to CA to Solve</span>
                          </Button>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={handleFileGSTR1}
                              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-6 text-lg shadow-lg"
                              size="lg"
                            >
                              <FileCheck2 className="h-5 w-5" />
                              <span>File GSTR1 to GST</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Keep the existing loading/empty state
                    <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                      {isLoading || isAnalyzing ? (
                        <div className="space-y-4 w-full">
                          <Skeleton className="h-8 w-3/4 mx-auto" />
                          <Skeleton className="h-20 w-full" />
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-medium">
                              No Analysis Available
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Generate and analyze your GSTR-1 to see AI-powered
                              insights
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={generateGSTR1}
                            className="gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Generate GSTR-1</span>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* // Now, let's update the TabsContent for GSTR-2B // Replace the
              existing GSTR-2B TabsContent with this */}
              <TabsContent value="gstr2b" className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">GSTR-3B Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Inward supplies and tax liability
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateGSTR3B}
                        disabled={isLoading3B}
                        className="gap-1"
                      >
                        {isLoading3B ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span>Generate GSTR-3B</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={analyzeGSTR3B}
                        disabled={isAnalyzing3B || !gstr3bData}
                        className="gap-1"
                      >
                        {isAnalyzing3B ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        <span>Analyze</span>
                      </Button>
                    </div>
                  </div>

                  {gstr3bData && gstr3bAnalysis ? (
                    <div className="space-y-6">
                      {/* Government Report Style Header */}
                      <div
                        className="border rounded-lg overflow-hidden shadow-sm"
                        ref={report3BRef}
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 p-4 border-b">
                          <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                              Government of India
                            </h3>
                            <h4 className="text-base font-semibold">
                              Goods and Services Tax Network
                            </h4>
                            <h2 className="text-xl font-bold mt-2">
                              GSTR-2B RETURN
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-800 border-purple-200"
                              >
                                {startDate} to {endDate}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-800 border-green-200"
                              >
                                Transactions: {gstr3bData.data.transactionCount}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 border-b bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                            Return Summary
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total Taxable Value
                              </p>
                              <p className="text-xl font-bold">
                                ₹
                                {gstr3bData.data.totalTaxableValue.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total CGST
                              </p>
                              <p className="text-xl font-bold">
                                ₹{gstr3bData.data.totalCGST.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total SGST
                              </p>
                              <p className="text-xl font-bold">
                                ₹{gstr3bData.data.totalSGST.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total IGST
                              </p>
                              <p className="text-lg font-bold">
                                ₹{gstr3bData.data.totalIGST.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total Tax
                              </p>
                              <p className="text-lg font-bold">
                                ₹
                                {(
                                  gstr3bData.data.totalCGST +
                                  gstr3bData.data.totalSGST +
                                  gstr3bData.data.totalIGST
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Total Value
                              </p>
                              <p className="text-lg font-bold">
                                ₹
                                {(
                                  gstr3bData.data.totalTaxableValue +
                                  gstr3bData.data.totalCGST +
                                  gstr3bData.data.totalSGST +
                                  gstr3bData.data.totalIGST
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Products Sold */}
                        <div className="p-4 border-b bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-purple-500" />
                            Products Sold
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Product ID
                                  </th>
                                  <th className="border p-2 text-left text-xs font-medium">
                                    Name
                                  </th>
                                  <th className="border p-2 text-center text-xs font-medium">
                                    HSN Code
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Quantity
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Taxable Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    CGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    SGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    IGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total (₹)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {gstr3bData.data.productsSold.map(
                                  (product, idx) => (
                                    <tr
                                      key={`${product.productId}-${idx}`}
                                      className={
                                        idx % 2 === 0
                                          ? "bg-white dark:bg-slate-950"
                                          : "bg-slate-50 dark:bg-slate-900"
                                      }
                                    >
                                      <td className="border p-2 text-xs font-mono">
                                        {product.productId}
                                      </td>
                                      <td className="border p-2 text-xs">
                                        {product.name}
                                      </td>
                                      <td className="border p-2 text-xs text-center">
                                        {product.hsnCode}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {product.quantity}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {product.taxableValue.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {product.cgst.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {product.sgst.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {product.igst.toLocaleString()}
                                      </td>
                                      <td className="border p-2 text-xs text-right">
                                        {(
                                          product.taxableValue +
                                          product.cgst +
                                          product.sgst +
                                          product.igst
                                        ).toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                              <tfoot>
                                <tr className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 font-medium">
                                  <td
                                    colSpan={3}
                                    className="border p-2 text-xs text-right"
                                  >
                                    Total
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.productsSold.reduce(
                                      (sum, product) => sum + product.quantity,
                                      0
                                    )}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalTaxableValue.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalCGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalSGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalIGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {(
                                      gstr3bData.data.totalTaxableValue +
                                      gstr3bData.data.totalCGST +
                                      gstr3bData.data.totalSGST +
                                      gstr3bData.data.totalIGST
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* HSN Summary */}
                        <div className="p-4 bg-white dark:bg-slate-950">
                          <h3 className="text-base font-semibold mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-purple-500" />
                            HSN Summary
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
                                  <th className="border p-2 text-left text-xs font-medium">
                                    HSN Code
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total Quantity
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total Value (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    CGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    SGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    IGST (₹)
                                  </th>
                                  <th className="border p-2 text-right text-xs font-medium">
                                    Total Tax (₹)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {gstr3bData.data.hsnSummary.map((item, idx) => (
                                  <tr
                                    key={item.hsnCode}
                                    className={
                                      idx % 2 === 0
                                        ? "bg-white dark:bg-slate-950"
                                        : "bg-slate-50 dark:bg-slate-900"
                                    }
                                  >
                                    <td className="border p-2 text-xs font-mono">
                                      {item.hsnCode}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {item.totalQuantity}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {item.totalValue.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {item.totalCGST.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {item.totalSGST.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {item.totalIGST.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-xs text-right">
                                      {(
                                        item.totalCGST +
                                        item.totalSGST +
                                        item.totalIGST
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 font-medium">
                                  <td className="border p-2 text-xs text-right">
                                    Total
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.hsnSummary.reduce(
                                      (sum, item) => sum + item.totalQuantity,
                                      0
                                    )}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalTaxableValue.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalCGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalSGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {gstr3bData.data.totalIGST.toLocaleString()}
                                  </td>
                                  <td className="border p-2 text-xs text-right">
                                    {(
                                      gstr3bData.data.totalCGST +
                                      gstr3bData.data.totalSGST +
                                      gstr3bData.data.totalIGST
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* Document Footer */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-4 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            Generated on: {new Date().toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={download3BAsPDF}
                            >
                              <FilePdf className="h-3.5 w-3.5" />
                              <span>Download PDF</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={download3BAsExcel}
                            >
                              <FileSpreadsheet className="h-3.5 w-3.5" />
                              <span>Download Excel</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Section - Now below the GSTR-3B report */}
                      <div
                        className="border rounded-lg overflow-hidden shadow-sm"
                        ref={analysis3BRef}
                      >
                        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-900/20 p-4 border-b">
                          <div className="flex items-center justify-center">
                            <h3 className="text-lg font-bold">
                              AI-Powered GSTR-3B Analysis
                            </h3>
                          </div>
                        </div>

                        <div className="p-4 space-y-4 bg-white dark:bg-slate-950">
                          {/* Analysis Cards */}
                          {gstr3bAnalysis.risks.length > 0 && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Compliance Risks Detected</AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr3bAnalysis.risks.map((risk, index) => (
                                    <li key={index}>{risk}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr3bAnalysis.suggestions.length > 0 && (
                            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300">
                              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <AlertTitle>
                                Suggestions for Improvement
                              </AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr3bAnalysis.suggestions.map(
                                    (suggestion, index) => (
                                      <li key={index}>{suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr3bAnalysis.flags.length > 0 && (
                            <Alert variant="warning">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Potential Issues</AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  {gstr3bAnalysis.flags.map((flag, index) => (
                                    <li key={index}>
                                      <span className="font-medium">
                                        {flag.type}:
                                      </span>{" "}
                                      {flag.description}
                                      <Badge
                                        variant="outline"
                                        className={
                                          flag.severity === "High"
                                            ? "ml-2 bg-red-100 text-red-800 border-red-200"
                                            : flag.severity === "Medium"
                                            ? "ml-2 bg-amber-100 text-amber-800 border-amber-200"
                                            : "ml-2 bg-blue-100 text-blue-800 border-blue-200"
                                        }
                                      >
                                        {flag.severity} Severity
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {gstr3bAnalysis.risks.length === 0 &&
                            gstr3bAnalysis.flags.length === 0 &&
                            gstr3bAnalysis.suggestions.length === 0 && (
                              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle>Perfect Compliance</AlertTitle>
                                <AlertDescription>
                                  No issues detected in your GSTR-3B. Great job
                                  maintaining compliance!
                                </AlertDescription>
                              </Alert>
                            )}
                        </div>
                      </div>

                      {/* Conditional Action Button based on compliance score */}
                      <div className="flex justify-center mt-6">
                        {complianceScore < 40 ? (
                          <Button
                            onClick={handleSendToCA}
                            className="gap-2 bg-amber-600 hover:bg-amber-700 px-8 py-6 text-lg"
                            size="lg"
                          >
                            <Send className="h-5 w-5" />
                            <span>Send to CA to Solve</span>
                          </Button>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={handleFileGSTR1}
                              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg"
                              size="lg"
                            >
                              <FileCheck2 className="h-5 w-5" />
                              <span>File GSTR-3B to GST</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Loading/empty state
                    <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                      {isLoading3B || isAnalyzing3B ? (
                        <div className="space-y-4 w-full">
                          <Skeleton className="h-8 w-3/4 mx-auto" />
                          <Skeleton className="h-20 w-full" />
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-medium">
                              No Analysis Available
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Generate and analyze your GSTR-3B to see
                              AI-powered insights
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={generateGSTR3B}
                            className="gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Generate GSTR-3B</span>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Your current GST compliance level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Overall Score</span>
                  <span
                    className={`text-sm font-medium ${getComplianceColor(
                      complianceScore
                    )}`}
                  >
                    {getComplianceStatus(complianceScore)}
                  </span>
                </div>
                <Progress value={complianceScore} className="h-2" />
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">GSTR-1 Filing</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Up to date
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GSTR-3B Filing</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Up to date
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Invoice Compliance</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    90%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">E-way Bill Compliance</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    100%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Compliance Achievements</CardTitle>
              <CardDescription>Milestones and badges earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <Award className="h-8 w-8 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-center">
                    Perfect Filing Streak
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-xs font-medium text-center">
                    Compliance Champion
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg bg-green-50 dark:bg-green-950/30">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-xs font-medium text-center">
                    Zero Errors
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Zap className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-center text-slate-500">
                    Early Filer
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <Award className="h-4 w-4" />
                <span>View All Achievements</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Filing Success Dialog */}
      <Dialog
        open={showFilingSuccessDialog}
        onOpenChange={setShowFilingSuccessDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
              <PartyPopper className="h-6 w-6" />
              Filing Successful!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your GSTR-1 has been successfully filed with the GST portal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-100 rounded-full p-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-green-200 rounded-full p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="bg-green-300 rounded-full p-4"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
              <div className="h-40 w-40"></div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <h3 className="text-lg font-medium">
                Compliance Achievement Unlocked!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You&apos;ve earned the &quot;Timely Filer&quot; badge for your GST compliance
                efforts.
              </p>
              <div className="flex items-center justify-center mt-4">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5">
                  <Award className="h-4 w-4 mr-1" />
                  <span>+50 Compliance Points</span>
                </Badge>
              </div>
            </motion.div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={() => setShowFilingSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CA Request Dialog */}
      <Dialog open={showCARequestDialog} onOpenChange={setShowCARequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {caApprovalStatus === "waiting"
                ? "Waiting for CA Approval"
                : "CA Approval Received"}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {caApprovalStatus === "waiting"
                ? "Your request has been sent to your CA for review and correction."
                : "Your CA has approved the corrections to your GSTR-1."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            {caApprovalStatus === "waiting" ? (
              <div className="flex flex-col items-center">
                <Clock className="h-16 w-16 text-amber-500 animate-pulse" />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Please wait while your CA reviews your GSTR-1 submission.
                  <br />
                  This usually takes 1-2 business hours.
                </p>
                <div className="w-full mt-6">
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Your CA has reviewed and approved your GSTR-1 with
                  corrections.
                  <br />
                  You can now proceed with filing.
                </p>
                <Button
                  className="mt-6 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowCARequestDialog(false);
                    setTimeout(() => {
                      setComplianceScore(Math.min(100, complianceScore + 15));
                      handleFileGSTR1();
                    }, 500);
                  }}
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>File Corrected GSTR-1</span>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
