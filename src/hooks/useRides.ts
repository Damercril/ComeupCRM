import { useState, useEffect } from 'react';
import { getRides, getRidesByDriver, getRidesByDateRange } from '../services/rides';
import type { YangoRide } from '../types/rides';

export function useRides() {
  const [rides, setRides] = useState<YangoRide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRides() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRides();
        setRides(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch rides'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchRides();
  }, []);

  const fetchDriverRides = async (driverId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRidesByDriver(driverId);
      setRides(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch driver rides'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRidesByDateRange = async (startDate: string, endDate: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRidesByDateRange(startDate, endDate);
      setRides(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rides by date range'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rides,
    isLoading,
    error,
    fetchDriverRides,
    fetchRidesByDateRange
  };
}