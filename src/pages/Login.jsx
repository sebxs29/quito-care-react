import './Login.css'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import TypeIt from 'typeit-react'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { authFirebase, googleProvider } from "../firebase";

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

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(authFirebase, googleProvider)
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Cerraste la ventana de Google')
          break
        case 'auth/popup-blocked':
          setError('El navegador bloqueó la ventana emergente. Permite popups e intenta de nuevo')
          break
        case 'auth/cancelled-popup-request':
          setError('Solicitud cancelada')
          break
        default:
          setError('No se pudo iniciar sesión con Google')
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
        
        <button 
          type="button" 
          className="google-button" 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Cargando...' : 'Iniciar sesión con Google'}
        </button>

        <div className="login-divider">
          <span>o</span>
        </div>
        
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
