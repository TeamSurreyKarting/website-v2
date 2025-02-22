import { notFound } from "next/navigation";
import NewFinancialTransactionForm from "@/components/forms/finances/new-transaction";
import { createClient } from "@/utils/supabase/server";

async function getAccount(id: string) {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("Accounts")
      .select()
      .eq("id", id)
      .single()
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function Page(props: {
  searchParams?: Promise<{
    accountId?: string;
  }>;
}) {
  const accountId = (await props.searchParams)?.accountId;

  if (!accountId) {
    console.error("accountId not provided");
    notFound();
  }

  const account  = await getAccount(accountId);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-medium"}>New Transaction</h2>
      <h3 className={"text-lg font-medium text-accent"}>{account.name}</h3>
      <NewFinancialTransactionForm accountId={accountId} />
    </div>
  );
}
