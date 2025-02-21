import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { format, parse, isValid, isBefore, isAfter } from "date-fns";

interface MonthPickerProps {
  name: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (value: Date) => void;
  disabled?: boolean | undefined;
  value?: Date | undefined;
  bypassValidation?: boolean | false;
}

export default function MonthYearPicker({
  name,
  minDate,
  maxDate,
  value,
  onChange,
  disabled,
  bypassValidation,
}: MonthPickerProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    value ? format(value, "MM") : undefined,
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    value ? format(value, "yyyy") : undefined,
  );

  useEffect(() => {
    console.log(selectedMonth, selectedYear);
  });

  const updateValue = (month: string, year: string) => {
    const newDate = parse(`${year}-${month}`, "yyyy-MM", new Date());
    if (isValid(newDate)) {
      if (
        bypassValidation ||
        ((!minDate || !isBefore(newDate, minDate)) &&
          (!maxDate || !isAfter(newDate, maxDate)))
      ) {
        console.log("valid", newDate);
        onChange?.(newDate);
        setSelectedMonth(month);
        setSelectedYear(year);
      }
    } else {
      console.log("invalid", newDate);
    }
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const minYear = minDate ? minDate.getFullYear() : currentYear - 10;
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 10;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
    (minYear + i).toString(),
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-2 items-center space-x-2">
        <Select
          defaultValue={selectedMonth}
          disabled={disabled}
          onValueChange={(value) => updateValue(value, selectedYear || "")}
        >
          <SelectTrigger id="month-select" className="md:w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={selectedYear}
          disabled={disabled}
          onValueChange={(value) => updateValue(selectedMonth || "", value)}
        >
          <SelectTrigger id="year-select" className={"md:w-[120px]"}>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <input
        type="month"
        name={name}
        value={
          selectedYear && selectedMonth
            ? `${selectedYear}-${selectedMonth}`
            : ""
        }
        onChange={() => console.log("foo")}
        className="sr-only"
        aria-hidden="true"
      />
    </>
  );
}
