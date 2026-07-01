import { Routes, Route } from "react-router"
import Landing from "./pages/Landing"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Nosotros from "./pages/Nosotros"
import Contacto from "./pages/Contacto"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/servicios" element={<Services/>}/>
      <Route path="/nosotros" element={<Nosotros/>}/>
      <Route path="/contacto" element={<Contacto/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/registro" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
