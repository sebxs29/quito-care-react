import './Header.css'
import { Link } from 'react-router'
import TypeIt from 'typeit-react'

const Header = () => {
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
        </div>

        <ul className="nav__menu" id="navMenu">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li>
            <Link to="/login" className="nav__login-btn">
              LOGIN
            </Link>
          </li>
          <li>
            <Link to="/registro" className="nav__register-btn">
              REGISTRO
            </Link>
          </li>
        </ul>

      </nav>
    </header>
  )
}

export default Header
