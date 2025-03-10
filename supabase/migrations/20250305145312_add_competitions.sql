create type "public"."RacePenalty" as enum ('Kart Change Penalty', 'Excessive Weaving', 'Jump Start', 'Breaking Formation', 'Fuel Pipe Pinching', 'Adjusting Radiator Cover', 'Carburettor Adjustment', 'Contact Warning', 'Contact Advantage', 'Forcing Driver Wide', 'Causing Spin', 'Multiple Kart Contact', 'Deliberate Forcing Off Track', 'Blocking', 'Overtaking Under Yellow', 'Speeding Under Yellow', 'Pit Lane Speeding', 'Track Limits Violation', 'Restarting on Grass', 'Rolling Back Across Track', 'Abandoning Kart', 'Underweight', 'Deliberate Contact After Race', 'Multiple Severe Incidents');

alter table "public"."Tracks" drop constraint "Tracks_pkey";

drop index if exists "public"."Tracks_pkey";

alter type "public"."race_format" rename to "race_format__old_version_to_be_dropped";

create type "public"."race_format" as enum ('practice', 'qualifying', 'individual_sprint', 'team_sprint', 'team_endurance');

create table "public"."CompetitionEventLapTimes" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "race" uuid not null,
    "racer" uuid not null,
    "lapNumber" numeric not null,
    "lapTime" numeric not null,
    "sector1Time" numeric not null,
    "sector2Time" numeric not null,
    "sector3Time" numeric not null
);


create table "public"."CompetitionEventRaceEntrants" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "teamRacer" uuid not null,
    "race" uuid not null,
    "startingPosition" numeric not null
);


create table "public"."CompetitionEventRacerAvailability" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "squadRacer" uuid not null,
    "isAvailable" boolean not null default false,
    "competitionEvent" uuid not null
);


create table "public"."CompetitionEventRaces" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "startsAt" timestamp with time zone not null,
    "duration" numeric not null,
    "event" uuid not null,
    "name" text not null,
    "format" race_format not null
);


create table "public"."CompetitionEventTeamSelection" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "racer" uuid not null,
    "team" uuid not null
);


create table "public"."CompetitionEventTeams" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "event" uuid not null,
    "name" text not null,
    "minNumber" numeric not null default '1'::numeric,
    "maxNumber" numeric not null
);


create table "public"."CompetitionEvents" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "event" uuid default gen_random_uuid(),
    "track" uuid not null,
    "competition" uuid not null
);


create table "public"."CompetitionMembershipRequirement" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "membership" uuid not null,
    "competition" uuid not null
);


create table "public"."CompetitionSquad" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "racer" uuid not null default gen_random_uuid(),
    "competition" uuid not null
);


create table "public"."Competitions" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "createdBy" uuid default auth.uid(),
    "name" text not null
);


drop type "public"."race_format__old_version_to_be_dropped";

alter table "public"."Tracks" add column "lat" numeric;

alter table "public"."Tracks" add column "long" numeric;

alter table "public"."Tracks" alter column "id" set default gen_random_uuid();

alter table "public"."Tracks" alter column "id" drop identity;

alter table "public"."Tracks" alter column "id" set data type uuid using "id"::uuid;

CREATE UNIQUE INDEX "CompetitionEligibleDrivers_pkey" ON public."CompetitionSquad" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEventLapTimes_race_racer_lapNumber_key" ON public."CompetitionEventLapTimes" USING btree (race, racer, "lapNumber");

CREATE UNIQUE INDEX "CompetitionEventRaceEntrants_pkey" ON public."CompetitionEventRaceEntrants" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEventRacerAvailability_pkey" ON public."CompetitionEventRacerAvailability" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEventRaces_pkey" ON public."CompetitionEventRaces" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEventTeamSelection_pkey" ON public."CompetitionEventTeamSelection" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEventTeams_pkey" ON public."CompetitionEventTeams" USING btree (id);

CREATE UNIQUE INDEX "CompetitionEvents_pkey" ON public."CompetitionEvents" USING btree (id);

CREATE UNIQUE INDEX "CompetitionMembershipRequirements_pkey" ON public."CompetitionMembershipRequirement" USING btree (id);

CREATE UNIQUE INDEX "Competitions_pkey" ON public."Competitions" USING btree (id);

CREATE UNIQUE INDEX competitioneventlaptimes_pkey ON public."CompetitionEventLapTimes" USING btree (id);

CREATE UNIQUE INDEX competitioneventraceravailability_squadracer_competitionevent_u ON public."CompetitionEventRacerAvailability" USING btree ("squadRacer", "competitionEvent");

CREATE UNIQUE INDEX competitioneventteamselection_racer_team_unique ON public."CompetitionEventTeamSelection" USING btree (racer, team);

CREATE UNIQUE INDEX competitionsquad_unique_competition_racer ON public."CompetitionSquad" USING btree (competition, racer);

CREATE UNIQUE INDEX tracks_pkey ON public."Tracks" USING btree (id);

alter table "public"."CompetitionEventLapTimes" add constraint "competitioneventlaptimes_pkey" PRIMARY KEY using index "competitioneventlaptimes_pkey";

alter table "public"."CompetitionEventRaceEntrants" add constraint "CompetitionEventRaceEntrants_pkey" PRIMARY KEY using index "CompetitionEventRaceEntrants_pkey";

alter table "public"."CompetitionEventRacerAvailability" add constraint "CompetitionEventRacerAvailability_pkey" PRIMARY KEY using index "CompetitionEventRacerAvailability_pkey";

alter table "public"."CompetitionEventRaces" add constraint "CompetitionEventRaces_pkey" PRIMARY KEY using index "CompetitionEventRaces_pkey";

alter table "public"."CompetitionEventTeamSelection" add constraint "CompetitionEventTeamSelection_pkey" PRIMARY KEY using index "CompetitionEventTeamSelection_pkey";

alter table "public"."CompetitionEventTeams" add constraint "CompetitionEventTeams_pkey" PRIMARY KEY using index "CompetitionEventTeams_pkey";

alter table "public"."CompetitionEvents" add constraint "CompetitionEvents_pkey" PRIMARY KEY using index "CompetitionEvents_pkey";

alter table "public"."CompetitionMembershipRequirement" add constraint "CompetitionMembershipRequirements_pkey" PRIMARY KEY using index "CompetitionMembershipRequirements_pkey";

alter table "public"."CompetitionSquad" add constraint "CompetitionEligibleDrivers_pkey" PRIMARY KEY using index "CompetitionEligibleDrivers_pkey";

alter table "public"."Competitions" add constraint "Competitions_pkey" PRIMARY KEY using index "Competitions_pkey";

alter table "public"."Tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."CompetitionEventLapTimes" add constraint "CompetitionEventLapTimes_race_racer_lapNumber_key" UNIQUE using index "CompetitionEventLapTimes_race_racer_lapNumber_key";

alter table "public"."CompetitionEventLapTimes" add constraint "competitioneventlaptimes_race_fkey" FOREIGN KEY (race) REFERENCES "CompetitionEventRaces"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventLapTimes" validate constraint "competitioneventlaptimes_race_fkey";

alter table "public"."CompetitionEventLapTimes" add constraint "competitioneventlaptimes_racer_fkey" FOREIGN KEY (racer) REFERENCES "CompetitionEventRaceEntrants"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventLapTimes" validate constraint "competitioneventlaptimes_racer_fkey";

alter table "public"."CompetitionEventRaceEntrants" add constraint "CompetitionEventRaceEntrants_race_fkey" FOREIGN KEY (race) REFERENCES "CompetitionEventRaces"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventRaceEntrants" validate constraint "CompetitionEventRaceEntrants_race_fkey";

alter table "public"."CompetitionEventRaceEntrants" add constraint "CompetitionEventRaceEntrants_teamRacer_fkey" FOREIGN KEY ("teamRacer") REFERENCES "CompetitionEventTeamSelection"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventRaceEntrants" validate constraint "CompetitionEventRaceEntrants_teamRacer_fkey";

alter table "public"."CompetitionEventRacerAvailability" add constraint "CompetitionEventRacerAvailability_competitionEvent_fkey" FOREIGN KEY ("competitionEvent") REFERENCES "CompetitionEvents"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventRacerAvailability" validate constraint "CompetitionEventRacerAvailability_competitionEvent_fkey";

alter table "public"."CompetitionEventRacerAvailability" add constraint "CompetitionEventRacerAvailability_squadRacer_fkey" FOREIGN KEY ("squadRacer") REFERENCES "CompetitionSquad"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventRacerAvailability" validate constraint "CompetitionEventRacerAvailability_squadRacer_fkey";

alter table "public"."CompetitionEventRacerAvailability" add constraint "competitioneventraceravailability_squadracer_competitionevent_u" UNIQUE using index "competitioneventraceravailability_squadracer_competitionevent_u";

alter table "public"."CompetitionEventRaces" add constraint "CompetitionEventRaces_event_fkey" FOREIGN KEY (event) REFERENCES "CompetitionEvents"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventRaces" validate constraint "CompetitionEventRaces_event_fkey";

alter table "public"."CompetitionEventTeamSelection" add constraint "CompetitionEventTeamSelection_racer_fkey" FOREIGN KEY (racer) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."CompetitionEventTeamSelection" validate constraint "CompetitionEventTeamSelection_racer_fkey";

alter table "public"."CompetitionEventTeamSelection" add constraint "CompetitionEventTeamSelection_team_fkey" FOREIGN KEY (team) REFERENCES "CompetitionEventTeams"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventTeamSelection" validate constraint "CompetitionEventTeamSelection_team_fkey";

alter table "public"."CompetitionEventTeamSelection" add constraint "competitioneventteamselection_racer_team_unique" UNIQUE using index "competitioneventteamselection_racer_team_unique";

alter table "public"."CompetitionEventTeams" add constraint "CompetitionEventTeams_check" CHECK (("maxNumber" > "minNumber")) not valid;

alter table "public"."CompetitionEventTeams" validate constraint "CompetitionEventTeams_check";

alter table "public"."CompetitionEventTeams" add constraint "CompetitionEventTeams_minNumber_check" CHECK (("minNumber" > (0)::numeric)) not valid;

alter table "public"."CompetitionEventTeams" validate constraint "CompetitionEventTeams_minNumber_check";

alter table "public"."CompetitionEventTeams" add constraint "competitioneventteams_event_fkey" FOREIGN KEY (event) REFERENCES "CompetitionEvents"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEventTeams" validate constraint "competitioneventteams_event_fkey";

alter table "public"."CompetitionEvents" add constraint "CompetitionEvents_competition_fkey" FOREIGN KEY (competition) REFERENCES "Competitions"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEvents" validate constraint "CompetitionEvents_competition_fkey";

alter table "public"."CompetitionEvents" add constraint "CompetitionEvents_event_fkey" FOREIGN KEY (event) REFERENCES "Events"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."CompetitionEvents" validate constraint "CompetitionEvents_event_fkey";

alter table "public"."CompetitionEvents" add constraint "CompetitionEvents_track_fkey" FOREIGN KEY (track) REFERENCES "Tracks"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionEvents" validate constraint "CompetitionEvents_track_fkey";

alter table "public"."CompetitionMembershipRequirement" add constraint "CompetitionMembershipRequirement_competition_fkey" FOREIGN KEY (competition) REFERENCES "Competitions"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionMembershipRequirement" validate constraint "CompetitionMembershipRequirement_competition_fkey";

alter table "public"."CompetitionMembershipRequirement" add constraint "CompetitionMembershipRequirements_membership_fkey" FOREIGN KEY (membership) REFERENCES "MembershipTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionMembershipRequirement" validate constraint "CompetitionMembershipRequirements_membership_fkey";

alter table "public"."CompetitionSquad" add constraint "CompetitionEligibleDrivers_competition_fkey" FOREIGN KEY (competition) REFERENCES "Competitions"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionSquad" validate constraint "CompetitionEligibleDrivers_competition_fkey";

alter table "public"."CompetitionSquad" add constraint "CompetitionSquad_racer_fkey" FOREIGN KEY (racer) REFERENCES "Racers"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."CompetitionSquad" validate constraint "CompetitionSquad_racer_fkey";

alter table "public"."CompetitionSquad" add constraint "competitionsquad_unique_competition_racer" UNIQUE using index "competitionsquad_unique_competition_racer";

grant delete on table "public"."CompetitionEventLapTimes" to "anon";

grant insert on table "public"."CompetitionEventLapTimes" to "anon";

grant references on table "public"."CompetitionEventLapTimes" to "anon";

grant select on table "public"."CompetitionEventLapTimes" to "anon";

grant trigger on table "public"."CompetitionEventLapTimes" to "anon";

grant truncate on table "public"."CompetitionEventLapTimes" to "anon";

grant update on table "public"."CompetitionEventLapTimes" to "anon";

grant delete on table "public"."CompetitionEventLapTimes" to "authenticated";

grant insert on table "public"."CompetitionEventLapTimes" to "authenticated";

grant references on table "public"."CompetitionEventLapTimes" to "authenticated";

grant select on table "public"."CompetitionEventLapTimes" to "authenticated";

grant trigger on table "public"."CompetitionEventLapTimes" to "authenticated";

grant truncate on table "public"."CompetitionEventLapTimes" to "authenticated";

grant update on table "public"."CompetitionEventLapTimes" to "authenticated";

grant delete on table "public"."CompetitionEventLapTimes" to "service_role";

grant insert on table "public"."CompetitionEventLapTimes" to "service_role";

grant references on table "public"."CompetitionEventLapTimes" to "service_role";

grant select on table "public"."CompetitionEventLapTimes" to "service_role";

grant trigger on table "public"."CompetitionEventLapTimes" to "service_role";

grant truncate on table "public"."CompetitionEventLapTimes" to "service_role";

grant update on table "public"."CompetitionEventLapTimes" to "service_role";

grant delete on table "public"."CompetitionEventRaceEntrants" to "anon";

grant insert on table "public"."CompetitionEventRaceEntrants" to "anon";

grant references on table "public"."CompetitionEventRaceEntrants" to "anon";

grant select on table "public"."CompetitionEventRaceEntrants" to "anon";

grant trigger on table "public"."CompetitionEventRaceEntrants" to "anon";

grant truncate on table "public"."CompetitionEventRaceEntrants" to "anon";

grant update on table "public"."CompetitionEventRaceEntrants" to "anon";

grant delete on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant insert on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant references on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant select on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant trigger on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant truncate on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant update on table "public"."CompetitionEventRaceEntrants" to "authenticated";

grant delete on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant insert on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant references on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant select on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant trigger on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant truncate on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant update on table "public"."CompetitionEventRaceEntrants" to "service_role";

grant delete on table "public"."CompetitionEventRacerAvailability" to "anon";

grant insert on table "public"."CompetitionEventRacerAvailability" to "anon";

grant references on table "public"."CompetitionEventRacerAvailability" to "anon";

grant select on table "public"."CompetitionEventRacerAvailability" to "anon";

grant trigger on table "public"."CompetitionEventRacerAvailability" to "anon";

grant truncate on table "public"."CompetitionEventRacerAvailability" to "anon";

grant update on table "public"."CompetitionEventRacerAvailability" to "anon";

grant delete on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant insert on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant references on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant select on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant trigger on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant truncate on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant update on table "public"."CompetitionEventRacerAvailability" to "authenticated";

grant delete on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant insert on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant references on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant select on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant trigger on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant truncate on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant update on table "public"."CompetitionEventRacerAvailability" to "service_role";

grant delete on table "public"."CompetitionEventRaces" to "anon";

grant insert on table "public"."CompetitionEventRaces" to "anon";

grant references on table "public"."CompetitionEventRaces" to "anon";

grant select on table "public"."CompetitionEventRaces" to "anon";

grant trigger on table "public"."CompetitionEventRaces" to "anon";

grant truncate on table "public"."CompetitionEventRaces" to "anon";

grant update on table "public"."CompetitionEventRaces" to "anon";

grant delete on table "public"."CompetitionEventRaces" to "authenticated";

grant insert on table "public"."CompetitionEventRaces" to "authenticated";

grant references on table "public"."CompetitionEventRaces" to "authenticated";

grant select on table "public"."CompetitionEventRaces" to "authenticated";

grant trigger on table "public"."CompetitionEventRaces" to "authenticated";

grant truncate on table "public"."CompetitionEventRaces" to "authenticated";

grant update on table "public"."CompetitionEventRaces" to "authenticated";

grant delete on table "public"."CompetitionEventRaces" to "service_role";

grant insert on table "public"."CompetitionEventRaces" to "service_role";

grant references on table "public"."CompetitionEventRaces" to "service_role";

grant select on table "public"."CompetitionEventRaces" to "service_role";

grant trigger on table "public"."CompetitionEventRaces" to "service_role";

grant truncate on table "public"."CompetitionEventRaces" to "service_role";

grant update on table "public"."CompetitionEventRaces" to "service_role";

grant delete on table "public"."CompetitionEventTeamSelection" to "anon";

grant insert on table "public"."CompetitionEventTeamSelection" to "anon";

grant references on table "public"."CompetitionEventTeamSelection" to "anon";

grant select on table "public"."CompetitionEventTeamSelection" to "anon";

grant trigger on table "public"."CompetitionEventTeamSelection" to "anon";

grant truncate on table "public"."CompetitionEventTeamSelection" to "anon";

grant update on table "public"."CompetitionEventTeamSelection" to "anon";

grant delete on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant insert on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant references on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant select on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant trigger on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant truncate on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant update on table "public"."CompetitionEventTeamSelection" to "authenticated";

grant delete on table "public"."CompetitionEventTeamSelection" to "service_role";

grant insert on table "public"."CompetitionEventTeamSelection" to "service_role";

grant references on table "public"."CompetitionEventTeamSelection" to "service_role";

grant select on table "public"."CompetitionEventTeamSelection" to "service_role";

grant trigger on table "public"."CompetitionEventTeamSelection" to "service_role";

grant truncate on table "public"."CompetitionEventTeamSelection" to "service_role";

grant update on table "public"."CompetitionEventTeamSelection" to "service_role";

grant delete on table "public"."CompetitionEventTeams" to "anon";

grant insert on table "public"."CompetitionEventTeams" to "anon";

grant references on table "public"."CompetitionEventTeams" to "anon";

grant select on table "public"."CompetitionEventTeams" to "anon";

grant trigger on table "public"."CompetitionEventTeams" to "anon";

grant truncate on table "public"."CompetitionEventTeams" to "anon";

grant update on table "public"."CompetitionEventTeams" to "anon";

grant delete on table "public"."CompetitionEventTeams" to "authenticated";

grant insert on table "public"."CompetitionEventTeams" to "authenticated";

grant references on table "public"."CompetitionEventTeams" to "authenticated";

grant select on table "public"."CompetitionEventTeams" to "authenticated";

grant trigger on table "public"."CompetitionEventTeams" to "authenticated";

grant truncate on table "public"."CompetitionEventTeams" to "authenticated";

grant update on table "public"."CompetitionEventTeams" to "authenticated";

grant delete on table "public"."CompetitionEventTeams" to "service_role";

grant insert on table "public"."CompetitionEventTeams" to "service_role";

grant references on table "public"."CompetitionEventTeams" to "service_role";

grant select on table "public"."CompetitionEventTeams" to "service_role";

grant trigger on table "public"."CompetitionEventTeams" to "service_role";

grant truncate on table "public"."CompetitionEventTeams" to "service_role";

grant update on table "public"."CompetitionEventTeams" to "service_role";

grant delete on table "public"."CompetitionEvents" to "anon";

grant insert on table "public"."CompetitionEvents" to "anon";

grant references on table "public"."CompetitionEvents" to "anon";

grant select on table "public"."CompetitionEvents" to "anon";

grant trigger on table "public"."CompetitionEvents" to "anon";

grant truncate on table "public"."CompetitionEvents" to "anon";

grant update on table "public"."CompetitionEvents" to "anon";

grant delete on table "public"."CompetitionEvents" to "authenticated";

grant insert on table "public"."CompetitionEvents" to "authenticated";

grant references on table "public"."CompetitionEvents" to "authenticated";

grant select on table "public"."CompetitionEvents" to "authenticated";

grant trigger on table "public"."CompetitionEvents" to "authenticated";

grant truncate on table "public"."CompetitionEvents" to "authenticated";

grant update on table "public"."CompetitionEvents" to "authenticated";

grant delete on table "public"."CompetitionEvents" to "service_role";

grant insert on table "public"."CompetitionEvents" to "service_role";

grant references on table "public"."CompetitionEvents" to "service_role";

grant select on table "public"."CompetitionEvents" to "service_role";

grant trigger on table "public"."CompetitionEvents" to "service_role";

grant truncate on table "public"."CompetitionEvents" to "service_role";

grant update on table "public"."CompetitionEvents" to "service_role";

grant delete on table "public"."CompetitionMembershipRequirement" to "anon";

grant insert on table "public"."CompetitionMembershipRequirement" to "anon";

grant references on table "public"."CompetitionMembershipRequirement" to "anon";

grant select on table "public"."CompetitionMembershipRequirement" to "anon";

grant trigger on table "public"."CompetitionMembershipRequirement" to "anon";

grant truncate on table "public"."CompetitionMembershipRequirement" to "anon";

grant update on table "public"."CompetitionMembershipRequirement" to "anon";

grant delete on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant insert on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant references on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant select on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant trigger on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant truncate on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant update on table "public"."CompetitionMembershipRequirement" to "authenticated";

grant delete on table "public"."CompetitionMembershipRequirement" to "service_role";

grant insert on table "public"."CompetitionMembershipRequirement" to "service_role";

grant references on table "public"."CompetitionMembershipRequirement" to "service_role";

grant select on table "public"."CompetitionMembershipRequirement" to "service_role";

grant trigger on table "public"."CompetitionMembershipRequirement" to "service_role";

grant truncate on table "public"."CompetitionMembershipRequirement" to "service_role";

grant update on table "public"."CompetitionMembershipRequirement" to "service_role";

grant delete on table "public"."CompetitionSquad" to "anon";

grant insert on table "public"."CompetitionSquad" to "anon";

grant references on table "public"."CompetitionSquad" to "anon";

grant select on table "public"."CompetitionSquad" to "anon";

grant trigger on table "public"."CompetitionSquad" to "anon";

grant truncate on table "public"."CompetitionSquad" to "anon";

grant update on table "public"."CompetitionSquad" to "anon";

grant delete on table "public"."CompetitionSquad" to "authenticated";

grant insert on table "public"."CompetitionSquad" to "authenticated";

grant references on table "public"."CompetitionSquad" to "authenticated";

grant select on table "public"."CompetitionSquad" to "authenticated";

grant trigger on table "public"."CompetitionSquad" to "authenticated";

grant truncate on table "public"."CompetitionSquad" to "authenticated";

grant update on table "public"."CompetitionSquad" to "authenticated";

grant delete on table "public"."CompetitionSquad" to "service_role";

grant insert on table "public"."CompetitionSquad" to "service_role";

grant references on table "public"."CompetitionSquad" to "service_role";

grant select on table "public"."CompetitionSquad" to "service_role";

grant trigger on table "public"."CompetitionSquad" to "service_role";

grant truncate on table "public"."CompetitionSquad" to "service_role";

grant update on table "public"."CompetitionSquad" to "service_role";

grant delete on table "public"."Competitions" to "anon";

grant insert on table "public"."Competitions" to "anon";

grant references on table "public"."Competitions" to "anon";

grant select on table "public"."Competitions" to "anon";

grant trigger on table "public"."Competitions" to "anon";

grant truncate on table "public"."Competitions" to "anon";

grant update on table "public"."Competitions" to "anon";

grant delete on table "public"."Competitions" to "authenticated";

grant insert on table "public"."Competitions" to "authenticated";

grant references on table "public"."Competitions" to "authenticated";

grant select on table "public"."Competitions" to "authenticated";

grant trigger on table "public"."Competitions" to "authenticated";

grant truncate on table "public"."Competitions" to "authenticated";

grant update on table "public"."Competitions" to "authenticated";

grant delete on table "public"."Competitions" to "service_role";

grant insert on table "public"."Competitions" to "service_role";

grant references on table "public"."Competitions" to "service_role";

grant select on table "public"."Competitions" to "service_role";

grant trigger on table "public"."Competitions" to "service_role";

grant truncate on table "public"."Competitions" to "service_role";

grant update on table "public"."Competitions" to "service_role";


