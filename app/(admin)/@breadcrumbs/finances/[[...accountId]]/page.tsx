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
  params,
}: {
  params: Promise<{ accountId?: string }>;
}) {
  const accountId = (await params).accountId;
  console.log("accountId", accountId);

  const accountName = accountId ? await fetchAccountName(accountId) : null;

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        {accountName ? (
          <AdminBreadcrumbLink href={"/finances"}>
            Finances
          </AdminBreadcrumbLink>
        ) : (
          <AdminBreadcrumbPage>
            Finances
          </AdminBreadcrumbPage>
        )}

      </BreadcrumbItem>
      {accountName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <AdminBreadcrumbPage>
              {accountName ?? accountId}
            </AdminBreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
