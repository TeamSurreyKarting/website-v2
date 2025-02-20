import AccountSelector from "@/components/finances/accountSelector";
import AccountsSummary from "@/components/finances/accountsSummary";
import TransactionsDataTable from "@/components/finances/transactions/data-table";
import { Suspense } from "react";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getAccounts(onlyActive: boolean = true) {
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

  const { data: accounts, error } = await query;

  if (error) {
    throw error;
  }

  return accounts;
}

async function getAccountDetails(
  accountId: string,
): Promise<Database["public"]["Tables"]["Accounts"]["Row"]> {
  const supabase = await createClient();

  const query = supabase.from("Accounts").select().eq("id", accountId).single();

  const { data: account, error } = await query;

  if (error) throw error;

  return account;
}

async function getAccountTxns(
  accountId: string,
): Promise<TxAccount[] | undefined> {
  const supabase = await createClient();

  // build query
  const query = supabase
    .from("Transactions")
    .select("id, occurredAt, itemDescription, value, Accounts( id, name )")
    .eq("account", accountId)
    .order("occurredAt", { ascending: false });

  const { data: transactions, error } = await query;

  if (error) {
    throw error;
  }

  if (transactions === null) {
    throw Error("Error finding transactions");
  }

  return transactions;
}

export default async function Page({
  params,
}: {
  params: Promise<{ accountId?: string }>;
}) {
  const accountId = (await params).accountId;

  const [accounts, accountDetails, accountTxns] = await Promise.all([
    getAccounts(),
    accountId ? getAccountDetails(accountId) : null,
    accountId ? getAccountTxns(accountId) : null,
  ]);

  if (accountId && !accountDetails) {
    notFound();
  }

  return (
    <>
      <div className={"flex flex-row gap-2 items-center justify-between"}>
        <Suspense fallback={<p>Loading accounts...</p>}>
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
              <TransactionsDataTable data={accountTxns ?? []} />
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
