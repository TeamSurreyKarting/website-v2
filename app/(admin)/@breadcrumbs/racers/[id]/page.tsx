import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";

async function fetchRacerName(userId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Racers")
    .select("fullName")
    .eq("id", userId)
    .single();

  return error ? null : data.fullName;
}

export default async function BreadcrumbSlot(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const racerName = await fetchRacerName(params.id);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/racers"}>
          Racers
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          {racerName ?? params.id}
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
