import { Database } from "@/database.types";
import { AccountBalanceRemaining } from "@/components/finances/accountBalanceRemaining";

export default async function AccountsSummary({
  accountDetails,
}: {
  accountDetails: Database["public"]["Tables"]["Accounts"]["Row"];
}) {
  return (
    <div className={"grid grid-cols-[1fr_2fr] gap-2"}>
      <div
        className={
          "rounded-lg text-center bg-ts-blue-500 border border-ts-blue-300"
        }
      >
        <AccountBalanceRemaining
          starting={accountDetails.startingBalance}
          remaining={accountDetails.endingBalance}
        />
      </div>
      <div className={"rounded-lg bg-ts-blue-500 border border-ts-blue-300"}>
        {/* Line Chart - Step of transaction history */}
        <p>asdfafasdfasdf</p>
      </div>
    </div>
  );
}
