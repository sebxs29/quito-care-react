import { useEffect } from "react"
import { useLocation } from "react-router"
import Benefits from "../components/benefits/Benefits"
import Contact from "../components/contact/Contact"
import Cta from "../components/cta/Cta"
import Download from "../components/download/Download"
import Faq from "../components/faq/Faq"
import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import Hero from "../components/hero/Hero"
import Partners from "../components/partners/Partners"

const Landing = () => {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const elemento = document.querySelector(hash)
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [hash])

  return (
    <>
      <Header/>
      <Hero/>
      <Benefits/>
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