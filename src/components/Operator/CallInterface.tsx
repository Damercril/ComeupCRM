import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Phone, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DriverInfo from "./DriverInfo";
import CallReport from "./CallReport";
import OperatorStats from "./OperatorStats";
import CallHistory from "./CallHistory";
import { fr } from "date-fns/locale";
import { mockDrivers } from "../../data/mockDrivers";
import {
  Driver,
  getDriversWithCarsAndCourse,
} from "../../services/driverService";
import { useAuthStore } from "../../stores/authStore";
import { ApiDriver, getDrivers } from "../../services/driverServiceApi";

interface CallLog {
  id: string;
  date: string;
  status: string;
  duration: string;
  note: string;
  callbackDate?: string;
}

export default function CallInterface() {
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);
  const [currentDriver, setCurrentDriver] = useState<ApiDriver | null>();
  const [callNote, setCallNote] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [callbackDate, setCallbackDate] = useState<Date | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callHistory, setCallHistory] = useState<Record<string, CallLog[]>>({});
  const [drivers, setDrivers] = useState<ApiDriver[]>([]); // Liste complète
  const [loading, setLoading] = useState<boolean>(true);
  const { workspace } = useAuthStore();

  const handleStartCall = () => {
    setCallStartTime(new Date());
  };

  const handleEndCall = () => {
    if (!callStartTime) return;
    const duration = Math.floor(
      (new Date().getTime() - callStartTime.getTime()) / 1000
    );
    console.log(`Call duration: ${duration} seconds`);
    setCallStartTime(null);
  };

  const handlePrevious = () => {
    setCurrentDriverIndex((prev) =>
      prev > 0 ? prev - 1 : mockDrivers.length - 1
    );
    resetForm();
  };

  const handleNext = () => {
    setCurrentDriverIndex((prev) => (prev < drivers.length - 1 ? prev + 1 : 0));
    resetForm();
  };

  const resetForm = () => {
    setCallNote("");
    setCallStatus("");
    setCallbackDate(null);
    setCallStartTime(null);
  };

  const handleSubmit = () => {
    if (!callStatus || !callbackDate) {
      alert("Veuillez sélectionner un statut et une date de rappel");
      return;
    }

    // Créer le nouveau log d'appel
    const newCallLog: CallLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: callStatus,
      duration: callStartTime
        ? `${Math.floor(
            (new Date().getTime() - callStartTime.getTime()) / 1000 / 60
          )}:${Math.floor(
            ((new Date().getTime() - callStartTime.getTime()) / 1000) % 60
          )
            .toString()
            .padStart(2, "0")}`
        : "0:00",
      note: callNote,
      callbackDate: callbackDate.toISOString(),
    };

    // Mettre à jour l'historique des appels
    setCallHistory((prev) => ({
      ...prev,
      [currentDriver!.driver_origin_id]: [newCallLog, ...(prev[currentDriver!.driver_origin_id] || [])],
    }));

    // Passer au chauffeur suivant
    handleNext();
  };

  const fetchDrivers = async (driver_id?:string) => {
    setLoading(true);
    const result = await getDrivers(workspace?.id,driver_id);
    console.log(result.data);
    if (result.success && result.data) {
      setCurrentDriver(result.data);
    } else {
      console.error(result.error); // Afficher une erreur si elle existe
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, [workspace]);
  // useEffect(() => {
  //   setCurrentDriver(drivers[currentDriverIndex]);
  // }, [currentDriverIndex]);

  if( loading){
    return (<div className="flex items-center justify-center min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
      <div className="flex flex-col items-center p-8 glass-card">
        <div className="w-12 h-12 border-4 rounded-full border-accent border-t-transparent animate-spin"></div>
        <p className="mt-4 text-text-secondary">Chargement en cours...</p>
      </div>
      
    </div>)
  } else if(currentDriver==null){
    return (<div className="flex items-center justify-center min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
      <div className="flex flex-col items-center p-8 glass-card">
        <p className="mt-4 text-text-secondary">Current not fund</p>
      </div>
      
    </div>)
  }
  return (
    <div className="min-h-screen p-4 bg-dark sm:p-6 lg:p-8">
      <div className="mx-auto space-y-6 max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-text-primary">
              Interface d'appel
            </h1>
            {callStartTime ? (
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
          <OperatorStats driver={currentDriver!}  />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <DriverInfo driver={currentDriver!} />
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-8">
            <CallReport
              callNote={callNote}
              setCallNote={setCallNote}
              callStatus={callStatus}
              setCallStatus={setCallStatus}
              callbackDate={callbackDate}
              setCallbackDate={setCallbackDate}
            />

            <CallHistory callHistory={callHistory[currentDriver!.driver_origin_id] || []} />

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={()=>fetchDrivers(currentDriver.previous)}
                className="glass-button text-white flex items-center gap-2 min-w-[140px] justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Précédent</span>
              </button>

              <button
                onClick={handleSubmit}
                className="glass-button active px-8 min-w-[200px]"
                disabled={!callStatus || !callbackDate}
              >
                Soumettre et suivant
              </button>

              <button
                onClick={()=>fetchDrivers(currentDriver.next)}
                className="glass-button text-white flex items-center gap-2 min-w-[140px] justify-center"
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
