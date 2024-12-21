import { ApiDriver } from './driverServiceApi';

interface CacheEntry {
  data: ApiDriver;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes en millisecondes

class DriverCache {
  private static instance: DriverCache;
  private cache: Map<string, CacheEntry>;

  private constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  public static getInstance(): DriverCache {
    if (!DriverCache.instance) {
      DriverCache.instance = new DriverCache();
    }
    return DriverCache.instance;
  }

  private getCacheKey(workspace: string, driverId?: string): string {
    return `${workspace}:${driverId || 'default'}`;
  }

  private loadFromLocalStorage(): void {
    try {
      const savedCache = localStorage.getItem('driverCache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du cache:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem('driverCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du cache:', error);
    }
  }

  public get(workspace: string, driverId?: string): ApiDriver | null {
    const key = this.getCacheKey(workspace, driverId);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée est expirée
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }

    return entry.data;
  }

  public set(workspace: string, data: ApiDriver, driverId?: string): void {
    const key = this.getCacheKey(workspace, driverId);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.saveToLocalStorage();
  }

  public clear(): void {
    this.cache.clear();
    localStorage.removeItem('driverCache');
  }
}

export const driverCache = DriverCache.getInstance();
