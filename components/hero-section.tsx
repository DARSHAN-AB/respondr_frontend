"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-red-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="container px-4 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div
                className={`inline-block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Emergency Response Reimagined
              </div>
              <h1
                className={`text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 transition-all duration-1000 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                When <span className="text-red-600">Every Second</span> Makes a Difference
              </h1>
              <p
                className={`max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed transition-all duration-1000 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Respondr connects you directly to emergency services with real-time ambulance tracking and seamless request handling.
              </p>
            </div>
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <div
              className={`flex items-center space-x-4 transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex -space-x-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border-2 border-white">
                  <span className="text-xs font-medium text-gray-900">DA</span>
                </div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border-2 border-white">
                  <span className="text-xs font-medium text-gray-900">VV</span>
                </div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border-2 border-white">
                  <span className="text-xs font-medium text-gray-900">HK</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                On a mission to <span className="font-medium text-gray-900">modernize</span> emergency care.
              </div>
            </div>
          </div>
          <div
            className={`relative transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-300 rounded-full opacity-50"></div>

              {/* Main image */}
              <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src="./accident2.webp?height=600&width=800"
                    width={800}
                    height={600}
                    alt="Emergency response"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-3 rounded-xl shadow-lg animate-bounce-slow">
                <div className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-red-600"
                    >
                      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
                      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"></path>
                      <path d="M5 18v2"></path>
                      <path d="M19 18v2"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Ambulance ETA</p>
                    <p className="text-sm font-bold text-red-600">8 minutes</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 z-20 bg-white p-3 rounded-xl shadow-lg animate-pulse-slow">
                <div className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-600"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Report Sent</p>
                    <p className="text-sm font-bold text-green-600">Successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
