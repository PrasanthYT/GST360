"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: string;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
}

function DatePicker({ className, date, setDate }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );

  const handleDateSelect = (date: Date | undefined) => {
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
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
}

function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
    date
  );

  const handleDateSelect = (date: DateRange | undefined) => {
    if (date) {
      setSelectedDate(date);
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
                  {format(selectedDate.from, "PPP")} -{" "}
                  {format(selectedDate.to, "PPP")}
                </>
              ) : (
                format(selectedDate.from, "PPP")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DatePicker, DatePickerWithRange };
