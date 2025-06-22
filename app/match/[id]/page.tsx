"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Calendar, Star, Phone, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import { getMatchById, applyToMatch, getMatchApplications, type Match, type Application } from "@/lib/firestore"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [match, setMatch] = useState<Match | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const loadMatchData = async () => {
      setLoading(true)
      try {
        const matchData = await getMatchById(params.id)
        if (matchData) {
          setMatch(matchData)

          // Cargar postulaciones
          const matchApplications = await getMatchApplications(params.id)
          setApplications(matchApplications)

          // Verificar si el usuario ya se postuló
          if (user) {
            const userApplication = matchApplications.find((app) => app.playerEmail === user.email)
            setHasApplied(!!userApplication)
          }
        }
      } catch (error) {
        console.error("Error loading match data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMatchData()
  }, [params.id, user])

  const handleApply = async () => {
    if (!user || !match) return

    setApplying(true)
    try {
      const applicationData = {
        matchId: match.id!,
        playerId: user.uid,
        playerName: user.displayName || user.email?.split("@")[0] || "Usuario",
        playerEmail: user.email!,
        status: "pending" as const,
      }

      const applicationId = await applyToMatch(applicationData)

      if (applicationId) {
        setHasApplied(true)
        setShowMotivationalMessage(true)

        // Actualizar lista de postulaciones
        const updatedApplications = await getMatchApplications(params.id)
        setApplications(updatedApplications)

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setShowMotivationalMessage(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error applying to match:", error)
      alert("Error al postularse. Por favor, intentá de nuevo.")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-slate-600">Cargando partido...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Partido no encontrado</h3>
            <p className="text-slate-500 mb-4">El partido que buscás no existe o fue eliminado.</p>
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600 text-white">Volver al inicio</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Verificar si el partido está vigente
  const isMatchActive = match.fechaHora.toDate() > new Date()
  const availableSlots = match.totalSlots - match.occupiedSlots

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-green-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a partidos
            </Button>
          </Link>
        </div>

        {/* Indicador de partido vencido */}
        {!isMatchActive && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-800 font-medium mb-1">⏰ Partido Vencido</div>
              <div className="text-red-700 text-sm">
                Este partido ya se realizó o venció su fecha límite de postulación.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen y título */}
            <Card className="overflow-hidden shadow-md border-0 bg-white rounded-xl">
              <div className="relative">
                <img
                  src={match.image || "/placeholder.svg?height=400&width=600"}
                  alt={match.place}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-green-500 text-white font-semibold text-lg px-3 py-1">
                    {match.fieldType}
                  </Badge>
                </div>
                {!isMatchActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-red-500 text-white text-lg px-4 py-2">PARTIDO VENCIDO</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{match.place}</h1>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{match.address || `${match.neighborhood}, CABA`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium">
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{match.time} hs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className={`${
                        match.gender === "Varones"
                          ? "bg-blue-100 text-blue-800"
                          : match.gender === "Mujeres"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-purple-100 text-purple-800"
                      } px-3 py-1`}
                    >
                      {match.gender}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {match.minAge}-{match.maxAge} años
                    </Badge>
                    <div className="text-2xl font-bold text-green-600">${match.price.toLocaleString()}</div>
                  </div>

                  {match.description && <p className="text-slate-700 leading-relaxed">{match.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Organizador */}
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Organizador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.organizerName}`} />
                    <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl">
                      {match.organizerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-800">{match.organizerName}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-slate-500 text-sm">(Organizador verificado)</span>
                    </div>
                  </div>
                  {user && (
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Jugadores postulados */}
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Jugadores Postulados ({applications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <div key={application.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.playerName}`}
                          />
                          <AvatarFallback>{application.playerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{application.playerName}</div>
                          <div className="text-sm text-slate-500">
                            {application.appliedAt.toDate().toLocaleDateString("es-AR")}
                          </div>
                        </div>
                        <Badge
                          className={`${
                            application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : application.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {application.status === "accepted"
                            ? "✅ Aceptado"
                            : application.status === "rejected"
                              ? "❌ Rechazado"
                              : "⏳ Pendiente"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500">Aún no hay postulaciones para este partido</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Cupos disponibles */}
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-2">{availableSlots}</div>
                    <div className="text-slate-600">
                      {availableSlots === 1 ? "lugar disponible" : "lugares disponibles"}
                    </div>
                    <div className="text-sm text-slate-500">de {match.totalSlots} totales</div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(match.occupiedSlots / match.totalSlots) * 100}%` }}
                    />
                  </div>

                  {user ? (
                    <div className="space-y-3">
                      {!hasApplied && isMatchActive ? (
                        <Button
                          onClick={handleApply}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg"
                          disabled={availableSlots === 0 || applying}
                        >
                          {applying ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Postulando...
                            </>
                          ) : availableSlots === 0 ? (
                            "🔒 Completo"
                          ) : (
                            "🎯 Postularme"
                          )}
                        </Button>
                      ) : hasApplied ? (
                        <div className="space-y-3">
                          <Button disabled className="w-full bg-gray-400 text-white font-semibold py-3 text-lg">
                            ✅ Ya te postulaste
                          </Button>
                          {showMotivationalMessage && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                              <div className="text-green-800 font-medium mb-1">¡Genial! 🎉</div>
                              <div className="text-green-700 text-sm">
                                Tu postulación fue enviada. El organizador la revisará pronto.
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button disabled className="w-full bg-gray-400 text-white font-semibold py-3 text-lg">
                          ⏰ Partido Vencido
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button disabled className="w-full bg-gray-400 text-white font-semibold py-3 text-lg">
                        🔐 Iniciá sesión para postularte
                      </Button>
                      <p className="text-xs text-slate-500 text-center">
                        Necesitás una cuenta para postularte a partidos
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card className="shadow-md border-0 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Detalles del Partido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tipo de cancha:</span>
                  <span className="font-medium text-slate-800">{match.fieldType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Barrio:</span>
                  <span className="font-medium text-slate-800">{match.neighborhood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Costo por persona:</span>
                  <span className="font-medium text-green-600">${match.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Edad:</span>
                  <span className="font-medium text-slate-800">
                    {match.minAge}-{match.maxAge} años
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Género:</span>
                  <span className="font-medium text-slate-800">{match.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estado:</span>
                  <span className={`font-medium ${isMatchActive ? "text-green-600" : "text-red-600"}`}>
                    {isMatchActive ? "Vigente" : "Vencido"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
