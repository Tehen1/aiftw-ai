"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  {
    name: 'Customer Support',
    messages: 2400,
    responseRate: 98,
  },
  {
    name: 'Sales Assistant',
    messages: 1800,
    responseRate: 95,
  },
  {
    name: 'Technical Support',
    messages: 1600,
    responseRate: 92,
  },
  {
    name: 'Product Guide',
    messages: 1200,
    responseRate: 94,
  },
  {
    name: 'FAQ Bot',
    messages: 900,
    responseRate: 96,
  },
];

export function ChatbotPerformance() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--secondary))"
          />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="messages"
            name="Messages"
            fill="hsl(var(--primary))"
          />
          <Bar
            yAxisId="right"
            dataKey="responseRate"
            name="Response Rate (%)"
            fill="hsl(var(--secondary))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
