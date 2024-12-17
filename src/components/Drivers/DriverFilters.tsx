import React from 'react';
import { Users, UserCheck, History, Archive } from 'lucide-react';

interface DriverFiltersProps {
  selectedSegments: string[];
  setSelectedSegments: (segments: string[]) => void;
}

const segments = [
  { id: 'new', label: 'Nouveaux', description: 'Jamais fait de courses', icon: Users },
  { id: 'active', label: 'Actifs', description: 'Courses récentes', icon: UserCheck },
  { id: 'rotation', label: 'Roulement', description: 'Inactifs 14-30 jours', icon: History },
  { id: 'archived', label: 'Archivés', description: '+30 jours d\'inactivité', icon: Archive },
];

const additionalFilters = [
  { id: 'incomplete', label: 'Inscription incomplète' },
  { id: 'inactive_14', label: 'Inactifs 14 jours' },
  { id: 'inactive_14_30', label: 'Inactifs 14-30 jours' },
  { id: 'inactive_30_plus', label: 'Inactifs +30 jours' },
];

export default function DriverFilters({ selectedSegments, setSelectedSegments }: DriverFiltersProps) {
  const toggleSegment = (segmentId: string) => {
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
    } else {
      setSelectedSegments([...selectedSegments, segmentId]);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-text-primary mb-4">Segments principaux</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <button
                  key={segment.id}
                  onClick={() => toggleSegment(segment.id)}
                  className={`p-4 glass-card hover:border-accent/50 transition-all ${
                    selectedSegments.includes(segment.id)
                      ? 'border-accent bg-accent/10'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="w-5 h-5 text-accent" />
                    <div className="font-medium text-text-primary">{segment.label}</div>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {segment.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-text-primary mb-4">Filtres additionnels</h4>
          <div className="flex flex-wrap gap-3">
            {additionalFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleSegment(filter.id)}
                className={`glass-button ${
                  selectedSegments.includes(filter.id) ? 'active' : ''
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}