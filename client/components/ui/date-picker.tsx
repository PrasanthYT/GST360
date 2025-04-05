"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange as DateRangeType } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  date?: DateRangeType;
  setDate?: (date: DateRangeType | undefined) => void;
  className?: string;
}

function DatePickerWithRange({
  date,
  setDate,
  className,
}: DatePickerWithRangeProps) {
  const [selectedDate, setSelectedDate] = React.useState<
    DateRangeType | undefined
  >(date);

  const handleDateSelect = (date: DateRangeType | undefined) => {
    setSelectedDate(date);
    if (setDate) {
      setDate(date);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <>
                  {format(selectedDate.from, "LLL d, y")} -{" "}
                  {format(selectedDate.to, "LLL d, y")}
                </>
              ) : (
                format(selectedDate.from, "LLL d, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DatePickerWithRange };
