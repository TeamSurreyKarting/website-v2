import { createClient } from "@/utils/supabase/server";
import { BaseDataTable } from "@/components/base-data-table";
import { columns } from "@/components/finances/transactions/columns";

async function getData(accountId?: string) {
  const supabase = await createClient();

  // build query
  const query = supabase
    .from("Transactions")
    .select("id, occurredAt, itemDescription, value, Accounts( id, name )");

  // if filtering by account, apply
  if (accountId) {
    query.eq("account", accountId);
  }

  // sort by reverse chronological order
  query.order("occurredAt", { ascending: false });

  const { data: transactions, error } = await query;

  if (error) {
    throw error;
  }

  if (transactions === null) {
    throw Error("Error finding transactions");
  }

  return transactions;
}

export default async function TransactionsDataTable({
  data,
  accountId,
}: {
  data?: TxAccount[];
  accountId?: string;
}) {
  if (!data && !accountId) {
    throw Error(
      "No data or account identifier was supplied to enable this component to operate correctly.",
    );
  }

  return (
    <BaseDataTable
      columns={columns}
      data={data ?? (await getData(accountId))}
    />
  );
}
