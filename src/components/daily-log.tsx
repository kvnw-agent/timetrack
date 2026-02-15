"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

// TimeEntry interface
export interface TimeEntry {
  id: string
  description: string
  startTime: Date
  endTime: Date
  duration: number // in milliseconds
  date: string // ISO date string for grouping (YYYY-MM-DD)
}

// Helper function to format duration as HH:MM:SS
function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

// Helper function to format date as "Monday, February 15, 2026"
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper function to format date as relative ("Today", "Yesterday", or full date)
function formatDateRelative(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const entryDate = new Date(date)
  entryDate.setHours(0, 0, 0, 0)

  if (entryDate.getTime() === today.getTime()) {
    return "Today"
  } else if (entryDate.getTime() === yesterday.getTime()) {
    return "Yesterday"
  } else {
    return formatDate(dateString)
  }
}

// Helper function to format time as "HH:MM AM/PM"
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// Helper function to group entries by date
function groupEntriesByDate(entries: TimeEntry[]): Map<string, TimeEntry[]> {
  const grouped = new Map<string, TimeEntry[]>()

  entries.forEach((entry) => {
    const existing = grouped.get(entry.date) || []
    existing.push(entry)
    grouped.set(entry.date, existing)
  })

  // Sort entries within each day by start time (chronological)
  grouped.forEach((dayEntries) => {
    dayEntries.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  })

  return grouped
}

// Helper function to calculate total duration for entries
function calculateTotalDuration(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => total + entry.duration, 0)
}

// Mock data for demonstration
const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    description: "Morning standup meeting",
    startTime: new Date("2026-02-15T09:00:00"),
    endTime: new Date("2026-02-15T09:30:00"),
    duration: 30 * 60 * 1000, // 30 minutes
    date: "2026-02-15",
  },
  {
    id: "2",
    description: "Feature development - user authentication",
    startTime: new Date("2026-02-15T10:00:00"),
    endTime: new Date("2026-02-15T12:30:00"),
    duration: 150 * 60 * 1000, // 2.5 hours
    date: "2026-02-15",
  },
  {
    id: "3",
    description: "Code review",
    startTime: new Date("2026-02-15T14:00:00"),
    endTime: new Date("2026-02-15T15:00:00"),
    duration: 60 * 60 * 1000, // 1 hour
    date: "2026-02-15",
  },
  {
    id: "4",
    description: "Bug fixing - payment integration",
    startTime: new Date("2026-02-15T15:30:00"),
    endTime: new Date("2026-02-15T17:00:00"),
    duration: 90 * 60 * 1000, // 1.5 hours
    date: "2026-02-15",
  },
  {
    id: "5",
    description: "Client meeting",
    startTime: new Date("2026-02-14T11:00:00"),
    endTime: new Date("2026-02-14T12:00:00"),
    duration: 60 * 60 * 1000, // 1 hour
    date: "2026-02-14",
  },
  {
    id: "6",
    description: "API development",
    startTime: new Date("2026-02-14T13:00:00"),
    endTime: new Date("2026-02-14T16:30:00"),
    duration: 210 * 60 * 1000, // 3.5 hours
    date: "2026-02-14",
  },
  {
    id: "7",
    description: "Documentation writing",
    startTime: new Date("2026-02-13T10:00:00"),
    endTime: new Date("2026-02-13T11:30:00"),
    duration: 90 * 60 * 1000, // 1.5 hours
    date: "2026-02-13",
  },
  {
    id: "8",
    description: "Testing and QA",
    startTime: new Date("2026-02-13T14:00:00"),
    endTime: new Date("2026-02-13T16:00:00"),
    duration: 120 * 60 * 1000, // 2 hours
    date: "2026-02-13",
  },
]

export default function DailyLog() {
  // Group entries by date
  const groupedEntries = groupEntriesByDate(mockTimeEntries)

  // Sort dates in reverse chronological order (most recent first)
  const sortedDates = Array.from(groupedEntries.keys()).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Calculate overall total
  const overallTotal = calculateTotalDuration(mockTimeEntries)

  // Empty state
  if (mockTimeEntries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-card-foreground">Daily Log</h2>
          <p className="text-sm text-muted-foreground">
            No time entries recorded yet
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      {/* Header with overall total */}
      <div className="rounded-lg border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Daily Log</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your time entries across days
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-muted-foreground">Total Time</div>
            <div className="font-mono text-3xl font-bold tabular-nums text-card-foreground">
              {formatDuration(overallTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Daily entries grouped by date */}
      <div className="flex flex-col gap-6">
        {sortedDates.map((date) => {
          const entries = groupedEntries.get(date) || []
          const dayTotal = calculateTotalDuration(entries)

          return (
            <Card key={date} className="overflow-hidden">
              <CardHeader className="bg-secondary/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {formatDateRelative(date)}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-xs font-medium text-muted-foreground">Day Total</div>
                    <div className="font-mono text-lg font-semibold tabular-nums">
                      {formatDuration(dayTotal)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between gap-4 rounded-md border bg-card p-4 transition-colors hover:bg-secondary/20"
                      role="listitem"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-card-foreground">
                          {entry.description}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold tabular-nums text-card-foreground">
                          {formatDuration(entry.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
