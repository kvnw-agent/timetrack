"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useTimeEntries } from "@/hooks/useTimeEntries"

// Component props interface for future extensibility
interface TimerProps {}

export function Timer({}: TimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedSecondsRef = useRef(0)
  const sessionStartTimeRef = useRef<number | null>(null)

  const { entries, addEntry, deleteEntry, clearEntries } = useTimeEntries()

  // Improved timer accuracy using Date.now() differential timing to prevent drift
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setSeconds(accumulatedSecondsRef.current + elapsedSeconds)
        }
      }, 100) // Update more frequently for smoother display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (startTimeRef.current !== null) {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        accumulatedSecondsRef.current += elapsedSeconds
        startTimeRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Memoized formatTime function to prevent recreation on every render
  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }, [])

  const formatDateTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }, [])

  // Memoized handlers to prevent recreation on every render
  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => {
      if (!prev) {
        // Starting the timer - record session start time
        sessionStartTimeRef.current = Date.now()
      } else {
        // Stopping the timer - save entry if there's meaningful time
        if (sessionStartTimeRef.current && seconds > 0) {
          const endTime = Date.now()
          addEntry({
            startTime: sessionStartTimeRef.current,
            endTime,
            duration: seconds,
          })
        }
        sessionStartTimeRef.current = null
      }
      return !prev
    })
  }, [seconds, addEntry])

  // Reset button stops the timer AND clears it to 00:00:00
  // Does NOT save the session - only Stop saves sessions
  const handleReset = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
    accumulatedSecondsRef.current = 0
    startTimeRef.current = null
    sessionStartTimeRef.current = null
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-8">
          {/* Timer display with accessibility attributes */}
          <div
            className="text-6xl font-mono font-bold tracking-wider tabular-nums"
            role="timer"
            aria-live="polite"
            aria-label={`Timer display: ${formatTime(seconds)}`}
          >
            {formatTime(seconds)}
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleStartStop}
              className="min-w-[120px]"
              aria-label={isRunning ? "Stop timer" : "Start timer"}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" aria-hidden="true" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  Start
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="min-w-[120px]"
              disabled={seconds === 0}
              aria-label="Reset timer to zero"
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        {/* Time Entries History */}
        {entries.length > 0 && (
          <div className="mt-8 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Saved Sessions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEntries}
                aria-label="Clear all saved sessions"
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-2">
              {entries
                .slice()
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-mono font-bold">
                        {formatTime(entry.duration)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(entry.startTime)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      aria-label={`Delete session ${formatTime(entry.duration)}`}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
