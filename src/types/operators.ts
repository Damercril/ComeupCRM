export interface Operator {
  id: number;
  name: string;
  calls: number;
  revenue: string;
  avgCallTime: string;
  performance: number;
  performanceData: {
    date: string;
    calls: number;
    revenue: number;
    avgCallTime: number;
  }[];
  callLogs: {
    id: number;
    date: string;
    duration: string;
    status: string;
    notes: string;
  }[];
}