import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

const CALL_STATUSES = [
  'A arrêté de faire yango',
  'A fait un accident',
  'Appel sans réponse',
  'Autre',
  'Compte se connecter dans les jours à venir',
  'Est disponible',
  'En déplacement pour le moment',
  'Fini son crédit chez un autre partenaire',
  'Injoignable',
  'Malade',
  "N'arrive pas à se connecter",
  'Pas de véhicule',
  'Véhicule au garage'
];

interface CallReportProps {
  callNote: string;
  setCallNote: (note: string) => void;
  callStatus: string;
  setCallStatus: (status: string) => void;
  callbackDate: Date | null;
  setCallbackDate: (date: Date | null) => void;
}

export default function CallReport({
  callNote,
  setCallNote,
  callStatus,
  setCallStatus,
  callbackDate,
  setCallbackDate
}: CallReportProps) {
  return (
    <div className="glass-card">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-text-primary">
          Rapport d'appel
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Statut de l'appel
            </label>
            <select
              value={callStatus}
              onChange={(e) => setCallStatus(e.target.value)}
              className="glass-input px-4 py-2 w-full text-text-primary [&:not(:placeholder-shown)]:text-black dark:text-text-primary"
            >
              <option value="" className="bg-dark-lighter text-text-primary">Sélectionner un statut</option>
              {CALL_STATUSES.map((status) => (
                <option 
                  key={status} 
                  value={status}
                  className="bg-dark-lighter text-text-primary"
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date de rappel
            </label>
            <div className="relative">
              <DatePicker
                selected={callbackDate}
                onChange={setCallbackDate}
                locale={fr}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                className="glass-input px-4 py-2 w-full [&:not(:placeholder-shown)]:text-black dark:text-text-primary"
                placeholderText="Sélectionner une date"
              />
            </div>
            {callbackDate && callbackDate > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
              <div className="mt-2 flex items-start space-x-2 text-accent-warning">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  La fiche pourra être réaffectée avant la date de rappel si nécessaire.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Notes de l'appel
          </label>
          <textarea
            value={callNote}
            onChange={(e) => setCallNote(e.target.value)}
            className="glass-input px-4 py-2 w-full h-32 resize-none [&:not(:placeholder-shown)]:text-black dark:text-text-primary"
            placeholder="Entrez vos notes ici..."
          />
        </div>
      </div>
    </div>
  );
}