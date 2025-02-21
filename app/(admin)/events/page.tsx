import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import Search from "@/components/search";
import ShowPastEventsToggle from "@/components/events/show-past-events-toggle";
import { Tables } from "@/database.types";
import EventsDataTable from "@/components/events/data-table/data-table";
import { notFound } from "next/navigation";

async function getEvents(search?: string, showPastEvents?: boolean): Promise<Tables<'Events'>[]> {
  try {
    const supabase = await createClient();

    const query = supabase.from("Events").select("*").order("startsAt");

    if (search) {
      query.ilike("name", `%${search}%`);
    }

    if (showPastEvents) {
      query.lt("endsAt", new Date().toISOString());
    }

    const { data } = await query.throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function EventsListPage({ searchParams }: { searchParams?: Promise<{ q: string, showPastEvents: boolean }> }) {
  try {
    const sp = await searchParams;

    const events = await getEvents(sp?.q, sp?.showPastEvents);

    return (
      <div className={"container mx-auto"}>
        <h2 className={"text-2xl font-bold"}>Events</h2>
        <div className="mx-auto my-2 flex justify-between gap-x-2">
          <div className={"flex flex-row gap-4 items-center"}>
            <Search />
            <ShowPastEventsToggle />
          </div>
          <div className={"flex flex-row gap-2"}>
            <Link href={"/events/new"} className={"flex gap-2 items-center"}>
              <Button>
                <FaPlus />
                <span className={"hidden md:block"}>Create</span>
              </Button>
            </Link>
          </div>
        </div>
        <Suspense
          key={`${sp?.q}_${sp?.showPastEvents}}`}
          fallback={<p>Loading...</p>}
        >
          <EventsDataTable events={events} />
        </Suspense>
      </div>
    )
  } catch (e) {
    console.error(e);
  }
}