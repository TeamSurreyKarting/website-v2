alter table "public"."TaskAssignees" drop constraint "TaskAssignments_assigned_by_fkey";

alter table "public"."TaskAssignees" drop constraint "TaskAssignments_assigned_to_fkey";

alter table "public"."TaskComments" alter column "task" set not null;