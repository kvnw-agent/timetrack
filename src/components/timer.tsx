"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

export default function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Handler functions with useCallback to prevent recreation on every render
  const handleStart = useCallback(() => {
    setIsRunning(true)
  }, [])

  const handleStop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setTime(0)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Spacebar for start/stop
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        if (isRunning) {
          handleStop()
        } else {
          handleStart()
        }
      }
      // R key for reset (when not running)
      if (e.code === "KeyR" && e.target === document.body && !isRunning) {
        e.preventDefault()
        handleReset()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isRunning, handleStart, handleStop, handleReset])

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-lg border bg-card p-8 shadow-lg">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-card-foreground">Timer</h2>
        <p className="text-sm text-muted-foreground">
          Keyboard shortcuts: Space to start/stop, R to reset
        </p>
      </div>

      <div
        className="rounded-md bg-secondary px-6 py-4"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="font-mono text-5xl font-bold tabular-nums text-secondary-foreground">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleStart}
          disabled={isRunning}
          variant="default"
          size="lg"
          aria-label={isRunning ? "Timer is running" : "Start timer"}
        >
          Start
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isRunning}
          variant="secondary"
          size="lg"
          aria-label={isRunning ? "Stop timer" : "Timer is stopped"}
        >
          Stop
        </Button>
        <Button
          onClick={handleReset}
          disabled={isRunning}
          variant="outline"
          size="lg"
          aria-label={time === 0 ? "Timer is at zero" : "Reset timer to zero"}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
