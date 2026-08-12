"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTimeFormat } from "../TimeFormatProvider";
import { getPalette } from "./palette";
import type { DayBucket } from "../metrics";

export default function Last7DaysChart({ days }: { days: DayBucket[] }) {
  const { resolvedTheme } = useTheme();
  const { fmt } = useTimeFormat();
  const palette = getPalette(resolvedTheme);
  const hasData = days.some((d) => d.hours > 0);

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        No hours logged in the last 7 days.
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={{ stroke: palette.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: palette.grid, opacity: 0.4 }}
            contentStyle={{
              background: palette.tooltipBg,
              border: `1px solid ${palette.tooltipBorder}`,
              borderRadius: 8,
              color: palette.tooltipText,
              fontSize: 12,
            }}
            formatter={(value: number) => [fmt(value, { decimals: 2 }), "Logged"]}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {days.map((d) => (
              <Cell
                key={d.date}
                fill={
                  d.isToday
                    ? palette.barToday
                    : d.isOff
                      ? palette.barOff
                      : palette.bar
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
