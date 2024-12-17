import React, { useState } from 'react';
import { Clock, Phone, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface CallLog {
  id: string;
  date: string;
  status: string;
  duration: string;
  note: string;
  callbackDate?: string;
}

interface CallHistoryProps {
  callHistory: CallLog[];
}

export default function CallHistory({ callHistory }: CallHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedHistory = isExpanded ? callHistory : callHistory.slice(0, 3);

  const CallNote = ({ call }: { call: CallLog }) => (
    <div className="p-4 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Clock className="w-4 h-4" />
            <span>{new Date(call.date).toLocaleString('fr-FR')}</span>
          </div>
          <div className="flex items-center space-x-2 text-text-secondary">
            <Phone className="w-4 h-4" />
            <span>{call.duration}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          call.status === 'Est disponible' 
            ? 'bg-accent-success/20 text-accent-success'
            : call.status === 'Appel sans réponse'
            ? 'bg-accent-warning/20 text-accent-warning'
            : 'bg-accent/20 text-accent'
        }`}>
          {call.status}
        </span>
      </div>

      <p className="text-white mb-2">{call.note}</p>

      {call.callbackDate && (
        <div className="flex items-center space-x-2 text-text-secondary text-sm">
          <Calendar className="w-4 h-4" />
          <span>Rappel prévu: {new Date(call.callbackDate).toLocaleDateString('fr-FR')}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">
          Historique des appels
        </h3>
      </div>

      {callHistory.length === 0 ? (
        <div className="p-4 text-text-secondary text-center">
          Aucun historique d'appel disponible
        </div>
      ) : (
        <>
          <div className="divide-y divide-white/10">
            {displayedHistory.map((call) => (
              <CallNote key={call.id} call={call} />
            ))}
          </div>

          {callHistory.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-3 flex items-center justify-center space-x-2 text-text-secondary hover:text-text-primary transition-colors border-t border-white/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Voir moins</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Voir plus ({callHistory.length - 3} appels)</span>
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}