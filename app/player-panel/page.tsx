"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Star, Target, History, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"

// Mock data
const mockApplications = [
  {
    id: "1",
    matchId: "1",
    place: "Complejo Deportivo San Telmo",
    date: "2025-01-22",
    time: "19:00",
    status: "pending",
    fieldType: "F5",
    organizer: "Carlos Mendez",
  },
  {
    id: "2",
    matchId: "2",
    place: "Cancha Los Amigos",
    date: "2025-01-23",
    time: "20:30",
    status: "accepted",
    fieldType: "F7",
    organizer: "Ana Rodriguez",
  },
  {
    id: "3",
    matchId: "3",
    place: "Club Atlético Norte",
    date: "2025-01-20",
    time: "18:00",
    status: "rejected",
    fieldType: "F11",
    organizer: "Diego Martínez",
  },
]

const mockHistory = [
  {
    id: "1",
    place: "Complejo San Martín",
    date: "2025-01-15",
    result: "played",
    rating: 4.5,
  },
  {
    id: "2",
    place: "Cancha Municipal",
    date: "2025-01-10",
    result: "cancelled",
    rating: null,
  },
  {
    id: "3",
    place: "Club Deportivo Sur",
    date: "2025-01-05",
    result: "played",
    rating: 4.2,
  },
]

const mockTodayMatches = [
  {
    id: "4",
    place: "Complejo Palermo",
    neighborhood: "Palermo",
    time: "21:00",
    fieldType: "F5",
    availableSlots: 2,
    totalSlots: 10,
  },
  {
    id: "5",
    place: "Cancha Villa Crespo",
    neighborhood: "Villa Crespo",
    time: "22:00",
    fieldType: "F7",
    availableSlots: 1,
    totalSlots: 14,
  },
]

export default function PlayerPanelPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Fix: Move the redirect logic to useEffect
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // If user is not authenticated, render nothing while redirecting
  if (!user) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            ⏳ Pendiente
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✅ Aceptado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            ❌ Rechazado
          </Badge>
        )
      default:
        return null
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "played":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ⚽ Jugado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            🚫 Cancelado
          </Badge>
        )
      default:
        return null
    }
  }

  const playerStats = {
    matchesPlayed: mockHistory.filter((h) => h.result === "played").length,
    averageRating:
      mockHistory.filter((h) => h.rating).reduce((acc, h) => acc + (h.rating || 0), 0) /
      mockHistory.filter((h) => h.rating).length,
    activeApplications: mockApplications.filter((a) => a.status === "pending").length,
    acceptanceRate: (mockApplications.filter((a) => a.status === "accepted").length / mockApplications.length) * 100,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Mi Panel de Jugador</h1>
          <p className="text-slate-600">Gestioná tus postulaciones y seguí tu historial</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{playerStats.matchesPlayed}</div>
              <div className="text-sm text-slate-600">Partidos Jugados</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold text-yellow-600">{playerStats.averageRating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-slate-600">Rating Promedio</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{playerStats.activeApplications}</div>
              <div className="text-sm text-slate-600">Postulaciones Activas</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{playerStats.acceptanceRate.toFixed(0)}%</div>
              <div className="text-sm text-slate-600">Tasa de Aceptación</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="shadow-md border-0 bg-gradient-to-r from-green-500 to-green-600 text-white mb-8 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 ¿Querés jugar hoy?</h3>
                <p className="text-green-100">Encontrá partidos disponibles cerca tuyo para jugar hoy mismo</p>
              </div>
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-green-50 font-semibold">
                <Target className="w-4 h-4 mr-2" />
                Buscar Partidos Hoy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Mis Postulaciones</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="today">Partidos Hoy</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5" />
                  Mis Postulaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">{application.place}</h3>
                          <p className="text-sm text-slate-600">Organiza: {application.organizer}</p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.date).toLocaleDateString("es-AR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {application.time}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {application.fieldType}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/match/${application.matchId}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </Link>
                        {application.status === "pending" && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Cancelar Postulación
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <History className="w-5 h-5" />
                  Historial de Partidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{match.place}</h3>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(match.date).toLocaleDateString("es-AR")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getResultBadge(match.result)}
                          {match.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{match.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Target className="w-5 h-5" />
                  Partidos Disponibles Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTodayMatches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{match.place}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            {match.neighborhood}
                            <Clock className="w-4 h-4 ml-2" />
                            {match.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {match.availableSlots} lugares disponibles
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {match.fieldType}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/match/${match.id}`}>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            🎯 Postularme
                          </Button>
                        </Link>
                        <Link href={`/match/${match.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {mockTodayMatches.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">⚽</div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay partidos disponibles hoy</h3>
                      <p className="text-slate-500 mb-4">Revisá mañana o creá tu propio partido</p>
                      <Link href="/create-match">
                        <Button className="bg-green-500 hover:bg-green-600 text-white">Crear Partido</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
