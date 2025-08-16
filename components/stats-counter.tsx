"use client"

import { useRef, useEffect, useState } from "react"

export function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <CounterItem value={45} suffix="%" label="Projected Faster Response Time" isVisible={isVisible} delay={0} />
      <CounterItem value={98} suffix="%" label="Accurate Location Detection" isVisible={isVisible} delay={0.5} />
      <CounterItem value={300} suffix="+" label="Incidents Simulated & Tested" isVisible={isVisible} delay={1} />
    </div>
  )
}

interface CounterItemProps {
  value: number
  suffix: string
  label: string
  isVisible: boolean
  delay: number
}

function CounterItem({ value, suffix, label, isVisible, delay }: CounterItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const end = value
    const duration = 2000
    const incrementTime = duration / end
    let timer: NodeJS.Timeout

    const startCounting = () => {
      setTimeout(() => {
        const updateCount = () => {
          start += 1
          setCount(start)

          if (start < end) {
            timer = setTimeout(updateCount, incrementTime)
          }
        }

        timer = setTimeout(updateCount, incrementTime)
      }, delay * 1000)
    }

    startCounting()

    return () => clearTimeout(timer)
  }, [value, isVisible, delay])

  return (
    <div className={`space-y-2 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <h3 className="text-4xl font-bold text-red-600">
        {count}
        {suffix}
      </h3>
      <p className="text-gray-700">{label}</p>
    </div>
  )
}
