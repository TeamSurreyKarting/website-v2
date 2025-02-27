"use client";

import { z } from "zod";
import { Tables } from "@/database.types";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { IoIdCard } from "react-icons/io5";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

const formSchema = z.object({
  competition: z.string().uuid().readonly(),
  membership: z.string().uuid(),
})

export function AddCompMembershipRestriction(
  { competition, memberships, membershipRequirements }:
  {
    competition: Tables<'Competitions'>,
    memberships: Tables<'MembershipTypes'>[],
    membershipRequirements: (Tables<'CompetitionMembershipRequirement'> & { MembershipTypes: Tables<'MembershipTypes'> })[]
  }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition: competition.id,
      membership: undefined,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);
  const [isRemovingRestriction, setRemovingRestriction] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      // add to squad
      await supabase.from("CompetitionMembershipRequirement").insert(values).throwOnError();

      // Finish
      refresh();
      setDialogOpenState(false);

      toast({ title: "Added membership restriction to competition", description: `${competition.name} now requires membership ${membershipRequirements?.find((mr) => mr.MembershipTypes.id === form.getValues().membership)?.MembershipTypes.name}` })
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to add membership restriction", description: (e as Error).message });
    }
  }

  async function removeRestriction(id: string) {
    setRemovingRestriction(true);

    try {
      const supabase = createClient();

      // add to squad
      await supabase.from("CompetitionMembershipRequirement").delete().eq("id", id).throwOnError();

      // Finish
      refresh();

      toast({ title: "Removed membership restriction from competition" })
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to remove membership restriction", description: (e as Error).message });
    } finally {
      setRemovingRestriction(false);
    }
  }

  return (
    <ResponsiveModal
      title={"Membership Restrictions"}
      trigger={
        <Button>
          <IoIdCard />
          <span>Membership Restrictions</span>
        </Button>
      }
      open={dialogIsOpen}
      onOpenChange={setDialogOpenState}
    >
      <>
        {membershipRequirements.length > 0 ? (
          <div className={"flex flex-col gap-2"}>
            { membershipRequirements.map((mr) => (
              <Card key={mr.id}>
                <CardHeader className={"py-2 px-4 flex flex-row justify-between items-center gap-2"}>
                  <CardTitle>{mr.MembershipTypes.name}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={"ghost"}>
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {mr.MembershipTypes.name}</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the requirement for squad members holding the membership "{mr.MembershipTypes.name}".
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          asChild
                        >
                          <LoadingButton
                            variant={"destructive"}
                            loading={isRemovingRestriction}
                            onClick={() => removeRestriction(mr.id)}
                          >
                            Confirm
                          </LoadingButton>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <em className={"w-full"}>No membership requirements set.</em>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <FormField
              control={form.control}
              name={"membership"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membership</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Membership" />
                      </SelectTrigger>
                      <SelectContent>
                        { memberships.map((membership) => (
                          <SelectItem
                            key={membership.id}
                            value={membership.id}
                          >
                            {membership.name}
                          </SelectItem>
                        )) }
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className={"max-md:w-full"}>
              <LoadingButton
                loading={form.formState.isLoading}
                className={"w-full md:w-fit md:float-right"}
                type={"submit"}
              >
                Add
              </LoadingButton>
            </div>
          </form>
        </Form>
      </>
    </ResponsiveModal>
  )
}