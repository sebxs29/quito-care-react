import './Dashboard.css';
import { authFirebase, dbFirebase } from '../firebase';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';

import { ToastContainer, toast } from "react-toastify";

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

import TypeIt from 'typeit-react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

import { doctores } from '../data/doctores';

ChartJS.register(ArcElement, Tooltip, Legend);


const especialidades = [
  ...new Set(
    doctores.map((doctor) => doctor.especialidad)
  )
];


const Dashboard = () => {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      especialidad: "",
      doctorId: "",
      fecha: "",
      hora: "",
      modalidad: "Videollamada",
      motivo: ""
    }
  });

  const [citas, setCitas] = useState([]);

  // DARK
const [modoOscuro, setModoOscuro] = useState(() => {
  return localStorage.getItem("tema") === "oscuro";
});

useEffect(() => {
  document.documentElement.classList.toggle(
    "dark-mode",
    modoOscuro
  );

  localStorage.setItem(
    "tema",
    modoOscuro ? "oscuro" : "claro"
  );
}, [modoOscuro]);

const handleChangeColor = () => {
  setModoOscuro((estadoAnterior) => !estadoAnterior);
};

  // Guarda el ID de la cita que se está actualizando
  const [id, setId] = useState("");


  const especialidadSeleccionada = watch("especialidad");


  const doctoresFiltrados = doctores.filter(
    (doctor) =>
      doctor.especialidad === especialidadSeleccionada
  );


  const fechaActual = new Date()
    .toISOString()
    .split("T")[0];


  // CERRAR SESIÓN
  const handleLogout = async () => {

    try {

      await signOut(authFirebase);

      window.location.href = "/";

    } catch (error) {

      console.log(error);

    }

  };


  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': '#f39c12',
      'Confirmada': '#27ae60',
      'Completada': '#3498db',
      'Cancelada': '#e74c3c',
      'Inasistencia': '#95a5a6'
    };
    return colores[estado] || '#95a5a6';
  };


  // LISTAR LAS CITAS DEL USUARIO AUTENTICADO
  const handleGet = async () => {

    try {

      const usuarioActual = authFirebase.currentUser;

      if (!usuarioActual) {
        return;
      }


      const citasQuery = query(
        collection(dbFirebase, "citas"),
        where(
          "pacienteId",
          "==",
          usuarioActual.uid
        )
      );


      const snapshot = await getDocs(citasQuery);

      const ahora = new Date();
      const documentos = [];

      for (const documento of snapshot.docs) {
        const cita = { ...documento.data(), id: documento.id };

        if (cita.fecha && cita.hora) {
          const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);

          if (fechaCita < ahora && (cita.estado === "Pendiente" || cita.estado === "Confirmada")) {
            const nuevoEstado = cita.estado === "Pendiente"
              ? "Inasistencia"
              : "Completada";

            const citaRef = doc(dbFirebase, "citas", documento.id);
            await updateDoc(citaRef, { estado: nuevoEstado });
            cita.estado = nuevoEstado;
          }
        }

        documentos.push(cita);
      }

      setCitas(documentos);

    } catch (error) {

      console.log(error);
      toast.error("No se pudieron cargar las citas");

    }

  };


  // CREAR O ACTUALIZAR UNA CITA
const handleCreate = async (data) => {

  const estaActualizando = Boolean(id);

  try {

    const usuarioActual = authFirebase.currentUser;

    if (!usuarioActual) {
      toast.error("No existe un usuario autenticado");
      return;
    }

    const doctorSeleccionado = doctores.find(
      (doctor) => doctor.id === data.doctorId
    );

    if (!doctorSeleccionado) {
      toast.warning("Debe seleccionar un doctor");
      return;
    }

    // VALIDACIÓN 0: Verificar horario de atención
    const fechaSeleccionada = new Date(data.fecha + "T00:00:00");
    const diaSemana = fechaSeleccionada.getDay();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diasSemana[diaSemana];

    if (diaSemana === 0) {
      toast.error("❌ Los domingos la clínica está cerrada. Solo emergencias por WhatsApp");
      return;
    }

    const [horaNum, minutoNum] = data.hora.split(":").map(Number);
    const horaTotal = horaNum + (minutoNum / 60);

    let horarioInicio, horarioFin, mensajeHorario;

    if (diaSemana === 6) {
      horarioInicio = 9.0;
      horarioFin = 14.0;
      mensajeHorario = "09:00 a 14:00";
    } else {
      horarioInicio = 8.0;
      horarioFin = 19.0;
      mensajeHorario = "08:00 a 19:00";
    }

    if (horaTotal < horarioInicio || horaTotal > horarioFin) {
      toast.error(`❌ Los ${nombreDia} el horario de atención es de ${mensajeHorario}`);
      return;
    }

    // VALIDACIÓN 1: Verificar disponibilidad del doctor
    const doctorQuery = query(
      collection(dbFirebase, "citas"),
      where("doctorId", "==", doctorSeleccionado.id),
      where("fecha", "==", data.fecha),
      where("hora", "==", data.hora)
    );
    const doctorSnapshot = await getDocs(doctorQuery);

    if (estaActualizando) {
      const ocupadaPorOtro = doctorSnapshot.docs.some(
        (documento) => documento.id !== id
      );
      if (ocupadaPorOtro) {
        toast.error("❌ El doctor ya tiene una cita agendada en esa fecha y hora");
        return;
      }
    } else {
      if (!doctorSnapshot.empty) {
        toast.error("❌ El doctor ya tiene una cita agendada en esa fecha y hora");
        return;
      }
    }

    // VALIDACIÓN 2: Verificar si el paciente ya tiene cita en ese horario
    const pacienteQuery = query(
      collection(dbFirebase, "citas"),
      where("pacienteId", "==", usuarioActual.uid),
      where("fecha", "==", data.fecha),
      where("hora", "==", data.hora)
    );
    const pacienteSnapshot = await getDocs(pacienteQuery);

    if (estaActualizando) {
      const pacienteOcupado = pacienteSnapshot.docs.some(
        (documento) => documento.id !== id
      );
      if (pacienteOcupado) {
        toast.error("❌ Ya tienes una cita agendada en esa fecha y hora");
        return;
      }
    } else {
      if (!pacienteSnapshot.empty) {
        toast.error("❌ Ya tienes una cita agendada en esa fecha y hora");
        return;
      }
    }

    // VALIDACIÓN 3: Verificar tiempo mínimo entre citas (1 hora)
    const pacienteCitasQuery = query(
      collection(dbFirebase, "citas"),
      where("pacienteId", "==", usuarioActual.uid),
      where("fecha", "==", data.fecha)
    );
    const pacienteCitasSnapshot = await getDocs(pacienteCitasQuery);

    for (const documento of pacienteCitasSnapshot.docs) {
      if (estaActualizando && documento.id === id) continue;

      const citaExistente = documento.data();
      const [horaExistente, minutoExistente] = citaExistente.hora.split(":").map(Number);
      const [horaNueva, minutoNueva] = data.hora.split(":").map(Number);

      const totalMinExistente = horaExistente * 60 + minutoExistente;
      const totalMinNueva = horaNueva * 60 + minutoNueva;
      const diferencia = Math.abs(totalMinNueva - totalMinExistente);

      if (diferencia < 60) {
        toast.error("❌ Debe haber al menos 1 hora entre tus citas");
        return;
      }
    }

    // Si pasa todas las validaciones, guardar la cita
    if (estaActualizando) {

      await updateDoc(
        doc(dbFirebase, "citas", id),
        {
          especialidad: data.especialidad,
          doctorId: doctorSeleccionado.id,
          doctorNombre: doctorSeleccionado.nombre,
          fecha: data.fecha,
          hora: data.hora,
          modalidad: data.modalidad,
          motivo: data.motivo,
          fechaActualizacion: serverTimestamp()
        }
      );

      setId("");

      toast.success("✅ Cita actualizada correctamente");

    } else {

      const nuevaCita = {
        pacienteId: usuarioActual.uid,
        pacienteEmail: usuarioActual.email,
        especialidad: data.especialidad,
        doctorId: doctorSeleccionado.id,
        doctorNombre: doctorSeleccionado.nombre,
        fecha: data.fecha,
        hora: data.hora,
        modalidad: data.modalidad,
        motivo: data.motivo,
        estado: "Pendiente",
        fechaCreacion: serverTimestamp()
      };

      await addDoc(
        collection(dbFirebase, "citas"),
        nuevaCita
      );

      toast.success("✅ Cita agendada correctamente");
    }

    reset({
      especialidad: "",
      doctorId: "",
      fecha: "",
      hora: "",
      modalidad: "Videollamada",
      motivo: ""
    });

    await handleGet();

  } catch (error) {

    console.error(error);

    toast.error(
      estaActualizando
        ? "❌ No se pudo actualizar la cita"
        : "❌ No se pudo registrar la cita"
    );
  }
};


  // CARGAR LOS DATOS DE UNA CITA EN EL FORMULARIO
  const handleEdit = (cita) => {

    setId(cita.id);


    reset({
      especialidad: cita.especialidad,
      doctorId: cita.doctorId,
      fecha: cita.fecha,
      hora: cita.hora,
      modalidad: cita.modalidad,
      motivo: cita.motivo
    });


    toast.warning(
      "Está editando una cita"
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // CANCELAR LA ACTUALIZACIÓN
  const handleCancelEdit = () => {

    setId("");


    reset({
      especialidad: "",
      doctorId: "",
      fecha: "",
      hora: "",
      modalidad: "Videollamada",
      motivo: ""
    });


  };


  // ELIMINAR UNA CITA
const handleDelete = async (idCita) => {

  const confirmar = window.confirm(
    "¿Estás seguro de eliminar esta cita?"
  );

  if (!confirmar) {
    return;
  }

  try {

    await deleteDoc(
      doc(dbFirebase, "citas", idCita)
    );

    if (id === idCita) {
      handleCancelEdit();
    }

    await handleGet();

    toast.success(
      "Cita eliminada correctamente"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "No se pudo eliminar la cita"
    );
  }
};


  // CARGAR LAS CITAS CUANDO SE ABRE EL DASHBOARD
  useEffect(() => {

    handleGet();

  }, []);

// AGRUPAR LAS CITAS POR ESPECIALIDAD
const citasPorEspecialidad = citas.reduce(
  (acumulador, cita) => {

    const especialidad = cita.especialidad?.trim() || "Sin especialidad";

    acumulador[especialidad] = (acumulador[especialidad] || 0) + 1;
    
    return acumulador;

  }, {}

);

// DATOS DEL GRAFICO
const datosGraficosEspecialidades = {

  labels: Object.keys(citasPorEspecialidad),

  datasets: [
    {
      label: "Cantidad de citas",
      data: Object.values(citasPorEspecialidad),
      backgroundColor: [
                "#2ECC71",
        "#3498DB",
        "#9B59B6",
        "#F39C12",
        "#E74C3C",
        "#1ABC9C",
        "#34495E"
      ],
      borderColor: modoOscuro ? "#1f2937" : "#ffffff",
      borderWidth: 2
    }
  ]

};

// CONFIGURACION DEL GRAFICO
const opcionesGraficosEspecialidades = {

  responsive: true,
  maintainAspectRatio: false,
  plugins: {

    legend: {
      position: "bottom",
      labels: {
        color: modoOscuro ? "#f5f5f5" : "#333333",
        padding: 16
      }
    },

    tooltip: {

      callbacks: {

        label: (context) => {

          const cantidad = context.raw;

          return `${context.label}: ${cantidad} ${cantidad == 1 ? "cita" : "citas"}`

        }

      }
    }
  }

};

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      limit={3}
      theme={modoOscuro ? "dark" : "light"}
    />

      <section className="header_projects">

        <div className="user-info">

          {authFirebase.currentUser?.photoURL ? (

            <img
              className="user-avatar"
              src={
                authFirebase.currentUser.photoURL
              }
              alt="Foto de perfil"
            />

          ) : (

            <div className="user-avatar-placeholder">

              {
                authFirebase.currentUser
                  ?.displayName
                  ?.charAt(0)
                ||
                authFirebase.currentUser
                  ?.email
                  ?.charAt(0)
                ||
                "?"
              }

            </div>

          )}


          <div>

            {
              authFirebase.currentUser
                ?.displayName
              &&
              (
                <p className="user-name">

                  {
                    authFirebase
                      .currentUser
                      .displayName
                  }

                </p>
              )
            }


            <p className="user-email">

              {
                authFirebase
                  .currentUser
                  ?.email
              }

            </p>

          </div>

        </div>


        <div className="header_actions">

<button
  type="button"
  className="theme-toggle"
  onClick={handleChangeColor}
  aria-label={
    modoOscuro
      ? "Activar modo claro"
      : "Activar modo oscuro"
  }
  title={
    modoOscuro
      ? "Activar modo claro"
      : "Activar modo oscuro"
  }
>
  {modoOscuro ? "☀️" : "🌙"}
</button>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Salir
          </button>

        </div>

      </section>


      <section className="container_projects">

        <section className="form-section">

          <h1 className="dashboard-title">

            <TypeIt
              key={
                id
                  ? `actualizar-${id}`
                  : "agendar"
              }
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false
              }}
            >

              {
                id
                  ? "Actualizar "
                  : "Agendar "
              }

              <span className="highlight">
                Cita Médica
              </span>

            </TypeIt>

          </h1>


          <p>

            {
              id
                ? "Modifique la información de la cita seleccionada"
                : "Complete la información para registrar una nueva cita"
            }

          </p>


          <form
            className="route-form"
            onSubmit={
              handleSubmit(handleCreate)
            }
          >

            <label>
              Especialidad:
            </label>


            <select
              {...register(
                "especialidad",
                {
                  required:
                    "La especialidad es requerida",

                  onChange: () => {

                    setValue(
                      "doctorId",
                      ""
                    );

                  }
                }
              )}
            >

              <option value="">
                Seleccione una especialidad
              </option>


              {
                especialidades.map(
                  (especialidad) => (

                    <option
                      key={especialidad}
                      value={especialidad}
                    >
                      {especialidad}
                    </option>

                  )
                )
              }

            </select>


            {
              errors.especialidad
              &&
              (
                <span className="errors">

                  {
                    errors
                      .especialidad
                      .message
                  }

                </span>
              )
            }


            <label>
              Doctor:
            </label>


            <select
              disabled={
                !especialidadSeleccionada
              }
              {...register(
                "doctorId",
                {
                  required:
                    "El doctor es requerido"
                }
              )}
            >

              <option value="">
                Seleccione un doctor
              </option>


              {
                doctoresFiltrados.map(
                  (doctor) => (

                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.nombre}
                    </option>

                  )
                )
              }

            </select>


            {
              errors.doctorId
              &&
              (
                <span className="errors">

                  {
                    errors
                      .doctorId
                      .message
                  }

                </span>
              )
            }


            <label>
              Fecha:
            </label>


            <input
              type="date"
              min={fechaActual}
              {...register(
                "fecha",
                {
                  required:
                    "La fecha es requerida"
                }
              )}
            />


            {
              errors.fecha
              &&
              (
                <span className="errors">

                  {
                    errors
                      .fecha
                      .message
                  }

                </span>
              )
            }


            <label>
              Hora:
            </label>


            <input
              type="time"
              {...register(
                "hora",
                {
                  required:
                    "La hora es requerida"
                }
              )}
            />


            {
              errors.hora
              &&
              (
                <span className="errors">

                  {
                    errors
                      .hora
                      .message
                  }

                </span>
              )
            }


            <label>
              Modalidad:
            </label>


            <select
              {...register(
                "modalidad",
                {
                  required:
                    "La modalidad es requerida"
                }
              )}
            >

              <option value="Videollamada">
                Videollamada
              </option>

              <option value="Chat">
                Chat
              </option>

              <option value="Presencial">
                Presencial
              </option>

            </select>


            {
              errors.modalidad
              &&
              (
                <span className="errors">

                  {
                    errors
                      .modalidad
                      .message
                  }

                </span>
              )
            }


            <label>
              Motivo de la consulta:
            </label>


            <textarea
              placeholder="Describa brevemente el motivo de la consulta"
              {...register(
                "motivo",
                {
                  required:
                    "El motivo es requerido",

                  validate: {
                    noSoloEspacios: (valor) => {
                      if (/^\s*$/.test(valor)) {
                        return "❌ El motivo no puede estar vacío o contener solo espacios";
                      }
                      return true;
                    },
                    caracteresSignificativos: (valor) => {
                      const chars = valor.replace(/\s/g, "").length;
                      if (chars < 10) {
                        return "❌ El motivo debe tener al menos 10 caracteres significativos (sin contar espacios)";
                      }
                      return true;
                    },
                    minimoPalabras: (valor) => {
                      const palabras = valor.trim().split(/\s+/);
                      if (palabras.length < 3) {
                        return "❌ El motivo debe tener al menos 3 palabras para describir el motivo de la consulta";
                      }
                      return true;
                    },
                    noCaracteresRepetidos: (valor) => {
                      if (/(.)\1{4,}/.test(valor)) {
                        return "❌ El motivo contiene demasiados caracteres repetidos";
                      }
                      return true;
                    },
                    caracteresPermitidos: (valor) => {
                      if (!/^[a-zA-ZáéíóúñÑü\s\d.,;:!?()\-]+$/.test(valor)) {
                        return "❌ El motivo solo puede contener letras, números, espacios y puntuación básica";
                      }
                      return true;
                    }
                  }
                }
              )}
            />


            {
              errors.motivo
              &&
              (
                <span className="errors">

                  {
                    errors
                      .motivo
                      .message
                  }

                </span>
              )
            }

            <input
              className="btn"
              type="submit"
              value={
                id
                  ? "Actualizar cita"
                  : "Agendar cita"
              }
            />


            {
              id
              &&
              (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancelar edición
                </button>
              )
            }

          </form>

        </section>


        <section className="chart-section">
            <h2>Mis citas por especialidad</h2>
            <p>Distribución de las citas médicas registradas</p>

            {
              citas.length == 0 ? (
                <div className="chart-empty">No existen citas para mostrar en el gráfico</div>
              ) 
              :
              (
                <div className='chart-container'>

                  <Doughnut
                    data={datosGraficosEspecialidades}
                  options={opcionesGraficosEspecialidades}
                  />

                </div>
              )
            }

        </section>


        <section className="routes-section">

          <h4>
            Mis citas
          </h4>

          <p>
            Listado de citas agendadas
          </p>


          {
            citas.length === 0
            &&
            (
              <div className="no-routes">
                No existen registros...
              </div>
            )
          }


          {
            citas.map((cita) => (

              <div
                className="route-card"
                key={cita.id}
              >

                <div className="route-info">

                  <p>
                    <strong>ID:</strong> {cita.id}
                  </p>

                  <p>
                    Especialidad: {cita.especialidad}
                  </p>

                  <p>
                    Doctor: {cita.doctorNombre}
                  </p>

                  <p>
                    Fecha: {cita.fecha}
                  </p>

                  <p>
                    Hora: {cita.hora}
                  </p>

                  <p>
                    Modalidad: {cita.modalidad}
                  </p>

                  <p>
                    Motivo: {cita.motivo}
                  </p>

                  <p>
                    <strong>Estado:</strong>{' '}
                    <span
                      className="estado-badge"
                      style={{
                        backgroundColor: getEstadoColor(cita.estado),
                        color: '#fff',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '1rem',
                        marginLeft: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      {cita.estado}
                    </span>
                  </p>

                </div>


                <div className="route-actions">

                  <button
                    type="button"
                    className="update-btn"
                    onClick={() => {
                      handleEdit(cita);
                    }}
                  >
                    Actualizar
                  </button>


                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => {
                      handleDelete(cita.id);
                    }}
                  >
                    Eliminar
                  </button>

                </div>

              </div>

            ))
          }

        </section>

      </section>

    </>
  );
};

export default Dashboard;
