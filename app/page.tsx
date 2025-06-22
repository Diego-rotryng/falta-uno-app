"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Users, Clock, Calendar, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "@/components/auth-modal"
import Navbar from "@/components/navbar"
import { getActiveMatches, type Match } from "@/lib/firestore"

const neighborhoods = [
  "Todos",
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

export default function HomePage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ FILTROS PERSISTENTES
  const [fieldTypeFilter, setFieldTypeFilter] = useState("Todos")
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("Todos")
  const [genderFilter, setGenderFilter] = useState("Todos")
  const [dateFilter, setDateFilter] = useState("")
  const [minAgeFilter, setMinAgeFilter] = useState("")
  const [maxAgeFilter, setMaxAgeFilter] = useState("")

  // ✅ CARGAR PARTIDOS DESDE FIRESTORE
  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true)
      try {
        const activeMatches = await getActiveMatches()
        setMatches(activeMatches)
      } catch (error) {
        console.error("Error loading matches:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  // Aplicar filtros manteniendo el estado
  const filteredMatches = useMemo(() => {
    let filtered = matches

    if (fieldTypeFilter !== "Todos") {
      filtered = filtered.filter((match) => match.fieldType === fieldTypeFilter)
    }

    if (neighborhoodFilter !== "Todos") {
      filtered = filtered.filter((match) => match.neighborhood === neighborhoodFilter)
    }

    if (genderFilter !== "Todos") {
      filtered = filtered.filter((match) => match.gender === genderFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((match) => match.date === dateFilter)
    }

    if (minAgeFilter) {
      filtered = filtered.filter((match) => match.minAge >= Number.parseInt(minAgeFilter))
    }

    if (maxAgeFilter) {
      filtered = filtered.filter((match) => match.maxAge <= Number.parseInt(maxAgeFilter))
    }

    return filtered
  }, [matches, fieldTypeFilter, neighborhoodFilter, genderFilter, dateFilter, minAgeFilter, maxAgeFilter])

  const handleApplyToMatch = (matchId: string) => {
    if (!user) {
      setAuthMode("login")
      setShowAuthModal(true)
      return
    }
    // Lógica para postularse al partido
    console.log("Aplicando al partido:", matchId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      {/* 🖼️ HERO SECTION CON IMAGEN DE FONDO DECORATIVA */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/football-background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "350px",
        }}
      >
        {/* Overlay para mejor legibilidad del texto */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>

        <div className="relative z-10">
          <main className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold text-slate-800 mb-4">⚽ Falta Uno</h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
                La plataforma definitiva para organizar partidos de fútbol amateur
              </p>
            </div>

            {/* ✅ FILTROS CON ESTADO PERSISTENTE */}
            <div className="mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-slate-200">
                <div className="flex items-center gap-2 text-slate-800 text-lg font-semibold mb-6">
                  <Filter className="w-5 h-5" />
                  Filtros
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Tipo de cancha */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Tipo de cancha</label>
                    <Select value={fieldTypeFilter} onValueChange={setFieldTypeFilter}>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-800 rounded-md py-2 px-3 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="Todos" className="text-slate-800 hover:bg-slate-100">
                          Todos
                        </SelectItem>
                        <SelectItem value="F5" className="text-slate-800 hover:bg-slate-100">
                          F5
                        </SelectItem>
                        <SelectItem value="F6" className="text-slate-800 hover:bg-slate-100">
                          F6
                        </SelectItem>
                        <SelectItem value="F7" className="text-slate-800 hover:bg-slate-100">
                          F7
                        </SelectItem>
                        <SelectItem value="F11" className="text-slate-800 hover:bg-slate-100">
                          F11
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Barrio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Barrio</label>
                    <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-800 rounded-md py-2 px-3 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 max-h-60">
                        {neighborhoods.map((neighborhood) => (
                          <SelectItem
                            key={neighborhood}
                            value={neighborhood}
                            className="text-slate-800 hover:bg-slate-100"
                          >
                            {neighborhood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Sexo</label>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-800 rounded-md py-2 px-3 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="Todos" className="text-slate-800 hover:bg-slate-100">
                          Todos
                        </SelectItem>
                        <SelectItem value="Varones" className="text-slate-800 hover:bg-slate-100">
                          Varones
                        </SelectItem>
                        <SelectItem value="Mujeres" className="text-slate-800 hover:bg-slate-100">
                          Mujeres
                        </SelectItem>
                        <SelectItem value="Mixto" className="text-slate-800 hover:bg-slate-100">
                          Mixto
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Fecha</label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-md py-2 px-3 text-sm"
                    />
                  </div>

                  {/* Edad mínima */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Edad mínima</label>
                    <Input
                      type="number"
                      placeholder="16"
                      value={minAgeFilter}
                      onChange={(e) => setMinAgeFilter(e.target.value)}
                      className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-md py-2 px-3 text-sm"
                      min="16"
                      max="60"
                    />
                  </div>

                  {/* Edad máxima */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">📍 Edad máxima</label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={maxAgeFilter}
                      onChange={(e) => setMaxAgeFilter(e.target.value)}
                      className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-md py-2 px-3 text-sm"
                      min="16"
                      max="60"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Lista de Partidos desde Firestore */}
      <div className="bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          {/* Indicador de partidos vigentes */}
          <div className="mb-6 text-center">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-slate-600">Cargando partidos...</p>
              </div>
            ) : (
              <p className="text-slate-600">
                Mostrando <span className="font-semibold text-green-600">{filteredMatches.length}</span> partidos
                vigentes
                {filteredMatches.length !== matches.length && (
                  <span className="text-slate-500"> (de {matches.length} disponibles)</span>
                )}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <Card
                  key={match.id}
                  className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl border-0"
                >
                  <div className="relative">
                    <img
                      src={match.image || "/placeholder.svg?height=200&width=300"}
                      alt={match.place}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                        {match.fieldType}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 text-slate-800">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{match.place}</h3>
                        <p className="text-sm text-slate-600">Organiza: {match.organizerName}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {match.neighborhood}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(match.date).toLocaleDateString("es-AR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {match.time}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold text-green-600">{match.totalSlots - match.occupiedSlots}</span>
                          <span className="text-slate-600">de {match.totalSlots} lugares</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                          {match.minAge}-{match.maxAge} años
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge
                          className={`${
                            match.gender === "Varones"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : match.gender === "Mujeres"
                                ? "bg-pink-100 text-pink-800 border-pink-200"
                                : "bg-purple-100 text-purple-800 border-purple-200"
                          } border`}
                        >
                          {match.gender}
                        </Badge>
                        <div className="text-lg font-bold text-green-600">${match.price.toLocaleString()}</div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Link href={`/match/${match.id}`}>
                          <Button
                            variant="outline"
                            className="w-full bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            Ver Detalles
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleApplyToMatch(match.id!)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                        >
                          🎯 Postularme
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredMatches.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No hay partidos vigentes que coincidan con tus filtros
              </h3>
              <p className="text-slate-500 mb-4">Probá ajustando los filtros o creá tu propio partido</p>
              {user && (
                <Link href="/create-match">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold">Crear Partido</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
