import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Tu configuración web de Firebase proporcionada
const firebaseConfig = {
  apiKey: "AIzaSyDnd7c2YZ8hDYOa_1ZXXmB9q09bfjnPtRk",
  authDomain: "dias-pipe.firebaseapp.com",
  projectId: "dias-pipe",
  storageBucket: "dias-pipe.firebasestorage.app",
  messagingSenderId: "1056465678198",
  appId: "1:1056465678198:web:2901627f949f4e81509457",
  // Cuando habilitas Realtime Database, a veces te da una databaseURL.
  // Si no te la dio en el snippet original de "web", usualmente en us-central 
  // esta es la URL automática:
  databaseURL: "https://dias-pipe-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Realtime Database y exportarla para usarla en App.jsx
export const db = getDatabase(app);
