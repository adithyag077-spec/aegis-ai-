import { useContext } from 'react';
import { ThreatContext } from '../context/ThreatContext';

export const useScan = () => {
  const context = useContext(ThreatContext);
  if (!context) {
    throw new Error('useScan must be used within a ThreatProvider');
  }
  return context;
};
