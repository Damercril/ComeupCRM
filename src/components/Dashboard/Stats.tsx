import React from 'react';
import { 
  Users, Phone, TrendingUp, Target, 
  DollarSign, UserCheck, Activity, List 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <div className="p-6 bg-white shadow-lg rounded-xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend}% vs last period
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function Stats() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Calls Today"
        value="1,23"
        icon={<Phone className="w-6 h-6 text-indigo-600" />}
        trend={12}
      />
      <StatCard
        title="Revenue Generated"
        value="₣2.4M"
        icon={<DollarSign className="w-6 h-6 text-indigo-600" />}
        trend={8}
      />
      <StatCard
        title="Core Drivers"
        value="156"
        icon={<UserCheck className="w-6 h-6 text-indigo-600" />}
        trend={-3}
      />
      <StatCard
        title="Potential Drivers"
        value="89"
        icon={<Target className="w-6 h-6 text-indigo-600" />}
        trend={15}
      />
    </div>
  );
}