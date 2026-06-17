import "./Specialties.css"

const Specialties = () => {
  return (
    <section id="specialties" className="specialties">
        <div className="container">

            <h2 className="specialties__titulo">Especialidades médicas</h2>
            <p className="specialties__subtitulo">
            Contamos con profesionales en diversas áreas para cuidar tu salud.
            </p>

            <div className="specialties__grid">

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-stethoscope"></i>
                </div>
                <h3 className="specialty__title">Medicina general</h3>
                <p className="specialty__description">
                Atención integral para el cuidado de tu salud.
                </p>
            </article>

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-baby"></i>
                </div>
                <h3 className="specialty__title">Pediatría</h3>
                <p className="specialty__description">
                Cuidado especializado para niños y adolescentes.
                </p>
            </article>

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-brain"></i>
                </div>
                <h3 className="specialty__title">Psicología</h3>
                <p className="specialty__description">
                Apoyo emocional y salud mental para tu bienestar.
                </p>
            </article>

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-hand-dots"></i>
                </div>
                <h3 className="specialty__title">Dermatología</h3>
                <p className="specialty__description">
                Diagnóstico y tratamiento para el cuidado de la piel.
                </p>
            </article>

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <h3 className="specialty__title">Cardiología</h3>
                <p className="specialty__description">
                Prevención, diagnóstico y tratamiento de enfermedades del corazón.
                </p>
            </article>

            <article className="specialty">
                <div className="specialty__icon">
                <i className="fa-solid fa-bone"></i>
                </div>
                <h3 className="specialty__title">Traumatología</h3>
                <p className="specialty__description">
                Atención de lesiones óseas, articulares y musculares.
                </p>
            </article>

            </div>

            <div className="specialties__boton-contenedor">
            <a href="#" className="specialties__boton">Ver todas las especialidades</a>
            </div>

        </div>
    </section>
  )
}

export default Specialties
