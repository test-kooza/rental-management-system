"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface MetricsComparisonChartProps {
  data: {
    period: string
    adr: number
    revpar: number
    formattedADR: string
    formattedRevPAR: string
  }[]
}

export default function MetricsComparisonChart({ data }: MetricsComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <XAxis dataKey="period" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <p className="font-medium">{label}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[0.70rem] uppercase text-muted-foreground">ADR</span>
                      <span className="font-bold text-sm ml-auto">{payload[0].payload.formattedADR}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-[0.70rem] uppercase text-muted-foreground">RevPAR</span>
                      <span className="font-bold text-sm ml-auto">{payload[0].payload.formattedRevPAR}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="adr"
          name="ADR"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="revpar"
          name="RevPAR"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

