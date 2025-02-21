import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";

async function fetchAccountName(
  accountId: string,
): Promise<string | undefined> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Accounts")
    .select("name")
    .eq("id", accountId)
    .single();

  return data?.name;
}

export default async function BreadcrumbSlot({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string }>;
}) {
  const accountId = (await searchParams).accountId;

  const accountName = accountId ? await fetchAccountName(accountId) : null;

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink className={"text-gray-300"} href={"/finances"}>
          Finances
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          className={"text-gray-300"}
          href={`/finances/${accountId}`}
        >
          {accountName ?? accountId}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className={"text-white capitalize"}>
          New Transaction
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
