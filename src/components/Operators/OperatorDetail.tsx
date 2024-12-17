import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import { Operator } from '../../types/operators';

interface OperatorDetailProps {
  operator: Operator;
  onClose: () => void;
}

type Period = '7d' | '14d' | '1m' | '3m' | 'custom';
type Tab = 'performance' | 'categories' | 'history';

const categoryData = [
  { name: 'Nouveaux', value: 25, color: '#FF6B6B' },
  { name: 'Actifs', value: 35, color: '#4ECB71' },
  { name: 'Roulement', value: 25, color: '#FFB946' },
  { name: 'Archivés', value: 15, color: '#845EF7' }
];

export default function OperatorDetail({ operator, onClose }: OperatorDetailProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('performance');
  const [period, setPeriod] = useState<Period>('7d');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [distribution, setDistribution] = useState(categoryData);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleDistributionChange = (index: number, value: number) => {
    const newDistribution = [...distribution];
    newDistribution[index] = { ...newDistribution[index], value };
    setDistribution(newDistribution);
  };

  const totalPercentage = distribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onClose} className="glass-button">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-text-primary">Détails de l'Opérateur</h3>
            </div>

            <div className="flex space-x-2">
              {['performance', 'categories', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab as Tab)}
                  className={`glass-button px-6 py-2.5 text-white font-medium transition-all duration-200 ${
                    currentTab === tab 
                      ? 'bg-gradient-to-r from-accent via-accent-light to-accent border-accent/50 shadow-lg shadow-accent/20' 
                      : 'hover:bg-white/10 bg-white/5'
                  }`}
                >
                  {tab === 'performance' && 'Performance'}
                  {tab === 'categories' && 'Répartition des catégories'}
                  {tab === 'history' && 'Historique d\'appels'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-text-primary">Performance</h4>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePeriodChange('7d')}
                      className={`glass-button px-3 py-1.5 text-sm text-white ${period === '7d' ? 'active' : ''}`}
                    >
                      7J
                    </button>
                    <button
                      onClick={() => handlePeriodChange('14d')}
                      className={`glass-button px-3 py-1.5 text-sm text-white ${period === '14d' ? 'active' : ''}`}
                    >
                      14J
                    </button>
                    <button
                      onClick={() => handlePeriodChange('1m')}
                      className={`glass-button px-3 py-1.5 text-sm text-white ${period === '1m' ? 'active' : ''}`}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => handlePeriodChange('3m')}
                      className={`glass-button px-3 py-1.5 text-sm text-white ${period === '3m' ? 'active' : ''}`}
                    >
                      3M
                    </button>
                    <button
                      onClick={() => handlePeriodChange('custom')}
                      className={`glass-button px-3 py-1.5 text-sm text-white ${period === 'custom' ? 'active' : ''}`}
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
                        className="glass-input px-4 py-2 pl-10 text-white text-sm"
                        dateFormat="dd/MM/yyyy"
                      />
                      <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={operator.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94A3B8"
                      tick={{ fill: '#E4E8F1' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#94A3B8"
                      tick={{ fill: '#E4E8F1' }}
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
                      yAxisId="left"
                      type="monotone"
                      dataKey="calls"
                      name="Appels"
                      stroke="#FF6B6B"
                      strokeWidth={2}
                      dot={{ stroke: '#FF6B6B', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#FF6B6B', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgCalls"
                      name="Moyenne équipe"
                      stroke="#FF6B6B"
                      strokeDasharray="5 5"
                      dot={false}
                      strokeWidth={2}
                    />

                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="CA Généré"
                      stroke="#4ECB71"
                      strokeWidth={2}
                      dot={{ stroke: '#4ECB71', strokeWidth: 2 }}
                      activeDot={{ r: 6, stroke: '#4ECB71', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgRevenue"
                      name="Moyenne équipe"
                      stroke="#4ECB71"
                      strokeDasharray="5 5"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {currentTab === 'categories' && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-lg font-medium text-text-primary">
                  Répartition des catégories
                </h4>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="glass-button active text-white"
                >
                  {isEditing ? 'Enregistrer' : 'Modifier'}
                </button>
              </div>

              <div className="space-y-6">
                {distribution.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text-primary">
                        {category.name}
                      </span>
                      <div className="flex items-center space-x-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={category.value}
                            onChange={(e) => handleDistributionChange(index, Number(e.target.value))}
                            className="glass-input px-3 py-1 w-20 text-right text-sm"
                          />
                        ) : (
                          <span className="text-sm text-text-primary">{category.value}%</span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${category.value}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-primary">Total</span>
                    <span className={`${
                      totalPercentage !== 100 ? 'text-accent-warning' : 'text-text-primary'
                    }`}>
                      {totalPercentage}%
                    </span>
                  </div>
                  {totalPercentage !== 100 && isEditing && (
                    <p className="text-xs text-accent-warning mt-1">
                      Le total doit être égal à 100%
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'history' && (
            <div className="space-y-4">
              {operator.callLogs.map((log) => (
                <div key={log.id} className="glass-card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-text-primary font-medium">{log.date}</span>
                        <span className="text-text-secondary">Durée: {log.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.status === 'Complété' 
                            ? 'bg-accent-success/20 text-accent-success' 
                            : 'bg-accent-warning/20 text-accent-warning'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm">{log.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}