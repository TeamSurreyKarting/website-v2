import { Database } from "@/database.types";
import { AccountBalanceRemaining } from "@/components/finances/accountBalanceRemaining";

export default async function AccountsSummary({
  accountDetails,
}: {
  accountDetails: Database["public"]["Tables"]["Accounts"]["Row"];
}) {
  return (
    <div className={"flex flex-col md:grid md:grid-cols-[1fr_2fr] gap-2"}>
      <AccountBalanceRemaining
        starting={accountDetails.startingBalance}
        remaining={accountDetails.endingBalance}
      />
    </div>
  );
}
