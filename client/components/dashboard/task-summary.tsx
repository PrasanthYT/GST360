"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function TaskSummary() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleCompleteTask = (id: string) => {
    if (!completedTasks.includes(id)) {
      setCompletedTasks([...completedTasks, id]);

      // Trigger confetti for task completion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleExpandTask = (id: string) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isCompleted = completedTasks.includes(task.id);
        const isExpanded = expandedTask === task.id;

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-lg border p-2.5 transition-all hover:shadow-sm",
              isCompleted
                ? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                : "hover:bg-accent/50",
              isExpanded ? "shadow-sm" : ""
            )}
          >
            <div className="flex items-start space-x-2">
              <div
                className={cn(
                  "mt-0.5 rounded-full p-1 cursor-pointer transition-colors",
                  isCompleted
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : task.status === "urgent"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : task.status === "due-soon"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                )}
                onClick={() => handleCompleteTask(task.id)}
              >
                {isCompleted ? (
                  <CheckCircle className="h-3 w-3" />
                ) : task.status === "urgent" ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : task.status === "due-soon" ? (
                  <Clock className="h-3 w-3" />
                ) : (
                  <FileText className="h-3 w-3" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                  <Badge
                    variant={
                      isCompleted
                        ? "default"
                        : task.status === "urgent"
                        ? "destructive"
                        : task.status === "due-soon"
                        ? "outline"
                        : "secondary"
                    }
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      isCompleted ? "bg-green-500 hover:bg-green-500/80" : ""
                    )}
                  >
                    {isCompleted ? "Completed" : task.statusText}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {task.dueDate}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    {!isCompleted && (
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <svg
                          className="h-3 w-3 fill-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span>+{task.points} points</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleExpandTask(task.id)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                    <span className="sr-only">Details</span>
                  </Button>
                </div>
              </div>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 border-t pt-2"
              >
                <p className="text-[10px] text-muted-foreground">
                  {task.description}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => setExpandedTask(null)}
                  >
                    Close
                  </Button>
                  {!isCompleted && (
                    <Button
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
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
    points: 150,
    description:
      "Complete and submit GSTR-1 return for October 2023. This includes all outward supplies, exports, and amendments.",
  },
  {
    id: "2",
    title: "File GSTR-3B for October 2023",
    status: "due-soon",
    statusText: "Due Soon",
    dueDate: "Due in 7 days (Nov 17, 2023)",
    points: 120,
    description:
      "Complete and submit GSTR-3B return for October 2023. Ensure all input tax credits are properly claimed.",
  },
  {
    id: "3",
    title: "Review ITC Claims for Q2",
    status: "normal",
    statusText: "Normal",
    dueDate: "Due in 15 days (Nov 25, 2023)",
    points: 100,
    description:
      "Review all input tax credit claims for Q2 (July-September 2023) to ensure accuracy before quarterly reconciliation.",
  },
];
