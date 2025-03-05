"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import AddEventTeamForm from "@/components/forms/competitions/add-event-team";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpsertTeamSelectionForm from "@/components/forms/competitions/upsert-team-selection";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, UserPlus } from "lucide-react";

type CompetitionEventTeamSelection = Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> }

type CompetitionEventTeam = Tables<'CompetitionEventTeams'> & { CompetitionEventTeamSelection: CompetitionEventTeamSelection[] };

type CompetitionEventTeamSelectionProps = {
  competitionEvent: Tables<'CompetitionEvents'>,
  competitionEventTeams: CompetitionEventTeam[],
  squad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[],
  squadAvailability: Tables<'CompetitionEventRacerAvailability'>[],
}

export default function CompetitionEventTeamSelection({ competitionEvent, competitionEventTeams, squad }: CompetitionEventTeamSelectionProps) {
  const [selectedTeam, setSelectedTeam] = useState<CompetitionEventTeam | undefined>(competitionEventTeams.length > 0 ? competitionEventTeams[0] : undefined);

  const selectedTeamSpots = selectedTeam?.maxNumber;
  const selectedTeamFieldedSpots = selectedTeam?.CompetitionEventTeamSelection.length;
  const totalSpots = Math.max(selectedTeamSpots ?? 0, selectedTeamFieldedSpots ?? 0);

  return (
    <Card>
      <CardHeader className={"flex flex-col gap-2"}>
        <CardTitle>Teams</CardTitle>
        <div className={"grid grid-cols-[1fr_auto] gap-2 items-center"}>
          <Select
            onValueChange={(id) => setSelectedTeam(competitionEventTeams.find((team) => team.id === id))}
            defaultValue={selectedTeam?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {competitionEventTeams.length > 0 ? competitionEventTeams?.map((cet) => (
                <SelectItem key={cet.id} value={cet.id}>
                  {cet.name}
                </SelectItem>
              )): <em>No teams created for event.</em>}
            </SelectContent>
          </Select>
          <AddEventTeamForm competitionEvent={competitionEvent}  />
        </div>
      </CardHeader>
      <CardContent className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
        { (selectedTeam && totalSpots) && Array.from({ length: totalSpots }).map((_, idx) => {
          // guard against out of bounds indices, return a placeholder
          const shouldShowPlaceholder = (idx + 1 > selectedTeam.CompetitionEventTeamSelection.length);

          if (shouldShowPlaceholder) {
            return <TeamSelectionPlaceholderItem team={selectedTeam} squad={squad} driverNumber={idx + 1} key={`team-selection-driver-${idx}`} />
          }

          const selection = selectedTeam.CompetitionEventTeamSelection[idx];

          return <TeamSelectionItem team={selectedTeam} squad={squad} selection={selection} key={`team-selection-driver-${idx}`} />;
        })}
      </CardContent>
    </Card>
  )
}

function TeamSelectionPlaceholderItem({ team, squad, driverNumber }: { team: CompetitionEventTeam, squad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[], driverNumber: number }) {
  return (
    <UpsertTeamSelectionForm team={team} squad={squad}>
      <Card className={"cursor-pointer bg-ts-gold-200 dark:bg-ts-blue group"}>
        <CardHeader className={"flex flex-row gap-2 justify-between items-center"}>
          <CardTitle className={"text-black/65 dark:text-white/50"}>Driver {driverNumber}</CardTitle>
          <UserPlus className={"text-black/65 dark:text-white/50 opacity-0 group-hover:opacity-100 transition-opacity"} />
        </CardHeader>
      </Card>
    </UpsertTeamSelectionForm>
  )
}

function TeamSelectionItem({ team, squad, selection } : { team: CompetitionEventTeam, squad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[], selection: CompetitionEventTeamSelection }) {
  const selectionIsInSquad = squad.find((s) => s.racer === selection.racer);
  return (
    <Card className={" bg-ts-gold-200 dark:bg-ts-blue"}>
      <CardHeader className={"flex flex-row gap-2 justify-between items-center"}>
        <CardTitle>{selection.Racers.fullName}</CardTitle>
        <UpsertTeamSelectionForm team={team} squad={squad} defaultValue={selectionIsInSquad ? selection : undefined}>
          <Button>
            <ArrowRightLeft />
          </Button>
        </UpsertTeamSelectionForm>
      </CardHeader>
    </Card>
  )
}