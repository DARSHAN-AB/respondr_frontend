"use client"

import { Home, User, Bell, Settings, LogOut, Ambulance, Shield, Users } from "lucide-react"
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
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

export function RoleSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Determine base path based on user role
  const getBasePath = () => {
    if (user?.role === "driver") return "/driver"
    if (user?.role === "admin") return "/admin"
    return ""
  }

  const basePath = getBasePath()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
          </div>
          <h1 className="text-xl font-bold text-red-600">Respondr</h1>
          {user?.role && <Badge className="ml-1 capitalize">{user.role}</Badge>}
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `${basePath}/dashboard` || pathname === "/dashboard"}
              tooltip="Dashboard"
            >
              <button onClick={() => router.push(`${basePath}/dashboard`)} className="transition-colors duration-200">
                <Home />
                <span>Dashboard</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `${basePath}/profile` || pathname === "/profile"}
              tooltip="Profile"
            >
              <button onClick={() => router.push(`${basePath}/profile`)} className="transition-colors duration-200">
                <User />
                <span>Profile</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Public user specific menu items */}
          {user?.role === "public" && (
            <>
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
            </>
          )}

          {/* Driver specific menu items */}
          {user?.role === "driver" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/driver/notifications"} tooltip="Notifications">
                  <button
                    onClick={() => router.push("/driver/notifications")}
                    className="transition-colors duration-200"
                  >
                    <Bell />
                    <span>Notifications</span>
                    <Badge className="ml-auto bg-red-500 text-white">3</Badge>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/driver/verification"} tooltip="Verification">
                  <button
                    onClick={() => router.push("/driver/verification")}
                    className="transition-colors duration-200"
                  >
                    <Shield />
                    <span>Verification</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Admin specific menu items */}
          {user?.role === "admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"} tooltip="Users">
                  <button onClick={() => router.push("/admin/users")} className="transition-colors duration-200">
                    <Users />
                    <span>Users</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin/verification-requests"}
                  tooltip="Verification Requests"
                >
                  <button
                    onClick={() => router.push("/admin/verification-requests")}
                    className="transition-colors duration-200"
                  >
                    <Shield />
                    <span>Verification Requests</span>
                    <Badge className="ml-auto bg-red-500 text-white">5</Badge>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `${basePath}/settings` || pathname === "/settings"}
              tooltip="Settings"
            >
              <button onClick={() => router.push(`${basePath}/settings`)} className="transition-colors duration-200">
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
