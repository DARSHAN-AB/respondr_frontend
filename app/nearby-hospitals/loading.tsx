import { Loader2, MapPin } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <Loader2 className="animate-spin text-red-600 w-16 h-16" />
          <MapPin className="absolute top-1/4 left-1/4 w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">
          Searching for the nearest hospitals...
        </h2>
        <p className="text-gray-500 text-center max-w-xs">
          Please wait while we fetch hospitals near your location. Make sure location services are enabled.
        </p>
      </div>
    </div>
  )
}
