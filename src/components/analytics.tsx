"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TimeEntry } from "@/components/daily-log"

// Helper function to format duration as hours (e.g., "5.5h")
function formatDurationHours(milliseconds: number): string {
  const hours = milliseconds / (1000 * 60 * 60)
  return `${hours.toFixed(1)}h`
}

// Helper function to get last 7 days as date strings
function getLast7Days(): string[] {
  const days: string[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    days.push(dateStr)
  }

  return days
}

// Helper function to format weekday (e.g., "Mon", "Tue")
function formatWeekday(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

// Helper function to format date as "Mon 2/15"
function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${weekday} ${month}/${day}`
}

// Helper function to group entries by date and calculate daily hours
function calculateDailyHours(entries: TimeEntry[]): Map<string, number> {
  const dailyHours = new Map<string, number>()

  entries.forEach((entry) => {
    const existing = dailyHours.get(entry.date) || 0
    dailyHours.set(entry.date, existing + entry.duration)
  })

  return dailyHours
}

// Helper function to calculate weekly statistics
function calculateWeeklyStats(entries: TimeEntry[], last7Days: string[]) {
  // Filter entries for the last 7 days
  const weekEntries = entries.filter(entry => last7Days.includes(entry.date))

  // Calculate total hours
  const totalMs = weekEntries.reduce((sum, entry) => sum + entry.duration, 0)
  const totalHours = totalMs / (1000 * 60 * 60)

  // Calculate daily hours
  const dailyHours = calculateDailyHours(weekEntries)

  // Calculate average (only counting days with entries)
  const daysWithEntries = dailyHours.size
  const avgHours = daysWithEntries > 0 ? totalHours / daysWithEntries : 0

  // Find most productive day
  let mostProductiveDay = ""
  let maxHours = 0
  dailyHours.forEach((hours, date) => {
    if (hours > maxHours) {
      maxHours = hours
      mostProductiveDay = date
    }
  })

  const mostProductiveDayFormatted = mostProductiveDay
    ? formatWeekday(mostProductiveDay)
    : "N/A"

  return {
    totalHours,
    avgHours,
    mostProductiveDay: mostProductiveDayFormatted,
    totalEntries: weekEntries.length,
    dailyHours,
  }
}

// Mock data for demonstration (same pattern as daily-log)
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
  {
    id: "9",
    description: "Sprint planning",
    startTime: new Date("2026-02-12T09:00:00"),
    endTime: new Date("2026-02-12T11:00:00"),
    duration: 120 * 60 * 1000, // 2 hours
    date: "2026-02-12",
  },
  {
    id: "10",
    description: "Feature implementation",
    startTime: new Date("2026-02-12T13:00:00"),
    endTime: new Date("2026-02-12T17:00:00"),
    duration: 240 * 60 * 1000, // 4 hours
    date: "2026-02-12",
  },
  {
    id: "11",
    description: "Database optimization",
    startTime: new Date("2026-02-11T10:00:00"),
    endTime: new Date("2026-02-11T13:00:00"),
    duration: 180 * 60 * 1000, // 3 hours
    date: "2026-02-11",
  },
  {
    id: "12",
    description: "Team sync",
    startTime: new Date("2026-02-11T15:00:00"),
    endTime: new Date("2026-02-11T16:00:00"),
    duration: 60 * 60 * 1000, // 1 hour
    date: "2026-02-11",
  },
  {
    id: "13",
    description: "Research and planning",
    startTime: new Date("2026-02-10T09:00:00"),
    endTime: new Date("2026-02-10T12:00:00"),
    duration: 180 * 60 * 1000, // 3 hours
    date: "2026-02-10",
  },
  {
    id: "14",
    description: "Code refactoring",
    startTime: new Date("2026-02-10T14:00:00"),
    endTime: new Date("2026-02-10T17:30:00"),
    duration: 210 * 60 * 1000, // 3.5 hours
    date: "2026-02-10",
  },
]

// Weekly Hours Chart Component
function WeeklyHoursChart({ last7Days, dailyHours }: {
  last7Days: string[],
  dailyHours: Map<string, number>
}) {
  // Calculate chart dimensions
  const chartWidth = 600
  const chartHeight = 300
  const padding = { top: 20, right: 20, bottom: 60, left: 60 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate max hours for scaling
  const maxHours = Math.max(
    ...last7Days.map(date => (dailyHours.get(date) || 0) / (1000 * 60 * 60)),
    1 // minimum of 1 to avoid division by zero
  )

  // Round up to nearest whole number for cleaner y-axis
  const yAxisMax = Math.ceil(maxHours)

  // Bar width calculation
  const barWidth = innerWidth / last7Days.length * 0.7
  const barSpacing = innerWidth / last7Days.length

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label="Weekly hours bar chart showing time tracked over the last 7 days"
      >
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].filter(h => h <= yAxisMax).map((hours) => {
          const y = padding.top + innerHeight - (hours / yAxisMax) * innerHeight
          return (
            <g key={hours}>
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
              <text
                x={padding.left - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                {hours}h
              </text>
              {/* Grid line */}
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border opacity-30"
                strokeDasharray="2,2"
              />
            </g>
          )
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + innerHeight}
          x2={chartWidth - padding.right}
          y2={padding.top + innerHeight}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + innerHeight}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />

        {/* Bars */}
        {last7Days.map((date, index) => {
          const hours = (dailyHours.get(date) || 0) / (1000 * 60 * 60)
          const barHeight = (hours / yAxisMax) * innerHeight
          const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2
          const y = padding.top + innerHeight - barHeight

          return (
            <g key={date}>
              {/* Bar with gradient */}
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" className="text-primary" stopColor="currentColor" stopOpacity="0.8" />
                  <stop offset="100%" className="text-primary" stopColor="currentColor" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#gradient-${index})`}
                className="transition-opacity hover:opacity-80"
                rx="4"
              />

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + innerHeight + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {formatWeekday(date)}
              </text>
              <text
                x={x + barWidth / 2}
                y={padding.top + innerHeight + 35}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {new Date(date).getDate()}
              </text>

              {/* Value label on top of bar */}
              {hours > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-card-foreground text-xs font-semibold"
                >
                  {hours.toFixed(1)}
                </text>
              )}
            </g>
          )
        })}

        {/* Y-axis label */}
        <text
          x={20}
          y={chartHeight / 2}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-medium"
          transform={`rotate(-90, 20, ${chartHeight / 2})`}
        >
          Hours
        </text>
      </svg>
    </div>
  )
}

export default function Analytics() {
  const last7Days = getLast7Days()
  const stats = calculateWeeklyStats(mockTimeEntries, last7Days)

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      {/* Header */}
      <div className="rounded-lg border bg-card p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-card-foreground">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Weekly productivity insights and time tracking statistics
        </p>
      </div>

      {/* Weekly Hours Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyHoursChart last7Days={last7Days} dailyHours={stats.dailyHours} />
        </CardContent>
      </Card>

      {/* Productivity Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hours (Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold tabular-nums text-card-foreground">
              {stats.totalHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Daily Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold tabular-nums text-card-foreground">
              {stats.avgHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Productive Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">
              {stats.mostProductiveDay}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold tabular-nums text-card-foreground">
              {stats.totalEntries}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
