// app/adminweb/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Users, Ambulance, CheckCircle, AlertTriangle, Activity, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getAdminVerificationRequests } from "@/lib/api"

// Mock data for stats (excluding pendingVerifications, which will be fetched)
const mockStats = {
  totalUsers: 1245,
  totalDrivers: 87,
  totalEmergencies: 532,
  completedEmergencies: 498,
  activeEmergencies: 3,
  userGrowth: [
    { month: "Jan", users: 850 },
    { month: "Feb", users: 940 },
    { month: "Mar", users: 1020 },
    { month: "Apr", users: 1080 },
    { month: "May", users: 1150 },
    { month: "Jun", users: 1245 },
  ],
  emergencyStats: [
    { month: "Jan", emergencies: 78 },
    { month: "Feb", emergencies: 92 },
    { month: "Mar", emergencies: 103 },
    { month: "Apr", emergencies: 85 },
    { month: "May", emergencies: 89 },
    { month: "Jun", emergencies: 85 },
  ],
  recentUsers: [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      role: "public",
      joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      role: "public",
      joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      role: "driver",
      joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: "4",
      name: "Neha Singh",
      email: "neha.singh@example.com",
      role: "public",
      joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    },
  ],
  recentEmergencies: [
    {
      id: "1",
      type: "Accident",
      location: "Connaught Place, New Delhi",
      status: "Completed",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: "2",
      type: "Medical",
      location: "Lajpat Nagar, New Delhi",
      status: "Completed",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: "3",
      type: "Accident",
      location: "Karol Bagh, New Delhi",
      status: "In Progress",
      timestamp: new Date(Date.now() - 12 * 60 * 60000).toISOString(),
    },
    {
      id: "4",
      type: "Medical",
      location: "Saket, New Delhi",
      status: "In Progress",
      timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
    },
  ],
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ ...mockStats, pendingVerifications: 0 }) // Initialize with 0
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch pending verification requests
  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const verificationRequests = await getAdminVerificationRequests()
        const pendingCount = verificationRequests.filter((req) => req.status === "Pending").length
        setStats((prev) => ({ ...prev, pendingVerifications: pendingCount }))
      } catch (error) {
        console.error('Error fetching pending verifications:', error.response?.data || error.message)
        toast({
          title: "Error",
          description: "Failed to fetch pending verification requests.",
          variant: "destructive",
        })
      }
    }

    fetchPendingVerifications()
  }, [])

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
              <Badge className="ml-2 bg-red-600">Admin Dashboard</Badge>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-red-100 text-red-600">{user?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>8.2% increase this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Drivers</p>
                      <h3 className="text-2xl font-bold">{stats.totalDrivers}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Ambulance className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span>12.5% increase this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Emergencies</p>
                      <h3 className="text-2xl font-bold">{stats.totalEmergencies}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <Activity className="mr-1 h-4 w-4" />
                    <span>{stats.activeEmergencies} active emergencies</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Emergencies</p>
                      <h3 className="text-2xl font-bold">{stats.completedEmergencies}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <span className="font-medium">
                      {((stats.completedEmergencies / stats.totalEmergencies) * 100).toFixed(1)}% completion rate
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.userGrowth}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Emergency Reports</CardTitle>
                  <CardDescription>Monthly emergency report trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.emergencyStats}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="emergencies"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>New users who joined recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              user.role === "driver"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {user.role}
                          </Badge>
                          <span className="text-xs text-gray-500">{getTimeSince(user.joinedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Emergencies</CardTitle>
                  <CardDescription>Latest emergency reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentEmergencies.map((emergency) => (
                      <div key={emergency.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              emergency.type === "Accident"
                                ? "bg-red-100"
                                : emergency.type === "Medical"
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                            }`}
                          >
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                emergency.type === "Accident"
                                  ? "text-red-600"
                                  : emergency.type === "Medical"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{emergency.type}</p>
                            <p className="text-sm text-gray-500">{emergency.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              emergency.status === "Completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {emergency.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{getTimeSince(emergency.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Pending Verifications
                </CardTitle>
                <CardDescription>Driver verification requests awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        {stats.pendingVerifications} verification {stats.pendingVerifications === 1 ? "request" : "requests"} pending
                      </span>
                    </div>
                    <a
                      href="/adminweb/verification-requests"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View all requests
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}