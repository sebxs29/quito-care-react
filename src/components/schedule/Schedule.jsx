import "./Schedule.css";

const schedule = [
  { day: "Lunes a Viernes", hours: "08:00 - 19:00", mode: "Videoconsulta y chat", type: "normal" },
  { day: "Sábados", hours: "09:00 - 14:00", mode: "Videoconsulta", type: "normal" },
  { day: "Domingos", hours: "Cerrado", mode: "Emergencias por WhatsApp", type: "emergency" },
  { day: "Feriados nacionales", hours: "Cerrado", mode: "Emergencias por WhatsApp", type: "emergency" },
];

const Schedule = () => {
  return (
    <section id="schedule" className="schedule">
      <div className="schedule__container container">
        <h2 className="schedule__title">Horarios de atención</h2>
        <p className="schedule__subtitle">
          Conéctate con un especialista desde donde estés, en el horario que mejor te acomode.
        </p>

        <div className="schedule__table">
          {schedule.map((item) => (
            <div className="schedule__row" key={item.day}>
              <span className="schedule__day">{item.day}</span>
              <span className="schedule__hours">{item.hours}</span>
              <span className={`schedule__badge schedule__badge--${item.type}`}>
                {item.mode}
              </span>
            </div>
          ))}
        </div>

        <p className="schedule__note">
          Todas las consultas son en línea. Recomendamos agendar con al menos 24 horas de anticipación para asegurar disponibilidad.
        </p>
      </div>
    </section>
  );
};

export default Schedule;