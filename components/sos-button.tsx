"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SOSButtonProps {
  onClick: () => void
  className?: string
}

export function SOSButton({ onClick, className }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [pulseCount, setPulseCount] = useState(0)

  const handlePress = () => {
    setIsPressed(true)
    setPulseCount((prev) => prev + 1)

    // Add a small delay for the animation effect
    setTimeout(() => {
      setIsPressed(false)
      onClick()
    }, 300)
  }

  return (
    <button
      onClick={handlePress}
      className={cn(
        "relative w-full h-32 rounded-lg bg-red-600 text-white font-bold text-2xl shadow-lg transition-all duration-300",
        "hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300",
        "active:scale-95 active:bg-red-800",
        isPressed ? "scale-95 bg-red-800" : "",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Multiple pulse rings for enhanced effect */}
        <div className="absolute w-24 h-24 rounded-full bg-red-500 animate-ping opacity-75" />
        <div className="absolute w-32 h-32 rounded-full bg-red-400 animate-pulse opacity-50" />
        <div className="absolute w-40 h-40 rounded-full bg-red-300 animate-pulse opacity-30" />

        {/* Ripple effect on click */}
        {Array.from({ length: pulseCount }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full rounded-lg bg-white opacity-30 animate-ripple"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: "1s",
            }}
          />
        ))}

        <div className="flex flex-col items-center justify-center z-10">
          <AlertTriangle className="h-10 w-10 mb-2 animate-pulse" />
          <span className="tracking-wider">SOS</span>
        </div>
      </div>
    </button>
  )
}
