import { columns } from "@/components/tasks/data-table/columns";
import { Database } from "@/database.types";
import { TableView } from "@/components/table-view";

export default async function TasksDataTable({
  tasks,
}: {
  tasks: Database["public"]["Views"]["TaskDetailsView"]["Row"][];
}) {
  return <TableView columns={columns} data={tasks} />;
}
