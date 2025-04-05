"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  RefreshCw,
  Printer,
  Copy,
  Send,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { DateRange } from "@/components/dashboard/date-range";

// Mock invoice data
const invoiceData = [
  {
    id: "INV-2023-001",
    customer: "ABC Enterprises",
    customerGstin: "27AAPFU0939F1ZV",
    date: "2023-11-24",
    dueDate: "2023-12-24",
    amount: 45600,
    status: "Paid",
    items: 12,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-002",
    customer: "XYZ Corporation",
    customerGstin: "29AAPFU0939F1ZT",
    date: "2023-11-20",
    dueDate: "2023-12-20",
    amount: 28750,
    status: "Pending",
    items: 8,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-003",
    customer: "Global Solutions Ltd",
    customerGstin: "07AAPFU0939F1ZU",
    date: "2023-11-15",
    dueDate: "2023-12-15",
    amount: 12480,
    status: "Paid",
    items: 5,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-004",
    customer: "Tech Innovators",
    customerGstin: "33AAPFU0939F1ZS",
    date: "2023-11-10",
    dueDate: "2023-12-10",
    amount: 34250,
    status: "Overdue",
    items: 10,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-005",
    customer: "Sunrise Industries",
    customerGstin: "27AAPFU0939F1ZV",
    date: "2023-11-05",
    dueDate: "2023-12-05",
    amount: 18900,
    status: "Paid",
    items: 7,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-006",
    customer: "Pinnacle Enterprises",
    customerGstin: "29AAPFU0939F1ZT",
    date: "2023-10-28",
    dueDate: "2023-11-28",
    amount: 9450,
    status: "Cancelled",
    items: 3,
    type: "Proforma Invoice",
  },
  {
    id: "INV-2023-007",
    customer: "Omega Solutions",
    customerGstin: "07AAPFU0939F1ZU",
    date: "2023-10-22",
    dueDate: "2023-11-22",
    amount: 22680,
    status: "Paid",
    items: 9,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-008",
    customer: "Delta Corp",
    customerGstin: "33AAPFU0939F1ZS",
    date: "2023-10-18",
    dueDate: "2023-11-18",
    amount: 15340,
    status: "Pending",
    items: 6,
    type: "Tax Invoice",
  },
  {
    id: "INV-2023-009",
    customer: "Horizon Ltd",
    customerGstin: "27AAPFU0939F1ZV",
    date: "2023-10-12",
    dueDate: "2023-11-12",
    amount: 8760,
    status: "Paid",
    items: 4,
    type: "Credit Note",
  },
  {
    id: "INV-2023-010",
    customer: "Summit Industries",
    customerGstin: "29AAPFU0939F1ZT",
    date: "2023-10-05",
    dueDate: "2023-11-05",
    amount: 31200,
    status: "Draft",
    items: 11,
    type: "Proforma Invoice",
  },
];

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter invoices based on search query, status, and type
  const filteredInvoices = invoiceData.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerGstin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      invoice.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesType =
      selectedType === "all" ||
      invoice.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort invoices based on selected sort order
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalInvoices = invoiceData.length;
  const totalPaid = invoiceData.filter((inv) => inv.status === "Paid").length;
  const totalPending = invoiceData.filter(
    (inv) => inv.status === "Pending"
  ).length;
  const totalOverdue = invoiceData.filter(
    (inv) => inv.status === "Overdue"
  ).length;
  const totalAmount = invoiceData.reduce((sum, inv) => sum + inv.amount, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCreateInvoice = () => {
    router.push("/dashboard/invoices/create");
  };

  // Function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "Overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      case "Draft":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Draft
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Draft":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Invoices</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create, manage, and track all your invoices
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={handleCreateInvoice} className="gap-2">
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <Card className="border-blue-200 hover:border-blue-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <div className="text-xs text-muted-foreground">All invoices</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1"
        >
          <Card className="border-green-200 hover:border-green-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPaid}</div>
              <div className="text-xs text-muted-foreground">Paid invoices</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="border-amber-200 hover:border-amber-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <div className="text-xs text-muted-foreground">
                Pending invoices
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="border-red-200 hover:border-red-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOverdue}</div>
              <div className="text-xs text-muted-foreground">
                Overdue invoices
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="col-span-1"
        >
          <Card className="border-purple-200 hover:border-purple-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Total invoice value
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices by ID, customer, or GSTIN..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <DateRange className="hidden md:block" />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border rounded-lg p-4 bg-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Invoice Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("all")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === "paid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("paid")}
                    className="justify-start"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Paid
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "pending" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("pending")}
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    Pending
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "overdue" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("overdue")}
                    className="justify-start"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    Overdue
                  </Button>
                  <Button
                    variant={selectedStatus === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("draft")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    Draft
                  </Button>
                  <Button
                    variant={
                      selectedStatus === "cancelled" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedStatus("cancelled")}
                    className="justify-start"
                  >
                    <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Invoice Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("all")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    All Types
                  </Button>
                  <Button
                    variant={
                      selectedType === "tax invoice" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedType("tax invoice")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Tax Invoice
                  </Button>
                  <Button
                    variant={
                      selectedType === "proforma invoice"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedType("proforma invoice")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Proforma
                  </Button>
                  <Button
                    variant={
                      selectedType === "credit note" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedType("credit note")}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Credit Note
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Date Range</h3>
                <DateRange />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedType("all");
                  }}
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setIsFiltersOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Invoice List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Invoice List</CardTitle>
            <Select defaultValue={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">
                  Amount (High to Low)
                </SelectItem>
                <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No invoices found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{invoice.customer}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.customerGstin}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.type}</TableCell>
                      <TableCell className="text-right">
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send to Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
