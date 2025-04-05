import { CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TaskSummary() {
  return (
    <div className="space-y-2">
      {tasks.slice(0, 3).map((task) => (
        <div
          key={task.id}
          className="flex items-start space-x-2 rounded-lg border p-2 transition-all hover:bg-accent/50"
        >
          <div
            className={cn(
              "mt-0.5 rounded-full p-1",
              task.status === "urgent"
                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : task.status === "due-soon"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                : task.status === "completed"
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            )}
          >
            {task.status === "urgent" ? (
              <AlertTriangle className="h-3 w-3" />
            ) : task.status === "due-soon" ? (
              <Clock className="h-3 w-3" />
            ) : task.status === "completed" ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <FileText className="h-3 w-3" />
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">{task.title}</p>
              <Badge
                variant={
                  task.status === "urgent"
                    ? "destructive"
                    : task.status === "due-soon"
                    ? "outline"
                    : task.status === "completed"
                    ? "default"
                    : "secondary"
                }
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  task.status === "completed"
                    ? "bg-green-500 hover:bg-green-500/80"
                    : ""
                )}
              >
                {task.statusText}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{task.dueDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const tasks = [
  {
    id: "1",
    title: "File GSTR-1 for October 2023",
    status: "urgent",
    statusText: "Urgent",
    dueDate: "Due in 1 day (Nov 11, 2023)",
  },
  {
    id: "2",
    title: "File GSTR-3B for October 2023",
    status: "due-soon",
    statusText: "Due Soon",
    dueDate: "Due in 7 days (Nov 17, 2023)",
  },
  {
    id: "3",
    title: "Review ITC Claims for Q2",
    status: "normal",
    statusText: "Normal",
    dueDate: "Due in 15 days (Nov 25, 2023)",
  },
];
