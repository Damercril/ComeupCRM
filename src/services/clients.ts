import { supabase } from '../lib/supabase';
import { getYangoClient } from '../lib/yango';
import type { YangoClient } from '../types/clients';

export async function getClients(): Promise<YangoClient[]> {
  try {
    const { data, error } = await supabase
      .from('yango_clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function syncClients() {
  try {
    const client = getYangoClient();
    const response = await client.getClients();

    // Store clients in Supabase
    const { error } = await supabase
      .from('yango_clients')
      .upsert(response.clients.map(client => ({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        status: client.status,
        created_at: new Date().toISOString()
      })));

    if (error) throw error;
    return response.clients;
  } catch (error) {
    console.error('Error syncing clients:', error);
    throw error;
  }
}