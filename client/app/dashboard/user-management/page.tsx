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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagementPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their access permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="active">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                      ${
                        user.role === "Admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : ""
                      }
                      ${
                        user.role === "Manager"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : ""
                      }
                      ${
                        user.role === "Accountant"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : ""
                      }
                      ${
                        user.role === "Viewer"
                          ? "bg-gray-50 text-gray-700 border-gray-200"
                          : ""
                      }
                    `}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : user.status === "Inactive"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {user.status}
                    </Badge>
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
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Active" ? (
                          <DropdownMenuItem className="text-amber-600">
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Delete
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
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understand the access levels for different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Accountant</TableHead>
                  <TableHead>Viewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dashboard</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>View Only</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Inventory Management
                  </TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>View Only</TableCell>
                  <TableCell>View Only</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">GST Filing</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>View Only</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">User Management</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>No Access</TableCell>
                  <TableCell>No Access</TableCell>
                  <TableCell>No Access</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">GSTN Management</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>View Only</TableCell>
                  <TableCell>View Only</TableCell>
                  <TableCell>No Access</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reports</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>Full Access</TableCell>
                  <TableCell>View Only</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const userData = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "Admin",
    lastActive: "Today, 10:30 AM",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "Manager",
    lastActive: "Today, 9:15 AM",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    role: "Accountant",
    lastActive: "Yesterday, 4:45 PM",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Neha Singh",
    email: "neha.singh@example.com",
    role: "Viewer",
    lastActive: "Nov 20, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    role: "Manager",
    lastActive: "Nov 18, 2023",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "6",
    name: "Ananya Gupta",
    email: "ananya.gupta@example.com",
    role: "Accountant",
    lastActive: "Never",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];
