import React, { useState } from 'react';
import { Phone, TrendingUp, Clock, Search } from 'lucide-react';
import { Operator } from '../../types/operators';

interface OperatorsListProps {
  onSelectOperator: (operator: Operator) => void;
}

// Données temporaires (à remplacer par les données de Supabase)
const operators: Operator[] = [
  {
    id: 1,
    name: 'Alice Koné',
    calls: 145,
    revenue: '320,000',
    avgCallTime: '4:30',
    performance: 12,
    performanceData: [
      { date: '2024-03-01', calls: 30, revenue: 65000, avgCallTime: 240 },
      { date: '2024-03-02', calls: 28, revenue: 62000, avgCallTime: 235 },
      { date: '2024-03-03', calls: 32, revenue: 70000, avgCallTime: 245 },
    ],
    callLogs: [
      { id: 1, date: '2024-03-03 14:30', duration: '5:20', status: 'Complété', notes: 'Chauffeur intéressé' },
      { id: 2, date: '2024-03-03 15:45', duration: '3:15', status: 'Non répondu', notes: 'Rappeler demain' },
    ]
  },
  {
    id: 2,
    name: 'David Touré',
    calls: 132,
    revenue: '280,000',
    avgCallTime: '3:45',
    performance: 8,
    performanceData: [
      { date: '2024-03-01', calls: 25, revenue: 55000, avgCallTime: 220 },
      { date: '2024-03-02', calls: 28, revenue: 61000, avgCallTime: 230 },
      { date: '2024-03-03', calls: 30, revenue: 65000, avgCallTime: 225 },
    ],
    callLogs: [
      { id: 3, date: '2024-03-03 16:00', duration: '4:10', status: 'Complété', notes: 'Formation planifiée' },
      { id: 4, date: '2024-03-03 16:45', duration: '2:30', status: 'Complété', notes: 'Suivi hebdomadaire' },
    ]
  },
  {
    id: 3,
    name: 'Marie Bamba',
    calls: 128,
    revenue: '265,000',
    avgCallTime: '4:15',
    performance: 5,
    performanceData: [
      { date: '2024-03-01', calls: 28, revenue: 58000, avgCallTime: 250 },
      { date: '2024-03-02', calls: 25, revenue: 52000, avgCallTime: 245 },
      { date: '2024-03-03', calls: 27, revenue: 56000, avgCallTime: 255 },
    ],
    callLogs: [
      { id: 5, date: '2024-03-03 10:15', duration: '3:45', status: 'Complété', notes: 'Mise à jour documents' },
      { id: 6, date: '2024-03-03 11:30', duration: '4:20', status: 'Complété', notes: 'Questions techniques' },
    ]
  }
];

export default function OperatorsList({ onSelectOperator }: OperatorsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Liste des Opérateurs ({filteredOperators.length})
          </h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Rechercher un opérateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {filteredOperators.map((operator) => (
          <button
            key={operator.id}
            onClick={() => onSelectOperator(operator)}
            className="w-full p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-text-primary">{operator.name}</h4>
                <div className="flex items-center space-x-6 mt-2 text-text-secondary">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{operator.calls} appels</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{operator.revenue} FCFA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{operator.avgCallTime}</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm ${
                operator.performance >= 10 
                  ? 'text-accent-success' 
                  : operator.performance >= 5 
                    ? 'text-accent' 
                    : 'text-accent-warning'
              }`}>
                {operator.performance >= 0 ? '+' : ''}{operator.performance}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}