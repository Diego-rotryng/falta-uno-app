"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, User, LogOut, Settings, Trophy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "./auth-modal"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ⚽ Falta Uno
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/create-match">
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Partido
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                          <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.displayName || "Usuario"}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="/player-panel" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Mi Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/organizer-panel" className="cursor-pointer">
                          <Trophy className="mr-2 h-4 w-4" />
                          Mis Partidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("login")}
                    className="text-gray-700 hover:text-green-600"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => handleAuthClick("register")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
