import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import AddComment from "@/components/tasks/ui/add-comment";

async function getComments(taskId: string) {
  const supabase = await createClient();

  const { data: subtasks, error } = await supabase
    .from("TaskComments")
    .select("id, task, authored_by( id, fullName ), created_at, content")
    .eq("task", taskId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return subtasks;
}

export default async function Comments({
  taskId,
  className,
}: {
  taskId: string;
  className?: string;
}) {
  // todo: allow for realtime listening for comments that come in
  const comments = await getComments(taskId);

  return (
    <div className={className}>
      <div className={"flex flex-row gap-2.5"}>
        <h3 className={"text-lg font-medium"}>Comments</h3>
        <Badge
          variant="default"
          className={"rounded-full bg-ts-blue-200 border border-white"}
        >
          {comments.length}
        </Badge>
      </div>
      <div className={"flex flex-col gap-1.5 mt-3"}>
        {comments.map((c) => (
          <div
            key={c.id}
            className={
              "bg-ts-blue-400 border border-ts-blue-300 rounded-lg flex flex-col gap-1.5 px-3 py-1.5"
            }
          >
            <h4 className={"opacity-75 text-sm font-medium"}>
              {c.authored_by.fullName}
            </h4>
            <span className={"text-xs font-medium"}>
              {new Date(c.created_at).toLocaleString("en-GB")}
            </span>
            <p className={"text-sm"}>{c.content}</p>
          </div>
        ))}
      </div>
      <AddComment taskId={taskId} />
    </div>
  );
}
