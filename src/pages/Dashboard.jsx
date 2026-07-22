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


const doctores = [
  {
    id: "doctor-1",
    nombre: "Dr. Sebastián Toapanta",
    especialidad: "Medicina general"
  },
  {
    id: "doctor-2",
    nombre: "Dr. Andrés Oto",
    especialidad: "Medicina general"
  },
  {
    id: "doctor-3",
    nombre: "Dr. Sebastián Caiza",
    especialidad: "Psicología"
  },
  {
    id: "doctor-4",
    nombre: "Dra. Emilia Caza",
    especialidad: "Pediatría"
  },
  {
    id: "doctor-5",
    nombre: "Dr. Joel Freire",
    especialidad: "Nutrición"
  },
  {
    id: "doctor-6",
    nombre: "Dra. Melanie Vera",
    especialidad: "Dermatología"
  },
  {
    id: "doctor-7",
    nombre: "Dra. Annabel Gómez",
    especialidad: "Gastroenterología"
  }
];


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


      const documentos = snapshot.docs.map(
        (documento) => ({
          ...documento.data(),
          id: documento.id
        })
      );


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

    const datosCita = {
      especialidad: data.especialidad,
      doctorId: doctorSeleccionado.id,
      doctorNombre: doctorSeleccionado.nombre,
      fecha: data.fecha,
      hora: data.hora,
      modalidad: data.modalidad,
      motivo: data.motivo
    };

    if (estaActualizando) {

      await updateDoc(
        doc(dbFirebase, "citas", id),
        {
          ...datosCita,
          fechaActualizacion: serverTimestamp()
        }
      );

      setId("");

      toast.success(
        "Cita actualizada correctamente"
      );

    } else {

      const nuevaCita = {
        pacienteId: usuarioActual.uid,
        pacienteEmail: usuarioActual.email,
        ...datosCita,
        estado: "Pendiente",
        fechaCreacion: serverTimestamp()
      };

      await addDoc(
        collection(dbFirebase, "citas"),
        nuevaCita
      );

      toast.success(
        "Cita agendada correctamente"
      );
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
        ? "No se pudo actualizar la cita"
        : "No se pudo registrar la cita"
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

    <section className="header_projects"></section>


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

                  minLength: {
                    value: 10,

                    message:
                      "El motivo debe tener mínimo 10 caracteres"
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
                    Estado: {cita.estado}
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