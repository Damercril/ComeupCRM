import { supabase } from '../lib/supabase';
import axios from 'axios';
import { API_URL } from '../config';

export interface CallLog {
  id?: string;
  date: string;
  status: string;
  duration: string;
  note: string;
  callback_date?: string;
  driver_id: string;
  workspace_id: string;
  created_at?: string;
  updated_at?: string;
}

export const createCallLog = async (callLog: CallLog) => {
  try {
    const { data, error } = await supabase
      .from('call_logs')
      .insert([{
        date: callLog.date,
        status: callLog.status,
        duration: callLog.duration,
        note: callLog.note,
        callback_date: callLog.callback_date,
        driver_id: callLog.driver_id,
        workspace_id: callLog.workspace_id
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating call log:', error);
    return { success: false, error };
  }
};

export const getCallLogs = async (workspaceId: string, driverId: string) => {
  try {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('driver_id', driverId)
      .order('date', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return { success: false, error, data: [] };
  }
};
