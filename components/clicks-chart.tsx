"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ClicksChartProps {
  data: Array<{
    date: string
    clicks: number
    label: string
  }>
}

export function ClicksChart({ data }: ClicksChartProps) {
  const maxClicks = Math.max(...data.map((d) => d.clicks), 1)

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--primary))",
    },
  }

  if (data.every((d) => d.clicks === 0)) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No click data yet. Share your link to start tracking!
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split(",")[0]}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            allowDecimals={false}
            domain={[0, Math.max(maxClicks, 5)]}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="clicks" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.clicks > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
