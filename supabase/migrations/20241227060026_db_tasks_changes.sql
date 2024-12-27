create type "public"."task_priority" as enum ('High', 'Medium', 'Low');

create type "public"."task_status" as enum ('Open', 'In Progress', 'Blocked', 'Completed', 'Cancelled');

create table "public"."TaskAssignments" (
											"task" uuid not null default gen_random_uuid(),
											"assigned_at" timestamp with time zone not null default now(),
											"assigned_to" uuid not null,
											"assigned_by" uuid not null default auth.uid()
);


alter table "public"."TaskAssignments" enable row level security;

create table "public"."TaskComments" (
										 "id" uuid not null default gen_random_uuid(),
										 "created_at" timestamp with time zone not null default now(),
										 "task" uuid default gen_random_uuid(),
										 "authored_by" uuid not null default auth.uid(),
										 "content" text not null
);


alter table "public"."TaskComments" enable row level security;

create table "public"."Tasks" (
								  "id" uuid not null default gen_random_uuid(),
								  "created_at" timestamp with time zone not null default now(),
								  "updated_at" timestamp with time zone not null default now(),
								  "created_by" uuid not null default auth.uid(),
								  "title" text not null,
								  "description" text not null,
								  "due_at" timestamp with time zone not null,
								  "status" task_status not null default 'Open'::task_status,
								  "priority" task_priority not null default 'Low'::task_priority,
								  "primarily_responsible_person" uuid not null,
								  "parent_task" uuid
);


CREATE UNIQUE INDEX "TaskAssignments_pkey" ON public."TaskAssignments" USING btree (task, assigned_to);

CREATE UNIQUE INDEX "TaskComments_pkey" ON public."TaskComments" USING btree (id);

CREATE UNIQUE INDEX "Tasks_pkey" ON public."Tasks" USING btree (id);

alter table "public"."TaskAssignments" add constraint "TaskAssignments_pkey" PRIMARY KEY using index "TaskAssignments_pkey";

alter table "public"."TaskComments" add constraint "TaskComments_pkey" PRIMARY KEY using index "TaskComments_pkey";

alter table "public"."Tasks" add constraint "Tasks_pkey" PRIMARY KEY using index "Tasks_pkey";

alter table "public"."TaskAssignments" add constraint "TaskAssignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignments" validate constraint "TaskAssignments_assigned_by_fkey";

alter table "public"."TaskAssignments" add constraint "TaskAssignments_assigned_by_fkey1" FOREIGN KEY (assigned_by) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignments" validate constraint "TaskAssignments_assigned_by_fkey1";

alter table "public"."TaskAssignments" add constraint "TaskAssignments_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignments" validate constraint "TaskAssignments_assigned_to_fkey";

alter table "public"."TaskAssignments" add constraint "TaskAssignments_assigned_to_fkey1" FOREIGN KEY (assigned_to) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignments" validate constraint "TaskAssignments_assigned_to_fkey1";

alter table "public"."TaskAssignments" add constraint "TaskAssignments_task_fkey" FOREIGN KEY (task) REFERENCES "Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskAssignments" validate constraint "TaskAssignments_task_fkey";

alter table "public"."TaskComments" add constraint "TaskComments_authored_by_fkey1" FOREIGN KEY (authored_by) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskComments" validate constraint "TaskComments_authored_by_fkey1";

alter table "public"."TaskComments" add constraint "TaskComments_task_fkey" FOREIGN KEY (task) REFERENCES "Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."TaskComments" validate constraint "TaskComments_task_fkey";

alter table "public"."Tasks" add constraint "Tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Tasks" validate constraint "Tasks_created_by_fkey";

alter table "public"."Tasks" add constraint "Tasks_created_by_fkey1" FOREIGN KEY (created_by) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Tasks" validate constraint "Tasks_created_by_fkey1";

alter table "public"."Tasks" add constraint "Tasks_parent_task_fkey" FOREIGN KEY (parent_task) REFERENCES "Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Tasks" validate constraint "Tasks_parent_task_fkey";

alter table "public"."Tasks" add constraint "Tasks_primarily_responsible_person_fkey" FOREIGN KEY (primarily_responsible_person) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Tasks" validate constraint "Tasks_primarily_responsible_person_fkey";

alter table "public"."Tasks" add constraint "Tasks_primarily_responsible_person_fkey1" FOREIGN KEY (primarily_responsible_person) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Tasks" validate constraint "Tasks_primarily_responsible_person_fkey1";

grant delete on table "public"."TaskAssignments" to "anon";

grant insert on table "public"."TaskAssignments" to "anon";

grant references on table "public"."TaskAssignments" to "anon";

grant select on table "public"."TaskAssignments" to "anon";

grant trigger on table "public"."TaskAssignments" to "anon";

grant truncate on table "public"."TaskAssignments" to "anon";

grant update on table "public"."TaskAssignments" to "anon";

grant delete on table "public"."TaskAssignments" to "authenticated";

grant insert on table "public"."TaskAssignments" to "authenticated";

grant references on table "public"."TaskAssignments" to "authenticated";

grant select on table "public"."TaskAssignments" to "authenticated";

grant trigger on table "public"."TaskAssignments" to "authenticated";

grant truncate on table "public"."TaskAssignments" to "authenticated";

grant update on table "public"."TaskAssignments" to "authenticated";

grant delete on table "public"."TaskAssignments" to "service_role";

grant insert on table "public"."TaskAssignments" to "service_role";

grant references on table "public"."TaskAssignments" to "service_role";

grant select on table "public"."TaskAssignments" to "service_role";

grant trigger on table "public"."TaskAssignments" to "service_role";

grant truncate on table "public"."TaskAssignments" to "service_role";

grant update on table "public"."TaskAssignments" to "service_role";

grant delete on table "public"."TaskComments" to "anon";

grant insert on table "public"."TaskComments" to "anon";

grant references on table "public"."TaskComments" to "anon";

grant select on table "public"."TaskComments" to "anon";

grant trigger on table "public"."TaskComments" to "anon";

grant truncate on table "public"."TaskComments" to "anon";

grant update on table "public"."TaskComments" to "anon";

grant delete on table "public"."TaskComments" to "authenticated";

grant insert on table "public"."TaskComments" to "authenticated";

grant references on table "public"."TaskComments" to "authenticated";

grant select on table "public"."TaskComments" to "authenticated";

grant trigger on table "public"."TaskComments" to "authenticated";

grant truncate on table "public"."TaskComments" to "authenticated";

grant update on table "public"."TaskComments" to "authenticated";

grant delete on table "public"."TaskComments" to "service_role";

grant insert on table "public"."TaskComments" to "service_role";

grant references on table "public"."TaskComments" to "service_role";

grant select on table "public"."TaskComments" to "service_role";

grant trigger on table "public"."TaskComments" to "service_role";

grant truncate on table "public"."TaskComments" to "service_role";

grant update on table "public"."TaskComments" to "service_role";

grant delete on table "public"."Tasks" to "anon";

grant insert on table "public"."Tasks" to "anon";

grant references on table "public"."Tasks" to "anon";

grant select on table "public"."Tasks" to "anon";

grant trigger on table "public"."Tasks" to "anon";

grant truncate on table "public"."Tasks" to "anon";

grant update on table "public"."Tasks" to "anon";

grant delete on table "public"."Tasks" to "authenticated";

grant insert on table "public"."Tasks" to "authenticated";

grant references on table "public"."Tasks" to "authenticated";

grant select on table "public"."Tasks" to "authenticated";

grant trigger on table "public"."Tasks" to "authenticated";

grant truncate on table "public"."Tasks" to "authenticated";

grant update on table "public"."Tasks" to "authenticated";

grant delete on table "public"."Tasks" to "service_role";

grant insert on table "public"."Tasks" to "service_role";

grant references on table "public"."Tasks" to "service_role";

grant select on table "public"."Tasks" to "service_role";

grant trigger on table "public"."Tasks" to "service_role";

grant truncate on table "public"."Tasks" to "service_role";

grant update on table "public"."Tasks" to "service_role";
