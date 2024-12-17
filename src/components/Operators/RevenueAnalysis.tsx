import React, { useState,useEffect } from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { DriverDayStats, fetchOrdersAndCalculateStatsForEachDay } from '../../services/driverService';
import { useAuthStore } from '../../stores/authStore';
import { getDayRevenue } from '../../services/driverServiceApi';

const data = [
  { date: '23/11/24', revenue: 1800000, calls: 450, avgRevenue: 2200000, avgCalls: 520 },
  { date: '24/11/24', revenue: 1950000, calls: 480, avgRevenue: 2200000, avgCalls: 520 },
  { date: '25/11/24', revenue: 2100000, calls: 520, avgRevenue: 2200000, avgCalls: 520 },
  { date: '26/11/24', revenue: 2300000, calls: 550, avgRevenue: 2200000, avgCalls: 520 },
  { date: '27/11/24', revenue: 2400000, calls: 580, avgRevenue: 2200000, avgCalls: 520 },
  { date: '28/11/24', revenue: 2600000, calls: 610, avgRevenue: 2200000, avgCalls: 520 },
  { date: '29/11/24', revenue: 2800000, calls: 650, avgRevenue: 2200000, avgCalls: 520 },
  { date: '30/11/24', revenue: 3000000, calls: 700, avgRevenue: 2200000, avgCalls: 520 },
];

interface MetricToggleProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}

const MetricToggle = ({ label, active, onClick, color }: MetricToggleProps) => (
  <button
    onClick={onClick}
    className={`glass-button flex items-center space-x-2 ${active ? 'active' : ''}`}
    style={{ borderColor: active ? color : undefined }}
  >
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span>{label}</span>
  </button>
);

export default function RevenueAnalysis() {
  const setToMidnight = (date: Date): Date => {
    const adjustedDate = new Date(date); // Cloner la date pour éviter les effets de bord
    adjustedDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure, les minutes, les secondes et les millisecondes
    return adjustedDate;
  };
  function formatDate(date:Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
  const { workspace } = useAuthStore();

  
  const today=new  Date();
  const [startDate, setStartDate] = useState<Date | null>(new Date(setToMidnight(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000))));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [metrics, setMetrics] = useState({
    revenue: true,
    calls: true
  });
  const [stats, setStats] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


 
  const handleFetchStats = async () => {
    
  
    setError(null);
    setLoading(true);
  
    let formattedStartDate: string;
    let formattedEndDate: string;
    
        if (startDate && endDate) {
          formattedStartDate = setToMidnight(startDate).toISOString(); // Start à minuit
          formattedEndDate = endDate.toISOString(); // End avec l'heure courante
          formattedStartDate = formatDate(setToMidnight(startDate));;
          formattedEndDate = formatDate(endDate);
        } else {
          setError('Veuillez sélectionner une période personnalisée valide.');
          setLoading(false);
          return;
        }
      
      
  
    
    try {
      const result = await getDayRevenue(workspace?.id,formattedStartDate, formattedEndDate);
      console.log('bienvenu',result)
      setStats(result.data);
    } catch (err: any) {
      setError('Erreur lors de la récupération des statistiques.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleMetric = (metric: keyof typeof metrics) => {
    setMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  useEffect(() => {
    handleFetchStats();
  }, [startDate,endDate]); // Se déclenche quand la période change


  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold text-text-primary">Analyse des Revenus</h3>
          
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
              className="glass-input px-4 py-2 pl-10 [&:not(:placeholder-shown)]:text-black dark:text-text-primary"
              dateFormat="dd/MM/yyyy"
            />
            <Calendar className="absolute w-4 h-4 text-text-secondary left-3 top-3" />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <MetricToggle
            label="Revenus"
            active={metrics.revenue}
            onClick={() => toggleMetric('revenue')}
            color="#38BDF8"
          />
          <MetricToggle
            label="Appels"
            active={metrics.calls}
            onClick={() => toggleMetric('calls')}
            color="#22C55E"
          />
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="totalOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8' }}
              />
              <YAxis 
                yAxisId="total"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8' }}
                tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
              />
              <YAxis 
                yAxisId="totalOrders"
                orientation="right"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8' }}
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

              {metrics.revenue && (
                <>
                  <Line
                    yAxisId="total"
                    type="monotone"
                    dataKey="total"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={{ stroke: '#38BDF8', strokeWidth: 2 }}
                    activeDot={{ r: 12, stroke: '#38BDF8', strokeWidth: 2 }}
                    name="Revenus (FCFA)"
                  />
                  <Line
                    yAxisId="total"
                    type="monotone"
                    dataKey="ca_average"
                    name="Moyenne revenus (3M)"
                    stroke="#38BDF8"
                    strokeDasharray="7 7"
                    dot={false}
                    strokeWidth={2}
                  />
                </>
              )}

              {metrics.calls && (
                <>
                  <Line
                    yAxisId="totalOrders"
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ stroke: '#22C55E', strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
                    name="Appels"
                  />
                  <Line
                    yAxisId="totalOrders"
                    type="monotone"
                    dataKey="averageOrders"
                    name="Moyenne appels (3M)"
                    stroke="#22C55E"
                    strokeDasharray="5 5"
                    dot={false}
                    strokeWidth={2}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}