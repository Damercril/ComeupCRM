import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Phone, TrendingUp, UserCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const performanceData = [
  { date: '23/11/24', calls: 45, revenue: 180000 },
  { date: '24/11/24', calls: 48, revenue: 195000 },
  { date: '25/11/24', calls: 52, revenue: 210000 },
  { date: '26/11/24', calls: 55, revenue: 230000 },
  { date: '27/11/24', calls: 58, revenue: 240000 },
  { date: '28/11/24', calls: 61, revenue: 260000 },
  { date: '29/11/24', calls: 65, revenue: 280000 },
  { date: '30/11/24', calls: 70, revenue: 300000 },
];

const driverStatusData = [
  { name: 'Réactivés', value: 25, color: '#22C55E' },
  { name: 'En attente', value: 15, color: '#F59E0B' },
  { name: 'Non joignables', value: 10, color: '#EF4444' },
];

type Period = '7d' | '14d' | '1m' | '3m' | 'custom';

export default function OperatorStatsView() {
  const [period, setPeriod] = useState<Period>('7d');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const totalCalls = performanceData.reduce((sum, day) => sum + day.calls, 0);
  const totalRevenue = performanceData.reduce((sum, day) => sum + day.revenue, 0);
  const totalReactivated = driverStatusData[0].value;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 glass-button">
              <Phone className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-secondary">Total Appels</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{totalCalls}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 glass-button">
              <TrendingUp className="w-6 h-6 text-accent-success" />
            </div>
            <div>
              <p className="text-text-secondary">CA Généré</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {(totalRevenue / 1000).toFixed(0)}k FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 glass-button">
              <UserCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-secondary">Chauffeurs Réactivés</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{totalReactivated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-text-primary">Performance</h3>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePeriodChange('7d')}
                  className={`glass-button text-white px-3 py-1.5 text-sm ${period === '7d' ? 'active' : ''}`}
                >
                  7J
                </button>
                <button
                  onClick={() => handlePeriodChange('14d')}
                  className={`glass-button text-white px-3 py-1.5 text-sm ${period === '14d' ? 'active' : ''}`}
                >
                  14J
                </button>
                <button
                  onClick={() => handlePeriodChange('1m')}
                  className={`glass-button text-white px-3 py-1.5 text-sm ${period === '1m' ? 'active' : ''}`}
                >
                  1M
                </button>
                <button
                  onClick={() => handlePeriodChange('3m')}
                  className={`glass-button text-white px-3 py-1.5 text-sm ${period === '3m' ? 'active' : ''}`}
                >
                  3M
                </button>
                <button
                  onClick={() => handlePeriodChange('custom')}
                  className={`glass-button text-white px-3 py-1.5 text-sm ${period === 'custom' ? 'active' : ''}`}
                >
                  Personnalisé
                </button>
              </div>

              {(period === 'custom' || showDatePicker) && (
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                      const [start, end] = dates as [Date, Date];
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    className="glass-input px-4 py-2 pl-10 text-sm"
                    dateFormat="dd/MM/yyyy"
                  />
                  <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#E4E8F1"
                  tick={{ fill: '#E4E8F1' }}
                />
                <YAxis 
                  yAxisId="calls"
                  stroke="#E4E8F1"
                  tick={{ fill: '#E4E8F1' }}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  stroke="#E4E8F1"
                  tick={{ fill: '#E4E8F1' }}
                  tickFormatter={(value) => `${(value/1000)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141B2D',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem'
                  }}
                  labelStyle={{ color: '#E4E8F1' }}
                  itemStyle={{ color: '#E4E8F1' }}
                />
                <Legend />
                <Line
                  yAxisId="calls"
                  type="monotone"
                  dataKey="calls"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  name="Appels"
                  dot={{ stroke: '#38BDF8', strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: '#38BDF8', strokeWidth: 2 }}
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22C55E"
                  strokeWidth={2}
                  name="CA (FCFA)"
                  dot={{ stroke: '#22C55E', strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Driver Status Distribution */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-text-primary">
            Distribution des Statuts Chauffeurs
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={driverStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {driverStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141B2D',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem'
                    }}
                    itemStyle={{ color: '#E4E8F1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center">
              <div className="w-full space-y-4">
                {driverStatusData.map((status, index) => (
                  <div key={index} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-text-primary">{status.name}</span>
                      </div>
                      <span className="text-text-primary font-medium">{status.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}