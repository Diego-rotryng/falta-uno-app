"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import { createMatch, type Match } from "@/lib/firestore"
import { Timestamp } from "firebase/firestore"

const neighborhoods = [
  "Agronomía",
  "Almagro",
  "Balvanera",
  "Barracas",
  "Belgrano",
  "Boedo",
  "Caballito",
  "Chacarita",
  "Coghlan",
  "Colegiales",
  "Constitución",
  "Flores",
  "Floresta",
  "La Boca",
  "Liniers",
  "Mataderos",
  "Monserrat",
  "Monte Castro",
  "Nueva Pompeya",
  "Núñez",
  "Palermo",
  "Parque Avellaneda",
  "Parque Chacabuco",
  "Parque Chas",
  "Parque Patricios",
  "Paternal",
  "Recoleta",
  "Retiro",
  "Saavedra",
  "San Cristóbal",
  "San Nicolás",
  "San Telmo",
  "Vélez Sársfield",
  "Versalles",
  "Villa Crespo",
  "Villa del Parque",
  "Villa Devoto",
  "Villa General Mitre",
  "Villa Lugano",
  "Villa Luro",
  "Villa Ortúzar",
  "Villa Pueyrredón",
  "Villa Real",
  "Villa Riachuelo",
  "Villa Santa Rita",
  "Villa Soldati",
  "Villa Urquiza",
]

export default function CreateMatchPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    placeName: "",
    neighborhood: "",
    address: "",
    date: "",
    time: "",
    fieldType: "",
    totalSlots: "",
    gender: "",
    minAge: "",
    maxAge: "",
    price: "",
    description: "",
    image: null as File | null,
  })

  // Redirect si no está logueado
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Crear fecha y hora combinadas
      const fechaHoraString = `${formData.date}T${formData.time}:00`
      const fechaHora = Timestamp.fromDate(new Date(fechaHoraString))

      // Preparar datos del partido para Firestore
      const matchData: Omit<Match, "id" | "createdAt" | "updatedAt"> = {
        organizerName: user.displayName || user.email?.split("@")[0] || "Usuario",
        organizerEmail: user.email || "",
        organizerId: user.uid,
        place: formData.placeName,
        neighborhood: formData.neighborhood,
        address: formData.address,
        fieldType: formData.fieldType,
        date: formData.date,
        time: formData.time,
        fechaHora: fechaHora,
        totalSlots: Number.parseInt(formData.totalSlots),
        occupiedSlots: 0,
        minAge: Number.parseInt(formData.minAge),
        maxAge: Number.parseInt(formData.maxAge),
        gender: formData.gender,
        price: Number.parseInt(formData.price),
        description: formData.description,
        image: "/placeholder.svg?height=400&width=600", // Por ahora placeholder, después se puede implementar upload
        status: "active",
      }

      // ✅ GUARDAR EN FIRESTORE
      const matchId = await createMatch(matchData)

      if (matchId) {
        console.log("Partido creado exitosamente con ID:", matchId)
        setSuccess(true)

        // Mostrar mensaje de éxito y redirigir
        setTimeout(() => {
          router.push("/organizer-panel")
        }, 2000)
      } else {
        throw new Error("Error al crear el partido")
      }
    } catch (error) {
      console.error("Error creating match:", error)
      alert("Error al crear el partido. Por favor, intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.placeName &&
      formData.neighborhood &&
      formData.date &&
      formData.time &&
      formData.fieldType &&
      formData.totalSlots &&
      formData.gender &&
      formData.minAge &&
      formData.maxAge &&
      formData.price
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="shadow-md border-0 bg-white rounded-xl text-center">
              <CardContent className="p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Partido Creado!</h2>
                <p className="text-slate-600 mb-4">
                  Tu partido se guardó exitosamente en la plataforma y ya está visible para otros jugadores.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push("/organizer-panel")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Ir a Mis Partidos
                  </Button>
                  <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                    Ver en Lista Pública
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

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

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-slate-800">⚽ Crear Nuevo Partido</CardTitle>
              <p className="text-slate-600">
                Completá todos los datos para que otros jugadores puedan encontrar tu partido
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del lugar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <MapPin className="w-5 h-5" />
                    Lugar del partido
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="placeName">Nombre del lugar *</Label>
                      <Input
                        id="placeName"
                        placeholder="Ej: Complejo Deportivo San Telmo"
                        value={formData.placeName}
                        onChange={(e) => handleInputChange("placeName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Barrio *</Label>
                      <Select
                        value={formData.neighborhood}
                        onValueChange={(value) => handleInputChange("neighborhood", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar barrio" />
                        </SelectTrigger>
                        <SelectContent>
                          {neighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección completa</Label>
                    <Input
                      id="address"
                      placeholder="Ej: Av. San Juan 1234"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>

                {/* Información del partido */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Calendar className="w-5 h-5" />
                    Fecha y hora
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Hora *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración del partido */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Users className="w-5 h-5" />
                    Configuración
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fieldType">Tipo de cancha *</Label>
                      <Select
                        value={formData.fieldType}
                        onValueChange={(value) => handleInputChange("fieldType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F5">F5 (5 vs 5)</SelectItem>
                          <SelectItem value="F6">F6 (6 vs 6)</SelectItem>
                          <SelectItem value="F7">F7 (7 vs 7)</SelectItem>
                          <SelectItem value="F11">F11 (11 vs 11)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalSlots">Cupo total *</Label>
                      <Input
                        id="totalSlots"
                        type="number"
                        placeholder="Ej: 10"
                        value={formData.totalSlots}
                        onChange={(e) => handleInputChange("totalSlots", e.target.value)}
                        min="4"
                        max="22"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Género *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Varones">Varones</SelectItem>
                          <SelectItem value="Mujeres">Mujeres</SelectItem>
                          <SelectItem value="Mixto">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minAge">Edad mínima *</Label>
                      <Input
                        id="minAge"
                        type="number"
                        placeholder="16"
                        value={formData.minAge}
                        onChange={(e) => handleInputChange("minAge", e.target.value)}
                        min="16"
                        max="60"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAge">Edad máxima *</Label>
                      <Input
                        id="maxAge"
                        type="number"
                        placeholder="40"
                        value={formData.maxAge}
                        onChange={(e) => handleInputChange("maxAge", e.target.value)}
                        min="16"
                        max="60"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Costo por persona (ARS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="1500"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción adicional</Label>
                    <Textarea
                      id="description"
                      placeholder="Ej: Partido amistoso, buen ambiente, incluye pelota y pecheras..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? "Creando partido..." : "🎯 Crear Partido"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
