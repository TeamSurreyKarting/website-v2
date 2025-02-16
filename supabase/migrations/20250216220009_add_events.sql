create table "public"."EventChecklist" (
    "id" uuid not null default gen_random_uuid(),
    "event" uuid not null,
    "createdAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "orderPosition" numeric not null default '0'::numeric,
    "title" text not null,
    "description" text,
    "isDone" boolean not null default false,
    "assignedTo" uuid not null
);


create table "public"."EventSchedule" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "createdBy" uuid default auth.uid(),
    "scheduledFor" timestamp with time zone not null,
    "title" text not null,
    "description" text,
    "event" uuid,
    "completionStatus" boolean not null default false
);


create table "public"."EventTicket" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "name" text not null,
    "membershipType" uuid,
    "availableFrom" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "availableUntil" timestamp with time zone not null,
    "maxAvailable" numeric not null default '0'::numeric,
    "event" uuid,
    "price" numeric not null
);


create table "public"."EventTicketAllocation" (
    "racer" uuid not null,
    "eventTicket" uuid not null,
    "id" uuid not null default gen_random_uuid(),
    "allocatedAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "allocatedBy" uuid default auth.uid()
);


create table "public"."EventTicketAllocationCheckIn" (
    "id" uuid not null,
    "createdAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "createdBy" uuid not null default auth.uid()
);


create table "public"."EventTransport" (
    "id" uuid not null default gen_random_uuid(),
    "event" uuid not null,
    "driver" uuid not null,
    "maxCapacity" numeric not null default '4'::numeric,
    "additionalDetails" text
);


create table "public"."EventTransportAllocation" (
    "id" uuid not null default gen_random_uuid(),
    "ticketAllocation" uuid not null,
    "transport" uuid
);


create table "public"."Events" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid not null default auth.uid(),
    "startsAt" timestamp with time zone not null,
    "endsAt" timestamp with time zone not null,
    "name" text not null,
    "description" text
);


alter table "public"."Members" alter column "id" set not null;

alter table "public"."Members" alter column "membership" set not null;

CREATE UNIQUE INDEX "EventChecklist_pkey" ON public."EventChecklist" USING btree (id);

CREATE UNIQUE INDEX "EventSchedule_pkey" ON public."EventSchedule" USING btree (id);

CREATE UNIQUE INDEX "EventTicketAllocationCheckIn_pkey" ON public."EventTicketAllocationCheckIn" USING btree (id);

CREATE UNIQUE INDEX "EventTicketAllocation_id_key" ON public."EventTicketAllocation" USING btree (id);

CREATE UNIQUE INDEX "EventTicketAllocation_pkey" ON public."EventTicketAllocation" USING btree (racer, "eventTicket");

CREATE UNIQUE INDEX "EventTicket_pkey" ON public."EventTicket" USING btree (id);

CREATE UNIQUE INDEX "EventTransportAllocation_pkey" ON public."EventTransportAllocation" USING btree (id);

CREATE UNIQUE INDEX "Event_pkey" ON public."Events" USING btree (id);

CREATE UNIQUE INDEX "Members_pkey" ON public."Members" USING btree (membership, racer);

CREATE UNIQUE INDEX eventtransport_event_driver_unique ON public."EventTransport" USING btree (event, driver);

CREATE UNIQUE INDEX eventtransport_pkey ON public."EventTransport" USING btree (id);

alter table "public"."EventChecklist" add constraint "EventChecklist_pkey" PRIMARY KEY using index "EventChecklist_pkey";

alter table "public"."EventSchedule" add constraint "EventSchedule_pkey" PRIMARY KEY using index "EventSchedule_pkey";

alter table "public"."EventTicket" add constraint "EventTicket_pkey" PRIMARY KEY using index "EventTicket_pkey";

alter table "public"."EventTicketAllocation" add constraint "EventTicketAllocation_pkey" PRIMARY KEY using index "EventTicketAllocation_pkey";

alter table "public"."EventTicketAllocationCheckIn" add constraint "EventTicketAllocationCheckIn_pkey" PRIMARY KEY using index "EventTicketAllocationCheckIn_pkey";

alter table "public"."EventTransport" add constraint "eventtransport_pkey" PRIMARY KEY using index "eventtransport_pkey";

alter table "public"."EventTransportAllocation" add constraint "EventTransportAllocation_pkey" PRIMARY KEY using index "EventTransportAllocation_pkey";

alter table "public"."Events" add constraint "Event_pkey" PRIMARY KEY using index "Event_pkey";

alter table "public"."Members" add constraint "Members_pkey" PRIMARY KEY using index "Members_pkey";

alter table "public"."EventChecklist" add constraint "EventChecklist_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventChecklist" validate constraint "EventChecklist_assignedTo_fkey";

alter table "public"."EventChecklist" add constraint "EventChecklist_event_fkey" FOREIGN KEY (event) REFERENCES "Events"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventChecklist" validate constraint "EventChecklist_event_fkey";

alter table "public"."EventSchedule" add constraint "EventSchedule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventSchedule" validate constraint "EventSchedule_createdBy_fkey";

alter table "public"."EventSchedule" add constraint "EventSchedule_event_fkey" FOREIGN KEY (event) REFERENCES "Events"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventSchedule" validate constraint "EventSchedule_event_fkey";

alter table "public"."EventTicket" add constraint "EventTicket_event_fkey" FOREIGN KEY (event) REFERENCES "Events"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTicket" validate constraint "EventTicket_event_fkey";

alter table "public"."EventTicket" add constraint "EventTicket_membershipType_fkey" FOREIGN KEY ("membershipType") REFERENCES "MembershipTypes"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventTicket" validate constraint "EventTicket_membershipType_fkey";

alter table "public"."EventTicketAllocation" add constraint "EventTicketAllocation_allocatedBy_fkey" FOREIGN KEY ("allocatedBy") REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventTicketAllocation" validate constraint "EventTicketAllocation_allocatedBy_fkey";

alter table "public"."EventTicketAllocation" add constraint "EventTicketAllocation_eventTicket_fkey" FOREIGN KEY ("eventTicket") REFERENCES "EventTicket"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTicketAllocation" validate constraint "EventTicketAllocation_eventTicket_fkey";

alter table "public"."EventTicketAllocation" add constraint "EventTicketAllocation_id_key" UNIQUE using index "EventTicketAllocation_id_key";

alter table "public"."EventTicketAllocation" add constraint "EventTicketAllocation_racer_fkey" FOREIGN KEY (racer) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventTicketAllocation" validate constraint "EventTicketAllocation_racer_fkey";

alter table "public"."EventTicketAllocationCheckIn" add constraint "EventTicketAllocationCheckIn_id_fkey" FOREIGN KEY (id) REFERENCES "EventTicketAllocation"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTicketAllocationCheckIn" validate constraint "EventTicketAllocationCheckIn_id_fkey";

alter table "public"."EventTransport" add constraint "eventtransport_driver_fkey" FOREIGN KEY (driver) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."EventTransport" validate constraint "eventtransport_driver_fkey";

alter table "public"."EventTransport" add constraint "eventtransport_event_driver_unique" UNIQUE using index "eventtransport_event_driver_unique";

alter table "public"."EventTransport" add constraint "eventtransport_event_fkey" FOREIGN KEY (event) REFERENCES "Events"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTransport" validate constraint "eventtransport_event_fkey";

alter table "public"."EventTransportAllocation" add constraint "EventTransportAllocation_ticketAllocation_fkey" FOREIGN KEY ("ticketAllocation") REFERENCES "EventTicketAllocation"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTransportAllocation" validate constraint "EventTransportAllocation_ticketAllocation_fkey";

alter table "public"."EventTransportAllocation" add constraint "EventTransportAllocation_transport_fkey" FOREIGN KEY (transport) REFERENCES "EventTransport"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."EventTransportAllocation" validate constraint "EventTransportAllocation_transport_fkey";

grant delete on table "public"."EventChecklist" to "anon";

grant insert on table "public"."EventChecklist" to "anon";

grant references on table "public"."EventChecklist" to "anon";

grant select on table "public"."EventChecklist" to "anon";

grant trigger on table "public"."EventChecklist" to "anon";

grant truncate on table "public"."EventChecklist" to "anon";

grant update on table "public"."EventChecklist" to "anon";

grant delete on table "public"."EventChecklist" to "authenticated";

grant insert on table "public"."EventChecklist" to "authenticated";

grant references on table "public"."EventChecklist" to "authenticated";

grant select on table "public"."EventChecklist" to "authenticated";

grant trigger on table "public"."EventChecklist" to "authenticated";

grant truncate on table "public"."EventChecklist" to "authenticated";

grant update on table "public"."EventChecklist" to "authenticated";

grant delete on table "public"."EventChecklist" to "service_role";

grant insert on table "public"."EventChecklist" to "service_role";

grant references on table "public"."EventChecklist" to "service_role";

grant select on table "public"."EventChecklist" to "service_role";

grant trigger on table "public"."EventChecklist" to "service_role";

grant truncate on table "public"."EventChecklist" to "service_role";

grant update on table "public"."EventChecklist" to "service_role";

grant delete on table "public"."EventSchedule" to "anon";

grant insert on table "public"."EventSchedule" to "anon";

grant references on table "public"."EventSchedule" to "anon";

grant select on table "public"."EventSchedule" to "anon";

grant trigger on table "public"."EventSchedule" to "anon";

grant truncate on table "public"."EventSchedule" to "anon";

grant update on table "public"."EventSchedule" to "anon";

grant delete on table "public"."EventSchedule" to "authenticated";

grant insert on table "public"."EventSchedule" to "authenticated";

grant references on table "public"."EventSchedule" to "authenticated";

grant select on table "public"."EventSchedule" to "authenticated";

grant trigger on table "public"."EventSchedule" to "authenticated";

grant truncate on table "public"."EventSchedule" to "authenticated";

grant update on table "public"."EventSchedule" to "authenticated";

grant delete on table "public"."EventSchedule" to "service_role";

grant insert on table "public"."EventSchedule" to "service_role";

grant references on table "public"."EventSchedule" to "service_role";

grant select on table "public"."EventSchedule" to "service_role";

grant trigger on table "public"."EventSchedule" to "service_role";

grant truncate on table "public"."EventSchedule" to "service_role";

grant update on table "public"."EventSchedule" to "service_role";

grant delete on table "public"."EventTicket" to "anon";

grant insert on table "public"."EventTicket" to "anon";

grant references on table "public"."EventTicket" to "anon";

grant select on table "public"."EventTicket" to "anon";

grant trigger on table "public"."EventTicket" to "anon";

grant truncate on table "public"."EventTicket" to "anon";

grant update on table "public"."EventTicket" to "anon";

grant delete on table "public"."EventTicket" to "authenticated";

grant insert on table "public"."EventTicket" to "authenticated";

grant references on table "public"."EventTicket" to "authenticated";

grant select on table "public"."EventTicket" to "authenticated";

grant trigger on table "public"."EventTicket" to "authenticated";

grant truncate on table "public"."EventTicket" to "authenticated";

grant update on table "public"."EventTicket" to "authenticated";

grant delete on table "public"."EventTicket" to "service_role";

grant insert on table "public"."EventTicket" to "service_role";

grant references on table "public"."EventTicket" to "service_role";

grant select on table "public"."EventTicket" to "service_role";

grant trigger on table "public"."EventTicket" to "service_role";

grant truncate on table "public"."EventTicket" to "service_role";

grant update on table "public"."EventTicket" to "service_role";

grant delete on table "public"."EventTicketAllocation" to "anon";

grant insert on table "public"."EventTicketAllocation" to "anon";

grant references on table "public"."EventTicketAllocation" to "anon";

grant select on table "public"."EventTicketAllocation" to "anon";

grant trigger on table "public"."EventTicketAllocation" to "anon";

grant truncate on table "public"."EventTicketAllocation" to "anon";

grant update on table "public"."EventTicketAllocation" to "anon";

grant delete on table "public"."EventTicketAllocation" to "authenticated";

grant insert on table "public"."EventTicketAllocation" to "authenticated";

grant references on table "public"."EventTicketAllocation" to "authenticated";

grant select on table "public"."EventTicketAllocation" to "authenticated";

grant trigger on table "public"."EventTicketAllocation" to "authenticated";

grant truncate on table "public"."EventTicketAllocation" to "authenticated";

grant update on table "public"."EventTicketAllocation" to "authenticated";

grant delete on table "public"."EventTicketAllocation" to "service_role";

grant insert on table "public"."EventTicketAllocation" to "service_role";

grant references on table "public"."EventTicketAllocation" to "service_role";

grant select on table "public"."EventTicketAllocation" to "service_role";

grant trigger on table "public"."EventTicketAllocation" to "service_role";

grant truncate on table "public"."EventTicketAllocation" to "service_role";

grant update on table "public"."EventTicketAllocation" to "service_role";

grant delete on table "public"."EventTicketAllocationCheckIn" to "anon";

grant insert on table "public"."EventTicketAllocationCheckIn" to "anon";

grant references on table "public"."EventTicketAllocationCheckIn" to "anon";

grant select on table "public"."EventTicketAllocationCheckIn" to "anon";

grant trigger on table "public"."EventTicketAllocationCheckIn" to "anon";

grant truncate on table "public"."EventTicketAllocationCheckIn" to "anon";

grant update on table "public"."EventTicketAllocationCheckIn" to "anon";

grant delete on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant insert on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant references on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant select on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant trigger on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant truncate on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant update on table "public"."EventTicketAllocationCheckIn" to "authenticated";

grant delete on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant insert on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant references on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant select on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant trigger on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant truncate on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant update on table "public"."EventTicketAllocationCheckIn" to "service_role";

grant delete on table "public"."EventTransport" to "anon";

grant insert on table "public"."EventTransport" to "anon";

grant references on table "public"."EventTransport" to "anon";

grant select on table "public"."EventTransport" to "anon";

grant trigger on table "public"."EventTransport" to "anon";

grant truncate on table "public"."EventTransport" to "anon";

grant update on table "public"."EventTransport" to "anon";

grant delete on table "public"."EventTransport" to "authenticated";

grant insert on table "public"."EventTransport" to "authenticated";

grant references on table "public"."EventTransport" to "authenticated";

grant select on table "public"."EventTransport" to "authenticated";

grant trigger on table "public"."EventTransport" to "authenticated";

grant truncate on table "public"."EventTransport" to "authenticated";

grant update on table "public"."EventTransport" to "authenticated";

grant delete on table "public"."EventTransport" to "service_role";

grant insert on table "public"."EventTransport" to "service_role";

grant references on table "public"."EventTransport" to "service_role";

grant select on table "public"."EventTransport" to "service_role";

grant trigger on table "public"."EventTransport" to "service_role";

grant truncate on table "public"."EventTransport" to "service_role";

grant update on table "public"."EventTransport" to "service_role";

grant delete on table "public"."EventTransportAllocation" to "anon";

grant insert on table "public"."EventTransportAllocation" to "anon";

grant references on table "public"."EventTransportAllocation" to "anon";

grant select on table "public"."EventTransportAllocation" to "anon";

grant trigger on table "public"."EventTransportAllocation" to "anon";

grant truncate on table "public"."EventTransportAllocation" to "anon";

grant update on table "public"."EventTransportAllocation" to "anon";

grant delete on table "public"."EventTransportAllocation" to "authenticated";

grant insert on table "public"."EventTransportAllocation" to "authenticated";

grant references on table "public"."EventTransportAllocation" to "authenticated";

grant select on table "public"."EventTransportAllocation" to "authenticated";

grant trigger on table "public"."EventTransportAllocation" to "authenticated";

grant truncate on table "public"."EventTransportAllocation" to "authenticated";

grant update on table "public"."EventTransportAllocation" to "authenticated";

grant delete on table "public"."EventTransportAllocation" to "service_role";

grant insert on table "public"."EventTransportAllocation" to "service_role";

grant references on table "public"."EventTransportAllocation" to "service_role";

grant select on table "public"."EventTransportAllocation" to "service_role";

grant trigger on table "public"."EventTransportAllocation" to "service_role";

grant truncate on table "public"."EventTransportAllocation" to "service_role";

grant update on table "public"."EventTransportAllocation" to "service_role";

grant delete on table "public"."Events" to "anon";

grant insert on table "public"."Events" to "anon";

grant references on table "public"."Events" to "anon";

grant select on table "public"."Events" to "anon";

grant trigger on table "public"."Events" to "anon";

grant truncate on table "public"."Events" to "anon";

grant update on table "public"."Events" to "anon";

grant delete on table "public"."Events" to "authenticated";

grant insert on table "public"."Events" to "authenticated";

grant references on table "public"."Events" to "authenticated";

grant select on table "public"."Events" to "authenticated";

grant trigger on table "public"."Events" to "authenticated";

grant truncate on table "public"."Events" to "authenticated";

grant update on table "public"."Events" to "authenticated";

grant delete on table "public"."Events" to "service_role";

grant insert on table "public"."Events" to "service_role";

grant references on table "public"."Events" to "service_role";

grant select on table "public"."Events" to "service_role";

grant trigger on table "public"."Events" to "service_role";

grant truncate on table "public"."Events" to "service_role";

grant update on table "public"."Events" to "service_role";


