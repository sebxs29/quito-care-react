import { Routes, Route } from "react-router"
import Landing from "./pages/Landing"
import Services from "./pages/Services"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/servicios" element={<Services/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/registro" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
