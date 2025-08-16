"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getNearbyHospitals } from "@/lib/api"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  Ambulance,
  Heart,
  Navigation,
  Filter,
  ChevronDown,
  Stethoscope,
  Pill,
  Thermometer,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Define hospital interface
interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  distance: string
  rating: number
  hours: string
  emergency: boolean
  specialties: string[]
  image: string
  latitude: number
  longitude: number
}

export default function NearbyHospitalsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user's location and fetch nearby hospitals
    const fetchHospitals = async () => {
      setIsLoading(true)
      try {
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              setUserLocation(location)

              // Fetch nearby hospitals using real data
              const hospitalData = await getNearbyHospitals(location.lat, location.lng, 10000) // 10km radius
              setHospitals(hospitalData)
              setFilteredHospitals(hospitalData)
            },
            (error) => {
              console.error("Error getting location:", error)
              toast({
                title: "Location error",
                description: "Unable to get your location. Showing default hospitals.",
                variant: "destructive",
              })

              // Use default location (e.g., city center) if geolocation fails
              const defaultLocation = { lat: 37.7749, lng: -122.4194 } // San Francisco
              setUserLocation(defaultLocation)
              fetchHospitalsForLocation(defaultLocation.lat, defaultLocation.lng)
            },
          )
        } else {
          // Geolocation not supported
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }
          setUserLocation(defaultLocation)
          fetchHospitalsForLocation(defaultLocation.lat, defaultLocation.lng)
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error)
        toast({
          title: "Error",
          description: "Failed to load nearby hospitals. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchHospitalsForLocation = async (lat: number, lng: number) => {
      try {
        const hospitalData = await getNearbyHospitals(lat, lng, 10000)
        setHospitals(hospitalData)
        setFilteredHospitals(hospitalData)
      } catch (error) {
        console.error("Error fetching hospitals for location:", error)
      }
    }

    fetchHospitals()
  }, [toast])

  // Filter hospitals based on search query and emergency filter
  useEffect(() => {
    let filtered = hospitals

    if (searchQuery) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (showEmergencyOnly) {
      filtered = filtered.filter((hospital) => hospital.emergency)
    }

    setFilteredHospitals(filtered)
  }, [searchQuery, showEmergencyOnly, hospitals])

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Get specialty icon
  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes("Emergency")) return <Ambulance className="h-4 w-4" />
    if (specialty.includes("Cardiology") || specialty.includes("Heart")) return <Heart className="h-4 w-4" />
    if (specialty.includes("Medicine") || specialty.includes("Health")) return <Stethoscope className="h-4 w-4" />
    if (specialty.includes("Pharmacy") || specialty.includes("Drug")) return <Pill className="h-4 w-4" />
    return <Thermometer className="h-4 w-4" />
  }

  // Open directions in Google Maps
  const openDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.latitude},${hospital.longitude}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(hospital.address)}`
      window.open(url, "_blank")
    }
  }

  // Call hospital
  const callHospital = (phone: string) => {
    if (phone && phone !== "Phone not available") {
      window.location.href = `tel:${phone}`
    } else {
      toast({
        title: "Phone not available",
        description: "Phone number is not available for this hospital.",
        variant: "destructive",
      })
    }
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
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-5xl mx-auto ml-8">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="mb-2 transition-all duration-300 hover:scale-105"
                  onClick={() => router.push("/dashboard")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold">Nearby Hospitals</h1>
                <p className="text-gray-500 mt-1">Find hospitals and medical facilities near your location</p>
              </div>

              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search hospitals, specialties, or locations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className={showEmergencyOnly ? "bg-red-50 text-red-600 border-red-200" : ""}
                    onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                  >
                    <Ambulance className="mr-2 h-4 w-4" />
                    Emergency Only
                  </Button>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading nearby hospitals...</span>
                  </div>
                </div>
              ) : filteredHospitals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredHospitals.map((hospital) => (
                    <Card key={hospital.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-48 relative">
                            <img
                              src={hospital.image || "/placeholder.svg"}
                              alt={hospital.name}
                              className="w-full h-full object-cover"
                            />
                            {hospital.emergency && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-red-600">24/7 Emergency</Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-semibold">{hospital.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{hospital.address}</span>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 mr-2">
                                  {hospital.distance}
                                </Badge>
                                {renderRating(hospital.rating)}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 my-3">
                              {hospital.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {getSpecialtyIcon(specialty)}
                                  {specialty}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{hospital.phone}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{hospital.hours}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => callHospital(hospital.phone)}
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </Button>
                              <Button variant="outline" onClick={() => openDirections(hospital)}>
                                <Navigation className="mr-2 h-4 w-4" />
                                Directions
                              </Button>
                              <Button variant="outline">
                                <Ambulance className="mr-2 h-4 w-4" />
                                Book Ambulance
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Hospitals Found</h3>
                    <p className="text-gray-500 mb-4">We couldn't find any hospitals matching your search criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setShowEmergencyOnly(false)
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}