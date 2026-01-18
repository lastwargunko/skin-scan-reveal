import { useState, useCallback, useEffect } from "react";
import { ClassificationResult } from "@/components/ResultCard";
import { HistoryItem } from "@/components/AnalysisHistory";

const STORAGE_KEY = "skin-classifier-history";
const MAX_HISTORY_ITEMS = 20;

export const useAnalysisHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const items = parsed.map((item: HistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(items);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  }, [history]);

  const addToHistory = useCallback((imagePreview: string, results: ClassificationResult[]) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imagePreview,
      results,
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      // Keep only the last MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory,
  };
};
