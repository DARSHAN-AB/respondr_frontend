"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Bell, CheckCircle, X, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define interfaces for type safety
interface Location {
  lat: number
  lng: number
}

interface Sender {
  name: string
  phone: string
  location: Location
}

interface BookingDetails {
  patientName?: string
  contactNumber?: string
  emergencyType?: string
  additionalInfo?: string
}

interface Notification {
  id: string
  type: "emergency" | "booking" | "system"
  status: "new" | "accepted" | "Completed" | "rejected" | "unread" | "read"
  timestamp: string
  sender?: Sender
  description: string | BookingDetails
  photoUrl?: string
  destination?: string
  title?: string // For system notifications
}

interface NotificationItemProps {
  notification: Notification
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onComplete: (id: string) => void
  onMarkAsRead: (id: string) => void
}

interface User {
  userId: string
}

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()
  const { user } = useAuth() as { user: User | null }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/notifications")
        if (!response.ok) {
          throw new Error("Failed to fetch notifications")
        }
        const data = await response.json()

        // Check for duplicate IDs
        const idSet = new Set<string>()
        data.notifications.forEach((notification: Notification) => {
          if (idSet.has(notification.id)) {
            console.warn(`Duplicate notification ID found: ${notification.id}`)
          }
          idSet.add(notification.id)
        })

        setNotifications(data.notifications)
      } catch (error: any) {
        console.error("Error fetching notifications:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications.",
        })
      }
    }

    fetchNotifications()
  }, [toast])

  const handleAcceptJob = async (reportIdRaw: string) => {
  if (!user?.userId) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "User not authenticated.",
    });
    return;
  }

  try {
    const reportId = parseInt(reportIdRaw);
    if (isNaN(reportId)) {
      throw new Error("Invalid report ID format");
    }

    let latitude: number, longitude: number;
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } else {
      throw new Error("Geolocation not supported");
    }

    // Step 1: Mark driver as busy
    const markBusyResponse = await fetch("http://localhost:3001/api/driver/mark-busy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        reportId, // send number
        latitude,
        longitude,
      }),
    });

    if (!markBusyResponse.ok) {
      const errorData = await markBusyResponse.json();
      throw new Error(errorData.error || "Failed to mark driver as busy or assign report");
    }

    // Step 2: Assign report
    const currentTime = new Date().toISOString();
    const assignReportResponse = await fetch("http://localhost:3001/api/driver/assign-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId,
        userId: user.userId,
        responseTime: currentTime,
      }),
    });

    if (!assignReportResponse.ok) {
      const errorData = await assignReportResponse.json();
      throw new Error(errorData.error || "Failed to assign report");
    }

    const assignReportData = await assignReportResponse.json();
    const assignmentId = assignReportData.assignmentId;

    // Step 3: Dispatch
    const dispatchResponse = await fetch("http://localhost:3001/api/driver/dispatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        reportId,
        assignmentId,
        dispatchTime: currentTime,
        action: "dispatch",
      }),
    });

    if (!dispatchResponse.ok) {
      const errorData = await dispatchResponse.json();
      throw new Error(errorData.error || "Failed to dispatch");
    }

    // Update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === reportIdRaw ? { ...n, status: "accepted" } : n))
    );

    // Open Google Maps
    const notification = notifications.find((n) => n.id === reportIdRaw);
    if (notification?.sender?.location) {
      const { lat, lng } = notification.sender.location;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    }

    toast({
      title: "Job Accepted",
      description: "You have accepted the request. Google Maps has been opened with the location.",
    });
  } catch (error: any) {
    console.error("Error accepting job:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "An error occurred while accepting the job.",
    });
  }
};


  const handleCompleteJob = async (id: string) => {
    if (!user?.userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated.",
      })
      return
    }

    try {
      // Step 1: Mark job as completed
      const completeResponse = await fetch("http://localhost:3001/api/driver/mark-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          emergencyId: id,
        }),
      })

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json()
        throw new Error(errorData.error || "Failed to mark job as completed")
      }

      // Step 2: Update dispatch record
      const currentTime = new Date().toISOString()
      const dispatchResponse = await fetch("http://localhost:3001/api/driver/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: id,
          action: "complete",
          arrivalTime: currentTime,
          completionTime: currentTime,
        }),
      })

      if (!dispatchResponse.ok) {
        const errorData = await dispatchResponse.json()
        throw new Error(errorData.error || "Failed to update dispatch record")
      }

      // Update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "Completed" } : n))
      )

      toast({
        title: "Job Completed",
        description: "The job has been marked as completed. You are now available.",
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

  const handleRejectJob = async (id: string) => {
    try {
      // Step 1: Reject job
      const rejectResponse = await fetch("http://localhost:3001/api/driver/reject-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergencyId: id,
        }),
      })

      if (!rejectResponse.ok) {
        const errorData = await rejectResponse.json()
        throw new Error(errorData.error || "Failed to reject job")
      }

      // Update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "rejected" } : n))
      )

      toast({
        title: "Job Rejected",
        description: "You have rejected the request.",
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

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    )
    toast({
      title: "Notification Marked as Read",
      description: "The system notification has been marked as read.",
    })
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
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
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
              <Badge className="ml-2 bg-red-600">Notifications</Badge>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="all" className="flex-1">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="emergency" className="flex-1">
                        Emergency Alerts
                      </TabsTrigger>
                      <TabsTrigger value="booking" className="flex-1">
                        Booking Requests
                      </TabsTrigger>
                      <TabsTrigger value="system" className="flex-1">
                        System
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onAccept={handleAcceptJob}
                          onReject={handleRejectJob}
                          onComplete={handleCompleteJob}
                          onMarkAsRead={handleMarkAsRead}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="emergency" className="space-y-4">
                      {notifications
                        .filter((n) => n.type === "emergency")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAccept={handleAcceptJob}
                            onReject={handleRejectJob}
                            onComplete={handleCompleteJob}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                    </TabsContent>

                    <TabsContent value="booking" className="space-y-4">
                      {notifications
                        .filter((n) => n.type === "booking")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAccept={handleAcceptJob}
                            onReject={handleRejectJob}
                            onComplete={handleCompleteJob}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                    </TabsContent>

                    <TabsContent value="system" className="space-y-4">
                      {notifications
                        .filter((n) => n.type === "system")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAccept={handleAcceptJob}
                            onReject={handleRejectJob}
                            onComplete={handleCompleteJob}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function NotificationItem({
  notification,
  onAccept,
  onReject,
  onComplete,
  onMarkAsRead,
}: NotificationItemProps) {
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
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  if (notification.type === "emergency") {
    return (
      <div
        className={`p-4 rounded-lg border ${
          notification.status === "new"
            ? "bg-red-50 border-red-200"
            : notification.status === "accepted"
            ? "bg-green-50 border-green-200"
            : notification.status === "Completed"
            ? "bg-blue-50 border-blue-200"
            : notification.status === "rejected"
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4">
            <img
              src={notification.photoUrl || "/placeholder.svg"}
              alt="Emergency"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{notification.sender?.name || "Unknown"}</h3>
                <p className="text-sm text-gray-500">{getTimeSince(notification.timestamp)}</p>
              </div>
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
            <p className="mb-3">{typeof notification.description === "string" ? notification.description : "No description provided"}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {notification.sender?.phone !== "N/A" && (
                <div className="text-sm">
                  <span className="font-medium">Contact:</span> {notification.sender.phone}
                </div>
              )}
              {notification.sender?.location && (
                <div className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  {notification.sender.location.lat.toFixed(4)},{" "}
                  {notification.sender.location.lng.toFixed(4)}
                </div>
              )}
            </div>
            {notification.status === "new" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(notification.id)}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(notification.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Accept
                </Button>
              </div>
            )}
            {notification.status === "accepted" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="border-gray-600 text-gray-600 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => onComplete(notification.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Completed
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else if (notification.type === "booking") {
    const details = typeof notification.description === "object" ? notification.description as BookingDetails : {}
    return (
      <div
        className={`p-4 rounded-lg border ${
          notification.status === "new"
            ? "bg-red-50 border-red-200"
            : notification.status === "accepted"
            ? "bg-green-50 border-green-200"
            : notification.status === "Completed"
            ? "bg-blue-50 border-blue-200"
            : notification.status === "rejected"
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{notification.sender?.name || details.patientName || "Unknown"}</h3>
                <p className="text-sm text-gray-500">{getTimeSince(notification.timestamp)}</p>
              </div>
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
            <div className="mb-3 space-y-2">
              {details.emergencyType && (
                <p className="text-sm">
                  <span className="font-medium">Emergency Type:</span> {details.emergencyType}
                </p>
              )}
              {details.additionalInfo && (
                <p className="text-sm">
                  <span className="font-medium">Details:</span> {details.additionalInfo}
                </p>
              )}
              {notification.destination && (
                <p className="text-sm">
                  <span className="font-medium">Destination:</span> {notification.destination}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(notification.sender?.phone !== "N/A" || details.contactNumber) && (
                <div className="text-sm">
                  <span className="font-medium">Contact:</span>{" "}
                  {details.contactNumber || notification.sender?.phone || "N/A"}
                </div>
              )}
              {notification.sender?.location && (
                <div className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  {notification.sender.location.lat.toFixed(4)},{" "}
                  {notification.sender.location.lng.toFixed(4)}
                </div>
              )}
            </div>
            {notification.status === "new" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(notification.id)}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(notification.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Accept
                </Button>
              </div>
            )}
            {notification.status === "accepted" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="border-gray-600 text-gray-600 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => onComplete(notification.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Completed
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={`p-4 rounded-lg border ${
          notification.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {notification.status === "unread" ? (
              <Info className="h-5 w-5 text-blue-600" />
            ) : (
              <Info className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium">{notification.title || "System Notification"}</h3>
              <p className="text-xs text-gray-500">{getTimeSince(notification.timestamp)}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {typeof notification.description === "string"
                ? notification.description
                : "No description provided"}
            </p>
            {notification.status === "unread" && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Mark as read
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}