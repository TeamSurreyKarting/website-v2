revoke delete on table "public"."TaskAssignments" from "anon";

revoke insert on table "public"."TaskAssignments" from "anon";

revoke references on table "public"."TaskAssignments" from "anon";

revoke select on table "public"."TaskAssignments" from "anon";

revoke trigger on table "public"."TaskAssignments" from "anon";

revoke truncate on table "public"."TaskAssignments" from "anon";

revoke update on table "public"."TaskAssignments" from "anon";

revoke delete on table "public"."TaskAssignments" from "authenticated";

revoke insert on table "public"."TaskAssignments" from "authenticated";

revoke references on table "public"."TaskAssignments" from "authenticated";

revoke select on table "public"."TaskAssignments" from "authenticated";

revoke trigger on table "public"."TaskAssignments" from "authenticated";

revoke truncate on table "public"."TaskAssignments" from "authenticated";

revoke update on table "public"."TaskAssignments" from "authenticated";

revoke delete on table "public"."TaskAssignments" from "service_role";

revoke insert on table "public"."TaskAssignments" from "service_role";

revoke references on table "public"."TaskAssignments" from "service_role";

revoke select on table "public"."TaskAssignments" from "service_role";

revoke trigger on table "public"."TaskAssignments" from "service_role";

revoke truncate on table "public"."TaskAssignments" from "service_role";

revoke update on table "public"."TaskAssignments" from "service_role";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_assigned_by_fkey";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_assigned_by_fkey1";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_assigned_to_fkey";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_assigned_to_fkey1";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_task_fkey";

drop view if exists "public"."TaskDetailsView";

alter table "public"."TaskAssignments" drop constraint "TaskAssignments_pkey";

drop index if exists "public"."TaskAssignments_pkey";

drop table "public"."TaskAssignments";

create table "public"."TaskAssignees" (
										  "task" uuid not null default gen_random_uuid(),
										  "assigned_at" timestamp with time zone not null default now(),
										  "assigned_to" uuid not null,
										  "assigned_by" uuid not null default auth.uid()
);


alter table "public"."TaskComments" disable row level security;

CREATE UNIQUE INDEX "TaskAssignments_pkey" ON public."TaskAssignees" USING btree (task, assigned_to);

alter table "public"."TaskAssignees" add constraint "TaskAssignments_pkey" PRIMARY KEY using index "TaskAssignments_pkey";

alter table "public"."TaskAssignees" add constraint "TaskAssignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignees" validate constraint "TaskAssignments_assigned_by_fkey";

alter table "public"."TaskAssignees" add constraint "TaskAssignments_assigned_by_fkey1" FOREIGN KEY (assigned_by) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignees" validate constraint "TaskAssignments_assigned_by_fkey1";

alter table "public"."TaskAssignees" add constraint "TaskAssignments_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignees" validate constraint "TaskAssignments_assigned_to_fkey";

alter table "public"."TaskAssignees" add constraint "TaskAssignments_assigned_to_fkey1" FOREIGN KEY (assigned_to) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignees" validate constraint "TaskAssignments_assigned_to_fkey1";

alter table "public"."TaskAssignees" add constraint "TaskAssignments_task_fkey" FOREIGN KEY (task) REFERENCES "Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignees" validate constraint "TaskAssignments_task_fkey";

create or replace view "public"."TaskDetailsView" as  SELECT t.id,
															 t.created_at,
															 t.updated_at,
															 cb.id AS created_by_id,
															 cb."fullName" AS created_by_full_name,
															 prp.id AS primarily_responsible_person_id,
															 prp."fullName" AS primarily_responsible_person_full_name,
															 t.parent_task,
															 t.title,
															 t.description,
															 t.due_at,
															 t.status,
															 t.priority,
															 ARRAY( SELECT ra.id
           FROM "RacerDetails" ra
          WHERE (ra.id IN ( SELECT ta.assigned_to
                   FROM "TaskAssignees" ta
                  WHERE (ta.task = t.id)))) AS assignees,
															 ( SELECT count(*) AS count
													  FROM "TaskComments" tc
													  WHERE (tc.task = t.id)) AS comment_count,
														  count(subtasks.id) AS subtasks_total,
														  count(
														  CASE
														  WHEN (subtasks.status = 'Completed'::task_status) THEN 1
														  ELSE NULL::integer
														  END) AS subtasks_completed
													  FROM ((("Tasks" t
														  LEFT JOIN "RacerDetails" cb ON ((t.created_by = cb.id)))
														  LEFT JOIN "RacerDetails" prp ON ((t.primarily_responsible_person = prp.id)))
														  LEFT JOIN "Tasks" subtasks ON ((t.id = subtasks.parent_task)))
													  GROUP BY t.id, cb.id, cb."fullName", prp.id, prp."fullName"
													  ORDER BY t.created_at DESC;


grant delete on table "public"."TaskAssignees" to "anon";

grant insert on table "public"."TaskAssignees" to "anon";

grant references on table "public"."TaskAssignees" to "anon";

grant select on table "public"."TaskAssignees" to "anon";

grant trigger on table "public"."TaskAssignees" to "anon";

grant truncate on table "public"."TaskAssignees" to "anon";

grant update on table "public"."TaskAssignees" to "anon";

grant delete on table "public"."TaskAssignees" to "authenticated";

grant insert on table "public"."TaskAssignees" to "authenticated";

grant references on table "public"."TaskAssignees" to "authenticated";

grant select on table "public"."TaskAssignees" to "authenticated";

grant trigger on table "public"."TaskAssignees" to "authenticated";

grant truncate on table "public"."TaskAssignees" to "authenticated";

grant update on table "public"."TaskAssignees" to "authenticated";

grant delete on table "public"."TaskAssignees" to "service_role";

grant insert on table "public"."TaskAssignees" to "service_role";

grant references on table "public"."TaskAssignees" to "service_role";

grant select on table "public"."TaskAssignees" to "service_role";

grant trigger on table "public"."TaskAssignees" to "service_role";

grant truncate on table "public"."TaskAssignees" to "service_role";

grant update on table "public"."TaskAssignees" to "service_role";
