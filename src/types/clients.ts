export interface YangoClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

export interface YangoClientResponse {
  clients: YangoClient[];
  total: number;
  cursor?: string;
}