import {columns} from "@/components/tasks/data-table/columns";
import {Database} from "@/database.types";
import {BaseDataTable} from "@/components/base-data-table";

export default async function TasksDataTable({ tasks }: { tasks: Database['public']['Tables']['Tasks']['Row'][] }) {
	return <BaseDataTable columns={columns} data={tasks} />;
}
