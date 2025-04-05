"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Apr",
    filed: 1,
    pending: 0,
  },
  {
    name: "May",
    filed: 1,
    pending: 0,
  },
  {
    name: "Jun",
    filed: 1,
    pending: 0,
  },
  {
    name: "Jul",
    filed: 1,
    pending: 0,
  },
  {
    name: "Aug",
    filed: 1,
    pending: 0,
  },
  {
    name: "Sep",
    filed: 1,
    pending: 0,
  },
  {
    name: "Oct",
    filed: 1,
    pending: 0,
  },
  {
    name: "Nov",
    filed: 0,
    pending: 1,
  },
  {
    name: "Dec",
    filed: 0,
    pending: 1,
  },
  {
    name: "Jan",
    filed: 0,
    pending: 0,
  },
  {
    name: "Feb",
    filed: 0,
    pending: 0,
  },
  {
    name: "Mar",
    filed: 0,
    pending: 0,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar
          dataKey="filed"
          fill="#4ade80"
          radius={[4, 4, 0, 0]}
          name="Filed"
        />
        <Bar
          dataKey="pending"
          fill="#f97316"
          radius={[4, 4, 0, 0]}
          name="Pending"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
