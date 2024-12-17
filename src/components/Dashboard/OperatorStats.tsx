import React from 'react';
import { Phone, TrendingUp, Clock } from 'lucide-react';

const operators = [
  {
    name: 'Alice Koné',
    calls: 145,
    revenue: '320,000',
    avgCallTime: '4:30',
    performance: 12,
  },
  {
    name: 'David Touré',
    calls: 132,
    revenue: '280,000',
    avgCallTime: '3:45',
    performance: 8,
  },
  {
    name: 'Marie Bamba',
    calls: 128,
    revenue: '265,000',
    avgCallTime: '4:15',
    performance: 5,
  },
];

export default function OperatorStats() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Top Performing Operators</h2>
      <div className="space-y-6">
        {operators.map((operator, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">{operator.name}</h3>
                <div className="flex items-center space-x-6 mt-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{operator.calls} calls</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>₣{operator.revenue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{operator.avgCallTime}</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm ${operator.performance >= 10 ? 'text-green-500' : 'text-blue-500'}`}>
                +{operator.performance}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}