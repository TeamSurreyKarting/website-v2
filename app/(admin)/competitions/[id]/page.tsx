import { notFound } from "next/navigation";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCompetitionEventForm } from "@/components/forms/competitions/add-event";
import { AddSquadRacerForm } from "@/components/forms/competitions/add-squad-racer";
import { AddCompMembershipRestriction } from "@/components/forms/competitions/add-comp-membership-restrictions";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CircleAlert } from "lucide-react";

type CompetitionComplex = Tables<'Competitions'> & {
  CompetitionEvents: (Tables<'CompetitionEvents'> & { Events: Tables<'Events'> | null, Tracks: Tables<'Tracks'> })[],
  CompetitionSquad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> & { Members: Tables<'Members'>[] } })[] }

async function getCompetition(id: string): Promise<CompetitionComplex> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("Competitions")
      .select('*, CompetitionEvents( *, Events( * ), Tracks( * ) ), CompetitionSquad( *, Racers( *, Members( * ) ) )')
      .eq("id", id)
      .maybeSingle()
      .throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getCompetitionMembershipRequirements(competitionId: string): Promise<(Tables<'CompetitionMembershipRequirement'> & { MembershipTypes: Tables<'MembershipTypes'> })[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionMembershipRequirement")
      .select('*, MembershipTypes!inner( * )')
      .eq("competition", competitionId)
      .throwOnError();

    if (!data) {
      throw new Error("Competition membership requirement db request invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getMembershipTypes() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("MembershipTypes")
      .select()
      .throwOnError();

    if (!data) {
      throw new Error("Membership types db request invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getTracks(): Promise<Tables<'Tracks'>[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase.from("Tracks").select().order("name").throwOnError();

    if (!data) {
      throw new Error("Request for tracks invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getRacers(): Promise<Tables<'Racers'>[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase.from("Racers").select().order("fullName").throwOnError();

    if (!data) {
      throw new Error("Request for racers invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export default async function CompetitionsDetailPage(props: { params: Promise<{ id?: string }> }) {
  const params = await props.params;
  const competitionId = params.id;

  if (!competitionId) {
    console.error("No competition id supplied.");
    notFound();
  }

  try {
    const [
      competition,
      compMembershipRequirements,
      membershipTypes,
      tracks,
      racers
    ] = await Promise.all([
      getCompetition(competitionId),
      getCompetitionMembershipRequirements(competitionId),
      getMembershipTypes(),
      getTracks(),
      getRacers(),
    ])

    const compMembershipRequirementsSet = new Set(compMembershipRequirements.map((m) => m.membership));

    return (
      <>
        <h2 className={"text-2xl font-bold"}>Competition</h2>
        <h3 className={"text-xl font-medium text-ts-gold-700"}>{competition.name}</h3>
        <Card className={"mt-4"}>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Events</CardTitle>
            <AddCompetitionEventForm competition={competition} tracks={tracks} />
          </CardHeader>
          <CardContent className={"grid grid-cols-1 lg:grid-cols-2 gap-4"}>
            { competition.CompetitionEvents.length > 0 ?
              competition.CompetitionEvents.map((competitionEvent) => (
                <Link href={`/competitions/${competition.id}/event/${competitionEvent.id}`} key={competitionEvent.id}>
                  <Card className={"border dark:border-ts-gold dark:bg-ts-blue dark:text-foreground border-ts-blue bg-ts-gold-700 text-black"}>
                    <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
                      <CardTitle className={"text-xl"}>{competitionEvent.Events?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track: <strong>{competitionEvent.Tracks.name}</strong></p>
                      <p>Starts At: <strong>{format(competitionEvent.Events?.startsAt ?? "", 'HH:mm, PPP')}</strong></p>
                      <p>Ends At: <strong>{format(competitionEvent.Events?.endsAt ?? "", 'HH:mm, PPP')}</strong></p>
                    </CardContent>
                  </Card>
                </Link>
              ))
              : <em>No events scheduled.</em>
            }
          </CardContent>
        </Card>
        <Card className={"mt-4"}>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Squad</CardTitle>
            <div className={"flex flex-row gap-2 items-end"}>
              <AddCompMembershipRestriction competition={competition} memberships={membershipTypes} membershipRequirements={compMembershipRequirements} />
              <AddSquadRacerForm competition={competition} racers={racers} />
            </div>
          </CardHeader>
          <CardContent className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"}>
            { competition.CompetitionSquad.length > 0 ?
              competition.CompetitionSquad.map((squadRacer) => {
                const racerMemberships = new Set(squadRacer.Racers.Members.map((x) => x.membership));
                const correctMemberships = compMembershipRequirementsSet.intersection(racerMemberships);

                return (
                  <Card className={"border dark:border-ts-gold dark:bg-ts-blue dark:text-foreground border-ts-blue bg-ts-gold-700 text-black"} key={squadRacer.id}>
                    <CardHeader>
                      <CardTitle>{squadRacer.Racers.fullName}</CardTitle>
                      {correctMemberships.size === 0 && (
                          <Badge variant="destructive"><CircleAlert />Racer is missing necessary membership</Badge>
                      )}
                    </CardHeader>
                  </Card>
                )
              }) : <em>No squad racers.</em>
            }
          </CardContent>
        </Card>
      </>
    )
  } catch (e) {
    console.error(e);
  }
}