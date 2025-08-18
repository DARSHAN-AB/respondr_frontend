import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Respondr",
  description: "Emergency Rescue Platform",
  icons: {
    icon: "/favicon.ico", // path from public/
    shortcut: "/favicon.ico"
    // apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fast2sms" content="q5QgRykcoSsAeiGIZJxR2LgEeRejf3Lg" />
      </head>
      <body className={inter.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
