import './Login.css'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import TypeIt from 'typeit-react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { authFirebase } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }
    
    try {
      await signInWithEmailAndPassword(authFirebase, email, password)
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Usuario no encontrado')
          break
        case 'auth/wrong-password':
          setError('Contraseña incorrecta')
          break
        case 'auth/invalid-email':
          setError('Correo electrónico inválido')
          break
        case 'auth/too-many-requests':
          setError('Demasiados intentos. Intenta más tarde')
          break
        default:
          setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 300
              }}
            >
              Quito<span className="login-title-highlight">Care</span>
            </TypeIt>
          </h2>
          <p className="login-subtitle">
            <TypeIt
              options={{
                speed: 80,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 800
              }}
            >
              Bienvenido de vuelta
            </TypeIt>
          </p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" /> Recordarme
            </label>
            <Link to="/recuperar" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
