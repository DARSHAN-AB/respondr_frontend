"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { AlertTriangle, Ambulance, CheckCircle, Clock, MapPin, Calendar, Info, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserReports, getUserBookings } from "@/lib/api"
import { useRouter } from "next/navigation"

// Define report types
interface Report {
  id: string
  type: "incident" | "ambulance"
  status: "pending" | "in-progress" | "completed" | "cancelled" | "dispatched"
  date: string
  time: string
  location: string
  description: string
  emergencyType?: string
  responderId?: string
  responderName?: string
  estimatedArrival?: string
  createdAt: string
  updatedAt: string
}

export default function MyReportsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Fetch both incident reports and ambulance bookings
        const [incidentReports, ambulanceBookings] = await Promise.all([getUserReports(token), getUserBookings(token)])

        // Transform and combine the data
        const transformedReports: Report[] = [
          ...incidentReports.map((report: any) => ({
            id: report.id,
            type: "incident" as const,
            status: report.status,
            date: new Date(report.created_at).toLocaleDateString(),
            time: new Date(report.created_at).toLocaleTimeString(),
            location: report.location,
            description: report.description,
            emergencyType: report.incident_type,
            responderId: report.responder_id,
            responderName: report.responder_name,
            estimatedArrival: report.estimated_arrival,
            createdAt: report.created_at,
            updatedAt: report.updated_at,
          })),
          ...ambulanceBookings.map((booking: any) => ({
            id: booking.id,
            type: "ambulance" as const,
            status: booking.status,
            date: new Date(booking.created_at).toLocaleDateString(),
            time: new Date(booking.created_at).toLocaleTimeString(),
            location: `${booking.pickup_latitude}, ${booking.pickup_longitude}`,
            description: booking.additional_info || `Emergency transport for ${booking.patient_name}`,
            emergencyType: booking.emergency_type,
            responderId: booking.driver_id,
            responderName: booking.driver_name,
            estimatedArrival: booking.estimated_arrival,
            createdAt: booking.created_at,
            updatedAt: booking.updated_at,
          })),
        ]

        // Sort by creation date (newest first)
        transformedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setReports(transformedReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast({
          title: "Error",
          description: "Failed to load your reports. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [token, toast])

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "incident":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "ambulance":
        return <Ambulance className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-red-600" />
    }
  }

  const renderReportCard = (report: Report) => (
    <Card key={report.id} className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-red-50 p-6 flex items-center justify-center md:w-1/6">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              {getTypeIcon(report.type)}
            </div>
          </div>
          <div className="p-6 md:w-5/6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {report.type === "incident" ? "Incident Report" : "Ambulance Booking"}
                  {report.emergencyType && ` - ${report.emergencyType}`}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {report.date} at {report.time}
                  </span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">{getStatusBadge(report.status)}</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2" />
                <span>{report.location}</span>
              </div>
              <p className="text-gray-700">{report.description}</p>
            </div>

            {report.status !== "pending" && report.responderName && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                    <div>
                      <p className="font-medium">{report.responderName}</p>
                      <p className="text-sm text-gray-500">Responder ID: {report.responderId}</p>
                    </div>
                  </div>
                  {report.status === "in-progress" && report.estimatedArrival && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="text-blue-600 font-medium">ETA: {report.estimatedArrival}</span>
                    </div>
                  )}
                  {report.status === "completed" && (
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <div className="flex justify-end w-full gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          {report.status === "pending" && (
            <Button variant="destructive" size="sm">
              Cancel
            </Button>
          )}
          {report.status === "completed" && (
            <Button variant="outline" size="sm">
              Leave Feedback
            </Button>
          )}
          {report.type === "ambulance" && (report.status === "in-progress" || report.status === "dispatched") && (
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push(`/track-ambulance?id=${report.id}`)}
            >
              Track Ambulance
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )

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
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">My Reports</h1>
                <p className="text-gray-500 mt-1">View and manage your emergency reports and ambulance bookings</p>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="incidents">Incidents</TabsTrigger>
                  <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading your reports...</span>
                      </div>
                    </div>
                  ) : reports.length > 0 ? (
                    <div className="space-y-4">{reports.map(renderReportCard)}</div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Info className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                        <p className="text-gray-500 mb-4">
                          You haven't made any emergency reports or ambulance bookings yet.
                        </p>
                        <div className="flex justify-center gap-4">
                          <Button variant="default" className="bg-red-600 hover:bg-red-700">
                            Report Incident
                          </Button>
                          <Button variant="outline">Book Ambulance</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="incidents">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading incident reports...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.filter((r) => r.type === "incident").map(renderReportCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ambulance">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading ambulance bookings...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.filter((r) => r.type === "ambulance").map(renderReportCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="active">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading active reports...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports
                        .filter((r) => r.status === "in-progress" || r.status === "pending")
                        .map(renderReportCard)}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}