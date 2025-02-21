import AccountSelector from "@/components/finances/accountSelector";
import AccountsSummary from "@/components/finances/accountsSummary";
import TransactionsDataTable from "@/components/finances/transactions/data-table";
import { Suspense } from "react";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

async function getAccounts(onlyActive: boolean = true) {
  try {
    const supabase = await createClient();

    const query = supabase
      .from("Accounts")
      .select()
      .order("endDate", { ascending: false });

    if (onlyActive) {
      // filter query to only show budgets that are currently active
      const now = new Date();
      const nowISO = now.toISOString();

      query.gt("endDate", nowISO);
      query.lt("startDate", nowISO);
    }

    const { data: accounts } = await query.throwOnError();

    return accounts;
  } catch (error) {
    console.log(error);
    notFound();
  }
}

type AccountDetails = Tables<'Accounts'> & { Transactions: Tables<'Transactions'>[]; };

async function getAccountDetails(
  accountId: string,
): Promise<AccountDetails> {
  try {
    const supabase = await createClient();

    const query = supabase
      .from("Accounts")
      .select('*, Transactions( * )')
      .eq("id", accountId).single();

    const { data: account } = await query.throwOnError();

    return account;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ accountId?: string }>;
}) {
  const accountId = (await params).accountId;

  const [
    accounts,
    accountDetails,
  ] = await Promise.all([
    getAccounts(),
    accountId ? getAccountDetails(accountId) : undefined,
  ]);

  if (accountId && !accountDetails) {
    notFound();
  }

  return (
    <>
      <div className={"grid grid-cols-[1fr_auto] gap-2 items-center justify-between"}>
        <Suspense fallback={<p>Loading...</p>}>
          <AccountSelector accounts={accounts} value={accountDetails?.id} />
        </Suspense>
        <Link href={"/finances/accounts/new"}>
          <Button>
            <FaPlus />
            <span className={"hidden md:block"}>Create Account</span>
          </Button>
        </Link>
      </div>
      <div className={"mt-4"}>
        <h3 className={"text-lg font-medium mb-2"}>Account Details</h3>
        {accountDetails ? (
          <Suspense fallback={<p>Loading summary of accounts...</p>}>
            <AccountsSummary
              key={accountDetails.id}
              accountDetails={accountDetails}
            />
            <div className={"mt-4"}>
              <div className={"mt-8 mb-4 flex gap-4 items-center justify-between"}>
                <h3 className={"font-medium text-lg"}>Transaction History</h3>
                <Link
                  href={`/finances/transactions/new?accountId=${accountDetails.id}`}
                >
                  <Button>
                    <FaPlus />
                    <span>Add Transaction</span>
                  </Button>
                </Link>
              </div>
              { accountDetails && <TransactionsDataTable data={accountDetails.Transactions} /> }
            </div>
          </Suspense>
        ) : (
           <Card>
             <CardHeader>
               <CardTitle>Select an account to view finances.</CardTitle>
             </CardHeader>
           </Card>
        )}
      </div>
    </>
  );
}
