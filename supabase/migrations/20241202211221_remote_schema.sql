

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."experience_level" AS ENUM (
    'rookie',
    'experienced',
    'graduate'
);


ALTER TYPE "public"."experience_level" OWNER TO "postgres";


CREATE TYPE "public"."license_type" AS ENUM (
    'bukc_test',
    'bukc_full'
);


ALTER TYPE "public"."license_type" OWNER TO "postgres";


CREATE TYPE "public"."points_allocations" AS ENUM (
    'formula1_top10',
    'linear_top10'
);


ALTER TYPE "public"."points_allocations" OWNER TO "postgres";


CREATE TYPE "public"."race_format" AS ENUM (
    'practice',
    'sprint',
    'endurance'
);


ALTER TYPE "public"."race_format" OWNER TO "postgres";


CREATE TYPE "public"."track_type" AS ENUM (
    'outdoor',
    'indoor'
);


ALTER TYPE "public"."track_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_fastest_laps"("for_event_id" bigint, "for_league_id" bigint) RETURNS TABLE("event_session_result_id" bigint, "event_session_id" bigint, "event_id" bigint, "racer_id" bigint, "fastest_lap" numeric, "total_time" numeric, "first_name" "text", "last_name" "text", "experience_level" "public"."experience_level")
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."get_fastest_laps"("for_event_id" bigint, "for_league_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_types"("enum_type" "text") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."get_types"("enum_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."racer_exists"("user_email" character varying) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    exists boolean;
BEGIN
    SELECT COUNT(*) > 0 INTO exists
    FROM public.racer_users
    WHERE email = user_email;

    RETURN exists;
END;
$$;


ALTER FUNCTION "public"."racer_exists"("user_email" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."racer_exists_by_email"("email_input" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    exists boolean;
BEGIN
    SELECT COUNT(*) > 0 INTO exists
    FROM public.racer_users
    WHERE email = email_input;

    RETURN exists;
END;
$$;


ALTER FUNCTION "public"."racer_exists_by_email"("email_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."racers_not_league_entrants"("requested_league_id" bigint) RETURNS TABLE("id" bigint, "user_id" "uuid", "first_name" "text", "last_name" "text", "created_at" timestamp with time zone, "student_id_expiry" "date", "experience_level" "public"."experience_level")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT r.*
    FROM public."Racers" r
    LEFT JOIN public."LeagueEntrant" le ON r.id = le.racer_id AND le.league_id = requested_league_id
    WHERE le.id IS NULL;
END;
$$;


ALTER FUNCTION "public"."racers_not_league_entrants"("requested_league_id" bigint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Members" (
    "id" bigint NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" NOT NULL,
    "membership" "uuid" DEFAULT "gen_random_uuid"(),
    "racer" "uuid" NOT NULL
);


ALTER TABLE "public"."Members" OWNER TO "postgres";


ALTER TABLE "public"."Members" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."MembershipTypes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "validFrom" "date" NOT NULL,
    "validUntil" "date" NOT NULL,
    "price" numeric NOT NULL
);


ALTER TABLE "public"."MembershipTypes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Racers" (
    "id" "uuid" NOT NULL,
    "firstName" "text" NOT NULL,
    "lastName" "text" NOT NULL,
    "graduationDate" "date",
    "fullName" "text" GENERATED ALWAYS AS ((("firstName" || ' '::"text") || "lastName")) STORED
);


ALTER TABLE "public"."Racers" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."RacerDetails" AS
 SELECT "r"."id",
    "r"."firstName",
    "r"."lastName",
    "r"."graduationDate",
    "r"."fullName",
    "u"."email",
    "u"."last_sign_in_at"
   FROM ("public"."Racers" "r"
     JOIN "auth"."users" "u" ON (("r"."id" = "u"."id")));


ALTER TABLE "public"."RacerDetails" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Tracks" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."track_type",
    "name" "text",
    "track_map_upload_path" "text"
);


ALTER TABLE "public"."Tracks" OWNER TO "postgres";


ALTER TABLE "public"."Tracks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tracks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "Members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."MembershipTypes"
    ADD CONSTRAINT "MembershipTypes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Racers"
    ADD CONSTRAINT "Racers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tracks"
    ADD CONSTRAINT "Tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "Members_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "Members_membership_fkey" FOREIGN KEY ("membership") REFERENCES "public"."MembershipTypes"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "Members_racer_fkey" FOREIGN KEY ("racer") REFERENCES "public"."Racers"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Racers"
    ADD CONSTRAINT "Racers_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_fastest_laps"("for_event_id" bigint, "for_league_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_fastest_laps"("for_event_id" bigint, "for_league_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_fastest_laps"("for_event_id" bigint, "for_league_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_types"("enum_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_types"("enum_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_types"("enum_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."racer_exists"("user_email" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."racer_exists"("user_email" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."racer_exists"("user_email" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."racer_exists_by_email"("email_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."racer_exists_by_email"("email_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."racer_exists_by_email"("email_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."racers_not_league_entrants"("requested_league_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."racers_not_league_entrants"("requested_league_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."racers_not_league_entrants"("requested_league_id" bigint) TO "service_role";


















GRANT ALL ON TABLE "public"."Members" TO "anon";
GRANT ALL ON TABLE "public"."Members" TO "authenticated";
GRANT ALL ON TABLE "public"."Members" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Members_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."MembershipTypes" TO "anon";
GRANT ALL ON TABLE "public"."MembershipTypes" TO "authenticated";
GRANT ALL ON TABLE "public"."MembershipTypes" TO "service_role";



GRANT ALL ON TABLE "public"."Racers" TO "anon";
GRANT ALL ON TABLE "public"."Racers" TO "authenticated";
GRANT ALL ON TABLE "public"."Racers" TO "service_role";



GRANT ALL ON TABLE "public"."RacerDetails" TO "anon";
GRANT ALL ON TABLE "public"."RacerDetails" TO "authenticated";
GRANT ALL ON TABLE "public"."RacerDetails" TO "service_role";



GRANT ALL ON TABLE "public"."Tracks" TO "anon";
GRANT ALL ON TABLE "public"."Tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."Tracks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tracks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tracks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tracks_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
