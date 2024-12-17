import React, { useState } from 'react';
import OperatorsList from '../Operators/OperatorsList';
import OperatorDetail from '../Operators/OperatorDetail';
import { Operator } from '../../types/operators';

export default function OperatorsView() {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Gestion des Opérateurs</h2>
      </div>
      
      {selectedOperator ? (
        <OperatorDetail 
          operator={selectedOperator} 
          onClose={() => setSelectedOperator(null)} 
        />
      ) : (
        <OperatorsList onSelectOperator={setSelectedOperator} />
      )}
    </div>
  );
}