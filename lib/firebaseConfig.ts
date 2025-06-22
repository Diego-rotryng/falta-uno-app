// firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBA-U9Jba2MGhGNMc5zOeejEJz6wEV2hIM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "falta-unov2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "falta-unov2",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "falta-unov2.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || "605906272324",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:605906272324:web:615e3287ac52c418877178",
}

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.log("[Firebase] apiKey que llega al cliente →", firebaseConfig.apiKey)
}

// Tiny sanity-check
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
  // eslint-disable-next-line no-console
  console.warn("[Firebase] apiKey is missing or too short. " + "Check your NEXT_PUBLIC_FIREBASE_API_KEY env variable.")
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }
