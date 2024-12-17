import { Vehicle } from '../types/drivers';

export interface MockDriver {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  driverId: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  lastRide: string;
  totalRides: number;
  revenue: number;
  weeklyRides: number[];
  trend: number;
  vehicles: Vehicle[];
}

export const mockDrivers: MockDriver[] = [
  {
    id: 'D1',
    name: 'Bamba Noa',
    phone: '+225 0789123456',
    licensePlate: 'AJ 1234 AB',
    driverId: 'YG001',
    status: 'active',
    lastRide: '2024-03-24',
    totalRides: 450,
    revenue: 1250000,
    weeklyRides: [15, 18, 12, 20],
    trend: 8.5,
    vehicles: [
      {
        id: 'V1',
        licensePlate: 'AJ 1234 AB',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        status: 'active'
      },
      {
        id: 'V2',
        licensePlate: 'AJ 5678 CD',
        brand: 'Honda',
        model: 'Civic',
        year: 2019,
        status: 'inactive'
      },
      {
        id: 'V3',
        licensePlate: 'AJ 9012 EF',
        brand: 'Hyundai',
        model: 'Elantra',
        year: 2021,
        status: 'pending'
      }
    ]
  },
  {
    id: 'D2',
    name: 'Michael Décou',
    phone: '+225 0798765432',
    licensePlate: 'AJ 4321 BA',
    driverId: 'YG002',
    status: 'active',
    lastRide: '2024-03-23',
    totalRides: 380,
    revenue: 980000,
    weeklyRides: [12, 14, 16, 15],
    trend: 5.2,
    vehicles: [
      {
        id: 'V4',
        licensePlate: 'AJ 4321 BA',
        brand: 'Kia',
        model: 'Cerato',
        year: 2021,
        status: 'active'
      }
    ]
  },
  {
    id: 'D3',
    name: 'Sécou Dia',
    phone: '+225 0745678912',
    licensePlate: 'AJ 8765 DC',
    driverId: 'YG003',
    status: 'inactive',
    lastRide: '2024-03-20',
    totalRides: 290,
    revenue: 750000,
    weeklyRides: [8, 10, 7, 5],
    trend: -3.8,
    vehicles: [
      {
        id: 'V5',
        licensePlate: 'AJ 8765 DC',
        brand: 'Hyundai',
        model: 'Accent',
        year: 2019,
        status: 'inactive'
      }
    ]
  },
  {
    id: 'D4',
    name: 'Mohamed Traoré',
    phone: '+225 0756789123',
    licensePlate: 'AJ 6543 FE',
    driverId: 'YG004',
    status: 'pending',
    lastRide: '2024-03-22',
    totalRides: 420,
    revenue: 1100000,
    weeklyRides: [14, 16, 13, 18],
    trend: 6.7,
    vehicles: [
      {
        id: 'V6',
        licensePlate: 'AJ 6543 FE',
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        status: 'active'
      }
    ]
  },
  {
    id: 'D5',
    name: 'Aminata Koné',
    phone: '+225 0734567891',
    licensePlate: 'AJ 9876 HG',
    driverId: 'YG005',
    status: 'active',
    lastRide: '2024-03-24',
    totalRides: 520,
    revenue: 1450000,
    weeklyRides: [17, 19, 16, 21],
    trend: 9.3,
    vehicles: [
      {
        id: 'V7',
        licensePlate: 'AJ 9876 HG',
        brand: 'Honda',
        model: 'Accord',
        year: 2021,
        status: 'active'
      }
    ]
  },
  {
    id: 'D6',
    name: 'Ibrahim Coulibaly',
    phone: '+225 0723456789',
    licensePlate: 'AJ 2345 IJ',
    driverId: 'YG006',
    status: 'archived',
    lastRide: '2024-03-15',
    totalRides: 180,
    revenue: 450000,
    weeklyRides: [5, 4, 3, 2],
    trend: -12.5,
    vehicles: [
      {
        id: 'V8',
        licensePlate: 'AJ 2345 IJ',
        brand: 'Kia',
        model: 'Rio',
        year: 2018,
        status: 'inactive'
      }
    ]
  },
  {
    id: 'D7',
    name: 'Fatou Diallo',
    phone: '+225 0712345678',
    licensePlate: 'AJ 7654 KL',
    driverId: 'YG007',
    status: 'active',
    lastRide: '2024-03-24',
    totalRides: 410,
    revenue: 1080000,
    weeklyRides: [13, 15, 14, 16],
    trend: 4.8,
    vehicles: [
      {
        id: 'V9',
        licensePlate: 'AJ 7654 KL',
        brand: 'Toyota',
        model: 'Yaris',
        year: 2020,
        status: 'active'
      }
    ]
  },
  {
    id: 'D8',
    name: 'Ousmane Sanogo',
    phone: '+225 0701234567',
    licensePlate: 'AJ 3456 MN',
    driverId: 'YG008',
    status: 'pending',
    lastRide: '2024-03-21',
    totalRides: 320,
    revenue: 820000,
    weeklyRides: [11, 9, 12, 10],
    trend: -1.2,
    vehicles: [
      {
        id: 'V10',
        licensePlate: 'AJ 3456 MN',
        brand: 'Hyundai',
        model: 'i10',
        year: 2019,
        status: 'pending'
      }
    ]
  },
  {
    id: 'D9',
    name: 'Mariam Touré',
    phone: '+225 0790123456',
    licensePlate: 'AJ 8901 OP',
    driverId: 'YG009',
    status: 'active',
    lastRide: '2024-03-24',
    totalRides: 480,
    revenue: 1320000,
    weeklyRides: [16, 18, 15, 19],
    trend: 7.9,
    vehicles: [
      {
        id: 'V11',
        licensePlate: 'AJ 8901 OP',
        brand: 'Kia',
        model: 'Forte',
        year: 2021,
        status: 'active'
      }
    ]
  },
  {
    id: 'D10',
    name: 'Seydou Konaté',
    phone: '+225 0778901234',
    licensePlate: 'AJ 5678 QR',
    driverId: 'YG010',
    status: 'inactive',
    lastRide: '2024-03-19',
    totalRides: 250,
    revenue: 680000,
    weeklyRides: [7, 6, 5, 4],
    trend: -8.4,
    vehicles: [
      {
        id: 'V12',
        licensePlate: 'AJ 5678 QR',
        brand: 'Honda',
        model: 'City',
        year: 2018,
        status: 'inactive'
      }
    ]
  }
];