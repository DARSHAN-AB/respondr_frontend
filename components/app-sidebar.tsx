"use client"

import { Home, User, MapPin, Bell, Settings, LogOut, Ambulance, FileText } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
          </div>
          <h1 className="text-xl font-bold text-red-600">Respondr</h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
              <button onClick={() => router.push("/dashboard")} className="transition-colors duration-200">
                <Home />
                <span>Dashboard</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/profile"} tooltip="Profile">
              <button onClick={() => router.push("/profile")} className="transition-colors duration-200">
                <User />
                <span>Profile</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/report-incident"} tooltip="Report Incident">
              <button onClick={() => router.push("/report-incident")} className="transition-colors duration-200">
                <Bell />
                <span>Report Incident</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/book-ambulance"} tooltip="Book Ambulance">
              <button onClick={() => router.push("/book-ambulance")} className="transition-colors duration-200">
                <Ambulance />
                <span>Book Ambulance</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/my-reports"} tooltip="My Reports">
              <button onClick={() => router.push("/my-reports")} className="transition-colors duration-200">
                <FileText />
                <span>My Reports</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/nearby-hospitals"} tooltip="Nearby Hospitals">
              <button onClick={() => router.push("/nearby-hospitals")} className="transition-colors duration-200">
                <MapPin />
                <span>Nearby Hospitals</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
              <button onClick={() => router.push("/settings")} className="transition-colors duration-200">
                <Settings />
                <span>Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button onClick={handleLogout} className="transition-colors duration-200">
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
