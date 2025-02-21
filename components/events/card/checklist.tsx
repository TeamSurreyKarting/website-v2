"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { z } from "zod";
import { LoadingButton } from "@/components/ui/loading-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RacerCombobox from "@/components/racers/combobox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsRight, ChevronsUpDown } from "lucide-react";
import pluralize from "pluralize";

const formSchema = z.object({
  event: z.string().uuid(),
  orderPosition: z.number().min(0),
  title: z.string(),
  description: z.string().optional(),
  assignedTo: z.string().uuid(),
})

export default function ChecklistCard({ checklistItems, eventId, }: { checklistItems: (Tables<'EventChecklist'> & { Racers: Tables<'Racers'> })[], eventId: string }) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { refresh } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: eventId,
      orderPosition: checklistItems.length,
      title: undefined,
      description: undefined,
      assignedTo: undefined,
    }
  });

  useEffect(() => {
    form.reset();
  }, [modalOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      await supabase.from("EventChecklist").insert(values).throwOnError();

      toast({ title: "Added checklist item" })

      setModalOpen(false);
      form.reset();

      refresh();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to add checklist item", description: (e as Error).message })
    }
  }

  async function updateChecklistItemState(itemId: string, newState: boolean) {
    try {
      const supabase = createClient();

      await supabase.from("EventChecklist").update({ isDone: newState }).eq("id", itemId).throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
    }
  }

  const incompleteChecklistItems = checklistItems.filter((item) => !item.isDone);
  const completeChecklistItems = checklistItems.filter((item) => item.isDone);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <Card>
        <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
          <div className={"flex flex-col gap-2"}>
            <CardTitle>Checklist</CardTitle>
            <CardDescription>
              {incompleteChecklistItems.length === 0 ? "No" : incompleteChecklistItems.length} {pluralize('task', incompleteChecklistItems.length)} to-do
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button>
              <FaPlus />
              <span>Add</span>
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          {
            incompleteChecklistItems.length
             ? incompleteChecklistItems.map((item) => (<ChecklistItem key={item.id} item={item} updateItemState={updateChecklistItemState} />))
             : (<em>No incomplete items</em>)
          }
          {completeChecklistItems.length > 0 && (
            <Collapsible>
              <div className="flex items-center justify-between space-x-4 px-4 my-2">
                <span>Completed Items</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className={"flex flex-col gap-2"}>
                {completeChecklistItems.length && completeChecklistItems.map((item) => (<ChecklistItem key={item.id} item={item} updateItemState={updateChecklistItemState} />))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className={"resize-none"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"assignedTo"}
              render={({ field }) => (
                <FormItem className={"flex flex-col"}>
                  <FormLabel>Assigned To</FormLabel>
                  <RacerCombobox
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    fullWidth={true}
                  />
                  <FormDescription>
                    The person that will oversee this task&apos;s completion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                loading={form.formState.isLoading}
                type={"submit"}
                className={"float-right"}
              >
                Add
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ChecklistItem({ item, updateItemState }: { item: Tables<'EventChecklist'> & { Racers: Tables<'Racers'> }, updateItemState: (itemId: string, newState: boolean) => void }) {
  return (
    <div
      className={"grid grid-cols-[1fr_auto] gap-2 bg-ts-blue-400 p-2 rounded-lg border border-ts-gold-700"}
    >
      <div className={"flex flex-col gap-1"}>
        <h4 className={"text-md font-bold"}>{item.title}</h4>
        { item.description && (<p className={"text-sm"}>{item.description}</p>) }
        { item.Racers.fullName && (
          <div className={"flex flex-row gap-1 items-center justify-start"}>
            <ChevronsRight/>
            <span className={"text-sm"}>{item.Racers.fullName}</span>
          </div>
        )}
      </div>
      <div>
        <Checkbox checked={item.isDone} onCheckedChange={(newState) => updateItemState(item.id, newState as boolean)} />
        {/* Add button to expand additional details */}
      </div>
    </div>
  )
}