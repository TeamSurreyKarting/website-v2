import { createClient } from "@/utils/supabase/server";
import { BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";
import { notFound } from "next/navigation";

async function getCompetitionAndEventName(compEventId: string) {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionEvents")
      .select('Competitions( name ), Events( name )')
      .eq("id", compEventId)
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

export default async function BreadcrumbSlot(props: {
  params: Promise<{ id: string, eventId: string }>;
}) {
  const params = await props.params;
  const compEvent = await getCompetitionAndEventName(params.eventId);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/competitions"}>
          Competitions
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={`/competitions/${params.id}`}>
          {compEvent.Competitions.name ?? params.id}
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          {compEvent.Events?.name ?? params.eventId}
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}