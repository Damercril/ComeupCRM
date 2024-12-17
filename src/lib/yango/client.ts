import axios from 'axios';
import type { YangoConfig } from '../../types/yango';
import type { YangoClientResponse } from '../../types/clients';

export class YangoClient {
  private readonly client;
  private readonly parkId: string;

  constructor(config: YangoConfig) {
    this.client = axios.create({
      baseURL: 'https://fleet.api.yango.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'X-API-Key': config.apiKey,
        'X-Client-ID': config.clientId,
        'Accept-Language': 'en'
      }
    });
    this.parkId = config.parkId;
  }

  async getDrivers() {
    try {
      const response = await this.client.post('/parks/driver-profiles/list', {
        query: {
          park: {
            id: this.parkId
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  async getRides(driverId?: string) {
    try {
      const response = await this.client.post('/parks/rides/list', {
        query: {
          park: {
            id: this.parkId
          },
          ...(driverId && { driver: { id: driverId } })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching rides:', error);
      throw error;
    }
  }

  async getClients(): Promise<YangoClientResponse> {
    try {
      const response = await this.client.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }
}