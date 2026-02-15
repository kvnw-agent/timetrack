"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

// Component props interface for future extensibility
interface TimerProps {}

export function Timer({}: TimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedSecondsRef = useRef(0)

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

  // Memoized handlers to prevent recreation on every render
  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  // Reset button stops the timer AND clears it to 00:00:00
  const handleReset = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
    accumulatedSecondsRef.current = 0
    startTimeRef.current = null
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
      </CardContent>
    </Card>
  )
}
