import { useState } from "react"
import emailjs from "@emailjs/browser"
import { dbFirebase } from "../../firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import "./Contact.css"

const Contact = () => {
  const [form, setForm] = useState({
    especialidad: "",
    nombre: "",
    correo: "",
    celular: "",
    motivo: "",
  })

  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMensaje("")

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setEnviando(true)

    try {
      // Guardar la solicitud en Firestore
      await addDoc(collection(dbFirebase, "solicitudes"), {
        ...form,
        fechaCreacion: serverTimestamp(),
      })

      // Enviar correo de confirmación con EmailJS
      await emailjs.send(
        "service_sytrnhx",
        "template_rto2rxu",
        {
          nombre: form.nombre,
          correo: form.correo,
          especialidad: form.especialidad,
          motivo: form.motivo,
          celular: form.celular,
        },
        "S268zx1GtNTal5Zc9"
      )

      setMensaje("¡Solicitud enviada! Revisa tu correo para la confirmación.")
      setForm({ especialidad: "", nombre: "", correo: "", celular: "", motivo: "" })
      setAceptaTerminos(false)

    } catch (err) {
      console.log(err)
      setError("No se pudo enviar la solicitud. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact__container container">

        <div className="contact__form">
          <h2 className="contact__title">
            Registra tus datos
          </h2>

          <form onSubmit={handleSubmit}>

            <p className="contact__description">
              Escribe la especialidad médica que necesitas
            </p>

            <input
              type="text"
              name="especialidad"
              placeholder="Ej: Cardiología, Psicología..."
              className="contact__input"
              value={form.especialidad}
              onChange={handleChange}
              required
            />

            <p className="contact__description">
              Llena los siguientes items
            </p>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className="contact__input"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              className="contact__input"
              value={form.correo}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="celular"
              placeholder="Número de celular"
              className="contact__input"
              value={form.celular}
              onChange={handleChange}
              required
            />

            <textarea
              name="motivo"
              placeholder="Describe el motivo de tu cita..."
              className="contact__textarea"
              value={form.motivo}
              onChange={handleChange}
              required
            ></textarea>

            <div className="contact__check">
              <input
                type="checkbox"
                id="terms"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />

              <label htmlFor="terms">
                Acepto los términos y condiciones
              </label>
            </div>

            {error && <p className="mensaje-formulario" style={{ color: "#d63031" }}>{error}</p>}
            {mensaje && <p className="mensaje-formulario">{mensaje}</p>}

            <button
              type="submit"
              className="contact__button"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>

          </form>
        </div>

        <div className="contact__map">
          <iframe
            src="https://www.google.com/maps?q=Quito,Ecuador&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Mapa de Quito"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default Contact;