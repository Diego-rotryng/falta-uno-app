'use client'

import { useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebaseConfig";

export default function Login() {
  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth)
          .then(() => {
            console.log("Sesión anónima iniciada");
          })
          .catch((error) => {
            console.error("Error al iniciar sesión anónima:", error);
          });
      } else {
        console.log("Usuario ya autenticado:", user.uid);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Bienvenido a Falta Uno</h1>
      <p className="mt-2">Sesión iniciada automáticamente.</p>
    </div>
  );
}
