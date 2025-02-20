"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  starting: {
    label: "Starting Balance",
  },
  remaining: {
    label: "Remaining Balance",
    color: "#fcc133",
  },
} satisfies ChartConfig;

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

  const chartData = [
    {
      remaining: remaining,
      starting: starting,
      fill: "var(--color-remaining)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className={"text-left"}>
        <CardTitle className={"text-xl"}>Remaining Balance</CardTitle>
        <CardDescription>Starting Balance: {gbpFormat.format(starting)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[100px] max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-66}
            endAngle={-66+((remaining/starting)*330)}
            innerRadius={80}
            outerRadius={135}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="#"
              className="fill-none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="remaining" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {gbpFormat.format(chartData[0].remaining)}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
