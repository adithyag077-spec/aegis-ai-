import React, { createContext, useState } from 'react';

export const ThreatContext = createContext(null);

export const ThreatProvider = ({ children }) => {
  const [activeScanResult, setActiveScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [threatLogs, setThreatLogs] = useState([]);

  return (
    <ThreatContext.Provider value={{
      activeScanResult,
      setActiveScanResult,
      isScanning,
      setIsScanning,
      threatLogs,
      setThreatLogs
    }}>
      {children}
    </ThreatContext.Provider>
  );
};
