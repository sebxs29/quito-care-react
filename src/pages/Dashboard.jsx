import './Dashboard.css'
import { authFirebase, dbFirebase } from '../firebase'

import { useForm } from 'react-hook-form';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

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
    nombre: "Dr. Joel Freeire",
    especialidad: "Nutrición"
  },
  {
    id: "doctor-6",
    nombre : "Dra. Melanie Vera",
    especialidad: "Dermatología"
  },
  {
    id: "doctor-7",
    nombre: "Dra. Annabel Gómez",
    especialidad: "Gastroenterología"
  } 

]

const especialidades = [
  ...new Set(doctores.map((doctor) => doctor.especialidad))
];


const Dashboard = () => {

const { register, handleSubmit, reset, watch, setValue, formState: {errors}} = useForm();
  
const especialidadSeleccionada = watch("especialidad");

const doctoresFiltrados = doctores.filter(
  (doctor) =>
    doctor.especialidad === especialidadSeleccionada
);

const fechaActual = new Date().toISOString().split("T")[0];

const [mensaje, setMensaje] = useState("");

// listar inicio
const [citas, setCitas] = useState([]);
// listar fin

const handleLogout = async () => {

  try {
    await signOut(authFirebase);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }

}

// listar inicio
const handleGet = async () => {

  try {

    const usuarioActual = authFirebase.currentUser;

    if(!usuarioActual) {
      return;
    }

    const citasQuery = query(
      collection(dbFirebase, "citas"),
      where("pacienteId", "==", usuarioActual.uid)
    );

    const snapshot = await getDocs(citasQuery);
    const documentos = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setCitas(documentos);

  } catch (error) {
    console.log(error);
  }

}
// listar fin

const handleCreate = async (data) => {
  
try {

  setMensaje("");

  const usuarioActual = authFirebase.currentUser;

  if(!usuarioActual) {
    setMensaje("No existe un usuario autenticado");
    return;
  }

  const doctorSeleccionado = doctores.find(
    (doctor) => doctor.id == data.doctorId
  );

  if(!doctorSeleccionado) {
    setMensaje("Debe seleccionar un doctor");
    return;
  }

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

  await addDoc(collection(dbFirebase, "citas"), nuevaCita);

  reset();
  setMensaje("La cita fue registrada correctamente");
  // listar inicio
  handleGet();
  // listar fin

} catch (error) {
  console.log(error);
  setMensaje("No se pudo registrar la cita");
}

}

// 🗑️ FUNCIÓN ELIMINAR AGREGADA
const handleDelete = async (id) => {
  const confirmar = confirm("¿Estás seguro de eliminar esta cita?");
  if (confirmar) {
    try {
      const citaDoc = doc(dbFirebase, "citas", id);
      await deleteDoc(citaDoc);
      handleGet();
      setMensaje("Cita eliminada correctamente");
    } catch (error) {
      console.log(error);
      setMensaje("No se pudo eliminar la cita");
    }
  }
}
// 🗑️ FIN FUNCIÓN ELIMINAR

// listar inicio
useEffect(() => {
  handleGet();
}, [])
// listar fin

  return (
    <>
      <section className="header_projects">
        <p>Bienvenido - {authFirebase.currentUser?.email}</p>

        <div className="header_actions">
          <button className="theme-toogle">🌙</button>

          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </div>
      </section>
    
      <section className="container_projects">

        <section className="form-section">

          <h1 className='dashboard-title'>
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false
              }}
            >
              Agendar <span className='highlight'>Cita Médica</span>
            </TypeIt>

          </h1>

          <p>Complete la información para registrar una nueva cita</p>


          <form className="route-form" onSubmit={handleSubmit(handleCreate)}>

            <label>Especialidad:</label>
            <select
              {...register("especialidad", {
                required: "La especialidad es requerida",
                onChange: () => {
                  setValue("doctorId", "")
                }
              })}
            >
              <option value="">Seleccione una especialidad</option>

              {especialidades.map((especialidad) => (
                <option
                  key={especialidad}
                  value={especialidad}
                >
                  {especialidad}
                </option>
              ))}
            </select>

            {errors.especialidad && (<span className='errors'>{errors.especialidad.message}</span>)}

            <label>Doctor:</label>
            <select
              disabled={!especialidadSeleccionada}
              {...register("doctorId", {
                required: "El doctor es requerido"
              })}
            >
              <option value="">Seleccione un doctor</option>

              {doctoresFiltrados.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {doctor.nombre}
                </option>
              ))}              

            </select>

            {errors.doctorId && (<span className='errors'>{errors.doctorId.message}</span>)}

            <label>Fecha:</label>
            <input type='date'
              min={fechaActual}
              {...register("fecha", {required: "La fecha es requerida"})}
            />

            {errors.fecha && (<span className='errors'>{errors.fecha.message}</span>)}

            <label>Hora:</label>
            <input type='time'
              {...register("hora", {required: "La hora es requerida"})}
            />

            {errors.hora && (<span className='errors'>{errors.hora.message}</span>)}



            <label>Modalidad:</label>

            <select
              {...register("modalidad", {required: "La modalidad es requerida"})}
            >

              <option value="Videollamada">Videollamada</option>

              <option value="Chat">Chat</option>

              <option value="Presencial">Presencial</option>

            </select>

            {errors.modalidad && (<span className='errors'>{errors.modalidad.message}</span>)}

            <label>Motivo de la consulta:</label>
            <textarea
              placeholder='Describa brevemente el motivo de la consulta'
              {...register("motivo", {
                required: "El motivo es requerido",
                minLength: {value: 10, message: "El motivo debe tener mínimo 10 caracteres"}
              })}
            />

            {errors.motivo && (<span className='errors'>{errors.motivo.message}</span>)}

            {mensaje && (<p className='mensaje-formulario'>{mensaje}</p>)}

            <input className='btn'
              type="submit"
              value="Agendar cita"
            />
          </form>
        </section>

        {/* listar inicio */}
        <section className="routes-section">

          <h4>Mis citas</h4>
          <p>Listado de citas agendadas</p>

          {citas.length === 0 && (<div className="no-routes">No existen registros...</div>)}

          {
            citas.map((cita) => (
              <div className="route-card" key={cita.id}>
                <div className="route-info">
                  <p>Especialidad: {cita.especialidad}</p>
                  <p>Doctor: {cita.doctorNombre}</p>
                  <p>Fecha: {cita.fecha}</p>
                  <p>Hora: {cita.hora}</p>
                  <p>Modalidad: {cita.modalidad}</p>
                  <p>Motivo: {cita.motivo}</p>
                  <p>Estado: {cita.estado}</p>
                </div>
                {/*BOTÓN ELIMINAR*/}
                <div className="route-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(cita.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          }

        </section>
        {/* listar fin */}

      </section>

    </>
  )
}

export default Dashboard
