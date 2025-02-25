import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";

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
        <AdminBreadcrumbLink href={"/finances"}>
          Finances
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbLink
          href={`/finances/${accountId}`}
        >
          {accountName ?? accountId}
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          New Transaction
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
