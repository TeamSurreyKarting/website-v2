import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker/picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function FormDatePicker({
  label,
  defaultValue,
  onValueChange,
  fullWidth,
}: {
  label: string;
  defaultValue?: Date;
  onValueChange: (value?: Date) => void;
  fullWidth?: boolean;
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"input"}
              className={cn(
                "pl-3 text-left font-normal",
                fullWidth ? "w-full" : "w-[240px]",
                !defaultValue && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
              {defaultValue ? (
                format(defaultValue, "HH:mm PPP")
              ) : (
                 <span>Pick a date</span>
               )}
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
