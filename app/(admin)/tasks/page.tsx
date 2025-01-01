import Search from "@/components/search";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import TaskViews from "@/components/tasks/ui/task-views";
import { Suspense } from "react";

export default async function TasksPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    view?: string;
  }>;
}) {
  const query = (await searchParams)?.q ?? "";
  const view = (await searchParams)?.view;

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Tasks</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <Search />
        <Link href={"/tasks/new"} className={"flex gap-2 items-center"}>
          <Button variant={"secondary"}>
            <FaPlus />
            Create
          </Button>
        </Link>
      </div>
      <Suspense key={query} fallback={<p>Loading...</p>}>
        <TaskViews query={query} view={view} />
      </Suspense>
    </div>
  );
}
