import { getFetcher } from "../utils/fetcher";
import { driverCache } from './driverCache';
import { API_URL } from '../config';

export interface ApiDriver {
  driver_origin_id: string;
  first_name: string; // Prénom
  last_name: string;
  phones: string[];
  plaque: string;
  revenuTotal: number;
  performanceIndex: number;
  performanceEvolution: number;
  last_ride: any;
  next: any;
  previous: any;
  recentWeeklyStats: any;
  [key: string]: any;
}
const api_url = API_URL;

export const getDrivers = async (
    workspace?: string,
    driver_id?:string,
  ): Promise<{ success: boolean; data?: ApiDriver; error?: string }> => {
    try {
      if (!workspace) {
        throw new Error("Workspace is required");
      }

      // Vérifier le cache d'abord
      const cachedData = driverCache.get(workspace, driver_id);
      if (cachedData) {
        console.log("Données trouvées dans le cache:", cachedData);
        return { success: true, data: cachedData };
      }

      // Si pas dans le cache, faire l'appel API
      const current_url = api_url + '/drivers/' + workspace + (driver_id ? '/' + driver_id : '');
      console.log('Appel API:', current_url);
      
      const data = await getFetcher(current_url);
      console.log('Réponse API:', data);

      if (!data || typeof data !== 'object') {
        console.error("Réponse API invalide:", data);
        return { success: false, error: "Invalid API response" };
      }

      // Mettre en cache les nouvelles données
      if (data) {
        driverCache.set(workspace, data, driver_id);
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des drivers:", error.message);
      return { success: false, error: error.message };
    }
  };

  
export const getTotalRevenue = async (
  workspace?: string,
  startDate?:string,
  endDate?:string,
): Promise<{ success: boolean; data?: ApiDriver; error?: string }> => {
  try {
    const curent_url=api_url+'/revenu-general/'+workspace+'/'+(startDate!=undefined ? startDate : '/')+'/'+(endDate!=undefined ? endDate : '');
    console.log('current',curent_url);
    const data= await getFetcher(curent_url);
    console.log('edes',data)
    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des drivers:", error.message);
    return { success: false, error: error.message };
  }
};


export const getDayRevenue = async (
  workspace?: string,
  startDate?:string,
  endDate?:string,
): Promise<{ success: boolean; data?: ApiDriver; error?: string }> => {
  try {
    const curent_url=api_url+'/revenu-journalier/'+workspace+'/'+(startDate!=undefined ? startDate : '/')+'/'+(endDate!=undefined ? endDate : '');
    console.log('current',curent_url);
    const data= await getFetcher(curent_url);
    console.log('edes',data)
    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des drivers:", error.message);
    return { success: false, error: error.message };
  }
};

export const getCoreEletron = async (
  workspace?: string,
  startDate?:string,
  endDate?:string,
): Promise<{ success: boolean; data?: ApiDriver; error?: string }> => {
  try {
    const curent_url=api_url+'/core-electron/'+workspace+'/'+(startDate!=undefined ? startDate : '/')+'/'+(endDate!=undefined ? endDate : '');
    console.log('current',curent_url);
    const data= await getFetcher(curent_url);
    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des drivers:", error.message);
    return { success: false, error: error.message };
  }
};

export const getDriversList = async (
  workspace?: string,
  limit: number = 10,
  offset: number = 0
): Promise<{ success: boolean; data?: ApiDriver[]; hasMore?: boolean; error?: string }> => {
  try {
    if (!workspace) {
      throw new Error("Workspace is required");
    }

    const curent_url = `${api_url}/drivers/${workspace}/list?limit=${limit}&offset=${offset}`;
    console.log('Fetching drivers list:', curent_url);
    const response = await getFetcher(curent_url);
    const data = response?.data || response; // Handle both {data: [...]} and direct array response
    const hasMore = Array.isArray(data) && data.length === limit;
    return { success: true, data: Array.isArray(data) ? data : [], hasMore };
  } catch (error: any) {
    console.error("Erreur lors de la récupération de la liste des drivers:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};