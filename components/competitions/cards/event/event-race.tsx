"use client";

import { Tables } from "@/database.types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FaFlagCheckered } from "react-icons/fa6";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import RaceEventForm from "@/components/forms/competitions/races/upsert";
import AssignDriverToRace from "@/components/forms/competitions/races/assign-driver";

type CompetitionEventRaceEntrant = Tables<'CompetitionEventRaceEntrants'> & {
  CompetitionEventTeamSelection: {
    id: string,
    CompetitionEventTeams: Tables<'CompetitionEventTeams'>,
    Racers: Tables<'Racers'>
  }
}

type Race = Tables<'CompetitionEventRaces'> & {
  CompetitionEventRaceEntrants: CompetitionEventRaceEntrant[]
}

type CompetitionEventRaceCardProps = {
  race: Race,
  competitionEvent: (Tables<'CompetitionEvents'> & { Events: Tables<'Events'> | null }),
  competitionTeams: (Tables<'CompetitionEventTeams'> & { CompetitionEventTeamSelection: (Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> })[] })[]
}

export default function CompetitionEventRaceCard({ race, competitionEvent, competitionTeams }: CompetitionEventRaceCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAssigningRacers, setIsAssigningRacers] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { refresh } = useRouter();
  const { toast } = useToast();

  async function deleteEventRace() {
    try {
      setIsDeleting(true);

      const supabase = createClient();

      await supabase.from("CompetitionEventRaces").delete().eq("id", race.id).throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to delete race from competition event.", description: (e as Error).message });
    }
  }

  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <Card className={"bg-ts-gold-50 text-black dark:bg-ts-blue dark:text-foreground"}>
            <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
              <div className={"flex flex-col gap-2"}>
                <CardTitle>{race.name}</CardTitle>
                <CardDescription className={"flex flex-row gap-2 items-center"}>
                  <Clock />{format(race.startsAt, 'HH:mm')}
                </CardDescription>
                {race.CompetitionEventRaceEntrants.length === 0 ? (
                  <span>No racers entered.</span>
                ) : (
                  <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                    {race.CompetitionEventRaceEntrants.map((entrant) => <CompetitionEventRaceEntrant key={entrant.id} race={race} entrant={entrant} />)}
                  </div>
                )}
              </div>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
            </CardHeader>
          </Card>
          <DropdownMenuContent
            align="end"
          >
            <DropdownMenuItem onClick={() => { setIsAssigningRacers(true); }}>
              <GiFullMotorcycleHelmet />
              Assign Racers
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setIsEditing(true); }}>
              <Pencil />
              <span>Edit Race</span>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className={
                  "text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "
                }>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the race <strong>{race.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
            <AlertDialogCancel className={"m-0"}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <LoadingButton
                variant={"destructive"}
                className={
                  "bg-red-600 text-white hover:bg-red-500 hover:text-white"
                }
                disabled={isDeleting}
                loading={isDeleting}
                onClick={() => deleteEventRace()}
              >
                Confirm
              </LoadingButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <RaceEventForm
        competitionEvent={competitionEvent}
        defaultValues={race}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
      <AssignDriverToRace
        race={race}
        competitionTeams={competitionTeams}
        open={isAssigningRacers}
        onOpenChange={setIsAssigningRacers}
      />

    </Dialog>
  )
}

function CompetitionEventRaceEntrant({ race, entrant }: { race: Race, entrant: CompetitionEventRaceEntrant }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { refresh } = useRouter();
  const { toast } = useToast();

  async function removeEntrantFromRace() {
    try {
      setIsDeleting(true);
      const supabase = createClient();

      await supabase.from("CompetitionEventRaceEntrants").delete().eq("id", entrant.id).throwOnError();

      toast({ title: `Removed ${entrant.CompetitionEventTeamSelection.Racers.fullName} from ${race.name}` })
      setIsOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: `Failed to remove ${entrant.CompetitionEventTeamSelection.Racers.fullName} from ${race.name}`, description: (error as Error).message })
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <Card key={entrant.id} className={"p-4"}>
          <CardHeader className={"p-0 flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>{entrant.CompetitionEventTeamSelection.Racers.fullName}</CardTitle>
            <DropdownMenuTrigger>
              <Button variant={"ghost"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
          </CardHeader>
        </Card>
        <DropdownMenuContent align={"end"}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className={
                "text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "
              }>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will unassign <strong>{entrant.CompetitionEventTeamSelection.Racers.fullName}</strong> from the race <strong>{race.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
          <AlertDialogCancel className={"m-0"}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant={"destructive"}
              className={
                "bg-red-600 text-white hover:bg-red-500 hover:text-white"
              }
              disabled={isDeleting}
              loading={isDeleting}
              onClick={() => removeEntrantFromRace()}
            >
              Confirm
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}