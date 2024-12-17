import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../../types/drivers';

interface VehicleChangeModalProps {
  vehicles: Vehicle[];
  currentVehicle: Vehicle;
  onClose: () => void;
  onChangeVehicle: (vehicleId: string, reason: string) => void;
}

export default function VehicleChangeModal({
  vehicles,
  currentVehicle,
  onClose,
  onChangeVehicle
}: VehicleChangeModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicle && reason) {
      onChangeVehicle(selectedVehicle, reason);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent-success/20 text-accent-success';
      case 'inactive': return 'bg-accent-warning/20 text-accent-warning';
      case 'pending': return 'bg-accent/20 text-accent';
      default: return 'bg-accent/20 text-accent';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              Changement de véhicule
            </h3>
            <button
              onClick={onClose}
              className="glass-button p-2 hover:text-accent-warning"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h4 className="text-white font-medium mb-3">Véhicule actuel</h4>
            <div className="glass-card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    {currentVehicle.brand} {currentVehicle.model} ({currentVehicle.year})
                  </p>
                  <p className="text-text-secondary">
                    Plaque: {currentVehicle.licensePlate}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentVehicle.status)}`}>
                  {currentVehicle.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Sélectionner un nouveau véhicule</h4>
            <div className="space-y-3">
              {vehicles
                .filter(v => v.id !== currentVehicle.id)
                .map(vehicle => (
                  <label
                    key={vehicle.id}
                    className={`glass-card p-4 block cursor-pointer transition-all ${
                      selectedVehicle === vehicle.id ? 'border-accent' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="vehicle"
                        value={vehicle.id}
                        checked={selectedVehicle === vehicle.id}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedVehicle === vehicle.id 
                          ? 'border-accent bg-accent' 
                          : 'border-white/30'
                      }`}>
                        {selectedVehicle === vehicle.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-text-secondary">
                          Plaque: {vehicle.licensePlate}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Raison du changement
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="glass-input text-black h-32 resize-none"
              placeholder="Expliquez la raison du changement de véhicule..."
              required
            />
          </div>

          {!selectedVehicle && (
            <div className="flex items-start space-x-2 text-accent-warning">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Veuillez sélectionner un nouveau véhicule pour continuer
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="glass-button text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="glass-button active"
              disabled={!selectedVehicle || !reason}
            >
              Confirmer le changement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}