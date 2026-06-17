import './Register.css'
import { Link } from 'react-router'
import { useState } from 'react'
import TypeIt from 'typeit-react'

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const { nombre, email, password, confirmPassword } = formData

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    console.log('Registro:', formData)
    setSuccess(true)
    // Aquí iría la lógica de registro
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 300
              }}
            >
              Quito<span className="register-title-highlight">Care</span>
            </TypeIt>
          </h2>
          <p className="register-subtitle">
            <TypeIt
              options={{
                speed: 80,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 800
              }}
            >
              Crea tu cuenta gratis
            </TypeIt>
          </p>
        </div>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">¡Registro exitoso! Redirigiendo...</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-terms">
            <label className="terms-check">
              <input type="checkbox" required /> 
              Acepto los <Link to="/terminos">Términos y Condiciones</Link>
            </label>
          </div>

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register