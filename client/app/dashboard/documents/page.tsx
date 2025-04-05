import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Upload,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileImage,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data for documents
const documents = [
  {
    id: "doc-1",
    name: "Invoice #INV-2023-001",
    type: "pdf",
    size: "245 KB",
    date: "2023-04-01",
    status: "verified",
  },
  {
    id: "doc-2",
    name: "GST Return Q1 2023",
    type: "spreadsheet",
    size: "1.2 MB",
    date: "2023-04-15",
    status: "verified",
  },
  {
    id: "doc-3",
    name: "Receipt #REC-2023-042",
    type: "pdf",
    size: "120 KB",
    date: "2023-04-22",
    status: "pending",
  },
  {
    id: "doc-4",
    name: "Product Catalog",
    type: "image",
    size: "3.5 MB",
    date: "2023-04-25",
    status: "verified",
  },
  {
    id: "doc-5",
    name: "Vendor Agreement",
    type: "text",
    size: "350 KB",
    date: "2023-04-28",
    status: "pending",
  },
  {
    id: "doc-6",
    name: "Tax Invoice #TI-2023-015",
    type: "pdf",
    size: "280 KB",
    date: "2023-05-02",
    status: "verified",
  },
  {
    id: "doc-7",
    name: "Inventory Report May 2023",
    type: "spreadsheet",
    size: "1.8 MB",
    date: "2023-05-05",
    status: "verified",
  },
  {
    id: "doc-8",
    name: "Business Registration",
    type: "pdf",
    size: "1.5 MB",
    date: "2023-05-10",
    status: "verified",
  },
];

// Function to get the appropriate icon based on document type
const getDocumentIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FilePdf className="h-10 w-10 text-red-500" />;
    case "spreadsheet":
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    case "image":
      return <FileImage className="h-10 w-10 text-blue-500" />;
    case "text":
    default:
      return <FileText className="h-10 w-10 text-gray-500" />;
  }
};

// Function to get the status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Verified</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center text-amber-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Pending</span>
        </div>
      );
    default:
      return null;
  }
};

export default function DocumentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop your files here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-category">Document Category</Label>
                <select
                  id="document-category"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="invoice">Invoice</option>
                  <option value="receipt">Receipt</option>
                  <option value="tax">Tax Document</option>
                  <option value="legal">Legal Document</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search documents..." className="pl-10" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Documents</DropdownMenuItem>
            <DropdownMenuItem>Invoices</DropdownMenuItem>
            <DropdownMenuItem>Tax Documents</DropdownMenuItem>
            <DropdownMenuItem>Receipts</DropdownMenuItem>
            <DropdownMenuItem>Legal Documents</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
            <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
            <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem>Size (Largest)</DropdownMenuItem>
            <DropdownMenuItem>Size (Smallest)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="verified">
            <CheckCircle className="h-4 w-4 mr-2" />
            Verified
          </TabsTrigger>
          <TabsTrigger value="pending">
            <AlertCircle className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {getDocumentIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-medium truncate"
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{doc.size}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">{getStatusBadge(doc.status)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Document Card */}
            <Card className="overflow-hidden border-dashed cursor-pointer hover:bg-gray-50 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[180px]">
                <Plus className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Add New Document</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.slice(0, 4).map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {getDocumentIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-medium truncate"
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{doc.size}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">{getStatusBadge(doc.status)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .filter((doc) => doc.status === "verified")
              .map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {getDocumentIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-sm font-medium truncate"
                          title={doc.name}
                        >
                          {doc.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{doc.size}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">{getStatusBadge(doc.status)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .filter((doc) => doc.status === "pending")
              .map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {getDocumentIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-sm font-medium truncate"
                          title={doc.name}
                        >
                          {doc.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{doc.size}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">{getStatusBadge(doc.status)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
