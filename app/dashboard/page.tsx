"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Camera, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SOSButton } from "@/components/sos-button"
import { useToast } from "@/hooks/use-toast"

// ✅ Dynamically load MapView on client side only
import dynamic from "next/dynamic"
const MapView = dynamic(() => import("@/components/map-view"), { ssr: false })

export default function DashboardPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get user's location when the dashboard loads
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocating(false)
          toast({
            title: "Location detected",
            description: "Your current location has been successfully detected.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Unable to get your location. Please enable location services.",
          })
        },
      )
    }

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast])

  const handleSOS = () => {
    router.push("/report-incident")
  }

  const handleBookAmbulance = () => {
    router.push("/book-ambulance")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4 text-red-600" />
                  <span className="hidden md:inline">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-6">
            {showWelcome && (
              <div className="mb-6 bg-white rounded-lg border border-gray-100 shadow-sm p-4 animate-fade-in-down">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Welcome to Respondr</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      In case of emergency, press the SOS button to immediately report an incident.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
              <Card className="lg:col-span-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 h-[500px]">
                <CardContent className="p-0 h-full">
                  <MapView location={location} isLocating={isLocating} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <SOSButton onClick={handleSOS} />

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Camera className="h-12 w-12 text-red-600" />
                      <div>
                        <h3 className="font-medium text-lg">Report Incident</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Take a photo and report an incident to emergency services
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push("/report-incident")}
                        className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                      >
                        Report Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <AlertTriangle className="h-12 w-12 text-red-600" />
                      <div>
                        <h3 className="font-medium text-lg">Book Ambulance</h3>
                        <p className="text-sm text-gray-600 mt-1">Request an ambulance to your current location</p>
                      </div>
                      <Button
                        onClick={handleBookAmbulance}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 hover:scale-105"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
