// components/client-layout.tsx
"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors />
    </AuthProvider>
  );
}
