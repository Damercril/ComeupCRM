import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { subWeeks, isWithinInterval } from "date-fns";

export interface Driver {
  created_at: string;
  current_status: "offline" | "online" | "away" | string;
  driver_origin_id: string;
  employment_type: "park_employee" | "contractor" | string;
  first_name: string; // Prénom
  id: number;
  last_name: string;
  park_id: string;
  phones: string[];
  cars: Car[];
  updated_at: string;
  work_rule_id: string;
  work_status: "working" | "not_working" | string;
  workspace_id: string;
  orders: any[];
  revenue: string;
  last_course: any;
  [key: string]: any;
}
export interface Car {
  id: number; // Identifiant unique de la voiture
  car_origin_id: string; // Identifiant unique d'origine
  workspace_id: string; // Identifiant de l'espace de travail
  brand: string; // Marque de la voiture (e.g., "Suzuki")
  model: string; // Modèle de la voiture (e.g., "Dzire")
  color: string; // Couleur de la voiture (e.g., "Синий")
  year: number; // Année de fabrication (e.g., 2024)
  number: string; // Numéro d'immatriculation (e.g., "AA-557-EY01")
  normalized_number: string; // Numéro d'immatriculation normalisé (e.g., "AA557EY01")
  status: string; // Statut de la voiture (e.g., "working")
  callsign: string; // Indicatif de la voiture (e.g., "AA-557-EY01")
  created_at: string; // Date de création (ISO string)
  updated_at: string; // Date de mise à jour (ISO string)
}
/**
 * Récupère les données d'une table Supabase en fonction des conditions.
 *
 * @template T - Type des données attendues.
 * @param {string} tableName - Nom de la table dans Supabase.
 * @param {Record<string, string | number | boolean>} conditions - Conditions d'égalité (clé-valeur).
 * @returns {Promise<{ data: T[] | null; error: PostgrestError | null }>} - Données ou erreur.
 */
const fetchTableData = async <T>(
  tableName: string,
  conditions: Record<string, string | number | boolean> = {}
): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
  try {
    let allData: T[] = [];
    const pageSize = 1000; // Nombre de lignes par requête
    let from = 0;
    let to = pageSize - 1;
    let hasMore = true;

    while (hasMore) {
      // Construction de la requête de base
      let query = supabase.from(tableName).select("*").range(from, to);

      // Ajout des conditions d'égalité uniquement si elles existent
      if (Object.keys(conditions).length > 0) {
        for (const [key, value] of Object.entries(conditions)) {
          query = query.eq(key, value);
        }
      }

      // Exécution de la requête
      const { data, error } = await query;

      if (error) {
        console.error(
          "Erreur lors de la récupération des données :",
          error.message
        );
        return { data: null, error };
      }

      // Ajouter les données récupérées au tableau principal
      allData = allData.concat(data || []);

      // Vérifier s'il y a encore plus de données à récupérer
      hasMore = (data || []).length === pageSize;
      from += pageSize;
      to += pageSize;
    }

    return { data: allData, error: null };
  } catch (error: any) {
    console.error("Erreur inattendue :", error.message);
    return { data: null, error };
  }
};
// Fonction pour récupérer tous les drivers
export const getDrivers = async (
  workspace?: string
): Promise<{ success: boolean; data?: Driver[]; error?: string }> => {
  try {
    const { data, error } = await fetchTableData<Driver>("drivers", {
      workspace_id: workspace!,
    });
    if (error) throw error;
    if (!data) {
      throw new Error("Aucune donnée trouvée.");
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des drivers:", error.message);
    return { success: false, error: error.message };
  }
};

export const getCarDrivers = async (
  workspace?: string
): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const { data, error } = await supabase.from("car_drivers").select("*");
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des drivers:", error.message);
    return { success: false, error: error.message };
  }
};

export const getDriversWithCars = async (
  workspace?: string
): Promise<{ success: boolean; data?: Driver[]; error?: string }> => {
  try {
    console.log("workspace", workspace);
    // Récupérer les chauffeurs
    const { data: drivers, error: driversError } = await fetchTableData<Driver>(
      "drivers",
      { workspace_id: workspace! }
    );
    if (driversError) throw driversError;
    // Récupérer les relations entre chauffeurs et voitures
    const { data: carDrivers, error: carDriversError } =
      await fetchTableData<any>("car_drivers", { workspace_id: workspace! });
    if (carDriversError) throw carDriversError;
    // Récupérer les voitures
    const { data: cars, error: carsError } = await fetchTableData<any>("cars", {
      workspace_id: workspace!,
    });

    if (carsError) throw carsError;
    if (!drivers || !carDrivers || !cars) {
      throw new Error("Aucune donnée trouvée.");
    }
    // Associer les données manuellement
    const formattedData = drivers.map((driver) => {
      const driverCars = carDrivers
        .filter(
          (carDriver) => carDriver.driver_origin_id === driver.driver_origin_id
        )
        .map((carDriver) =>
          cars.find((car) => car.car_origin_id === carDriver.car_origin_id)
        )
        .filter((car) => car !== null && car !== undefined); // Exclure les null ou undefined
      return { ...driver, cars: driverCars };
    });

    return { success: true, data: formattedData };
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération des chauffeurs et de leurs voitures :",
      error.message
    );
    return { success: false, error: error.message };
  }
};

export const getDriversWithCarsAndCourse = async (
  workspace?: string
): Promise<{ success: boolean; data?: Driver[]; error?: string }> => {
  try {
    console.log("workspace", workspace);

    // Récupérer les chauffeurs
    const { data: drivers, error: driversError } = await fetchTableData<Driver>(
      "drivers",
      { workspace_id: workspace! }
    );
    if (driversError) throw driversError;

    // Récupérer les relations entre chauffeurs et voitures
    const { data: carDrivers, error: carDriversError } =
      await fetchTableData<any>("car_drivers", { workspace_id: workspace! });
    if (carDriversError) throw carDriversError;

    // Récupérer les voitures
    const { data: cars, error: carsError } = await fetchTableData<any>("cars", {
      workspace_id: workspace!,
    });
    if (carsError) throw carsError;

    // Récupérer les commandes
    const { data: orders, error: orderError } = await fetchTableData<any>(
      "orders",
      { workspace_id: workspace! }
    );
    if (orderError) throw orderError;

    if (!drivers || !carDrivers || !cars || !orders) {
      throw new Error("Aucune donnée trouvée.");
    }

    // Calcul des semaines de référence
    const now = new Date();
    const weekIntervals = [
      { start: subWeeks(now, 1), end: now }, // Semaine 1 (dernière semaine)
      { start: subWeeks(now, 2), end: subWeeks(now, 1) }, // Semaine 2
      { start: subWeeks(now, 3), end: subWeeks(now, 2) }, // Semaine 3
      { start: subWeeks(now, 4), end: subWeeks(now, 3) }, // Semaine 4
    ];

    // Associer les données manuellement
    const formattedData = drivers.map((driver) => {
      const driverCars = carDrivers
        .filter(
          (carDriver) => carDriver.driver_origin_id === driver.driver_origin_id
        )
        .map((carDriver) =>
          cars.find((car) => car.car_origin_id === carDriver.car_origin_id)
        )
        .filter((car) => car !== null && car !== undefined); // Exclure les null ou undefined

      const driverOrders = orders.filter(
        (order) => order.driver_origin_id === driver.driver_origin_id
      );

      // Calculer la dernière commande
      const driverLastOrder = driverOrders[driverOrders.length - 1];

      // Calculer le nombre de commandes par semaine
      const weeksOrders: { s1: number; s2: number; s3: number; s4: number } = {
        s1: 0,
        s2: 0,
        s3: 0,
        s4: 0,
      };

      weekIntervals.forEach((interval, index) => {
        const count = driverOrders.filter((order) =>
          isWithinInterval(new Date(order.booked_at), {
            start: interval.start,
            end: interval.end,
          })
        ).length;

        const key = `s${index + 1}` as keyof typeof weeksOrders;
        weeksOrders[key] = count;
      });

       // Calculer le chiffre d'affaires total
       const totalRevenue = driverOrders
       .filter(order => order.price !== null) // Exclure les prix null
       .reduce((sum, order) => sum + (order.price || 0), 0); // Ajouter le prix au total

      return {
        ...driver,
        cars: driverCars,
        orders: driverOrders,
        last_course: driverLastOrder,
        weeksOrders,
        totalRevenue
      };
    });

    return { success: true, data: formattedData };
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération des chauffeurs et de leurs voitures :",
      error.message
    );
    return { success: false, error: error.message };
  }
};

// stats
interface Order {
  id: number;
  order_origin_id: string;
  workspace_id: string;
  driver_origin_id: string;
  car_origin_id: string;
  status: string;
  payment_method: string | null;
  address_from: { address: string; lat: number; lon: number };
  route_points: any[];
  order_time_interval: { from: string; to: string };
  price: number | null;
  short_id: number;
  driving_at: string;
  provider: string;
  category: string | null;
  booked_at: string;
  ended_at: string | null;
  mileage: number | null;
  created_at: string;
  updated_at: string;
}

export interface DriverStats {
  totalOrders: number;
  totalRevenue: number;
  coreDrivers: number;
  electrons: number;
}
export interface DriverDayStats {
  date: String;
  totalOrders: number;
  totalRevenue: number;
  coreDrivers: number;
  coreChange: number;
  electrons: number;
  electronsChange: number;
  averageRevenue: number;
  averageOrders: number;
}
export const fetchOrdersAndCalculateStats = async (
  startDate?: string,
  endDate?: string,
  workspace?: string
): Promise<DriverStats> => {
  try {
    // Construire la requête Supabase
    const { data: orders, error } = await fetchTableData<any>("orders", {
      workspace_id: workspace!,
    });
    if (error || !orders)
      throw new Error(
        `Erreur lors de la récupération des commandes : ${error?.message}`
      );
    let filteredOrders = orders;
    console.log("test", filteredOrders);

    // Ajouter les filtres de période
    if (startDate && endDate) {
      console.log("date", startDate, endDate);
      filteredOrders = orders.filter((order) => {
        return order.booked_at >= startDate && order.booked_at <= endDate;
      });
    } else if (startDate) {
      const startOfDay = new Date(startDate).toISOString();
      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 59, 59, 999);
      filteredOrders = orders.filter((order) => {
        return (
          order.booked_at >= startOfDay &&
          order.booked_at <= endOfDay.toISOString()
        );
      });
    }
    console.log("test", filteredOrders);

    if (!filteredOrders || filteredOrders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        coreDrivers: 0,
        electrons: 0,
      };
    }

    // Calculer les statistiques
    const totalOrders = filteredOrders.length;

    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + parseFloat(order.price || 0),
      0
    );

    const driverOrderCounts: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const driverId = order.driver_origin_id;
      if (!driverOrderCounts[driverId]) {
        driverOrderCounts[driverId] = 0;
      }
      driverOrderCounts[driverId]++;
    });

    const coreDrivers = Object.values(driverOrderCounts).filter((count) => {
      const weeklyThreshold = count >= 70; // 70 courses par semaine
      const threeDayThreshold = count >= (20 / 3) * 7; // 20 courses tous les 3 jours extrapolé à une semaine
      return weeklyThreshold || threeDayThreshold;
    }).length;

    const electrons = Object.values(driverOrderCounts).filter((count) => {
      const weeklyThreshold = count >= 40; // 40 courses par semaine
      const threeDayThreshold = count >= (10 / 3) * 7; // 10 courses tous les 3 jours extrapolé à une semaine
      return weeklyThreshold || threeDayThreshold;
    }).length;

    return {
      totalOrders,
      totalRevenue,
      coreDrivers,
      electrons,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération et du calcul des statistiques:",
      error
    );
    throw error;
  }
};
export const fetchOrdersAndCalculateStatsForEachDay = async (
  startDate?: string,
  endDate?: string,
  workspace?: string
): Promise<DriverDayStats[]> => {
  try {
    // Construire la requête Supabase

    const { data: orders, error } = await fetchTableData<any>("orders", {
      workspace_id: workspace!,
    });
    if (error)
      throw new Error(
        `Erreur lors de la récupération des commandes : ${error.message}`
      );
    if (!orders || orders.length === 0) return [];

    // Filtrer les commandes selon les dates
    let filteredOrders = orders;
    if (startDate && endDate) {
      filteredOrders = orders.filter((order) => {
        return order.booked_at >= startDate && order.booked_at <= endDate;
      });
    } else if (startDate) {
      const startOfDay = new Date(startDate).toISOString();
      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 59, 59, 999);
      filteredOrders = orders.filter((order) => {
        return (
          order.booked_at >= startOfDay &&
          order.booked_at <= endOfDay.toISOString()
        );
      });
    }

    if (filteredOrders.length === 0) return [];

    // Obtenir toutes les dates entre startDate et endDate
    const start = new Date(endDate!);
    const end = new Date(startDate!);
    const dates: string[] = [];
    for (let d = new Date(start); d >= end; d.setDate(d.getDate() - 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]); // Obtenir uniquement la date (YYYY-MM-DD)
    }

    let previousCoreDrivers = 0;
    let previousElectrons = 0;

    // Calcul des statistiques par jour
    const statsByDay = dates.map((date) => {
      const ordersForDay = filteredOrders.filter((order) => {
        const orderDate = new Date(order.booked_at).toISOString().split("T")[0];
        return orderDate === date;
      });

      if (ordersForDay.length === 0) {
        const coreChange = 0 - previousCoreDrivers;
        const electronsChange = 0 - previousElectrons;

        previousCoreDrivers = 0;
        previousElectrons = 0;

        return {
          date,
          coreChange,
          electronsChange,
          totalOrders: 0,
          totalRevenue: 0,
          averageRevenue: 0,
          averageOrders: 0,
          coreDrivers: 0,
          electrons: 0,
        };
      }

      const totalOrders = ordersForDay.length;
      const totalRevenue = ordersForDay.reduce(
        (sum, order) => sum + parseFloat(order.price || 0),
        0
      );

      const driverOrderCounts: Record<string, number> = {};
      ordersForDay.forEach((order) => {
        const driverId = order.driver_origin_id;
        if (!driverOrderCounts[driverId]) {
          driverOrderCounts[driverId] = 0;
        }
        driverOrderCounts[driverId]++;
      });

      const coreDrivers = Object.values(driverOrderCounts).filter((count) => {
        const weeklyThreshold = count >= 70; // 70 courses par semaine
        const threeDayThreshold = count >= (20 / 3) * 7; // 20 courses tous les 3 jours extrapolé à une semaine
        return weeklyThreshold || threeDayThreshold;
      }).length;

      const electrons = Object.values(driverOrderCounts).filter((count) => {
        const weeklyThreshold = count >= 40; // 40 courses par semaine
        const threeDayThreshold = count >= (10 / 3) * 7; // 10 courses tous les 3 jours extrapolé à une semaine
        return weeklyThreshold || threeDayThreshold;
      }).length;

      const coreChange = coreDrivers - previousCoreDrivers;
      const electronsChange = electrons - previousElectrons;

      previousCoreDrivers = coreDrivers;
      previousElectrons = electrons;

      // Calculer la moyenne des revenus et des commandes
      const averageRevenue =
        totalRevenue / Object.keys(driverOrderCounts).length || 0;
      const averageOrders =
        totalOrders / Object.keys(driverOrderCounts).length || 0;

      return {
        date,
        coreChange,
        electronsChange,
        totalOrders: 450,
        totalRevenue,
        averageRevenue,
        averageOrders: 3000,
        coreDrivers,
        electrons,
      };
    });

    // Inverser les éléments pour obtenir les dates du plus récent au plus ancien
    return statsByDay;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération et du calcul des statistiques:",
      error
    );
    throw error;
  }
};

export interface DriverStatus {
  name: string;
  value: number;
  color: string;
}

export const getDriverStatusStats = async (
  workspace: string
): Promise<{ success: boolean; data?: DriverStatus[]; error?: string }> => {
  try {
    // Récupérer les chauffeurs
    const { data: drivers, error: driversError } = await fetchTableData<any>(
      "drivers",
      { workspace_id: workspace! }
    );
    if (driversError || !drivers) throw driversError;

    // Récupérer les relations entre chauffeurs et voitures
    const { data: carDrivers, error: carDriversError } =
      await fetchTableData<any>("car_drivers", { workspace_id: workspace! });

    if (carDriversError || !carDrivers) throw carDriversError;

    // Mapper les statuts personnalisés
    const statusMapping: Record<string, string> = {
      offline: "Injoignable",
      in_order_free: "Est disponible",
      busy: "En déplacement",
      in_order_busy: "En déplacement",
    };

    // Définir les couleurs pour chaque statut
    const statusColors: Record<string, string> = {
      "A arrêté de faire yango": "#EF4444",
      "A fait un accident": "#F59E0B",
      "Appel sans réponse": "#6366F1",
      "Compte se connecter": "#22C55E",
      "Est disponible": "#38BDF8",
      "En déplacement": "#8B5CF6",
      "Crédit autre partenaire": "#EC4899",
      Injoignable: "#64748B",
      Malade: "#94A3B8",
      "Problème connexion": "#FB923C",
      "Pas de véhicule": "#A855F7",
      "Véhicule au garage": "#14B8A6",
    };

    // Initialiser tous les statuts à 0
    const statusCounts: Record<string, number> = {
      "A arrêté de faire yango": 0,
      "A fait un accident": 0,
      "Appel sans réponse": 0,
      "Compte se connecter": 0,
      "Est disponible": 0,
      "En déplacement": 0,
      "Crédit autre partenaire": 0,
      Injoignable: 0,
      Malade: 0,
      "Problème connexion": 0,
      "Pas de véhicule": 0,
      "Véhicule au garage": 0,
    };

    // Calculer les statuts
    drivers.forEach((driver) => {
      // Vérifier si le chauffeur a une voiture assignée
      const hasCar = carDrivers.some(
        (carDriver) => carDriver.driver_origin_id === driver.driver_origin_id
      );
      if (!hasCar) {
        statusCounts["Pas de véhicule"] += 1;
        return;
      }

      // Mapper le statut du chauffeur
      const mappedStatus =
        statusMapping[driver.current_status] || "Injoignable"; // Par défaut, 'Injoignable'
      statusCounts[mappedStatus] = (statusCounts[mappedStatus] || 0) + 1;
    });

    // Formater les données finales
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#000000", // Couleur par défaut
    }));

    return { success: true, data: statusData };
  } catch (error: any) {
    console.error(
      "Erreur lors de la récupération des statistiques de statut des chauffeurs :",
      error.message
    );
    return { success: false, error: error.message };
  }
};
