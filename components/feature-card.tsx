"use client"

import { useRef, useEffect, useState } from "react"
import { Brain, Clock, MapPin } from "lucide-react"

interface FeatureCardProps {
  icon: "brain" | "clock" | "map-pin"
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 1000)
        }
      },
      {
        threshold: 0.1,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay])

  const renderIcon = () => {
    switch (icon) {
      case "brain":
        return <Brain className="h-6 w-6 text-red-600" />
      case "clock":
        return <Clock className="h-6 w-6 text-red-600" />
      case "map-pin":
        return <MapPin className="h-6 w-6 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">{renderIcon()}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}
