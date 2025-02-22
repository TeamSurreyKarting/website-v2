import { notFound } from "next/navigation";
import NewFinancialTransactionForm from "@/components/forms/finances/new-transaction";

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

  return (
    <div className={"container mx-auto"}>
      <NewFinancialTransactionForm accountId={accountId} />
    </div>
  );
}
