import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GSTNManagementPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GSTN Management</h1>
          <p className="text-muted-foreground">
            Manage multiple GSTN numbers for your business
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add GSTN
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your GSTN Numbers</CardTitle>
          <CardDescription>
            View and manage all your registered GSTN numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GSTN Number</TableHead>
                <TableHead>Trade Name</TableHead>
                <TableHead>Legal Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gstnData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.gstn}</TableCell>
                  <TableCell>{item.tradeName}</TableCell>
                  <TableCell>{item.legalName}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Active" ? "default" : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.isDefault && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Default
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {!item.isDefault && (
                          <DropdownMenuItem>Set as Default</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GSTN Verification</CardTitle>
          <CardDescription>
            Verify a new GSTN number before adding it to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              To add a new GSTN number, you need to verify it first. Click the
              "Add GSTN" button above to start the verification process.
            </p>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">
                Benefits of managing multiple GSTN numbers:
              </h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>
                  Manage all your business entities from a single dashboard
                </li>
                <li>Switch between different GSTN numbers easily</li>
                <li>
                  Generate consolidated reports across all your businesses
                </li>
                <li>Streamline compliance for all your registered entities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const gstnData = [
  {
    id: "1",
    gstn: "27AAPFU0939F1ZV",
    tradeName: "ABC Enterprises",
    legalName: "ABC Enterprises Private Limited",
    state: "Maharashtra",
    status: "Active",
    isDefault: true,
  },
  {
    id: "2",
    gstn: "29AAPFU0939F1ZT",
    tradeName: "ABC Enterprises - Karnataka",
    legalName: "ABC Enterprises Private Limited",
    state: "Karnataka",
    status: "Active",
    isDefault: false,
  },
  {
    id: "3",
    gstn: "07AAPFU0939F1ZU",
    tradeName: "ABC Enterprises - Delhi",
    legalName: "ABC Enterprises Private Limited",
    state: "Delhi",
    status: "Active",
    isDefault: false,
  },
  {
    id: "4",
    gstn: "33AAPFU0939F1ZS",
    tradeName: "ABC Enterprises - Tamil Nadu",
    legalName: "ABC Enterprises Private Limited",
    state: "Tamil Nadu",
    status: "Inactive",
    isDefault: false,
  },
];
