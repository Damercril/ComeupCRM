import { supabase } from '../lib/supabase';
import type { YangoRide } from '../types/rides';

export async function getRides(): Promise<YangoRide[]> {
  try {
    const { data, error } = await supabase
      .from('yango_rides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
}

export async function getRidesByDriver(driverId: string): Promise<YangoRide[]> {
  try {
    const { data, error } = await supabase
      .from('yango_rides')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching driver rides:', error);
    throw error;
  }
}

export async function getRidesByDateRange(startDate: string, endDate: string): Promise<YangoRide[]> {
  try {
    const { data, error } = await supabase
      .from('yango_rides')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching rides by date range:', error);
    throw error;
  }
}