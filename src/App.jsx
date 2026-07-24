import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router"
import Landing from "./pages/Landing"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"
import NotFound from "./pages/NotFound"

import { useEffect, useState } from "react"
import { authFirebase } from "./firebase"

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const elemento = document.querySelector(hash)
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

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
      <ScrollManager />
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
