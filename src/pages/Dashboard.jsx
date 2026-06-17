import './Dashboard.css'
import { useState } from 'react'
import TypeIt from 'typeit-react'

const Dashboard = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2026-06-16', time: '09:00', title: 'Consulta médica', doctor: 'Dr. Pérez', status: 'confirmada' },
    { id: 2, date: '2026-06-17', time: '14:30', title: 'Análisis de sangre', doctor: 'Dra. Gómez', status: 'pendiente' },
    { id: 3, date: '2026-06-18', time: '11:00', title: 'Revisión dental', doctor: 'Dr. Rodríguez', status: 'completada' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', title: '', doctor: '' })

  const addAppointment = (e) => {
    e.preventDefault()
    if (!newAppointment.date || !newAppointment.time || !newAppointment.title || !newAppointment.doctor) {
      alert('Completa todos los campos')
      return
    }
    const newApp = {
      id: appointments.length + 1,
      ...newAppointment,
      status: 'pendiente'
    }
    setAppointments([newApp, ...appointments])
    setNewAppointment({ date: '', time: '', title: '', doctor: '' })
    setShowModal(false)
  }

  const deleteAppointment = (id) => {
    if (window.confirm('¿Eliminar esta cita?')) {
      setAppointments(appointments.filter(app => app.id !== id))
    }
  }

  const updateStatus = (id, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ))
  }

  const total = appointments.length
  const confirmadas = appointments.filter(a => a.status === 'confirmada').length
  const pendientes = appointments.filter(a => a.status === 'pendiente').length

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <TypeIt options={{ speed: 100, waitUntilVisible: true, cursor: false }}>
            Mi <span className="highlight">Dashboard</span>
          </TypeIt>
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Nueva Cita
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total Citas</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{confirmadas}</div>
          <div className="stat-label">Confirmadas</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{pendientes}</div>
          <div className="stat-label">Pendientes</div>
        </div>
      </div>

      <div className="appointments-section">
        <h3 className="section-title">Mis Citas</h3>
        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div className="empty">No hay citas</div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className={`appointment-item ${app.status}`}>
                <div className="appointment-info">
                  <div className="appointment-date">{app.date} - {app.time}</div>
                  <div className="appointment-title">{app.title}</div>
                  <div className="appointment-doctor">{app.doctor}</div>
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge ${app.status}`}>{app.status}</span>
                  <select 
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button onClick={() => deleteAppointment(app.id)} className="delete-btn">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Cita</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={addAppointment}>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Título</label>
                <input type="text" placeholder="Ej: Consulta médica" value={newAppointment.title} onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <input type="text" placeholder="Nombre del doctor" value={newAppointment.doctor} onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary full">Agendar Cita</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard