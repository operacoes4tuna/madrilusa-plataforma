import InstitutionalHeader from "../components/InstitutionalHeader";
import Hero from "../components/Hero";
import About from "../components/About";
import RegistrationCards from "../components/RegistrationCards";
import Objectives from "../components/Objectives";
import Target from "../components/Target";
import Activities from "../components/Activities";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import Chatbot from "@/shared/components/Chatbot";
import "../styles/institutional-theme.css";

const LandingPage = () => {
  return (
    <div className="institutional-layout min-h-screen bg-background">
      <InstitutionalHeader />
      
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Bem vindo ao Madrilusa */}
      <About />
      
      {/* 3. Faça parte do projecto */}
      <RegistrationCards />
      
      {/* 4. Principais Objectivos */}
      <Objectives />
      
      {/* 5. A quem se destina? */}
      <Target />
      
      {/* 6. As acções do projecto incluem */}
      <Activities />
      
      {/* 7. Perguntas frequentes */}
      <FAQ />
      
      {/* 8. Newsletter */}
      <Newsletter />
      
      {/* 9. Footer/Contactos */}
      <Footer />
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default LandingPage; 