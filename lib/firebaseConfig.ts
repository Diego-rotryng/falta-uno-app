import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDxvehhCekbK5Y4Gu2a86Sry-zxX_Q62b4",
  authDomain: "falta-uno-v2.firebaseapp.com",
  projectId: "falta-uno-v2",
  storageBucket: "falta-uno-v2.appspot.com",
  messagingSenderId: "431426445367",
  appId: "1:431426445367:web:15a4ad2c5211ce18b89f82"
}

// Inicializa la app
const app = initializeApp(firebaseConfig)

// ✅ Exportá las instancias necesarias
export const auth = getAuth(app)
export const db = getFirestore(app)
