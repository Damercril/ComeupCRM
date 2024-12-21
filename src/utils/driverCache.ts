import { ApiDriver } from "../services/driverServiceApi";

class DriverCache {
  private cache: Map<string, ApiDriver>;
  private maxSize: number;
  private accessOrder: string[];
  private preloadingIds: Set<string> = new Set();
  private preloadedIds: Set<string> = new Set(); // Pour suivre les conducteurs déjà préchargés

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.accessOrder = [];
  }

  get(driverId: string): ApiDriver | undefined {
    const driver = this.cache.get(driverId);
    if (driver) {
      this.updateAccessOrder(driverId);
    }
    return driver;
  }

  set(driverId: string, driver: ApiDriver): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(driverId)) {
      const oldestId = this.accessOrder[0];
      this.cache.delete(oldestId);
      this.accessOrder.shift();
      this.preloadedIds.delete(oldestId);
    }

    this.cache.set(driverId, driver);
    this.updateAccessOrder(driverId);
    this.preloadedIds.add(driverId);
  }

  private updateAccessOrder(driverId: string): void {
    const index = this.accessOrder.indexOf(driverId);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(driverId);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.preloadingIds.clear();
    this.preloadedIds.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getAll(): ApiDriver[] {
    return Array.from(this.cache.values());
  }

  isPreloading(driverId: string): boolean {
    return this.preloadingIds.has(driverId);
  }

  isPreloaded(driverId: string): boolean {
    return this.preloadedIds.has(driverId);
  }

  setPreloading(driverId: string, isPreloading: boolean): void {
    if (isPreloading) {
      this.preloadingIds.add(driverId);
    } else {
      this.preloadingIds.delete(driverId);
    }
  }

  getPreloadingCount(): number {
    return this.preloadingIds.size;
  }
}

export const driverCache = new DriverCache();
