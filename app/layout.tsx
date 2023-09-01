"use client";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

import Header from "../components/Header";
import { AuthContextProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />

      <body className="relative bg-white">
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>

        <Toaster />
      </body>
    </html>
  );
}
