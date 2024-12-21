// SAUVEGARDE VERSION 1.0
// Date: 2024-12-20
// Description: Version optimisée du composant DriverInfo avec un design équilibré

import React, { useState } from 'react';
import { ApiDriver } from '../../services/driverServiceApi';
import { Phone, Calendar, User } from 'lucide-react';

interface DriverInfoProps {
  driver: ApiDriver;
}

export default function DriverInfo({ driver }: DriverInfoProps) {
  const [newPhone, setNewPhone] = useState('');
  const [isAddingPhone, setIsAddingPhone] = useState(false);

  const handleAddPhone = () => {
    if (newPhone && !driver.phones.includes(newPhone)) {
      driver.phones.push(newPhone);
      setNewPhone('');
      setIsAddingPhone(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-accent/10">
          <User className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-base font-semibold text-text-primary">
          Informations chauffeur
        </h3>
      </div>

      {/* Informations principales */}
      <div className="space-y-3">
        {/* Identité */}
        <div className="glass-card p-3 rounded-lg bg-white/5">
          <h2 className="text-lg font-bold text-text-primary">
            {driver.first_name} {driver.last_name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 text-sm text-accent bg-accent/10 rounded-full">
              Active
            </span>
            <span className="text-sm text-text-secondary">
              ID: {driver.driver_origin_id}
            </span>
          </div>
        </div>

        {/* Téléphones */}
        <div className="glass-card p-3 rounded-lg bg-white/5">
          {driver.phones.map((phone, index) => (
            <div key={index} className="flex items-center gap-3 py-1.5">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-base text-text-primary">{phone}</span>
            </div>
          ))}
          {!isAddingPhone ? (
            <button 
              onClick={() => setIsAddingPhone(true)}
              className="text-sm text-accent hover:text-accent/80 mt-2 flex items-center gap-1"
            >
              <span className="text-lg">+</span> Ajouter un numéro
            </button>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Nouveau numéro"
                className="text-sm px-3 py-1.5 rounded flex-1"
              />
              <button
                onClick={handleAddPhone}
                className="text-sm px-3 py-1.5 bg-accent/10"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setIsAddingPhone(false);
                  setNewPhone('');
                }}
                className="text-sm px-3 py-1.5 text-text-secondary"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Dernière course */}
        <div className="glass-card p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm text-text-secondary">Dernière course</p>
              <p className="text-base text-text-primary">
                {driver.last_ride ? new Date(driver.last_ride.date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="glass-card p-3 rounded-lg bg-white/5">
          <p className="text-sm text-text-secondary">Performance hebdomadaire</p>
          <div className="text-xl font-bold text-text-primary flex items-baseline gap-2 mt-1">
            0
            <span className="text-sm font-normal text-accent">0%</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[1, 2, 3, 4].map((week) => (
              <div key={week} className="text-center p-2 bg-white/5 rounded">
                <p className="text-sm text-text-secondary">S{week}</p>
                <p className="text-base font-semibold text-text-primary">0</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
