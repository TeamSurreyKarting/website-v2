import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormStatusPicker({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange: (value?: string) => void;
}) {
  return (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a status..." />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Blocked">Blocked</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
