"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import { Database } from "@/database.types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccountSelector({
  accounts,
  value,
  onChange,
}: {
  accounts: Database["public"]["Tables"]["Accounts"]["Row"][];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const router = useRouter();

  const handleSelectionChange = useCallback(
    async (newAccountId?: string) => {
      if (!newAccountId) return;

      onChange?.(newAccountId);
      router.push(`/finances/${newAccountId}`);
    },
    [router, onChange],
  );

  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const selectedAccount = accounts.find((acc) => acc.id === value);

  return (
    <Select value={value} onValueChange={handleSelectionChange}>
      <SelectTrigger className="w-full overflow-hidden">
        {selectedAccount ? selectedAccount.name : "Select Account..."}
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id}
            className={clsx("flex gap-2", {
              "font-medium": account.id === value,
            })}
          >
            <p className={"truncate"}>{account.name}</p>
            <span className={"opacity-60"}>
              {gbpFormat.format(account.endingBalance)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
