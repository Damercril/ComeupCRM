import React, { useState } from 'react';
import { Clock, Phone, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface CallLog {
  id: string;
  date: string;
  status: string;
  duration: string;
  note: string;
  callback_date?: string;
}

interface CallHistoryProps {
  call_history: CallLog[];
  is_loading: boolean;
}

const CallHistory: React.FC<CallHistoryProps> = ({ call_history, is_loading = false }) => {
  const [is_expanded, setIsExpanded] = useState(false);
  const displayed_history = is_expanded ? call_history : call_history.slice(0, 3);

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

      {call.callback_date && (
        <div className="flex items-center space-x-2 text-text-secondary text-sm">
          <Calendar className="w-4 h-4" />
          <span>Rappel prévu: {new Date(call.callback_date).toLocaleDateString('fr-FR')}</span>
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

      {is_loading ? (
        <div className="p-4 text-text-secondary text-center">
          Chargement...
        </div>
      ) : call_history.length === 0 ? (
        <div className="p-4 text-text-secondary text-center">
          Aucun historique d'appel disponible
        </div>
      ) : (
        <>
          <div className="divide-y divide-white/10">
            {displayed_history.map((call) => (
              <CallNote key={call.id} call={call} />
            ))}
          </div>

          {call_history.length > 3 && (
            <button
              onClick={() => setIsExpanded(!is_expanded)}
              className="w-full p-3 flex items-center justify-center space-x-2 text-text-secondary hover:text-text-primary transition-colors border-t border-white/10"
            >
              {is_expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Voir moins</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Voir plus ({call_history.length - 3} appels)</span>
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CallHistory;