// ... (début du fichier inchangé)

const [showVehicleModal, setShowVehicleModal] = useState(false);

const handleVehicleChange = (vehicleId: string, reason: string) => {
  console.log('Changement de véhicule:', {
    driverId: editingDriver?.id,
    oldVehicleId: editingDriver?.vehicles[0].id,
    newVehicleId: vehicleId,
    reason
  });
  setShowVehicleModal(false);
};

// Dans la section des boutons d'action :
<button 
  className="glass-button text-white"
  onClick={() => setShowVehicleModal(true)}
>
  <Car className="w-4 h-4 mr-2" />
  Changement de véhicule
</button>

{showVehicleModal && editingDriver && (
  <VehicleChangeModal
    vehicles={editingDriver.vehicles}
    currentVehicle={editingDriver.vehicles[0]}
    onClose={() => setShowVehicleModal(false)}
    onChangeVehicle={handleVehicleChange}
  />
)}

// ... (reste du fichier inchangé)