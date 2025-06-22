import { db } from "./firebaseConfig"
import { collection, addDoc, getDocs, doc, getDoc, query, where, orderBy, Timestamp } from "firebase/firestore"

export interface Match {
  id?: string
  organizerName: string
  organizerEmail: string
  organizerId: string
  place: string
  neighborhood: string
  address?: string
  fieldType: string
  date: string
  time: string
  fechaHora: Timestamp
  totalSlots: number
  occupiedSlots: number
  minAge: number
  maxAge: number
  gender: string
  price: number
  description?: string
  image?: string
  status: "active" | "confirmed" | "completed" | "cancelled"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Application {
  id?: string
  matchId: string
  playerId: string
  playerName: string
  playerEmail: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: Timestamp
}

// Obtener partidos vigentes sin requerir índice compuesto
export async function getActiveMatches(): Promise<Match[]> {
  try {
    const now = Timestamp.now()
    const matchesRef = collection(db, "partidos")

    // ✅ Solo filtramos por fechaHora para evitar índice compuesto
    const q = query(matchesRef, where("fechaHora", ">", now), orderBy("fechaHora", "asc"))

    const querySnapshot = await getDocs(q)
    const matches: Match[] = []

    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data(),
      } as Match)
    })

    // ✅ Filtramos status === "active" en el cliente
    return matches.filter((m) => m.status === "active")
  } catch (error) {
    console.error("Error fetching active matches:", error)
    return []
  }
}

// Función para obtener todos los partidos (para paneles de admin)
export async function getAllMatches(): Promise<Match[]> {
  try {
    const matchesRef = collection(db, "partidos")
    const q = query(matchesRef, orderBy("fechaHora", "desc"))

    const querySnapshot = await getDocs(q)
    const matches: Match[] = []

    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data(),
      } as Match)
    })

    return matches
  } catch (error) {
    console.error("Error fetching all matches:", error)
    return []
  }
}

// Función para obtener un partido específico
export async function getMatchById(matchId: string): Promise<Match | null> {
  try {
    const matchRef = doc(db, "partidos", matchId)
    const matchSnap = await getDoc(matchRef)

    if (matchSnap.exists()) {
      return {
        id: matchSnap.id,
        ...matchSnap.data(),
      } as Match
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching match:", error)
    return null
  }
}

// Función para crear un nuevo partido
export async function createMatch(matchData: Omit<Match, "id" | "createdAt" | "updatedAt">): Promise<string | null> {
  try {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, "partidos"), {
      ...matchData,
      createdAt: now,
      updatedAt: now,
    })

    console.log("Match created with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error creating match:", error)
    return null
  }
}

// Función para obtener partidos de un organizador
export async function getMatchesByOrganizer(organizerId: string): Promise<Match[]> {
  try {
    const matchesRef = collection(db, "partidos")
    const q = query(matchesRef, where("organizerId", "==", organizerId), orderBy("fechaHora", "desc"))

    const querySnapshot = await getDocs(q)
    const matches: Match[] = []

    querySnapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data(),
      } as Match)
    })

    return matches
  } catch (error) {
    console.error("Error fetching organizer matches:", error)
    return []
  }
}

// Función para aplicar a un partido
export async function applyToMatch(application: Omit<Application, "id">): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "applications"), {
      ...application,
      appliedAt: Timestamp.now(),
    })

    console.log("Application created with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error applying to match:", error)
    return null
  }
}

// Función para obtener postulaciones de un partido
export async function getMatchApplications(matchId: string): Promise<Application[]> {
  try {
    const applicationsRef = collection(db, "applications")
    const q = query(applicationsRef, where("matchId", "==", matchId), orderBy("appliedAt", "desc"))

    const querySnapshot = await getDocs(q)
    const applications: Application[] = []

    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      } as Application)
    })

    return applications
  } catch (error) {
    console.error("Error fetching match applications:", error)
    return []
  }
}
