import React, { useState,useEffect } from 'react';
import RevenueAnalysis from '../Operators/RevenueAnalysis';
import StatusDistribution from '../Dashboard/StatusDistribution';
import DriverSegmentsTable from '../Dashboard/DriverSegmentsTable';
import { Users, Phone, TrendingUp, Target, UserCheck, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {fetchOrdersAndCalculateStats,DriverStats } from '../../services/driverService';
import { useAuthStore } from '../../stores/authStore';
import { getTotalRevenue } from '../../services/driverServiceApi';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
}

type Period = 'today' | '7d' | '14d' | '1m' | '3m' | 'custom';

const StatCard = ({ title, value, icon, trend, trendLabel,isLoading }: StatCardProps) => (
  <div className="p-4 glass-card sm:p-6">
    <div className="flex items-center space-x-4">
      <div className="p-2 sm:p-3 glass-button">
        {icon}
      </div>
      <div>
        <p className="text-sm sm:text-base text-text-secondary">{title}</p>
        <p className="mt-1 text-lg font-bold sm:text-2xl text-text-primary">{isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-transparent animate-spin"></div>
          ) : (
            value
          )}</p>
        {trend !== undefined && (
          <p className={`text-xs sm:text-sm mt-1 ${trend >= 0 ? 'text-accent-success' : 'text-accent-warning'}`}>
            {trend >= 0 ? '+' : ''}{trend}% {trendLabel}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default function DashboardView() {
  const [period, setPeriod] = useState<Period>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { workspace } = useAuthStore();

  

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return "aujourd'hui";
      case '7d':
        return '7 derniers jours';
      case '14d':
        return '14 derniers jours';
      case '1m':
        return 'dernier mois';
      case '3m':
        return 'dernier trimestre';
      case 'custom':
        return 'période personnalisée';
      default:
        return '';
    }
  };
  const setToMidnight = (date: Date): Date => {
    const adjustedDate = new Date(date); // Cloner la date pour éviter les effets de bord
    adjustedDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure, les minutes, les secondes et les millisecondes
    return adjustedDate;
  };
  function formatDate(date:Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
  
  const handleFetchStats = async () => {
    if (period === 'custom' && (!startDate || !endDate)) {
      setError('Veuillez sélectionner une période valide.');
      return;
    }
  
    setError(null);
    setLoading(true);
  
    let formattedStartDate: string;
    let formattedEndDate: string;
    const today = new Date(); // Date actuelle immuable
  
    switch (period) {
      case 'today': {
        const startOfDay = setToMidnight(today); // Cloné et ramené à minuit
        formattedStartDate = formatDate(startOfDay);
        formattedEndDate = formatDate(today); // Date actuelle avec l'heure courante
        break;
      }
      case '7d': {
        const startDate = setToMidnight(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)); // 7 jours avant, minuit
        formattedStartDate = formatDate(startDate);;
        formattedEndDate = formatDate(today);
        break;
      }
      case '14d': {
        const startDate = setToMidnight(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)); // 14 jours avant, minuit
        formattedStartDate = formatDate(startDate);
        formattedEndDate = formatDate(today);
        break;
      }
      case '1m': {
        const startDate = setToMidnight(new Date(new Date(today).setMonth(today.getMonth() - 1))); // 1 mois avant, minuit
        formattedStartDate = formatDate(startDate);;
        formattedEndDate = formatDate(today);
        break;
      }
      case '3m': {
        const startDate = setToMidnight(new Date(new Date(today).setMonth(today.getMonth() - 3))); // 3 mois avant, minuit
        formattedStartDate = formatDate(startDate);;
        formattedEndDate = formatDate(today);
        break;
      }
      case 'custom': {
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
        break;
      }
      default:
        return;
    }
  
    console.log('data select', formattedStartDate, formattedEndDate);
  
    try {
      const result = await getTotalRevenue(workspace?.id,formattedStartDate, formattedEndDate);
      setStats(result.data);
      console.log('stats', result, period);
    } catch (err: any) {
      setError('Erreur lors de la récupération des statistiques.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Charger les statistiques de la date d'aujourd'hui au démarrage
  useEffect(() => {
    handleFetchStats();
  }, [period,startDate,endDate,workspace]); // Se déclenche quand la période change

  // Gérer le changement de période
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold sm:text-2xl text-text-primary">Tableau de bord</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => handlePeriodChange('today')}
              className={`glass-button px-3 py-1.5 text-sm ${period === 'today' ? 'active' : ''}`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => handlePeriodChange('7d')}
              className={`glass-button px-3 py-1.5 text-sm ${period === '7d' ? 'active' : ''}`}
            >
              7J
            </button>
            <button
              onClick={() => handlePeriodChange('14d')}
              className={`glass-button px-3 py-1.5 text-sm ${period === '14d' ? 'active' : ''}`}
            >
              14J
            </button>
            <button
              onClick={() => handlePeriodChange('1m')}
              className={`glass-button px-3 py-1.5 text-sm ${period === '1m' ? 'active' : ''}`}
            >
              1M
            </button>
            <button
              onClick={() => handlePeriodChange('3m')}
              className={`glass-button px-3 py-1.5 text-sm ${period === '3m' ? 'active' : ''}`}
            >
              3M
            </button>
            <button
              onClick={() => handlePeriodChange('custom')}
              className={`glass-button px-3 py-1.5 text-sm ${period === 'custom' ? 'active' : ''}`}
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
                  handleFetchStats();
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                className="glass-input px-4 py-2 pl-10 [&:not(:placeholder-shown)]:text-black dark:text-text-primary text-sm"
                dateFormat="dd/MM/yyyy"
              />
              <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <StatCard
        isLoading={loading}
          title={`Appels ${getPeriodLabel()}`}
          value={`1,234`}
          // value={`${stats?.totalOrders}`}
          icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
          trend={12}
          trendLabel="vs période précédente"
        />
        <StatCard
        isLoading={loading}
          title={`CA Généré ${getPeriodLabel()}`}
          value={`${stats?.totalCA} FCFA`}
          icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent-success" />}
          trend={8}
          trendLabel="vs période précédente"
        />
        <StatCard
        isLoading={loading}
          title={`Noyau dur ${getPeriodLabel()}`}
          value={`${stats?.total_noyaux_durs}`}
          icon={<UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
          trend={-3}
          trendLabel="vs période précédente"
        />
        <StatCard
        isLoading={loading}
          title={`Électrons ${getPeriodLabel()}`}
          value={`${stats?.total_electrons}`}
          icon={<Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent-warning" />}
          trend={15}
          trendLabel="vs période précédente"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card h-[600px]">
          <RevenueAnalysis />
        </div>
        <div className="glass-card h-[600px]">
          <StatusDistribution />
        </div>
      </div>

      <div className="glass-card h-[600px]">
        <DriverSegmentsTable />
      </div>
    </div>
  );
}