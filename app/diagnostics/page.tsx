"use client"

import Navbar from "@/components/navbar"
import FirebaseDiagnostics from "@/components/firebase-diagnostics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-green-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🔧 Diagnóstico Firebase</h1>
          <p className="text-slate-600">Verificación completa de la conexión con Firebase</p>
        </div>

        <FirebaseDiagnostics />
      </main>
    </div>
  )
}
