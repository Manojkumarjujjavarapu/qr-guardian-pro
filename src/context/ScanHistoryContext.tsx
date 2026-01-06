import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AnalysisResult, ThreatLevel } from '@/lib/urlAnalyzer';
import { supabase } from '@/integrations/supabase/client';

interface ScanHistoryContextType {
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  clearHistory: () => void;
  isLoading: boolean;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export function ScanHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch history from database on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('scan_history')
          .select('*')
          .order('scanned_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching scan history:', error);
          return;
        }

        if (data) {
          const results: AnalysisResult[] = data.map((row) => ({
            url: row.url,
            threatLevel: row.threat_level as ThreatLevel,
            riskScore: row.risk_score,
            threats: row.threats || [],
            details: row.details as AnalysisResult['details'],
            timestamp: new Date(row.scanned_at),
          }));
          setHistory(results);
        }
      } catch (error) {
        console.error('Error fetching scan history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const addToHistory = useCallback(async (result: AnalysisResult) => {
    // Optimistically update local state
    setHistory((prev) => [result, ...prev.slice(0, 49)]);

    // Persist to database
    try {
      const { error } = await supabase.from('scan_history').insert({
        url: result.url,
        threat_level: result.threatLevel,
        risk_score: result.riskScore,
        threats: result.threats,
        details: result.details,
        scanned_at: result.timestamp.toISOString(),
      });

      if (error) {
        console.error('Error saving scan to history:', error);
      }
    } catch (error) {
      console.error('Error saving scan to history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    // Optimistically clear local state
    setHistory([]);

    // Delete from database
    try {
      const { error } = await supabase.from('scan_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing scan history:', error);
      }
    } catch (error) {
      console.error('Error clearing scan history:', error);
    }
  }, []);

  return (
    <ScanHistoryContext.Provider value={{ history, addToHistory, clearHistory, isLoading }}>
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
