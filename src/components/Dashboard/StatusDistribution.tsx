import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DriverStatus, getCarDrivers, getDriverStatusStats } from '../../services/driverService';
import { useAuthStore } from '../../stores/authStore';

const statusData = [
  { name: 'A arrêté de faire yango', value: 150, color: '#EF4444' },
  { name: 'A fait un accident', value: 50, color: '#F59E0B' },
  { name: 'Appel sans réponse', value: 200, color: '#6366F1' },
  { name: 'Compte se connecter', value: 180, color: '#22C55E' },
  { name: 'Est disponible', value: 220, color: '#38BDF8' },
  { name: 'En déplacement', value: 120, color: '#8B5CF6' },
  { name: 'Crédit autre partenaire', value: 80, color: '#EC4899' },
  { name: 'Injoignable', value: 90, color: '#64748B' },
  { name: 'Malade', value: 40, color: '#94A3B8' },
  { name: 'Problème connexion', value: 60, color: '#FB923C' },
  { name: 'Pas de véhicule', value: 30, color: '#A855F7' },
  { name: 'Véhicule au garage', value: 30, color: '#14B8A6' }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function StatusDistribution() {
  const totalDrivers = statusData.reduce((acc, curr) => acc + curr.value, 0);
  const [stats, setStats] = useState<DriverStatus[]>([]); // Liste complète
  const [total, setTotal] = useState<number>(0); // Liste complète
  const [loading, setLoading] = useState<boolean>(true); // Liste complète
  const { workspace } = useAuthStore();
  
  const fetchDriversWithCar = async () => {
    const response=await getDriverStatusStats(workspace?.id!);
    if(response.success){
      setStats(response.data!);
      setTotal(response.data!.reduce((acc, curr) => acc + curr.value, 0))
     console.log('response',response.data)
    }else{
     console.log(response.error)
    }
    setLoading(false);
   };
 
   useEffect(() => {
    fetchDriversWithCar()
  }, []);



  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Distribution des Statuts</h3>
          <div className="glass-card px-3 py-1.5 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-primary">{total} chauffeurs</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-1 min-h-0 p-4">
        <div className="w-[60%] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="90%"
                innerRadius="50%"
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141B2D',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem'
                }}
                itemStyle={{ color: '#E4E8F1', fontSize: '13px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[40%] flex items-center justify-center px-2">
          <div className="w-full space-y-2.5">
            {statusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center min-w-0 space-x-2">
                  <div 
                    className="flex-shrink-0 w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm truncate text-text-primary">
                    {status.name}
                  </span>
                </div>
                <span className="flex-shrink-0 ml-2 text-sm text-text-secondary">
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}