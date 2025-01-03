import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Plus, Phone, Car, X } from 'lucide-react';
import { mockDrivers, MockDriver } from '../../data/mockDrivers';

import { Driver, getDrivers,getDriversWithCars,getCarDrivers } from '../../services/driverService';
import { useAuthStore } from '../../stores/authStore';

export default function DriversView() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDriverSearch, setShowDriverSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]); // Liste complète
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]); // Liste filtrée
  const [searchTerm, setSearchTerm] = useState<string>(''); // Terme de recherche
  const [loading, setLoading] = useState<boolean>(true);
  const { workspace } = useAuthStore();

  // const filteredDrivers = mockDrivers.filter(driver => {
  //   const searchLower = searchTerm.toLowerCase();
  //   return (
  //     driver.name.toLowerCase().includes(searchLower) ||
  //     driver.phone.includes(searchTerm) ||
  //     driver.licensePlate.toLowerCase().includes(searchLower) ||
  //     driver.driverId.toLowerCase().includes(searchLower)
  //   );
  // });

 
  // Récupérer les drivers
  const fetchDrivers = async () => {
    setLoading(true);
    const result = await getDriversWithCars(workspace?.id);
    console.log(result.data);
    if (result.success && result.data) {
      setDrivers(result.data);
      setFilteredDrivers(result.data);
    } else {
      console.error(result.error); // Afficher une erreur si elle existe
    }
    setLoading(false);
  };
  const fetchDriversWithCar = async () => {
   const response=await getCarDrivers(workspace?.id);
   if(response.success){
    console.log('response',response.data)
   }else{
    console.log(response.error)
   }
  };

  // Filtrer la liste des drivers
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = drivers.filter((driver) =>
      driver.first_name.toLowerCase().includes(term) || // Recherche par nom
      driver.last_name.toLowerCase().includes(term) ||  // Recherche par email
      driver.driver_origin_id.toLowerCase().includes(term) ||  // Recherche par email
      driver.phones.some((phone) => phone.toLowerCase().includes(term))  || // Recherche par email
      driver.cars.some((car) => car.callsign.toLowerCase().includes(term))  // Recherche par email
    );
    setFilteredDrivers(filtered);
  };

  useEffect(() => {
    fetchDrivers();
    fetchDriversWithCar();
  }, [workspace]);



  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
  //       setShowDriverSearch(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 glass-card">
        <h2 className="mb-6 text-xl font-semibold text-white">Gestion des chauffeurs</h2>
        
        <div className="space-y-6" ref={searchRef}>
          {selectedDriver ? (
            <div className="p-4 glass-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 glass-button">
                      <span className="font-medium text-white">
                      {selectedDriver.first_name[0]}{selectedDriver.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedDriver.first_name} {selectedDriver.last_name}</p>
                      <p className="text-sm text-text-secondary">{selectedDriver.phones}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <p className="text-sm text-text-secondary">
                      ID: {selectedDriver.driver_origin_id}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Plaque: {selectedDriver.cars.map((car) => car.number).join(", ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDriver(null);
                    setShowDriverSearch(true);
                    setSearchTerm('');
                  }}
                  className="p-2 text-white glass-button hover:text-accent-warning"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button className="text-white glass-button">
                  <Car className="w-4 h-4 mr-2" />
                  Changement de véhicule
                </button>
                <button className="text-white glass-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajout d'un nouveau véhicule
                </button>
                <button className="text-white glass-button">
                  <Phone className="w-4 h-4 mr-2" />
                  Modifier le numéro de téléphone
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="p-2 glass-card">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone, plaque ou ID..."
                    className="w-full py-2 pl-10 pr-4 text-white bg-transparent glass-input"
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => setShowDriverSearch(true)}
                  />
                  <Search className="absolute w-4 h-4 text-text-secondary left-3 top-3" />
                </div>
                
                {showDriverSearch && (
                  <div className="mt-2 overflow-y-auto max-h-60">
                    {filteredDrivers.length > 0 ? (
                      <div className="space-y-2">
                        {filteredDrivers.map((driver) => (
                          <button
                            key={driver.id}
                            type="button"
                            className="flex items-center w-full p-3 space-x-3 transition-colors rounded-lg hover:bg-white/10"
                            onClick={() => {
                              setSelectedDriver(driver);
                              setSearchTerm('');
                              setShowDriverSearch(false);
                            }}
                          >
                            <div className="flex items-center justify-center w-10 h-10 glass-button">
                              <span className="font-medium text-white">
                                {driver.first_name[0]}{driver.last_name[0]}
                              </span>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-white">{driver.first_name} {driver.last_name}</p>
                              <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
                                <p>{driver.phones.join(", ")}</p>
                                <p>ID: {driver.driver_origin_id}</p>
                                <p>Plaque: {driver.cars.map((car) => car.number).join(", ")}</p>
                                <p>Statut: </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchTerm ? (
                      <p className="p-3 text-sm text-center text-text-secondary">
                        Aucun chauffeur trouvé
                      </p>
                    ) : (
                      <p className="p-3 text-sm text-center text-text-secondary">
                        Commencez à taper pour rechercher un chauffeur
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}