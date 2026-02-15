import { useState, useEffect } from "react"

export interface TimeEntry {
  id: string
  startTime: number
  endTime: number
  duration: number
}

const STORAGE_KEY = "timetrack-entries"

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([])

  // Load entries from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setEntries(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("Failed to load time entries from localStorage:", error)
    }
  }, [])

  // Persist entries to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch (error) {
      console.error("Failed to save time entries to localStorage:", error)
    }
  }, [entries])

  const addEntry = (entry: Omit<TimeEntry, "id">) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: crypto.randomUUID(),
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const clearEntries = () => {
    setEntries([])
  }

  return {
    entries,
    addEntry,
    deleteEntry,
    clearEntries,
  }
}
