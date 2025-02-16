import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";

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
        <BreadcrumbLink className={"text-gray-300"} href={"/events"}>
          Events
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className={"text-white capitalize"}>
          {name ?? params.id}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}