import { Link } from "react-router"
import "./NotFound.css"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🤒</div>
        <h1 className="not-found-title">¡Ups! Página no encontrada</h1>
        <p className="not-found-message">
          La página que estás buscando no existe o fue movida.
        </p>
        <Link to="/" className="not-found-btn">
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound
