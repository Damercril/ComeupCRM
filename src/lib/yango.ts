import { supabase } from './supabase';

export interface YangoConfig {
  apiKey: string;
  clientId: string;
  parkId: string;
}

export async function testYangoConnection(config: YangoConfig): Promise<{ 
  success: boolean; 
  error?: string;
  status?: number;
}> {
  try {
    const { data: response, error: functionError } = await supabase.functions.invoke('test-yango', {
      body: config
    });

    if (functionError) {
      console.error('Edge function error:', functionError);
      return { 
        success: false, 
        error: 'Service unavailable',
        status: 503
      };
    }

    if (!response.success) {
      return { 
        success: false, 
        error: response.error?.message || 'Connection failed',
        status: response.status
      };
    }

    // Save settings to Supabase if connection is successful
    const { error: settingsError } = await supabase
      .from('workspace_settings')
      .upsert({
        yango_api_key: config.apiKey,
        yango_client_id: config.clientId,
        yango_park_id: config.parkId,
        yango_connection_status: true,
        yango_last_sync: new Date().toISOString()
      });

    if (settingsError) {
      console.error('Error saving settings:', settingsError);
      // Don't fail the operation if settings save fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error testing Yango connection:', error);
    return { 
      success: false, 
      error: 'Network error or service unavailable',
      status: 503
    };
  }
}