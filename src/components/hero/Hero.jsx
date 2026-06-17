import heroImage from "../../assets/hero.png"

import './Hero.css'

const Hero = () => {
  return (
    
  <section id="hero" className="hero">
    <div className="hero__container container">

      <div className="hero__content">
        <h1 className="hero__title">
          Telemedicina en Quito <br />
          <span className="hero__highlight">fácil y rápida</span>
        </h1>

        <p className="hero__description">
          Agenda tu cita médica sin salir de casa y recibe atención de profesionales certificados.
        </p>

        <button className="hero__button">Agendar cita</button>
      </div>

      <div className="hero__image">
        <img src={heroImage} alt="Doctora en telemedicina" loading="lazy"/>
      </div>
      
    </div>
  </section>

  )
}

export default Hero