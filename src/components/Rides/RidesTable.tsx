import React, { useState } from 'react';
import { useRides } from '../../hooks/useRides';
import { Calendar, Search, ArrowUpDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RidesTable() {
  const { rides, isLoading, error, fetchRidesByDateRange } = useRides();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof rides[0] | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof typeof rides[0]) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      fetchRidesByDateRange(start.toISOString(), end.toISOString());
    }
  };

  const filteredRides = rides.filter(ride => 
    ride.driver_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRides = [...filteredRides].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-accent-warning">Error loading rides: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Rides History</h2>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={handleDateRangeChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                className="glass-input pl-10 pr-4 py-2"
                placeholderText="Filter by date range"
                dateFormat="dd/MM/yyyy"
              />
              <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 py-2"
              />
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('driver_id')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>Driver ID</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('start_time')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>Start Time</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('end_time')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>End Time</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>Revenue</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort('distance')}
                    className="flex items-center space-x-2 text-sm font-medium text-text-secondary"
                  >
                    <span>Distance</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-text-secondary">Loading rides...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedRides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-text-secondary">
                    No rides found
                  </td>
                </tr>
              ) : (
                sortedRides.map((ride) => (
                  <tr key={ride.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-text-primary">{ride.driver_id}</td>
                    <td className="p-4 text-text-primary">
                      {new Date(ride.start_time).toLocaleString()}
                    </td>
                    <td className="p-4 text-text-primary">
                      {new Date(ride.end_time).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        ride.status === 'completed'
                          ? 'bg-accent-success/20 text-accent-success'
                          : ride.status === 'cancelled'
                          ? 'bg-accent-warning/20 text-accent-warning'
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {ride.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-primary">
                      {ride.revenue.toLocaleString()} FCFA
                    </td>
                    <td className="p-4 text-text-primary">
                      {ride.distance.toFixed(1)} km
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}