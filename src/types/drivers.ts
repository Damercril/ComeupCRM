export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface VehicleChangeRequest {
  driverId: string;
  oldVehicleId: string;
  newVehicleId: string;
  reason: string;
}