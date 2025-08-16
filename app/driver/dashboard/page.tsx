"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bell, CheckCircle, X, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"
import VerificationDialog from "@/components/verification-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const MapView = dynamic(() => import("@/components/map-view").then((mod) => mod.default), {
  ssr: false,
})

export default function DriverDashboardPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [driverStatus, setDriverStatus] = useState<"available" | "busy" | "offline">("offline")
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"not_submitted" | "pending" | "accepted" | "rejected" | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // Fetch emergency alerts
    const fetchEmergencyAlerts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/emergency-alerts")
        if (!response.ok) {
          throw new Error("Failed to fetch emergency alerts")
        }
        const data = await response.json()
        
        // Check for duplicate IDs
        const idSet = new Set()
        data.notifications.forEach((notification: any) => {
          if (idSet.has(notification.id)) {
            console.warn(`Duplicate emergency alert ID found: ${notification.id}`)
          }
          idSet.add(notification.id)
        })

        setNotifications(data.notifications)
      } catch (error: any) {
        console.error("Error fetching emergency alerts:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load emergency alerts.",
        })
      }
    }

    fetchEmergencyAlerts()

    // Get user location
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
  }, [toast])

  const handleNotificationClick = (notification: any) => {
    setCurrentNotification(notification)
    setShowNotificationDialog(true)
  }

  const handleAcceptJob = async () => {
    // Check if driver is online
    if (driverStatus !== "available") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be online to accept jobs. Please go online first.",
      })
      setShowNotificationDialog(false)
      return
    }

    if (!user?.userId || !location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing user authentication or location.",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/driver/mark-busy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          latitude: location.lat,
          longitude: location.lng,
          reportId: currentNotification.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update busy status.")
      }

      setDriverStatus("busy")
      setNotifications((prev) =>
        prev.map((n) => (n.id === currentNotification.id ? { ...n, status: "accepted" } : n)),
      )
      setShowNotificationDialog(false)

      // Open Google Maps in a new tab with the report's coordinates
      const { lat, lng } = currentNotification.sender.location
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(googleMapsUrl, "_blank")

      toast({
        title: "Job Accepted",
        description: "You have accepted the emergency request. Google Maps has been opened with the location.",
      })
    } catch (error: any) {
      console.error("Error accepting job:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while accepting the job.",
      })
    }
  }

  const handleCompleteJob = async () => {
    if (!user?.userId || !currentNotification) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing user authentication or notification data.",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/driver/mark-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          emergencyId: currentNotification.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark job as completed.")
      }

      setDriverStatus("available")
      setNotifications((prev) =>
        prev.map((n) => (n.id === currentNotification.id ? { ...n, status: "Completed" } : n)),
      )
      setShowNotificationDialog(false)

      toast({
        title: "Job Completed",
        description: "The emergency job has been marked as completed. You are now available.",
      })
    } catch (error: any) {
      console.error("Error completing job:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while completing the job.",
      })
    }
  }

  const handleRejectJob = async () => {
    if (!user?.userId || !currentNotification) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing user authentication or notification data.",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/driver/reject-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergencyId: currentNotification.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject job.")
      }

      setShowNotificationDialog(false)
      setNotifications((prev) =>
        prev.map((n) => (n.id === currentNotification.id ? { ...n, status: "rejected" } : n)),
      )

      toast({
        title: "Job Rejected",
        description: "You have rejected the emergency request.",
      })
    } catch (error: any) {
      console.error("Error rejecting job:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while rejecting the job.",
      })
    }
  }

  const handleGoOnline = async () => {
    if (!user?.userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated. Please log in again.",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/verification-status/${user.userId}`)
      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Received non-JSON response from server (status: ${response.status})`)
      }

      const data = await response.json()

      if (response.ok) {
        const status = data.status
        setVerificationStatus(status)

        if (status === "accepted") {
          if (!location) {
            toast({
              title: "Location Missing",
              description: "Please allow location access to go online.",
              variant: "destructive",
            })
            return
          }

          const updateRes = await fetch("http://localhost:3001/api/driver/update-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.userId,
              latitude: location.lat,
              longitude: location.lng,
              status: "available",
            }),
          })

          if (!updateRes.ok) {
            throw new Error("Failed to update driver status.")
          }

          setDriverStatus("available")
          toast({
            title: "You are now Online",
            description: "You are marked as available for emergencies.",
          })
        } else {
          setShowVerificationDialog(true)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || `Failed to fetch verification status (status: ${response.status})`,
        })
      }
    } catch (error: any) {
      console.error("Error checking verification status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while checking verification status.",
      })
    }
  }

  const handleGoOffline = async () => {
    if (!user?.userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated. Please log in again.",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:3001/api/driver/go-offline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to set offline status (status: ${response.status})`)
      }

      setDriverStatus("offline")
      toast({
        title: "You are now Offline",
        description: "You will no longer receive emergency requests.",
      })
    } catch (error: any) {
      console.error("Error going offline:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while going offline.",
      })
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTimeSince = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    return `${diffHours} hours ago`
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <RoleSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr</h1>
              <Badge className="ml-2 bg-red-600">Driver Dashboard</Badge>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    driverStatus === "available"
                      ? "px-3 py-1 bg-green-100 text-green-800 border-green-200"
                      : driverStatus === "busy"
                      ? "px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "px-3 py-1 bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {driverStatus === "available" ? "Available" : driverStatus === "busy" ? "Busy" : "Offline"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (driverStatus === "available" ? handleGoOffline() : handleGoOnline())}
                  className={driverStatus === "busy" ? "opacity-50 cursor-not-allowed" : ""}
                  disabled={driverStatus === "busy"}
                >
                  {driverStatus === "available" ? "Go Offline" : "Go Online"}
                </Button>
              </div>
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4 text-red-600" />
                  <span className="hidden md:inline">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/driver/notifications")}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => n.status === "new").length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.filter((n) => n.status === "new").length}
                  </span>
                )}
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-red-100 text-red-600">{user?.name?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
              <Card className="lg:col-span-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 h-[500px] z-10">
                <CardContent className="p-0 h-full">
                  <MapView
                    location={location}
                    isLocating={isLocating}
                    dialogOpen={showVerificationDialog || showNotificationDialog}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>Emergency Alerts</span>
                      <Badge className="bg-red-500">{notifications.filter((n) => n.status === "new").length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">No emergency alerts</div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={
                              notification.status === "new"
                                ? "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-red-50 border-red-200"
                                : notification.status === "accepted"
                                ? "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-green-50 border-green-200"
                                : notification.status === "Completed"
                                ? "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-blue-50 border-blue-200"
                                : "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-gray-50 border-gray-200"
                            }
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium text-sm">{notification.sender.name}</h3>
                              <Badge
                                variant="outline"
                                className={
                                  notification.status === "new"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : notification.status === "accepted"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : notification.status === "Completed"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {notification.status === "new"
                                  ? "New"
                                  : notification.status === "accepted"
                                  ? "Accepted"
                                  : notification.status === "Completed"
                                  ? "Completed"
                                  : "Rejected"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">{getTimeSince(notification.timestamp)}</p>
                            <p className="text-sm mt-1 line-clamp-2">{notification.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Verification Status</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.role === "driver" ? "Complete your verification to accept jobs" : ""}
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push("/driver/verification")}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 hover:scale-105"
                      >
                        Complete Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle>Emergency Alert</DialogTitle>
            <DialogDescription>
              {currentNotification?.status === "accepted"
                ? "This job has been accepted. Mark it as completed when finished."
                : "A new emergency has been reported. Do you want to accept this job?"}
            </DialogDescription>
          </DialogHeader>

          {currentNotification && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={currentNotification.photoUrl || "/placeholder.svg"}
                  alt="Emergency"
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Reporter:</span>
                  <span className="text-sm">{currentNotification.sender.name}</span>
                </div>
                {currentNotification.sender.phone !== "N/A" && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Contact:</span>
                    <span className="text-sm">{currentNotification.sender.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Time:</span>
                  <span className="text-sm">{getTimeSince(currentNotification.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">
                    {currentNotification.sender.location.lat.toFixed(4)},
                    {currentNotification.sender.location.lng.toFixed(4)}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm mt-1">{currentNotification.description}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            {currentNotification?.status === "accepted" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNotificationDialog(false)}
                  className="border-gray-600 text-gray-600 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button type="button" onClick={handleCompleteJob} className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRejectJob}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button type="button" onClick={handleAcceptJob} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept Job
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VerificationDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
        verificationStatus={verificationStatus}
        onAction={(action: "cancel" | "submit") => {
          console.log("Verification dialog action:", action)
          setShowVerificationDialog(false)
          if (action === "submit") {
            router.push("/driver/verification")
          }
        }}
        onClose={() => {
          console.log("Verification dialog closed")
          setShowVerificationDialog(false)
        }}
        setDriverStatus={setDriverStatus}
        toast={toast}
      />
    </SidebarProvider>
  )
}