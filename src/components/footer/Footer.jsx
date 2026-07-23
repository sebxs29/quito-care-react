import "./Footer.css"
import { Link } from "react-router"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const Footer = () => {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])

  return (
    <footer className="footer">
      <div className="footer__container container">

        <div className="footer__brand" data-aos="fade-up" data-aos-delay="0">
          <h3 className="footer__logo">
            Quito
            <span className="footer__logo--highlight">Care</span>
          </h3>
          <p className="footer__description">
            Telemedicina en Quito rápida, fácil y segura
          </p>
          <div className="footer__social">
            <a href="#"><i className="fa-brands fa-facebook"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer__links" data-aos="fade-up" data-aos-delay="100">
          <h4 className="footer__title">Enlaces</h4>
          <ul>
            <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Inicio</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer__services" data-aos="fade-up" data-aos-delay="200">
          <h4 className="footer__title">Servicios</h4>
          <ul>
            <li><Link to="/servicios">Consulta en línea</Link></li>
            <li><Link to="/servicios">Especialidades</Link></li>
            <li><Link to="/nosotros">Doctores</Link></li>
            <li><Link to="/#faq">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        <div className="footer__contact" data-aos="fade-up" data-aos-delay="300">
          <h4 className="footer__title">Contacto</h4>
          <p>Quito, Ecuador</p>
          <p>info@quitocare.com</p>
          <p>+593 98 496 9316</p>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© 2026 QuitoCare. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer