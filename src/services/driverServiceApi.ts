import { getFetcher } from "../utils/fetcher";

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
const api_url = 'https://powderblue-jay-800840.hostingersite.com/api';

export const getDrivers = async (
    workspace?: string,
    driver_id?:string,
  ): Promise<{ success: boolean; data?: ApiDriver; error?: string }> => {
    try {
      const curent_url=api_url+'/drivers/'+workspace+'/'+(driver_id!=undefined ? driver_id : '')
      console.log('current',curent_url);
      const data= await getFetcher(curent_url);
      console.log('edes',data)
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