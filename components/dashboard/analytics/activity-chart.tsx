"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: '2024-01-01', messages: 1200 },
  { date: '2024-01-02', messages: 1400 },
  { date: '2024-01-03', messages: 1100 },
  { date: '2024-01-04', messages: 1600 },
  { date: '2024-01-05', messages: 1800 },
  { date: '2024-01-06', messages: 2000 },
  { date: '2024-01-07', messages: 1900 },
];

export function ActivityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [value.toLocaleString(), 'Messages']}
          />
          <Area
            type="monotone"
            dataKey="messages"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
