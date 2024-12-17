import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '01/03', coreDrivers: 120, potentialDrivers: 70, revenue: 1800000 },
  { date: '02/03', coreDrivers: 132, potentialDrivers: 75, revenue: 1950000 },
  { date: '03/03', coreDrivers: 145, potentialDrivers: 80, revenue: 2100000 },
  { date: '04/03', coreDrivers: 150, potentialDrivers: 85, revenue: 2300000 },
  { date: '05/03', coreDrivers: 156, potentialDrivers: 89, revenue: 2400000 },
];

export default function PerformanceChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Performance Trends</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="coreDrivers" 
              stroke="#4F46E5" 
              name="Core Drivers"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="potentialDrivers" 
              stroke="#10B981" 
              name="Potential Drivers"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#F59E0B" 
              name="Revenue (FCFA)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}