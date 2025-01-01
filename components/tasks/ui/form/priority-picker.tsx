import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormPriorityPicker({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange: (value?: string) => void;
}) {
  return (
    <FormItem>
      <FormLabel>Priority</FormLabel>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a priority..." />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
