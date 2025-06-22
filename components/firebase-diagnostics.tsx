"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { db, auth, storage } from "@/lib/firebaseConfig"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

interface DiagnosticResult {
  service: string
  status: "success" | "error" | "testing" | "pending"
  message: string
  details?: string
}

export default function FirebaseDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([
    { service: "Configuración", status: "pending", message: "Verificando configuración..." },
    { service: "Firestore", status: "pending", message: "Probando conexión..." },
    { service: "Authentication", status: "pending", message: "Probando autenticación..." },
    { service: "Storage", status: "pending", message: "Probando almacenamiento..." },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const updateResult = (service: string, status: DiagnosticResult["status"], message: string, details?: string) => {
    setResults((prev) => prev.map((r) => (r.service === service ? { ...r, status, message, details } : r)))
  }

  const runDiagnostics = async () => {
    setIsRunning(true)

    // 1. Verificar configuración
    try {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBA-U9Jba2MGhGNMc5zOeejEJz6wEV2hIM",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "falta-unov2.firebaseapp.com",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "falta-unov2",
      }

      if (!config.apiKey || config.apiKey.length < 10) {
        throw new Error("API Key inválida o faltante")
      }

      updateResult(
        "Configuración",
        "success",
        "✅ Configuración válida",
        `Proyecto: ${config.projectId}\nDominio: ${config.authDomain}`,
      )
    } catch (error) {
      updateResult("Configuración", "error", "❌ Error en configuración", String(error))
    }

    // 2. Probar Firestore
    updateResult("Firestore", "testing", "🔄 Probando escritura/lectura...")
    try {
      // Crear documento de prueba
      const testData = {
        test: true,
        timestamp: new Date(),
        message: "Prueba de conexión Firestore",
      }

      const docRef = await addDoc(collection(db, "test"), testData)

      // Leer documentos
      const querySnapshot = await getDocs(collection(db, "test"))
      let found = false
      querySnapshot.forEach((doc) => {
        if (doc.id === docRef.id) found = true
      })

      if (found) {
        // Limpiar documento de prueba
        await deleteDoc(doc(db, "test", docRef.id))
        updateResult("Firestore", "success", "✅ Firestore funcionando", "Escritura y lectura exitosas")
      } else {
        throw new Error("No se pudo leer el documento creado")
      }
    } catch (error: any) {
      updateResult("Firestore", "error", "❌ Error en Firestore", error.message || String(error))
    }

    // 3. Probar Authentication
    updateResult("Authentication", "testing", "🔄 Probando autenticación...")
    try {
      // Intentar crear usuario de prueba
      const testEmail = `test-${Date.now()}@faltauno.test`
      const testPassword = "test123456"

      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)

      // Verificar que se creó
      if (userCredential.user) {
        // Limpiar usuario de prueba
        await deleteUser(userCredential.user)
        updateResult(
          "Authentication",
          "success",
          "✅ Authentication funcionando",
          "Creación y eliminación de usuario exitosas",
        )
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        updateResult("Authentication", "success", "✅ Authentication funcionando", "Servicio activo (email ya existe)")
      } else {
        updateResult("Authentication", "error", "❌ Error en Authentication", error.message || String(error))
      }
    }

    // 4. Probar Storage
    updateResult("Storage", "testing", "🔄 Probando almacenamiento...")
    try {
      // Crear archivo de prueba
      const testFile = new Blob(["Prueba de Storage"], { type: "text/plain" })
      const storageRef = ref(storage, `test/test-${Date.now()}.txt`)

      // Subir archivo
      await uploadBytes(storageRef, testFile)

      // Obtener URL
      const downloadURL = await getDownloadURL(storageRef)

      if (downloadURL) {
        // Limpiar archivo de prueba
        await deleteObject(storageRef)
        updateResult("Storage", "success", "✅ Storage funcionando", "Subida y descarga exitosas")
      }
    } catch (error: any) {
      updateResult("Storage", "error", "❌ Error en Storage", error.message || String(error))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "testing":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Probando</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🔧 Diagnóstico de Firebase</CardTitle>
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ejecutando...
              </>
            ) : (
              "🚀 Ejecutar Diagnóstico"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.service} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-semibold">{result.service}</span>
                </div>
                {getStatusBadge(result.status)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{result.message}</p>
              {result.details && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{result.details}</pre>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
