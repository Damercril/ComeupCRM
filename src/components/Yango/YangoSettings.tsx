import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { testYangoConnection, YangoConfig } from '../../lib/yango';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

export default function YangoSettings() {
  const workspace = useAuthStore(state => state.workspace);
  const [config, setConfig] = useState<YangoConfig>({
    apiKey: 'EwqiaxpNOudkKbUmEASEGDkiYtbHoKopN',
    clientId: 'taxi/park/c4f70e438b9f4981ac6c712e99aea33d',
    parkId: 'c4f70e438b9f4981ac6c712e99aea33d'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);

  useEffect(() => {
    if (workspace) {
      loadSettings();
    }
  }, [workspace]);

  const loadSettings = async () => {
    if (!workspace) return;

    try {
      const { data: settings, error: settingsError } = await supabase
        .from('workspace_settings')
        .select('*')
        .eq('workspace_id', workspace.id)
        .single();

      if (settingsError) {
        if (settingsError.code !== 'PGRST116') { // No rows found
          console.error('Error loading Yango settings:', settingsError);
        }
        return;
      }

      if (settings) {
        setConfig({
          apiKey: settings.yango_api_key || '',
          clientId: settings.yango_client_id || '',
          parkId: settings.yango_park_id || ''
        });
        setConnectionStatus(settings.yango_connection_status);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const testConnection = async () => {
    if (!workspace) {
      setError({ message: 'No workspace selected' });
      return;
    }

    if (!config.apiKey || !config.clientId || !config.parkId) {
      setError({ message: 'Please fill in all fields' });
      return;
    }

    setIsTesting(true);
    setError(null);

    try {
      const { success, error: connectionError, status } = await testYangoConnection({
        ...config,
        workspace_id: workspace.id
      });
      
      setConnectionStatus(success);
      
      if (!success && connectionError) {
        setError({ message: connectionError, status });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus(false);
      setError({ 
        message: 'An unexpected error occurred',
        status: 500
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center space-x-2">
        <Key className="w-5 h-5" />
        <span>Yango API Configuration</span>
      </h3>

      {error && (
        <div className="mb-4 p-4 glass-card border-accent-warning/50 bg-accent-warning/10">
          <p className="text-sm text-accent-warning">
            {error.message}
            {error.status && (
              <span className="ml-2 px-2 py-1 bg-accent-warning/20 rounded">
                Status: {error.status}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            API Key (X-API-Key)
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            className="glass-input px-4 py-2 w-full"
            placeholder="Enter your Yango API key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Client ID (X-Client-ID)
          </label>
          <input
            type="text"
            value={config.clientId}
            onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
            className="glass-input px-4 py-2 w-full"
            placeholder="e.g., taxi/park/your_client_id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Park ID
          </label>
          <input
            type="text"
            value={config.parkId}
            onChange={(e) => setConfig(prev => ({ ...prev, parkId: e.target.value }))}
            className="glass-input px-4 py-2 w-full"
            placeholder="e.g., c4f70e438b9f4981ac6c712e99aea33d"
          />
        </div>

        <button
          onClick={testConnection}
          className="glass-button active w-full"
          disabled={isTesting}
        >
          {isTesting ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Testing connection...
            </div>
          ) : (
            'Test Connection'
          )}
        </button>

        {connectionStatus !== null && !error && (
          <div className="flex items-center space-x-2 mt-4">
            {connectionStatus ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-accent-success" />
                <span className="text-accent-success">Connected successfully</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-accent-warning" />
                <span className="text-accent-warning">Connection failed</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}