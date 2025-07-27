import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import RegistrationCards from "@/components/RegistrationCards";
import Objectives from "@/components/Objectives";
import Target from "@/components/Target";
import Activities from "@/components/Activities";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <RegistrationCards />
      <Objectives />
      <Target />
      <Activities />
      <FAQ />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
