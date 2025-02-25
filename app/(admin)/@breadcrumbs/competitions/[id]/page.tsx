import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";

async function getCompetitionName(id: string): Promise<string | undefined> {
  try {
    const supabase = await createClient();

    const { data } = await supabase.from("Competitions").select("name").eq("id", id).maybeSingle().throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data.name;
  } catch (e) {
    console.error(e);
  }
}

export default async function BreadcrumbSlot(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const name = await getCompetitionName(params.id);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/competitions"}>
          Competitions
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