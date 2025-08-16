// components/ClientWrapper.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors />
    </AuthProvider>
  );
}
