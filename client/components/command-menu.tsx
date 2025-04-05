"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { DialogProps } from "@radix-ui/react-dialog";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  Store,
  Truck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/inventory"))
              }
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Inventory</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/gstn-management"))
              }
            >
              <Receipt className="mr-2 h-4 w-4" />
              <span>GSTN Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/user-management"))
              }
            >
              <Users className="mr-2 h-4 w-4" />
              <span>User Management</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="GST">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/gst/e-invoicing"))
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>E-Invoicing</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/gst/e-way-bill"))
              }
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>E-Way Bill</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/gst/gstr-filing"))
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>GSTR Filing</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/gst/returns"))
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>GST Returns</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Business">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/sales"))}
            >
              <Store className="mr-2 h-4 w-4" />
              <span>Sales</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/purchases"))
              }
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>Purchases</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/dashboard/reports"))
              }
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Reports</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
