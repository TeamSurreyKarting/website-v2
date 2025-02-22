import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";

async function fetchEventName(eventId: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase.from("Events").select('name').eq("id", eventId).single().throwOnError();

  return data.name;
}

export default async function BreadcrumbSlot(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const name = await fetchEventName(params.id);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/events"}>
          Events
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          {name ?? params.id}
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}