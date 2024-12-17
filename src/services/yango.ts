import { supabase } from '../lib/supabase';
import { initializeYangoClient, getYangoClient } from '../lib/yango';
import type { YangoConfig } from '../types/yango';

export async function initializeYangoService(workspaceId: string) {
  try {
    // Get Yango settings from workspace settings
    const { data: settings, error } = await supabase
      .from('workspace_settings')
      .select('yango_api_key, yango_client_id, yango_park_id')
      .eq('workspace_id', workspaceId)
      .single();

    if (error) throw error;
    if (!settings) throw new Error('No Yango settings found');

    const config: YangoConfig = {
      apiKey: settings.yango_api_key,
      clientId: settings.yango_client_id,
      parkId: settings.yango_park_id
    };

    // Initialize the Yango client
    return initializeYangoClient(config);
  } catch (error) {
    console.error('Error initializing Yango service:', error);
    throw error;
  }
}

export async function syncRides() {
  try {
    const client = getYangoClient();
    const rides = await client.getRides();

    // Store rides in Supabase
    const { error } = await supabase
      .from('yango_rides')
      .upsert(rides.map(ride => ({
        id: ride.id,
        driver_id: ride.driver.id,
        start_time: ride.start_time,
        end_time: ride.end_time,
        status: ride.status,
        revenue: ride.cost.amount,
        distance: ride.distance,
        created_at: new Date().toISOString()
      })));

    if (error) throw error;
    return rides;
  } catch (error) {
    console.error('Error syncing rides:', error);
    throw error;
  }
}