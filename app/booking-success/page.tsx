"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Clock, MapPin, Phone, Navigation } from "lucide-react"
import Link from "next/link"
import { AnimatedSection } from "@/components/animated-section"
import { useToast } from "@/hooks/use-toast"

export default function BookingSuccessPage() {
  const { toast } = useToast()

  const handleTrackAmbulance = () => {
    // In a real app, this would redirect to Google Maps with the driver's location
    // For now, we'll just show a toast message
    toast({
      title: "Driver Arrived",
      description: "Your ambulance driver has arrived at your location.",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <AnimatedSection>
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-green-400 opacity-75"></div>
                <CheckCircle className="relative h-16 w-16 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Ambulance Booked Successfully</CardTitle>
            <CardDescription>An ambulance has been dispatched to your location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-red-600" />
                <span className="text-lg font-bold text-red-600">ETA: 8-10 minutes</span>
              </div>

              <div className="flex items-center mb-4 p-3 bg-white rounded-lg">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ambulance en route from</p>
                  <p className="text-sm font-medium">City Hospital (2.4 km away)</p>
                </div>
              </div>

              <div className="flex items-center mb-4 p-3 bg-white rounded-lg">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Driver contact</p>
                  <p className="text-sm font-medium">Rahul S. • +91 98765 43210</p>
                </div>
              </div>

              <h3 className="font-medium text-green-800 mb-2">What to do while waiting:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Stay with the patient and keep them calm
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  If possible, send someone to the main road to guide the ambulance
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Keep the patient's airway clear and apply pressure to any bleeding
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Do not give food or water to the patient
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Emergency Contact</h3>
              <p className="text-sm text-gray-700">
                If the situation worsens or you need immediate assistance, call emergency services directly:
              </p>
              <p className="text-xl font-bold text-red-600 mt-2 text-center">108</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleTrackAmbulance}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
            >
              <Navigation className="mr-2 h-4 w-4" /> Track Ambulance
            </Button>

            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-[1.02]">
                <Home className="mr-2 h-4 w-4" /> Return to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  )
}
