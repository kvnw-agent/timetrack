"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimeEntry } from "@/types/timer";

const STORAGE_KEY = "timetrack-entries";

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((entry: Omit<TimeEntry, "id">) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, deleteEntry, clearEntries };
}
