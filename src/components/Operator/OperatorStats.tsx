import React from 'react';
import { Phone, TrendingUp, Clock } from 'lucide-react';
import { ApiDriver } from '../../services/driverServiceApi';

interface StatsProps {
  driver: ApiDriver;
  todayCalls?: number;
  avgCallDuration?: string;
}

export default function OperatorStats({
  driver, 
  todayCalls = 0,
  avgCallDuration = '0:00'
}: StatsProps) {
  const stats = {
    todayCalls,
    totalRevenue: (driver.revenuTotal ?? 0) * 0.03,
    avgCallDuration
  };

  const formatRevenue = (amount: number) => {
    const roundedAmount = Math.round(amount);
    return roundedAmount.toLocaleString('fr-FR');
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent/10">
          <Phone className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Appels aujourd'hui</p>
          <p className="text-lg font-semibold text-text-primary">{stats.todayCalls}</p>
        </div>
      </div>

      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent-success/10">
          <TrendingUp className="w-5 h-5 text-accent-success" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">CA Généré (3%)</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatRevenue(stats.totalRevenue)} FCFA
          </p>
        </div>
      </div>

      <div className="flex items-center p-4 space-x-3 glass-card">
        <div className="p-2 rounded-lg bg-accent-warning/10">
          <Clock className="w-5 h-5 text-accent-warning" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Temps moyen par fiche</p>
          <p className="text-lg font-semibold text-text-primary">{stats.avgCallDuration}</p>
        </div>
      </div>
    </div>
  );
}