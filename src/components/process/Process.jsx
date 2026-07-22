import "./Process.css";

const steps = [
  {
    number: "01",
    title: "Agenda tu cita",
    description:
      "Elige la especialidad que necesitas y reserva tu horario en línea, sin llamadas ni filas.",
  },
  {
    number: "02",
    title: "Evaluación inicial",
    description:
      "Nuestro equipo revisa tu historial y prepara todo para que la consulta sea ágil y precisa.",
  },
  {
    number: "03",
    title: "Consulta con el especialista",
    description:
      "Recibes atención personalizada con el médico indicado para tu caso.",
  },
  {
    number: "04",
    title: "Seguimiento continuo",
    description:
      "Te acompañamos después de la consulta con recordatorios y controles cuando corresponda.",
  },
];

const Process = () => {
  return (
    <section id="process" className="process">
      <div className="process__container container">
        <h2 className="process__title">Cómo funciona tu atención</h2>
        <p className="process__subtitle">
          Un proceso simple, pensado para que llegues a tu consulta sin
          complicaciones.
        </p>

        <div className="process__steps">
          {steps.map((step) => (
            <div className="process__step" key={step.number}>
              <span className="process__number">{step.number}</span>
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;