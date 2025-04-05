"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Package,
  Users,
  Receipt,
  BarChart3,
  Truck,
  Store,
  Settings,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShortcutItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  path: string;
  description: string;
}

export function ShortcutsWidget() {
  const [favorites, setFavorites] = useState<string[]>([
    "inventory",
    "e-invoicing",
    "gstr-filing",
  ]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const shortcuts: ShortcutItem[] = [
    {
      id: "inventory",
      name: "Inventory",
      icon: Package,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      path: "/dashboard/inventory",
      description: "Manage your products and stock levels",
    },
    {
      id: "e-invoicing",
      name: "E-Invoicing",
      icon: FileText,
      color:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      path: "/dashboard/gst/e-invoicing",
      description: "Generate and manage GST e-invoices",
    },
    {
      id: "gstr-filing",
      name: "GSTR Filing",
      icon: Receipt,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      path: "/dashboard/gst/gstr-filing",
      description: "File your GST returns",
    },
    {
      id: "user-management",
      name: "Users",
      icon: Users,
      color:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      path: "/dashboard/user-management",
      description: "Manage users and permissions",
    },
    {
      id: "reports",
      name: "Reports",
      icon: BarChart3,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      path: "/dashboard/reports",
      description: "View business reports and analytics",
    },
    {
      id: "purchases",
      name: "Purchases",
      icon: Truck,
      color: "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
      path: "/dashboard/purchases",
      description: "Manage your purchase orders",
    },
    {
      id: "sales",
      name: "Sales",
      icon: Store,
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
      path: "/dashboard/sales",
      description: "Track your sales and invoices",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      color: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
      path: "/dashboard/settings",
      description: "Configure your account settings",
    },
  ];

  const favoriteShortcuts = shortcuts.filter((shortcut) =>
    favorites.includes(shortcut.id)
  );
  const otherShortcuts = shortcuts.filter(
    (shortcut) => !favorites.includes(shortcut.id)
  );

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Quick Access</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          {showAddMenu ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showAddMenu ? "Close" : "Add shortcut"}
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {favoriteShortcuts.map((shortcut) => (
          <ShortcutButton
            key={shortcut.id}
            shortcut={shortcut}
            isFavorite={true}
            onToggleFavorite={() => toggleFavorite(shortcut.id)}
          />
        ))}
      </div>

      {showAddMenu && otherShortcuts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 border-t pt-4"
        >
          <h4 className="text-xs font-medium text-muted-foreground mb-3">
            Add More Shortcuts
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherShortcuts.map((shortcut) => (
              <ShortcutButton
                key={shortcut.id}
                shortcut={shortcut}
                isFavorite={false}
                onToggleFavorite={() => toggleFavorite(shortcut.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ShortcutButtonProps {
  shortcut: ShortcutItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function ShortcutButton({
  shortcut,
  isFavorite,
  onToggleFavorite,
}: ShortcutButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-lg border p-3 transition-colors",
              "hover:border-primary/50 hover:bg-primary/5",
              isFavorite
                ? "border-primary/20 bg-primary/10"
                : "border-muted-foreground/20"
            )}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                onToggleFavorite();
              } else {
                // Navigate to the path
                window.location.href = shortcut.path;
              }
            }}
          >
            <div className={cn("mb-2 rounded-full p-2", shortcut.color)}>
              <shortcut.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">{shortcut.name}</span>

            <button
              className={cn(
                "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity",
                "group-hover:opacity-100",
                isFavorite
                  ? "hover:bg-red-100 hover:text-red-600"
                  : "hover:bg-green-100 hover:text-green-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              {isFavorite ? (
                <X className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{shortcut.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isFavorite
              ? "Ctrl+Click to remove"
              : "Ctrl+Click to add as favorite"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
