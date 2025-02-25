"use client";

import { columns } from "@/components/tasks/data-table/columns";
import { Tables } from "@/database.types";
import { TableView } from "@/components/table-view";
import { WindowCollectionView } from "@/components/collection-view";
import TaskCard from "@/components/tasks/kanban-board/task-card";

export default function TasksDataTable({
  tasks,
  authedUserId,
}: {
  tasks: Tables<'TaskDetailsView'>[],
  authedUserId: string | undefined,
}) {
  const collectionData = tasks.map((task) => {
    return {
      href: `/tasks/${task.id}`,
      ...task,
    }
  });

  return (
    <>
      <WindowCollectionView data={collectionData} renderItem={(item) => {
        return <TaskCard task={item} authedUserId={authedUserId} />;
      }} className={"md:hidden mt-4 mb-16 h-full"} />
      <TableView columns={columns} data={tasks} className={"hidden md:block"} />
    </>
  );
}
