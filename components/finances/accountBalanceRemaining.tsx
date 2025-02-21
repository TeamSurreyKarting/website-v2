"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AccountBalanceRemaining({
  remaining,
  starting,
}: {
  remaining: number;
  starting: number;
}) {
  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className={"text-left"}>
        <CardTitle className={"text-xl"}>Remaining Balance</CardTitle>
        <CardDescription className={"text-lg"}><span className={"font-bold"}>{gbpFormat.format(remaining)}</span>&nbsp;({100-Math.round(remaining/starting)}%)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Progress max={Math.max(remaining, starting)} value={remaining} />
      </CardContent>
      <CardFooter className={"mt-4"}>
        <p>Starting Balance: {gbpFormat.format(starting)}</p>
      </CardFooter>
    </Card>
  );
}
