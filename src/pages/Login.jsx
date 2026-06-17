import './Login.css'
import { Link } from 'react-router'
import { useState } from 'react'
import TypeIt from 'typeit-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }
    
    console.log('Email:', email)
    console.log('Password:', password)
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
          
          <button type="submit" className="login-button">
            Iniciar Sesión
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