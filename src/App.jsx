import { Routes, Route, BrowserRouter, Navigate } from "react-router"
import Landing from "./pages/Landing"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"

import { useEffect, useState } from "react"
import { authFirebase } from "./firebase"

function App() {

  const [user, setUser] = useState("");

  useEffect(() => {
    authFirebase.onAuthStateChanged((user) => {
      setUser(user)
    })
  }, [])

  return (

  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/registro"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
