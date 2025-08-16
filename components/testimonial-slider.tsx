"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "We believe emergency services should be just one tap away — no waiting, no confusion, no delay.",
    name: "Team Respondr",
    title: "Vision",
    avatar: "/secondry logo.png",
  },
  {
    quote:
      "Our team is building Respondr to empower everyday people in crisis with faster help and peace of mind.",
    name: "Founders' Note",
    title: "What We Stand For",
    avatar: "/darshan.jpg",
  },
  {
    quote:
      "This is just the beginning — we're working towards smarter systems, better coverage, and truly inclusive access.",
    name: "Road Ahead",
    title: "Future Goals",
    avatar: "/secondry logo.png",
  },
]


export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <svg
                      className="absolute -top-6 -left-6 h-12 w-12 text-red-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.032-.52.112-1.01.24-.496.128-.94.216-1.33.264L4.868 10.01c.8-.368 1.547-.692 2.25-.973.704-.282 1.32-.506 1.855-.07.53.428.983.817 1.36 1.166.378.35.685.667.923.953.237.286.443.483.615.6.172.12.33.183.467.2.138.012.277.02.415.02.496.008.914-.104 1.254-.337.34-.234.638-.54.888-.922.416-.643.625-1.498.625-2.563 0-.86-.148-1.598-.443-2.217-.295-.618-.722-1.1-1.276-1.443-.555-.345-1.228-.517-2.02-.517-.774 0-1.484.17-2.13.513-.645.342-1.176.84-1.59 1.5-.413.658-.62 1.418-.62 2.28 0 .176.03.432.088.764.06.332.15.663.27.992.122.33.252.63.392.894.14.265.255.45.348.55.56.08.21.113.467.113-.56.016-.2.025-.437.025-.56 0-.157-.015-.3-.043-.143-.028-.29-.078-.438-.15-.148-.072-.3-.17-.455-.294-.156-.125-.3-.27-.435-.435-.135-.165-.248-.344-.34-.535-.09-.19-.153-.384-.19-.58-.36-.195-.055-.384-.055-.566 0-.862.21-1.656.63-2.38.42-.726 1.004-1.302 1.752-1.73.748-.428 1.606-.642 2.574-.642 1.048 0 1.956.214 2.723.64.768.428 1.358 1.01 1.77 1.745.414.734.62 1.574.62 2.518 0 .855-.148 1.625-.445 2.31-.297.683-.713 1.223-1.246 1.62-.534.395-1.15.592-1.84.592-.352 0-.668-.04-.946-.12-.278-.08-.54-.193-.788-.338-.248-.145-.455-.34-.62-.58-.165-.243-.292-.534-.38-.873-.09-.338-.148-.735-.177-1.19-.03-.453-.044-.94-.044-1.46v-.256zm-6.56 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.032-.52.112-1.01.24-.496.128-.94.216-1.33.264L-1.792 10.01c.8-.368 1.547-.692 2.25-.973.704-.282 1.32-.506 1.855-.07.53.428.983.817 1.36 1.166.378.35.685.667.923.953.237.286.443.483.615.6.172.12.33.183.467.2.138.012.277.02.415.02.496.008.914-.104 1.254-.337.34-.234.638-.54.888-.922.416-.643.625-1.498.625-2.563 0-.86-.148-1.598-.443-2.217-.295-.618-.722-1.1-1.276-1.443-.555-.345-1.228-.517-2.02-.517-.774 0-1.484.17-2.13.513-.645.342-1.176.84-1.59 1.5-.413.658-.62 1.418-.62 2.28 0 .176.03.432.088.764.06.332.15.663.27.992.122.33.252.63.392.894.14.265.255.45.348.55.56.08.21.113.467.113-.56.016-.2.025-.437.025-.56 0-.157-.015-.3-.043-.143-.028-.29-.078-.438-.15-.148-.072-.3-.17-.455-.294-.156-.125-.3-.27-.435-.435-.135-.165-.248-.344-.34-.535-.09-.19-.153-.384-.19-.58-.36-.195-.055-.384-.055-.566 0-.862.21-1.656.63-2.38.42-.726 1.004-1.302 1.752-1.73.748-.428 1.606-.642 2.574-.642 1.048 0 1.956.214 2.723.64.768.428 1.358 1.01 1.77 1.745.414.734.62 1.574.62 2.518 0 .855-.148 1.625-.445 2.31-.297.683-.713 1.223-1.246 1.62-.534.395-1.15.592-1.84.592-.352 0-.668-.04-.946-.12-.278-.08-.54-.193-.788-.338-.248-.145-.455-.34-.62-.58-.165-.243-.292-.534-.38-.873-.09-.338-.148-.735-.177-1.19-.03-.453-.044-.94-.044-1.46v-.256z" />
                    </svg>
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed">
                      {testimonial.quote}
                    </blockquote>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden mb-3">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm opacity-80">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}