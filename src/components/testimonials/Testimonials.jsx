
import "./Testimonials.css"

const Testimonials = () => {
  return (

    <section id="testimonios" className="testimonios">
        <div className="container">

            <div className="testimonios__header">
            <p className="testimonios__label">TESTIMONIOS</p>
            <h2 className="testimonios__titulo">Lo que dicen nuestros pacientes</h2>
            <p className="testimonios__subtitulo">
                Miles de personas ya confían en QuitoCare para cuidar su salud
                desde la comodidad de su hogar.
            </p>
            </div>

            <div className="testimonios__grid">

            <article className="testimonio">
                <div className="testimonio__estrellas">★★★★★</div>
                <p className="testimonio__texto">"La atención fue rápida y muy profesional. Pude resolver todas mis dudas desde casa."</p>
                <div className="testimonio__autor">
                <img src="https://ui-avatars.com/api/?name=Maria+Gonzalez&background=2ECC71&color=fff&rounded=true" 
                    alt="María González" className="testimonio__foto"/>
                <div>
                    <p className="testimonio__nombre">María González</p>
                    <p className="testimonio__lugar">Quito, Ecuador</p>
                </div>
                </div>
            </article>

            <article className="testimonio">
                <div className="testimonio__estrellas">★★★★★</div>
                <p className="testimonio__texto">"Excelente plataforma, fácil de usar y los doctores son muy amables y capacitados."</p>
                <div className="testimonio__autor">
                <img src="https://ui-avatars.com/api/?name=Carlos+Mendez&background=2ECC71&color=fff&rounded=true" 
                    alt="Carlos Méndez" className="testimonio__foto"/>
                <div>
                    <p className="testimonio__nombre">Carlos Méndez</p>
                    <p className="testimonio__lugar">Quito, Ecuador</p>
                </div>
                </div>
            </article>

            <article className="testimonio">
                <div className="testimonio__estrellas">★★★★★</div>
                <p className="testimonio__texto">"Agendar una cita es súper sencillo y la consulta en línea funciona perfecto."</p>
                <div className="testimonio__autor">
                <img src="https://ui-avatars.com/api/?name=Ana+Ruiz&background=2ECC71&color=fff&rounded=true" 
                    alt="Ana Ruiz" className="testimonio__foto"/>
                <div>
                    <p className="testimonio__nombre">Ana Ruiz</p>
                    <p className="testimonio__lugar">Quito, Ecuador</p>
                </div>
                </div>
            </article>

            </div>

        </div>
    </section>

  )
}

export default Testimonials
