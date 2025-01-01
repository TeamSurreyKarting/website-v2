import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/date-time-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function FormDueDatePicker({
  defaultValue,
  onValueChange,
  fullWidth,
}: {
  defaultValue?: Date;
  onValueChange: (value?: Date) => void;
  fullWidth?: boolean;
}) {
  return (
    <FormItem>
      <FormLabel>Due Date</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "pl-3 text-left font-normal",
                fullWidth ? "w-full" : "w-[240px]",
                "bg-ts-blue-600",
                !defaultValue && "text-muted-foreground",
              )}
            >
              {defaultValue ? (
                format(defaultValue, "HH:mm PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className={"bg-ts-blue-500 text-white"}
            mode="single"
            selected={defaultValue}
            onSelect={onValueChange}
            disabled={(date) => date <= new Date()}
            initialFocus
          />
          <div>
            <TimePicker
              className={"bg-ts-blue-500 text-white"}
              date={defaultValue}
              dateDidSet={onValueChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
