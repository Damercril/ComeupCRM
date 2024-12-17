export interface YangoRide {
  id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  revenue: number;
  distance: number;
  created_at: string;
}