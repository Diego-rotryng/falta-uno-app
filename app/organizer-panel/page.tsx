"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Users, Calendar, Star, Phone, Check, X, Edit, Trash2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"

// Mock data
const mockOrganizerMatches = [
  {
    id: "1",
    place: "Complejo Deportivo San Telmo",
    date: "2025-01-22",
    time: "19:00",
    fieldType: "F5",
    totalSlots: 10,
    confirmedPlayers: 7,
    pendingApplications: 5,
    status: "active",
    applicants: [
      { id: "1", name: "Juan Pérez", age: 25, rating: 4.2, phone: "+54 9 11 1234-5678", status: "pending" },
      { id: "2", name: "Diego López", age: 28, rating: 4.5, phone: "+54 9 11 2345-6789", status: "accepted" },
      { id: "3", name: "Martín Silva", age: 22, rating: 4.0, phone: "+54 9 11 3456-7890", status: "pending" },
      { id: "4", name: "Carlos Ruiz", age: 30, rating: 4.8, phone: "+54 9 11 4567-8901", status: "accepted" },
      { id: "5", name: "Roberto García", age: 26, rating: 3.9, phone: "+54 9 11 5678-9012", status: "pending" },
    ],
  },
  {
    id: "2",
    place: "Cancha Los Amigos",
    date: "2025-01-25",
    time: "20:30",
    fieldType: "F7",
    totalSlots: 14,
    confirmedPlayers: 12,
    pendingApplications: 3,
    status: "confirmed",
    applicants: [
      { id: "6", name: "Ana Rodriguez", age: 24, rating: 4.3, phone: "+54 9 11 6789-0123", status: "accepted" },
      { id: "7", name: "Sofia Martinez", age: 27, rating: 4.6, phone: "+54 9 11 7890-1234", status: "accepted" },
    ],
  },
]

export default function OrganizerPanelPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedMatch, setSelectedMatch] = useState<any>(null)

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

  const handleAcceptPlayer = (matchId: string, playerId: string) => {
    console.log("Accepting player:", playerId, "for match:", matchId)
    // Aquí iría la lógica para aceptar al jugador
  }

  const handleRejectPlayer = (matchId: string, playerId: string) => {
    console.log("Rejecting player:", playerId, "for match:", matchId)
    // Aquí iría la lógica para rechazar al jugador
  }

  const handleConfirmMatch = (matchId: string) => {
    console.log("Confirming match:", matchId)
    // Aquí iría la lógica para confirmar el partido
  }

  const handleWhatsApp = (phone: string, playerName: string, matchPlace: string) => {
    const message = `¡Hola ${playerName}! Te confirmo tu lugar en el partido de ${matchPlace}. ¡Nos vemos en la cancha! ⚽`
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            🔵 Activo
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✅ Confirmado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            🏁 Finalizado
          </Badge>
        )
      default:
        return null
    }
  }

  const getPlayerStatusBadge = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel del Organizador</h1>
            <p className="text-slate-600">Gestioná tus partidos y jugadores</p>
          </div>
          <Link href="/create-match">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Partido
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{mockOrganizerMatches.length}</div>
              <div className="text-sm text-slate-600">Partidos Creados</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {mockOrganizerMatches.reduce((acc, match) => acc + match.pendingApplications, 0)}
              </div>
              <div className="text-sm text-slate-600">Postulaciones Pendientes</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {mockOrganizerMatches.reduce((acc, match) => acc + match.confirmedPlayers, 0)}
              </div>
              <div className="text-sm text-slate-600">Jugadores Confirmados</div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold text-yellow-600">4.8</span>
              </div>
              <div className="text-sm text-slate-600">Rating como Organizador</div>
            </CardContent>
          </Card>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {mockOrganizerMatches.map((match) => (
            <Card key={match.id} className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-800">{match.place}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(match.date).toLocaleDateString("es-AR")} - {match.time}
                      </div>
                      <Badge variant="outline">{match.fieldType}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(match.status)}
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Jugadores confirmados:</span>
                      <span className="font-semibold text-green-600">
                        {match.confirmedPlayers}/{match.totalSlots}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Postulaciones pendientes:</span>
                      <span className="font-semibold text-yellow-600">{match.pendingApplications}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(match.confirmedPlayers / match.totalSlots) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedMatch(match)}>
                          <Users className="w-4 h-4 mr-2" />
                          Ver Postulantes ({match.applicants.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Postulantes - {selectedMatch?.place}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {selectedMatch?.applicants.map((applicant: any) => (
                            <div key={applicant.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`}
                                    />
                                    <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-semibold">{applicant.name}</div>
                                    <div className="text-sm text-slate-600">{applicant.age} años</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{applicant.rating}</span>
                                  </div>
                                  {getPlayerStatusBadge(applicant.status)}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {applicant.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                      onClick={() => handleAcceptPlayer(selectedMatch.id, applicant.id)}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Aceptar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleRejectPlayer(selectedMatch.id, applicant.id)}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Rechazar
                                    </Button>
                                  </>
                                )}
                                {applicant.status === "accepted" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleWhatsApp(applicant.phone, applicant.name, selectedMatch.place)}
                                  >
                                    <Phone className="w-4 h-4 mr-1" />
                                    WhatsApp
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {match.status === "active" && (
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleConfirmMatch(match.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirmar Partido
                      </Button>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Grupo WhatsApp
                    </Button>
                    <Link href={`/match/${match.id}`}>
                      <Button variant="outline" className="w-full">
                        Ver Página Pública
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockOrganizerMatches.length === 0 && (
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Aún no creaste ningún partido</h3>
                <p className="text-slate-500 mb-6">
                  Empezá organizando tu primer partido y construí tu comunidad futbolera
                </p>
                <Link href="/create-match">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Mi Primer Partido
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
