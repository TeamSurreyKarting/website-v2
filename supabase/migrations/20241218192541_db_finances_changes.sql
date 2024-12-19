alter table "public"."Members" drop constraint "Members_added_by_fkey";

create table "public"."Accounts" (
									 "id" uuid not null default gen_random_uuid(),
									 "name" text not null,
									 "startingBalance" numeric not null,
									 "endDate" date,
									 "startDate" date,
									 "endingBalance" numeric not null
);


create table "public"."Transactions" (
										 "id" uuid not null default gen_random_uuid(),
										 "account" uuid not null,
										 "occurredAt" timestamp with time zone not null default now(),
										 "itemDescription" text not null,
										 "value" numeric not null
);


alter table "public"."Members" drop column "added_at";

alter table "public"."Members" drop column "added_by";

alter table "public"."Members" add column "addedAt" timestamp with time zone not null default now();

alter table "public"."Members" add column "addedBy" uuid default auth.uid();

alter table "public"."Members" drop column "id";

alter table "public"."Members" add column "id" uuid default gen_random_uuid();

alter table "public"."Members" alter column "id" set data type uuid using "id"::uuid;

CREATE UNIQUE INDEX "Budgets_name_key" ON public."Accounts" USING btree (name);

CREATE UNIQUE INDEX "Budgets_pkey" ON public."Accounts" USING btree (id);

CREATE UNIQUE INDEX "Members_id_key" ON public."Members" USING btree (id);

CREATE UNIQUE INDEX "Transactions_pkey" ON public."Transactions" USING btree (id);

alter table "public"."Accounts" add constraint "Budgets_pkey" PRIMARY KEY using index "Budgets_pkey";

alter table "public"."Transactions" add constraint "Transactions_pkey" PRIMARY KEY using index "Transactions_pkey";

alter table "public"."Accounts" add constraint "Budgets_name_key" UNIQUE using index "Budgets_name_key";

alter table "public"."Members" add constraint "Members_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Members" validate constraint "Members_addedBy_fkey";

alter table "public"."Members" add constraint "Members_id_key" UNIQUE using index "Members_id_key";

alter table "public"."Transactions" add constraint "Transactions_account_fkey" FOREIGN KEY (account) REFERENCES "Accounts"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Transactions" validate constraint "Transactions_account_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_initial_ending_balance()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW."endingBalance" := NEW."startingBalance";
RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_account_ending_balance()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  amount_change NUMERIC;
BEGIN
  IF TG_OP = 'INSERT' THEN
    amount_change := NEW.value;
  ELSIF TG_OP = 'UPDATE' THEN
    amount_change := NEW.value - OLD.value;
  ELSIF TG_OP = 'DELETE' THEN
    amount_change := -OLD.value;
END IF;

UPDATE "Accounts"
SET "endingBalance" = "endingBalance" - amount_change
WHERE "id" = NEW."account";

RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_fastest_laps(for_event_id bigint, for_league_id bigint)
 RETURNS TABLE(event_session_result_id bigint, event_session_id bigint, event_id bigint, racer_id bigint, fastest_lap numeric, total_time numeric, first_name text, last_name text, experience_level experience_level)
 LANGUAGE plpgsql
AS $function$
BEGIN
RETURN QUERY
	WITH RankedLaps AS (
        SELECT
            res.id AS event_session_result_id,  -- Fully qualified
            res.racer_id AS racer_id,            -- Fully qualified
            res.fastest_lap,
            res.total_time,
            ses.id AS event_session_id,
            re.id AS event_id,
            r.first_name,
            r.last_name,
            r.experience_level,
            ROW_NUMBER() OVER (
                PARTITION BY res.racer_id
                ORDER BY res.fastest_lap ASC
            ) AS lap_rank
        FROM
            public."RaceEventSessionResult" res
            JOIN public."RaceEventSession" ses ON res.event_session_id = ses.id
            JOIN public."RaceEvent" re ON ses.race_event_id = re.id
            JOIN public."LeagueEntrant" le ON le.racer_id = res.racer_id
            JOIN public."League" l ON le.league_id = l.id
            JOIN public."Racers" r ON res.racer_id = r.id
        WHERE
            ses.race_event_id = for_event_id
            AND l.id = for_league_id
            AND res.racer_id IN (
                SELECT le_inner.racer_id
                FROM public."LeagueEntrant" le_inner
                WHERE le_inner.league_id = for_league_id
            )
    )
SELECT
	RankedLaps.event_session_result_id,  -- Fully qualified
	RankedLaps.event_session_id,
	RankedLaps.event_id,
	RankedLaps.racer_id,
	RankedLaps.fastest_lap,
	RankedLaps.total_time,
	RankedLaps.first_name,
	RankedLaps.last_name,
	RankedLaps.experience_level
FROM
	RankedLaps
WHERE
	lap_rank = 1
ORDER BY
	RankedLaps.fastest_lap ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_types(enum_type text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
json_data json;
  text_query text;
BEGIN
  text_query := format (
    'SELECT array_to_json(enum_range(NULL::%s))',
    enum_type
  );

EXECUTE text_query INTO json_data;

RETURN json_data;
END
$function$
;

CREATE OR REPLACE FUNCTION public.racer_exists(user_email character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
exists boolean;
BEGIN
SELECT COUNT(*) > 0 INTO exists
FROM public.racer_users
WHERE email = user_email;

RETURN exists;
END;
$function$
;

grant delete on table "public"."Accounts" to "anon";

grant insert on table "public"."Accounts" to "anon";

grant references on table "public"."Accounts" to "anon";

grant select on table "public"."Accounts" to "anon";

grant trigger on table "public"."Accounts" to "anon";

grant truncate on table "public"."Accounts" to "anon";

grant update on table "public"."Accounts" to "anon";

grant delete on table "public"."Accounts" to "authenticated";

grant insert on table "public"."Accounts" to "authenticated";

grant references on table "public"."Accounts" to "authenticated";

grant select on table "public"."Accounts" to "authenticated";

grant trigger on table "public"."Accounts" to "authenticated";

grant truncate on table "public"."Accounts" to "authenticated";

grant update on table "public"."Accounts" to "authenticated";

grant delete on table "public"."Accounts" to "service_role";

grant insert on table "public"."Accounts" to "service_role";

grant references on table "public"."Accounts" to "service_role";

grant select on table "public"."Accounts" to "service_role";

grant trigger on table "public"."Accounts" to "service_role";

grant truncate on table "public"."Accounts" to "service_role";

grant update on table "public"."Accounts" to "service_role";

grant delete on table "public"."Transactions" to "anon";

grant insert on table "public"."Transactions" to "anon";

grant references on table "public"."Transactions" to "anon";

grant select on table "public"."Transactions" to "anon";

grant trigger on table "public"."Transactions" to "anon";

grant truncate on table "public"."Transactions" to "anon";

grant update on table "public"."Transactions" to "anon";

grant delete on table "public"."Transactions" to "authenticated";

grant insert on table "public"."Transactions" to "authenticated";

grant references on table "public"."Transactions" to "authenticated";

grant select on table "public"."Transactions" to "authenticated";

grant trigger on table "public"."Transactions" to "authenticated";

grant truncate on table "public"."Transactions" to "authenticated";

grant update on table "public"."Transactions" to "authenticated";

grant delete on table "public"."Transactions" to "service_role";

grant insert on table "public"."Transactions" to "service_role";

grant references on table "public"."Transactions" to "service_role";

grant select on table "public"."Transactions" to "service_role";

grant trigger on table "public"."Transactions" to "service_role";

grant truncate on table "public"."Transactions" to "service_role";

grant update on table "public"."Transactions" to "service_role";

CREATE TRIGGER initialise_account_ending_balance BEFORE INSERT ON public."Accounts" FOR EACH ROW EXECUTE FUNCTION set_initial_ending_balance();

CREATE TRIGGER update_account_ending_balance AFTER INSERT OR DELETE OR UPDATE ON public."Transactions" FOR EACH ROW EXECUTE FUNCTION update_account_ending_balance();
