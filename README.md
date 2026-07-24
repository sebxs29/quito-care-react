# 🩺 QuitoCare

QuitoCare es una aplicación web de telemedicina desarrollada con **React + Vite**, cuyo objetivo es facilitar la gestión de citas médicas en línea mediante una interfaz moderna, intuitiva y responsive. La plataforma permite a los usuarios registrarse, iniciar sesión, agendar citas médicas y administrar sus consultas desde un panel personalizado.

---

## 🚀 Características principales

- ✅ Registro e inicio de sesión con Firebase Authentication.
- ✅ Inicio de sesión con Google.
- ✅ Protección de rutas para usuarios autenticados.
- ✅ CRUD de citas médicas.
- ✅ Selección dinámica de especialidades y doctores.
- ✅ Dashboard personalizado para cada usuario.
- ✅ Gráficos estadísticos con Chart.js.
- ✅ Modo oscuro.
- ✅ Notificaciones con React Toastify.
- ✅ Chatbot integrado mediante Zapier.
- ✅ Diseño Responsive (Mobile First).
- ✅ Despliegue en Firebase Hosting.

---

## 🛠 Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- React Hook Form
- CSS3

### Backend / Base de datos

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting

### Librerías

- React Toastify
- TypeIt
- Chart.js
- React ChartJS 2

### Herramientas

- Git
- GitHub
- Visual Studio Code

---

## 📂 Estructura del proyecto

```text
src/
│
├── components/
│   ├── chatbot/
│   ├── contact/
│   ├── doctorsChart/
│   ├── footer/
│   ├── header/
│   ├── hero/
│   ├── process/
│   ├── specialties/
│   ├── testimonials/
│   └── ...
│
├── data/
│   └── doctores.js
│
├── pages/
│   ├── Landing.jsx
│   ├── Services.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Nosotros.jsx
│   └── Contacto.jsx
│
├── firebase.js
├── App.jsx
└── main.jsx
```

---

## 🔐 Autenticación

La aplicación utiliza Firebase Authentication para gestionar el acceso de los usuarios.

Se implementan dos métodos de autenticación:

- Correo electrónico y contraseña.
- Inicio de sesión con Google.

Las rutas privadas son protegidas mediante React Router, evitando que usuarios no autenticados puedan acceder al Dashboard.

---

## 📅 Gestión de citas

El Dashboard permite al usuario administrar sus citas médicas.

Funciones implementadas:

- Crear cita médica.
- Consultar citas registradas.
- Actualizar información de una cita.
- Eliminar una cita.

Cada cita almacena:

- Especialidad
- Doctor
- Fecha
- Hora
- Modalidad
- Motivo de consulta
- Estado
- Usuario propietario

Toda la información se almacena en Cloud Firestore.

---

## 📊 Estadísticas

Se implementaron gráficos utilizando Chart.js.

### Dashboard

Gráfico de dona que muestra la distribución de citas médicas por especialidad.

### Servicios

Gráfico de barras que presenta la cantidad de doctores disponibles por especialidad.

---

## 🌙 Modo oscuro

La aplicación incorpora un modo oscuro que permite mejorar la experiencia visual del usuario.

---

## 🔔 Notificaciones

Se utiliza React Toastify para informar al usuario sobre:

- Inicio de sesión.
- Registro exitoso.
- Creación de citas.
- Actualización de citas.
- Eliminación de citas.
- Errores del sistema.

---

## 🤖 Chatbot

QuitoCare integra un chatbot desarrollado con Zapier, el cual brinda asistencia rápida al usuario y responde preguntas frecuentes relacionadas con la plataforma.

---

## 📱 Responsive Design

La aplicación fue desarrollada siguiendo la metodología **Mobile First**, adaptándose correctamente a:

- Teléfonos móviles.
- Tablets.
- Computadoras.

---

## ☁️ Despliegue

La aplicación se encuentra desplegada mediante Firebase Hosting.

**Sitio web:**

https://quito-care.web.app/

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/USFQ-2026-A-DI-GR3/quito-care-react.git
```

Entrar al proyecto:

```bash
cd quito-care-react
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

---

## 👥 Integrantes

- Sebastián Toapanta
- Andrés Oto
- Sebastián Caiza

---

## 📄 Licencia

Proyecto académico desarrollado para la asignatura **Diseño de Interfaces**.
