import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AssigneeEdit from "@/components/tasks/ui/assignee-edit";
import { TaskAssignmentWithAuthorDetails } from "@/utils/db-fns/tasks/types/task-assignment-with-author-details";

export default async function TaskAssignees({
  taskId,
  primaryResponsiblePerson,
  assignments
}: {
  taskId: string,
  primaryResponsiblePerson: {
    id: string;
    fullName: string;
  },
  assignments: TaskAssignmentWithAuthorDetails[] | null
}) {
  if (!assignments) { return null; }

  const totalAssignees = assignments.map((x) => x.assigned_to!.id).includes(primaryResponsiblePerson.id) ? assignments.length : assignments.length + 1;

  return (
    <div
      className={"rounded-lg bg-ts-blue border border-ts-blue-400 p-6 mt-6"}
    >
      <div
        className={"flex flex-wrap items-center justify-between gap-x-2 mb-3"}
      >
        <div className={"flex flex-row gap-2.5"}>
          <h3 className={"text-lg font-medium"}>Assignees</h3>
          <Badge
            variant="default"
            className={"rounded-full bg-ts-blue-200 border border-white"}
          >
            {totalAssignees}
          </Badge>
        </div>
        <AssigneeEdit
          taskId={taskId}
          primaryResponsiblePerson={primaryResponsiblePerson.id}
          assignees={assignments.map((x) => x.assigned_to!.id)}
        />
      </div>
      <TooltipProvider>
        <div className={"flex flex-row flex-wrap gap-3 mt-3 p-3"}>
          <Tooltip>
            <TooltipTrigger>
              <div className={"p-2 rounded text-black font-medium bg-ts-gold-700 border border-ts-gold-600"}>
                <span>{primaryResponsiblePerson.fullName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Primary Responsible Person</p>
            </TooltipContent>
          </Tooltip>
          {assignments.map((assignment) => {
            if (assignment.assigned_to!.id === primaryResponsiblePerson.id) { return null }

            return (
              <Tooltip
                key={`${assignment.task}-${assignment.assigned_to!.id}`}
              >
                <TooltipTrigger>
                  <div
                    className={"p-2 rounded font-medium bg-ts-blue-300 border border-ts-blue-200"}
                  >
                    <span>{assignment.assigned_to!.fullName}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned by: <strong>{assignment.assigned_by!.fullName}</strong></p>
                  <p>Assigned at: <strong>{(new Date(assignment.assigned_at)).toLocaleString()}</strong></p>
                </TooltipContent>
              </Tooltip>
            )}
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}