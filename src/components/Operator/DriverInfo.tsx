import React, { useState } from "react";
import { Phone, Calendar, TrendingUp, Plus, X } from "lucide-react";
import { MockDriver } from "../../data/mockDrivers";
import { ApiDriver } from "../../services/driverServiceApi";

interface DriverInfoProps {
  driver: ApiDriver;
}

export default function DriverInfo({ driver }: DriverInfoProps) {
  console.log('drivers',driver,driver.recentweeklyStats)
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const totalOrders = Object.values(driver.recentweeklyStats).reduce((acc, value) => (acc as number) + (value as number), 0);
  const numberOfWeeks = Object.keys(driver.recentweeklyStats).length;
  const averageRides = numberOfWeeks > 0 ? totalOrders as number / numberOfWeeks : 0;

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setAdditionalPhones([...additionalPhones, newPhone.trim()]);
      setNewPhone("");
      setShowPhoneInput(false);
    }
  };

  const handleRemovePhone = (index: number) => {
    setAdditionalPhones(additionalPhones.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-success/20 text-accent-success";
      case "inactive":
        return "bg-accent-warning/20 text-accent-warning";
      case "pending":
        return "bg-accent/20 text-accent";
      case "archived":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-accent/20 text-accent";
    }
  };

  return (
    <div className="h-full glass-card">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">
          Informations chauffeur
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {driver.last_name} {driver.first_name}
          </h2>
          <div className="flex items-center mt-2 space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                "active" 
              )}`}
            >
              {"Active"}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-accent/20 text-accent">
              ID: {driver.driver_origin_id}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 glass-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-text-secondary" />
                <span className="text-white">{driver.phones.join(",")}</span>
              </div>
            </div>

            {additionalPhones.map((phone, index) => (
              <div
                key={index}
                className="flex items-center justify-between pl-8 mt-2"
              >
                <span className="text-white">{phone}</span>
                <button
                  onClick={() => handleRemovePhone(index)}
                  className="p-1 transition-colors rounded-full hover:bg-white/10"
                  title="Supprimer ce numéro"
                >
                  <X className="w-4 h-4 text-accent-warning" />
                </button>
              </div>
            ))}

            {showPhoneInput ? (
              <div className="flex items-center pl-8 mt-3 space-x-2">
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+225 XX XX XX XX XX"
                  className="py-1 text-sm glass-input"
                  autoFocus
                />
                <button
                  onClick={handleAddPhone}
                  className="px-3 py-1 glass-button active"
                  disabled={!newPhone.trim()}
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowPhoneInput(false);
                    setNewPhone("");
                  }}
                  className="px-3 py-1 glass-button"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPhoneInput(true)}
                className="flex items-center pl-8 mt-3 space-x-2 text-sm transition-colors text-accent hover:text-accent-light"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un numéro</span>
              </button>
            )}
          </div>

          <div className="p-4 glass-card">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-text-secondary" />
              <span className="text-white">
                Dernière course:{" "}
                {driver.last_ride
                  ?driver.last_ride
                  : `-`}
              </span>
            </div>
          </div>

          <div className="p-4 glass-card">
            <h3 className="flex items-center mb-3 space-x-2 text-sm font-medium text-text-secondary">
              <TrendingUp className="w-4 h-4" />
              <span>Performance hebdomadaire</span>
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">
                {driver.performanceIndex ?? 0}
              </span>
              <div
                className={`flex items-center space-x-1 ${
                  driver.performanceEvolution > 0
                    ? "text-accent-success"
                    : "text-accent-warning"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">
                  {driver.performanceEvolution > 0 ? "+" : ""}
                  {driver.performanceEvolution > 0 ? driver.performanceEvolution : -1*(driver.performanceEvolution) }%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(driver.recentweeklyStats).map(([key, value], index) => (
                <div key={index} className="p-2 text-center glass-card">
                  <div className="mb-1 text-xs text-text-secondary">
                    {key.toUpperCase()} {/* Affiche s1, s2, etc. */}
                  </div>
                  <div className="text-sm font-medium text-white">
                    {value as number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
