import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnalysisResult } from '@/lib/urlAnalyzer';

interface ScanHistoryContextType {
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  clearHistory: () => void;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export function ScanHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const addToHistory = useCallback((result: AnalysisResult) => {
    setHistory((prev) => [result, ...prev.slice(0, 49)]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <ScanHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </ScanHistoryContext.Provider>
  );
}

export function useScanHistory() {
  const context = useContext(ScanHistoryContext);
  if (context === undefined) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return context;
}
