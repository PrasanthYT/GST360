"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Home,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Store,
  Truck,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { CommandMenu } from "@/components/command-menu";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    gst: pathname.includes("/dashboard/gst"),
  });

  // Close the mobile sidebar when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleSubmenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/dashboard/inventory",
      active: pathname === "/dashboard/inventory",
    },
    {
      label: "GST",
      icon: Receipt,
      href: "#",
      key: "gst",
      active: pathname.includes("/dashboard/gst"),
      submenu: [
        {
          label: "E-Invoicing",
          href: "/dashboard/gst/e-invoicing",
          active: pathname === "/dashboard/gst/e-invoicing",
        },
        {
          label: "E-Way Bill",
          href: "/dashboard/gst/e-way-bill",
          active: pathname === "/dashboard/gst/e-way-bill",
        },
        {
          label: "GSTR Filing",
          href: "/dashboard/gst/gstr-filing",
          active: pathname === "/dashboard/gst/gstr-filing",
        },
        {
          label: "GST Returns",
          href: "/dashboard/gst/returns",
          active: pathname === "/dashboard/gst/returns",
        },
      ],
    },
    {
      label: "Sales",
      icon: Store,
      href: "/dashboard/sales",
      active: pathname === "/dashboard/sales",
    },
    {
      label: "Purchases",
      icon: Truck,
      href: "/dashboard/purchases",
      active: pathname === "/dashboard/purchases",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/dashboard/reports",
      active: pathname === "/dashboard/reports",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/dashboard/customers",
      active: pathname === "/dashboard/customers",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      active: pathname === "/dashboard/documents",
    },
    {
      label: "GSTN Management",
      icon: Receipt,
      href: "/dashboard/gstn-management",
      active: pathname === "/dashboard/gstn-management",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/dashboard/user-management",
      active: pathname === "/dashboard/user-management",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar
            routes={routes}
            openMenus={openMenus}
            toggleSubmenu={toggleSubmenu}
          />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "hidden border-r bg-background md:flex md:w-64 md:flex-col",
          className
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Logo className="h-6 w-auto" />
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-2">
            {routes.map((route) => (
              <div key={route.href}>
                {route.submenu ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => route.key && toggleSubmenu(route.key)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        route.active
                          ? "bg-accent text-accent-foreground"
                          : "transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon className="h-5 w-5" />
                        {route.label}
                      </div>
                      {route.key && openMenus[route.key] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {route.key && openMenus[route.key] && (
                      <div className="ml-8 mt-2 space-y-1">
                        {route.submenu.map((submenu) => (
                          <Link
                            key={submenu.href}
                            href={submenu.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              submenu.active
                                ? "bg-accent/50 text-accent-foreground"
                                : "transparent"
                            )}
                          >
                            {submenu.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={route.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      route.active
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}

function MobileSidebar({
  routes,
  openMenus,
  toggleSubmenu,
}: {
  routes: any[];
  openMenus: Record<string, boolean>;
  toggleSubmenu: (key: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Logo className="h-6 w-auto" />
      </div>
      <div className="p-4">
        <CommandMenu className="w-full md:hidden" />
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {routes.map((route) => (
            <div key={route.href}>
              {route.submenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => route.key && toggleSubmenu(route.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      route.active
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </div>
                    {route.key && openMenus[route.key] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {route.key && openMenus[route.key] && (
                    <div className="ml-8 mt-2 space-y-1">
                      {route.submenu.map((submenu: any) => (
                        <Link
                          key={submenu.href}
                          href={submenu.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            submenu.active
                              ? "bg-accent/50 text-accent-foreground"
                              : "transparent"
                          )}
                        >
                          {submenu.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
