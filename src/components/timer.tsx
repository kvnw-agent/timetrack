"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Save } from "lucide-react"
import { useTimeEntries } from "@/hooks/useTimeEntries"

interface TimerProps {}

export function Timer({}: TimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const sessionStartRef = useRef<number | null>(null)
  const accumulatedSecondsRef = useRef(0)
  
  const { addEntry } = useTimeEntries()

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      if (sessionStartRef.current === null) {
        sessionStartRef.current = Date.now()
      }
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setSeconds(accumulatedSecondsRef.current + elapsedSeconds)
        }
      }, 100)
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

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }, [])

  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const handleSaveAndReset = useCallback(() => {
    if (seconds > 0 && sessionStartRef.current) {
      addEntry({
        startTime: sessionStartRef.current,
        endTime: Date.now(),
        duration: seconds,
      })
    }
    setIsRunning(false)
    setSeconds(0)
    accumulatedSecondsRef.current = 0
    startTimeRef.current = null
    sessionStartRef.current = null
  }, [seconds, addEntry])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
    accumulatedSecondsRef.current = 0
    startTimeRef.current = null
    sessionStartRef.current = null
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-8">
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
              onClick={handleSaveAndReset}
              className="min-w-[120px]"
              disabled={seconds === 0}
              aria-label="Save entry and reset timer"
            >
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Save
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={handleReset}
              disabled={seconds === 0}
              aria-label="Reset timer without saving"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
