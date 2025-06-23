import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Falta Uno - Organizá partidos de fútbol",
  description: "La plataforma definitiva para organizar partidos de fútbol amateur",
  generator: "v0.dev",
  manifest: "/manifest.json", // 👈 NUEVO
  themeColor: "#000000",      // 👈 NUEVO
  icons: {
    icon: "/icono-192.png",   // 👈 NUEVO
    apple: "/icono-192.png",  // 👈 NUEVO
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* 👇 En caso de que Next no lo meta solo */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icono-192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
