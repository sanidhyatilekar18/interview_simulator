"use client"

import { useEffect, useState } from "react"

interface Props {
  durationSeconds: number
  onTimeUp: () => void
}

export default function InterviewTimer({ durationSeconds, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!triggered) {
        setTriggered(true)
        onTimeUp()
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, triggered, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 60
  const isDanger = timeLeft <= 30
  const progress = (timeLeft / durationSeconds) * 100

  return (
    <div
      className={`sticky top-4 z-10 rounded-xl p-4 border shadow-sm transition-colors ${
        isDanger
          ? "bg-red-50 border-red-200"
          : isWarning
          ? "bg-yellow-50 border-yellow-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-medium ${
            isDanger
              ? "text-red-600"
              : isWarning
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {isDanger ? "⚠️ Time almost up!" : isWarning ? "⏳ Hurry up!" : "⏱️ Time Remaining"}
        </span>
        <span
          className={`text-2xl font-bold font-mono ${
            isDanger
              ? "text-red-600"
              : isWarning
              ? "text-yellow-600"
              : "text-gray-800"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${
            isDanger
              ? "bg-red-500"
              : isWarning
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}