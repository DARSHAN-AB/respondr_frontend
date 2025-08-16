"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ value, duration = 2000, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

    const currentRef = countRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const end = value
    const incrementTime = duration / end
    let timer: NodeJS.Timeout

    const updateCount = () => {
      start += 1
      setCount(start)

      if (start < end) {
        timer = setTimeout(updateCount, incrementTime)
      }
    }

    timer = setTimeout(updateCount, incrementTime)

    return () => clearTimeout(timer)
  }, [value, duration, isVisible])

  return (
    <span ref={countRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
