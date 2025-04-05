"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "success" | "info" | "warning" | "error";
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export function ToastNotification({
  open: openProp,
  onOpenChange,
  title,
  description,
  icon,
  action,
  variant = "default",
  duration = 5000,
  position = "bottom-right",
}: ToastProps) {
  const [open, setOpen] = useState(openProp || false);

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  const handleClose = () => {
    setOpen(false);
    onOpenChange?.(false);
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  const variantClasses = {
    default: "bg-background border",
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    warning:
      "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };

  const headerClasses = {
    default: "text-foreground",
    success: "text-green-700 dark:text-green-300",
    info: "text-blue-700 dark:text-blue-300",
    warning: "text-amber-700 dark:text-amber-300",
    error: "text-red-700 dark:text-red-300",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "fixed z-50 max-w-md shadow-lg rounded-lg overflow-hidden",
            positionClasses[position]
          )}
        >
          <div className={cn("rounded-lg", variantClasses[variant])}>
            <div className="flex items-start p-4 gap-3">
              {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn("font-medium text-sm", headerClasses[variant])}
                >
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
                {action && <div className="mt-3">{action}</div>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full -mt-1 -mr-1 flex-shrink-0"
                onClick={handleClose}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
