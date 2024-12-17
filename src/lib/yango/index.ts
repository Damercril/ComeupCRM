import { YangoClient } from './client';
import type { YangoConfig } from '../../types/yango';

let yangoClient: YangoClient | null = null;

export function initializeYangoClient(config: YangoConfig) {
  yangoClient = new YangoClient(config);
  return yangoClient;
}

export function getYangoClient() {
  if (!yangoClient) {
    throw new Error('Yango client not initialized');
  }
  return yangoClient;
}