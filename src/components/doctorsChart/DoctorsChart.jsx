import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { doctores } from "../../data/doctores";

import "./DoctorsChart.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);


const DoctorsChart = () => {

  const doctoresPorEspecialidad = doctores.reduce(
    (acumulador, doctor) => {

      const especialidad = doctor.especialidad;

      acumulador[especialidad] =
        (acumulador[especialidad] || 0) + 1;

      return acumulador;
    },
    {}
  );


  const datosGrafico = {

    labels: Object.keys(
      doctoresPorEspecialidad
    ),

    datasets: [
      {
        label: "Doctores disponibles",

        data: Object.values(
          doctoresPorEspecialidad
        ),

        backgroundColor: "#2ECC71",

        borderColor: "#27AE60",

        borderWidth: 1,

        borderRadius: 6
      }
    ]
  };


  const opcionesGrafico = {

    responsive: true,

    maintainAspectRatio: false,

    indexAxis: "y",

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
        callbacks: {

          label: (context) => {

            const cantidad = context.raw;

            return `${cantidad} ${
              cantidad === 1
                ? "doctor disponible"
                : "doctores disponibles"
            }`;
          }
        }
      }
    },

    scales: {

      x: {
        beginAtZero: true,

        ticks: {
          stepSize: 1,
          precision: 0
        },

        title: {
          display: true,
          text: "Cantidad de doctores"
        }
      },

      y: {
        grid: {
          display: false
        }
      }
    }
  };


  return (
    <section className="doctors-chart">

      <div className="doctors-chart__content">

        <h2>
          Doctores por especialidad
        </h2>

        <p>
          Conoce la cantidad de profesionales disponibles
          en cada área médica.
        </p>

        <div className="doctors-chart__container">

          <Bar
            data={datosGrafico}
            options={opcionesGrafico}
          />

        </div>

      </div>

    </section>
  );
};


export default DoctorsChart;