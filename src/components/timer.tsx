"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl font-mono font-bold tabular-nums">
            {formatTime(time)}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleStartStop}
              variant={isRunning ? "destructive" : "default"}
              size="lg"
              className="min-w-24"
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="min-w-24"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
