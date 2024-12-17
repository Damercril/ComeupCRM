import { useState, useEffect } from 'react';
import { getClients } from '../services/clients';
import type { YangoClient } from '../types/clients';

export function useClients() {
  const [clients, setClients] = useState<YangoClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error
  };
}