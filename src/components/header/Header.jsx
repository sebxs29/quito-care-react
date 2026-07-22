import { useState } from 'react'
import './Header.css'
import { Link } from 'react-router'
import TypeIt from 'typeit-react'

const Header = () => {
// MENU HAMBURGESA
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  }

  return (
    <header className="header">
      <nav className="nav__header container">

        <div className="nav__top">
          <h1 className="navbar_logo">
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false,
              }}
            >
              Quito<span className="navbar__logo--primary">Care</span>
            </TypeIt>
          </h1>

          <button
            type='button'
            className={`nav__hamburger ${menuAbierto ? "nav__hamburger--activo" : ""}`}
              onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        <ul
          className={`nav__menu ${menuAbierto ? "nav__menu--activo" : ""}`}
          id="navMenu"
        >
          <li><Link to="/" onClick={cerrarMenu}>Inicio</Link></li>
          <li><Link to="/servicios" onClick={cerrarMenu}>Servicios</Link></li>
          <li><Link to="/nosotros" onClick={cerrarMenu}>Nosotros</Link></li>
          <li><Link to="/contacto" onClick={cerrarMenu}>Contacto</Link></li>
          <li><Link to="/login" className="nav__login-btn" onClick={cerrarMenu}>LOGIN</Link></li>
          <li><Link to="/registro" className="nav__register-btn" onClick={cerrarMenu}>REGISTRO</Link></li>
        </ul>

      </nav>
    </header>
  )
}

export default Header
