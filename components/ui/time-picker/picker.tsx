"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker/time-picker-input";
import { useRef } from "react";

interface TimePickerProps {
  className?: string;
  date: Date | undefined;
  dateDidSet: (date: Date | undefined) => void;
}

export function TimePicker({ className, date, dateDidSet }: TimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-end justify-center gap-2 pb-2", className)}>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={dateDidSet}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
          className={
            "focus-visible:border-ts-gold focus-visible:bs-ts-blue-200"
          }
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={dateDidSet}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
          className={
            "focus-visible:border-ts-gold focus-visible:bs-ts-blue-200"
          }
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={dateDidSet}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
          className={
            "focus-visible:border-ts-gold focus-visible:bs-ts-blue-200"
          }
        />
      </div>
      <div className="flex h-10 items-center opacity-0">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}
