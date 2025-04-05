import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentFiled() {
  return (
    <div className="space-y-2">
      {recentlyFiled.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-2 rounded-lg border p-2 transition-all hover:bg-accent/50"
        >
          <Avatar className="h-7 w-7 border">
            <AvatarImage src={item.avatar} alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-[10px]">
              {item.initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium leading-none">{item.name}</p>
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
      ))}
    </div>
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
  },
  {
    id: "2",
    name: "GSTR-3B (Oct 2023)",
    date: "Filed on Nov 20, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G3",
    additionalInfo: "Filed on time",
  },
  {
    id: "3",
    name: "GSTR-1 (Sep 2023)",
    date: "Filed on Oct 11, 2023",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
    initial: "G1",
    additionalInfo: "No discrepancies found",
  },
];
