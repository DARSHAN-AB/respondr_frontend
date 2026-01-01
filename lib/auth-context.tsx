"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/api";

interface AuthContextType {
  user: { userId: number; role: string } | null;
  driverId: number | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: number, role: string, driverId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ userId: number; role: string } | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        console.log("Decoded JWT payload:", payload); // LOG THIS
        setUser({ userId: payload.user_id, role: payload.role });
        setDriverId(payload.driver_id);
        setToken(storedToken);
        setIsAuthenticated(true);
        setAuthToken(storedToken);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (token: string, userId: number, role: string, driverId: number) => {
  localStorage.setItem("token", token);
  setAuthToken(token);
  setUser({ userId, role });
  setDriverId(driverId);
  setToken(token);
  setIsAuthenticated(true);
  toast.success("Logged in successfully!");

  console.log("Logged in with role:", role); // Debug log

  // Redirect user based on their role
  switch (role) {
    case "Admin":
      router.push("/adminweb/dashboard");
      break;
    case "Driver":
      router.push("/driver/dashboard");
      break;
    default:
      router.push("/dashboard"); // public
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, driverId, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
