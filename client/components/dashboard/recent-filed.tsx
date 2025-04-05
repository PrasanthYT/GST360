"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileCheck,
  AlertCircle,
  Download,
  Eye,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RecentFiled() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {recentlyFiled.map((item) => {
        const isExpanded = expandedItem === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-lg border p-2 transition-all",
              isExpanded ? "bg-accent/30 shadow-sm" : "hover:bg-accent/20",
              item.status === "Approved" && "border-green-200"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleExpand(item.id)}
          >
            <div className="flex items-start gap-2">
              <div className="relative">
                <Avatar className="h-7 w-7 border">
                  <AvatarImage src={item.avatar} alt="Avatar" />
                  <AvatarFallback className="bg-primary/10 text-[10px]">
                    {item.initial}
                  </AvatarFallback>
                </Avatar>
                {item.status === "Approved" && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5 text-white ring-2 ring-background">
                    <CheckIcon className="h-2 w-2" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium leading-none">
                    {item.name}
                  </p>
                  <Badge
                    variant={
                      item.status === "Approved"
                        ? "default"
                        : item.status === "Under Review"
                        ? "outline"
                        : "secondary"
                    }
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      item.status === "Approved" &&
                        "bg-green-500 hover:bg-green-500/80"
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{item.date}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  {item.status === "Approved" ? (
                    <FileCheck className="h-2.5 w-2.5 text-green-500" />
                  ) : item.status === "Under Review" ? (
                    <AlertCircle className="h-2.5 w-2.5 text-amber-500" />
                  ) : (
                    <FileText className="h-2.5 w-2.5 text-blue-500" />
                  )}
                  <span>{item.additionalInfo}</span>
                </div>
              </div>
            </div>

            {(isExpanded || isHovered) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "mt-2 flex justify-end gap-1",
                  !isExpanded && "pt-1 border-t"
                )}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="h-3 w-3" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">View Return</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-3 w-3" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Download PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Share2 className="h-3 w-3" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Share Return</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 border-t pt-2"
              >
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <p className="font-medium">Return Period:</p>
                    <p className="text-muted-foreground">
                      {item.details?.period}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">ARN Number:</p>
                    <p className="text-muted-foreground">{item.details?.arn}</p>
                  </div>
                  <div>
                    <p className="font-medium">Filed By:</p>
                    <p className="text-muted-foreground">
                      {item.details?.filedBy}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Mode:</p>
                    <p className="text-muted-foreground">
                      {item.details?.mode}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const recentlyFiled = [
  {
    id: "1",
    name: "GSTR-1 (Oct 2023)",
    date: "Filed on Nov 11, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G1",
    additionalInfo: "Processed in 2 hours",
    details: {
      period: "October 2023",
      arn: "AA2310230012345",
      filedBy: "Rahul Sharma",
      mode: "Online",
    },
  },
  {
    id: "2",
    name: "GSTR-3B (Oct 2023)",
    date: "Filed on Nov 20, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G3",
    additionalInfo: "Filed on time",
    details: {
      period: "October 2023",
      arn: "AB2310230054321",
      filedBy: "Rahul Sharma",
      mode: "Online",
    },
  },
  {
    id: "3",
    name: "GSTR-1 (Sep 2023)",
    date: "Filed on Oct 11, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G1",
    additionalInfo: "No discrepancies found",
    details: {
      period: "September 2023",
      arn: "AA2309230087654",
      filedBy: "Rahul Sharma",
      mode: "Offline",
    },
  },
];
