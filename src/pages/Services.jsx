import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import Specialties from "../components/specialties/Specialties"
import Process from "../components/process/Process"
import Testimonials from "../components/testimonials/Testimonials"

const Services = () => {
  return (
    <>
      <Header />
      <main>
        <Specialties />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}

export default Services