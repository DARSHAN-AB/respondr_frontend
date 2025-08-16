"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { User, Mail, Phone, Shield, Bell, Clock, MapPin, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { updateUserProfile } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // User data state that will be populated from the auth context
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    medicalConditions: "",
    allergies: "",
  })
  console.log("User object:", user);

  // Update userData when user changes
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        address: user.address || "",
        bloodGroup: user.bloodGroup || "",
        emergencyContact: user.emergencyContact || "",
        medicalConditions: user.medicalConditions || "",
        allergies: user.allergies || "",
      })
      setIsLoading(false)
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await updateUserProfile(token, userData)
      await refreshUser() // Refresh user data in context

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading profile...</span>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
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
            <div className="mb-6">
              <Button
                variant="ghost"
                className="mb-2 transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </div>
            <div className="max-w-5xl mx-auto ml-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <Card className="w-full md:w-1/3">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user?.profileImage || "/profile.jpg"} alt="Profile" />
                        <AvatarFallback className="bg-red-100 text-red-600 text-2xl">
                          {user ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-2xl font-bold">{userData.name}</h2>
                      <p className="text-gray-500 mb-4">{userData.email}</p>
                      {user?.role && (
                        <div className="mb-4">
                          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} User
                          </span>
                        </div>
                      )}

                      <div className="w-full mt-4">
                        <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => setIsEditing(!isEditing)}>
                          {isEditing ? "Cancel Editing" : "Edit Profile"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="w-full md:w-2/3">
                  <Tabs defaultValue="personal">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="personal" className="flex-1">
                        Personal Information
                      </TabsTrigger>
                      <TabsTrigger value="medical" className="flex-1">
                        Medical Information
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex-1">
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                      <Card>
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="name"
                                  value={userData.name}
                                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.name}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{userData.email}</span>
                              <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="phone"
                                  value={userData.phone}
                                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.phone || "Not provided"}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="address"
                                  value={userData.address}
                                  onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.address || "Not provided"}</span>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <Button
                              onClick={handleSaveProfile}
                              className="mt-4 bg-red-600 hover:bg-red-700"
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="medical">
                      <Card>
                        <CardHeader>
                          <CardTitle>Medical Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="bloodGroup"
                                  value={userData.bloodGroup}
                                  onChange={(e) => setUserData({ ...userData, bloodGroup: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.bloodGroup || "Not provided"}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Emergency Contact</Label>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="emergencyContact"
                                  value={userData.emergencyContact}
                                  onChange={(e) => setUserData({ ...userData, emergencyContact: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.emergencyContact || "Not provided"}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="medicalConditions">Medical Conditions</Label>
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="medicalConditions"
                                  value={userData.medicalConditions}
                                  onChange={(e) => setUserData({ ...userData, medicalConditions: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.medicalConditions || "None"}</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="allergies">Allergies</Label>
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4 text-gray-500" />
                              {isEditing ? (
                                <Input
                                  id="allergies"
                                  value={userData.allergies}
                                  onChange={(e) => setUserData({ ...userData, allergies: e.target.value })}
                                  className="flex-1"
                                />
                              ) : (
                                <span>{userData.allergies || "None"}</span>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <Button
                              onClick={handleSaveProfile}
                              className="mt-4 bg-red-600 hover:bg-red-700"
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                      <Card>
                        <CardHeader>
                          <CardTitle>Notification Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-500" />
                              <span>Emergency Alerts</span>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-500" />
                              <span>Ambulance Updates</span>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-500" />
                              <span>System Notifications</span>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Reminder Notifications</span>
                            </div>
                            <Switch />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle>Privacy Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>Share Location with Emergency Services</span>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-gray-500" />
                              <span>Share Medical Information with Responders</span>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>Allow Anonymous Usage Data Collection</span>
                            </div>
                            <Switch />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}