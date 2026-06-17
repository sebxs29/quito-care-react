import About from "../components/about/About"
import Benefits from "../components/benefits/Benefits"
import Contact from "../components/contact/Contact"
import Cta from "../components/cta/Cta"
import Download from "../components/download/Download"
import Faq from "../components/faq/Faq"
import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import Hero from "../components/hero/Hero"
import Partners from "../components/partners/Partners"
import Team from "../components/team/Team"
import Testimonials from "../components/testimonials/Testimonials"

const Landing = () => {
  return (
    <>
    <Header/>
    <Hero/>
    <Benefits/>
    <Testimonials/>
    <Team/>
    <About/>
    <Faq/>
    <Cta/>
    <Download/>
    <Partners/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default Landing