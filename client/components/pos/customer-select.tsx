"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, User, UserPlus, Check } from "lucide-react";

interface POSCustomerSelectProps {
  customers: any[];
  onSelect: (customer: any) => void;
  onClose: () => void;
}

export function POSCustomerSelect({
  customers,
  onSelect,
  onClose,
}: POSCustomerSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating a new customer
  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;

    const customer = {
      id: `new-${Date.now()}`,
      ...newCustomer,
    };

    onSelect(customer);
  };

  // Handle quick customer (no details)
  const handleQuickCustomer = () => {
    const customer = {
      id: `quick-${Date.now()}`,
      name: "Walk-in Customer",
      phone: "",
      email: "",
    };

    onSelect(customer);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Select Customer</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="quick" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="existing">Existing</TabsTrigger>
            <TabsTrigger value="new">New Customer</TabsTrigger>
            <TabsTrigger value="quick">Quick Sale</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {filteredCustomers.length > 0 ? (
                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => onSelect(customer)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {customer.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <User className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No customers found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search or create a new customer
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="new" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    placeholder="Customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleCreateCustomer}
              disabled={!newCustomer.name || !newCustomer.phone}
            >
              <UserPlus className="h-4 w-4" />
              Create & Select Customer
            </Button>
          </TabsContent>

          <TabsContent value="quick" className="mt-4 space-y-4">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Quick Sale</h3>
              <p className="text-muted-foreground mb-6">
                Continue without adding customer details for a quick walk-in
                sale.
              </p>

              <Button className="gap-2" onClick={handleQuickCustomer}>
                <Check className="h-4 w-4" />
                Continue as Walk-in Customer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
