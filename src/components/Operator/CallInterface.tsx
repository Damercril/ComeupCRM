import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Phone, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import OperatorStats from "./OperatorStats";
import CallReport from "./CallReport";
import CallHistory from "./CallHistory";
import DriverInfo from "./DriverInfo";
import { ApiDriver, getDrivers, getDriversList } from "../../services/driverServiceApi";
import { createCallLog, getCallLogs } from "../../services/callService";
import { useAuthStore } from "../../stores/authStore";

interface CallLog {
  date: string;
  status: string;
  duration: string;
  note: string;
  callback_date?: string;
  driver_id: string;
  workspace_id: string;
  id: string;
}

export default function CallInterface() {
  const [current_driver_index, setCurrentDriverIndex] = useState(0);
  const [current_driver, setCurrentDriver] = useState<ApiDriver | null>(null);
  const [call_note, setCallNote] = useState("");
  const [call_status, setCallStatus] = useState("");
  const [callback_date, setCallbackDate] = useState<Date | null>(null);
  const [call_start_time, setCallStartTime] = useState<Date | null>(null);
  const [call_history, setCallHistory] = useState<Record<string, CallLog[]>>({});
  const [drivers, setDrivers] = useState<ApiDriver[]>([]); // Liste complète
  const [initial_loading, setInitialLoading] = useState(true);
  const [loading_next, setLoadingNext] = useState(false);
  const [preloaded_drivers, setPreloadedDrivers] = useState<Record<string, ApiDriver>>({});
  const [preload_queue, setPreloadQueue] = useState<string[]>([]);
  const [current_offset, setCurrentOffset] = useState(0);
  const [is_preloading, setIsPreloading] = useState(false);
  const [has_more_drivers, setHasMoreDrivers] = useState(true);
  const [preloaded_driver_ids, setPreloadedDriverIds] = useState<Set<string>>(new Set());
  const [today_calls, setTodayCalls] = useState<number>(0);
  const [last_call_time, setLastCallTime] = useState<number | null>(null);
  const [total_call_time, setTotalCallTime] = useState<number>(0);
  const [is_loading_calls, setIsLoadingCalls] = useState(false);
  const BATCH_SIZE = 10;
  const INITIAL_BATCH_SIZE = 20; // Précharger 20 fiches au démarrage (40 minutes de travail)
  const NEXT_BATCH_SIZE = 10; // Précharger 10 fiches à la fois ensuite
  const PRELOAD_THRESHOLD = 5; // Déclencher le préchargement quand il reste 5 fiches
  const AVG_TIME_PER_PROFILE = 120000; // 2 minutes en millisecondes
  const PRELOAD_INTERVAL = AVG_TIME_PER_PROFILE / 2; // Vérifier toutes les minutes
  const workspace = useAuthStore(state => state.workspace);
  const user = useAuthStore(state => state.user);

  const resetForm = () => {
    setCallNote("");
    setCallStatus("");
    setCallbackDate(null);
    setCallStartTime(null);
  };

  const handleStartCall = () => {
    setCallStartTime(new Date());
  };

  const handleEndCall = async () => {
    if (!current_driver || !workspace) return;
    
    setCallStatus('ended');
    setLastCallTime(Date.now());

    const duration = call_start_time
      ? Math.floor((new Date().getTime() - call_start_time.getTime()) / 1000)
      : 0;

    const newCallLog: CallLog = {
      date: new Date().toISOString(),
      status: call_status,
      duration: formatDuration(duration),
      note: call_note,
      callback_date: callback_date ? callback_date.toISOString() : undefined,
      driver_id: current_driver.driver_origin_id,
      workspace_id: workspace.id,
      id: Math.random().toString(36).substr(2, 9)
    };

    try {
      const result = await createCallLog(newCallLog);
      if (result.success) {
        console.log('Call log created successfully');
        loadCallHistory();
      } else {
        console.error('Failed to create call log:', result.error);
      }
    } catch (error) {
      console.error('Error creating call log:', error);
    }

    // Reset call state
    setCallStartTime(null);
    setCallNote('');
    setCallbackDate(null);
  };

  const handlePrevious = async () => {
    if (!current_driver?.previous) return;
    await fetchDrivers(current_driver.previous);
    resetForm();
  };

  const handleNext = async () => {
    if (!current_driver?.next) return;
    await fetchDrivers(current_driver.next);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!call_status || !callback_date || !workspace?.id || !current_driver) {
      alert("Veuillez sélectionner un statut et une date de rappel");
      return;
    }

    // Calculer le temps passé sur cette fiche
    if (last_call_time) {
      const timeSpent = Date.now() - last_call_time;
      const newTotalTime = total_call_time + timeSpent;
      setTotalCallTime(newTotalTime);
      localStorage.setItem(getTodayStorageKey('total_time'), newTotalTime.toString());
    }
    setLastCallTime(Date.now());

    // Créer le nouveau log d'appel
    const duration = call_start_time
      ? Math.floor(
          (new Date().getTime() - call_start_time.getTime()) / 1000
        )
      : 0;
    const newCallLog: CallLog = {
      date: new Date().toISOString(),
      status: call_status,
      duration: formatDuration(duration),
      note: call_note,
      callback_date: callback_date ? callback_date.toISOString() : undefined,
      driver_id: current_driver.driver_origin_id,
      workspace_id: workspace.id,
      id: Math.random().toString(36).substr(2, 9)
    };

    // Sauvegarder dans la base de données
    const result = await createCallLog(newCallLog);
    if (!result.success) {
      alert("Erreur lors de l'enregistrement de l'appel");
      return;
    }

    // Mettre à jour l'historique local
    setCallHistory((prev) => ({
      ...prev,
      [current_driver.driver_origin_id]: [result.data, ...(prev[current_driver.driver_origin_id] || [])],
    }));

    // Incrémenter et sauvegarder le nombre d'appels du jour
    const newCount = today_calls + 1;
    setTodayCalls(newCount);
    localStorage.setItem(getTodayStorageKey('count'), newCount.toString());

    handleNext();
    resetForm();
  };

  // Fonction pour obtenir la clé du localStorage avec la date du jour
  const getTodayStorageKey = (suffix: string) => {
    const today = new Date().toISOString().split('T')[0];
    return `calls_${suffix}_${today}_${workspace?.id}`;
  };

  // Charger les statistiques du jour
  useEffect(() => {
    if (workspace?.id) {
      const storedCount = localStorage.getItem(getTodayStorageKey('count'));
      const storedTotalTime = localStorage.getItem(getTodayStorageKey('total_time'));
      
      setTodayCalls(storedCount ? parseInt(storedCount) : 0);
      setTotalCallTime(storedTotalTime ? parseInt(storedTotalTime) : 0);
      setLastCallTime(Date.now());
    }
  }, [workspace]);

  // Calculer le temps moyen par appel
  const getAverageCallTime = () => {
    if (today_calls === 0) return '0:00';
    
    const avgSeconds = Math.floor(total_call_time / (today_calls * 1000));
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const preloadSpecificDriver = async (driverId: string, priority: boolean = false) => {
    if (!workspace?.id || !driverId || preloaded_drivers[driverId]) return;

    try {
      const result = await getDrivers(workspace.id, driverId);
      if (result.success && result.data) {
        setPreloadedDrivers(prev => {
          const newDrivers = { ...prev };
          // On s'assure que result.data existe avant l'assignation
          if (result.data) {
            newDrivers[driverId] = result.data;
          }
          return newDrivers;
        });
      }
    } catch (error) {
      console.error(`Erreur lors du préchargement du chauffeur ${driverId}:`, error);
    }
  };

  const fetchDrivers = async (driver_id?: string) => {
    if (!workspace?.id) return;

    if (!current_driver) {
      setInitialLoading(true);
    } else {
      setLoadingNext(true);
    }

    try {
      // Vérifier si le chauffeur est déjà en cache
      if (driver_id && preloaded_drivers[driver_id]) {
        const cachedDriver = preloaded_drivers[driver_id];
        setCurrentDriver(cachedDriver);
        // Précharger les adjacents pendant qu'on affiche les données en cache
        if (cachedDriver) {
          preloadAdjacentDrivers(cachedDriver);
        }
        return;
      }

      const result = await getDrivers(workspace.id, driver_id);
      if (result.success && result.data) {
        const driver = result.data;
        setCurrentDriver(driver);
        // Mettre en cache
        const driverId = driver.driver_origin_id;
        if (driverId) {
          setPreloadedDrivers(prev => {
            const newDrivers = { ...prev };
            newDrivers[driverId] = driver;
            return newDrivers;
          });
        }
        // Précharger les adjacents
        preloadAdjacentDrivers(driver);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des drivers:", error);
    } finally {
      setInitialLoading(false);
      setLoadingNext(false);
    }
  };

  const preloadAdjacentDrivers = async (driver: ApiDriver) => {
    if (!driver) return;

    // Précharger le suivant et le précédent en priorité
    if (driver.next) await preloadSpecificDriver(driver.next, true);
    if (driver.previous) await preloadSpecificDriver(driver.previous, true);
  };

  const preloadDriverProfiles = async (offset: number = 0, batchSize: number = NEXT_BATCH_SIZE) => {
    if (!workspace?.id || !has_more_drivers || is_preloading) return;
    
    setIsPreloading(true);
    try {
      const driversListResult = await getDriversList(workspace.id, batchSize, offset);
      
      if (driversListResult.success && Array.isArray(driversListResult.data)) {
        // Filtrer les chauffeurs qui n'ont pas encore été préchargés
        const newDrivers = driversListResult.data.filter(
          driver => driver?.driver_origin_id && !preloaded_driver_ids.has(driver.driver_origin_id)
        );

        if (newDrivers.length > 0) {
          // Précharger en priorité les 3 prochains chauffeurs
          const priorityDrivers = newDrivers.slice(0, 3);
          const remainingDrivers = newDrivers.slice(3);

          // Précharger les chauffeurs prioritaires
          await Promise.all(priorityDrivers.map(driver => preloadSpecificDriver(driver.driver_origin_id)));

          // Précharger les chauffeurs restants
          for (const driver of remainingDrivers) {
            await preloadSpecificDriver(driver.driver_origin_id);
          }
        }

        setHasMoreDrivers(driversListResult.hasMore || false);
      }
    } catch (error) {
      console.error("Erreur lors du préchargement des profils:", error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Charger l'historique des appels
  const loadCallHistory = async () => {
    if (!workspace || !current_driver) return;
    
    try {
      setIsLoadingCalls(true);
      const result = await getCallLogs(workspace.id, current_driver.driver_origin_id);
      if (result.success && result.data) {
        setCallHistory(prev => ({
          ...prev,
          [current_driver.driver_origin_id]: result.data
        }));
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    } finally {
      setIsLoadingCalls(false);
    }
  };

  // Précharger les prochains chauffeurs
  useEffect(() => {
    const preloadNextDrivers = async () => {
      if (!workspace || !current_driver?.next || is_preloading) return;
      
      try {
        setIsPreloading(true);
        const result = await getDrivers(workspace.id, current_driver.next);
        if (result.success && result.data) {
          setPreloadedDrivers(prev => ({
            ...prev,
            [current_driver.next]: result.data
          }));
        }
      } catch (error) {
        console.error("Erreur lors du préchargement:", error);
      } finally {
        setIsPreloading(false);
      }
    };

    if (drivers.length < PRELOAD_THRESHOLD) {
      preloadNextDrivers();
    }
  }, [workspace, current_driver, drivers.length, is_preloading]);

  // Charger les détails du chauffeur quand il change
  useEffect(() => {
    if (current_driver) {
      loadCallHistory();
    }
  }, [current_driver, workspace]);

  const handleNextDriver = async () => {
    if (!workspace || !current_driver?.next) return;
    
    try {
      setLoadingNext(true);
      
      // Utiliser le chauffeur préchargé si disponible
      if (preloaded_drivers[current_driver.next]) {
        setCurrentDriver(preloaded_drivers[current_driver.next]);
        // Nettoyer le cache
        const { [current_driver.next]: _, ...rest } = preloaded_drivers;
        setPreloadedDrivers(rest);
      } else {
        // Sinon charger depuis l'API
        const result = await getDrivers(workspace.id, current_driver.next);
        if (result.success && result.data) {
          setCurrentDriver(result.data);
        }
      }
      
      resetForm();
    } catch (error) {
      console.error("Erreur lors du passage au chauffeur suivant:", error);
    } finally {
      setLoadingNext(false);
    }
  };

  const handlePreviousDriver = async () => {
    if (!workspace || !current_driver?.previous) return;
    
    try {
      const result = await getDrivers(workspace.id, current_driver.previous);
      if (result.success && result.data) {
        setCurrentDriver(result.data);
        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors du passage au chauffeur précédent:", error);
    }
  };

  // Charger la liste initiale des chauffeurs
  useEffect(() => {
    const loadInitialDrivers = async () => {
      if (!workspace) {
        console.log("Pas de workspace disponible");
        return;
      }
      
      console.log("Chargement des chauffeurs pour le workspace:", workspace.id);
      try {
        setInitialLoading(true);
        const result = await getDrivers(workspace.id);
        console.log("Résultat du chargement:", result);
        
        if (result.success && result.data) {
          console.log("Chauffeur chargé:", result.data);
          setCurrentDriver(result.data);
          setDrivers([result.data]);
        } else {
          console.error("Erreur lors du chargement des chauffeurs:", result.error);
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    console.log("useEffect déclenché avec workspace:", workspace);
    loadInitialDrivers();
  }, [workspace]);

  // Préchargement initial au montage du composant
  useEffect(() => {
    if (workspace?.id) {
      fetchDrivers();
      // Charger un lot plus important au démarrage
      preloadDriverProfiles(0, INITIAL_BATCH_SIZE);
    }
  }, [workspace]);

  // Préchargement continu en arrière-plan
  useEffect(() => {
    if (!workspace?.id || !has_more_drivers) return;

    const checkAndPreload = () => {
      // Calculer combien de fiches sont préchargées mais pas encore consultées
      const remainingPreloaded = preloaded_driver_ids.size - current_driver_index;
      
      // Si on approche du seuil, déclencher un nouveau préchargement
      if (remainingPreloaded <= PRELOAD_THRESHOLD) {
        preloadDriverProfiles(current_offset);
      }
    };

    const intervalId = setInterval(checkAndPreload, PRELOAD_INTERVAL);
    return () => clearInterval(intervalId);
  }, [workspace, current_offset, has_more_drivers, preloaded_driver_ids, current_driver_index]);

  if (initial_loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
        <div className="flex flex-col items-center p-8 glass-card">
          <div className="w-12 h-12 border-4 rounded-full border-accent border-t-transparent animate-spin"></div>
          <p className="mt-4 text-text-secondary">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (!workspace?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
        <div className="flex flex-col items-center p-8 glass-card">
          <p className="mt-4 text-text-secondary">Workspace non trouvé</p>
        </div>
      </div>
    );
  }

  if (!current_driver) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
        <div className="flex flex-col items-center p-8 glass-card">
          <p className="mt-4 text-text-secondary">Aucun chauffeur disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
      <div className="mx-auto space-y-6 max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-text-primary">
              Journal d'appel
            </h1>
            {call_start_time ? (
              <button
                onClick={handleEndCall}
                className="glass-button bg-gradient-to-r from-accent-warning to-accent-warning/80 border-accent-warning/50 text-white min-w-[180px] flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Terminer l'appel
              </button>
            ) : (
              <button
                onClick={handleStartCall}
                className="glass-button active min-w-[180px] flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Démarrer l'appel
              </button>
            )}
          </div>
          <OperatorStats 
            driver={current_driver!} 
            todayCalls={today_calls}
            avgCallDuration={getAverageCallTime()}
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <DriverInfo driver={current_driver!} />
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-8">
            <CallReport
              callNote={call_note}
              setCallNote={setCallNote}
              callStatus={call_status}
              setCallStatus={setCallStatus}
              callbackDate={callback_date}
              setCallbackDate={setCallbackDate}
            />

            <CallHistory call_history={call_history[current_driver!.driver_origin_id] || []} is_loading={is_loading_calls}/>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousDriver}
                className="glass-button text-white flex items-center gap-2 min-w-[140px] justify-center"
                disabled={loading_next || !current_driver?.previous}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Précédent</span>
              </button>

              <button
                onClick={handleSubmit}
                className="glass-button active px-8 min-w-[200px]"
                disabled={!call_status || !callback_date || loading_next}
              >
                Soumettre et suivant
              </button>

              <button
                onClick={handleNextDriver}
                className="glass-button text-white flex items-center gap-2 min-w-[140px] justify-center"
                disabled={loading_next || !current_driver?.next}
              >
                <span>Passer</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
