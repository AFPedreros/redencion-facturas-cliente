"use client";

import "./globals.css";

import { AuthContextProvider } from "@/context/AuthContext";

import { Toaster } from "@/components/ui/toaster";
import SiteHeader from "@/components/site-header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />

      <body className="relative bg-background">
        <AuthContextProvider>
          <SiteHeader />
          {children}
        </AuthContextProvider>

        <Toaster />
      </body>
    </html>
  );
}
