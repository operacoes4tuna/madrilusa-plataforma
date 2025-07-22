import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="sobre" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            Bem vindo ao Madrilusa
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground leading-relaxed space-y-6"
          >
            <p>
              O projeto Madrilusa é uma iniciativa de Inovação e Empreendedorismo Social (IIES), 
              promovida pela ADRITEM, em parceria com a Federação Minha Terra, a CoraNE e a ADRACES.
            </p>
            
            <p>
              Este projeto procura responder a desafios prementes como a exclusão social de jovens 
              imigrantes oriundos da CPLP, que enfrentam barreiras culturais, linguísticas e económicas 
              no processo de integração em Portugal. Paralelamente, assiste-se ao despovoamento e 
              envelhecimento das populações em zonas rurais, fenómenos que agravam o isolamento social 
              e acentuam o desequilíbrio territorial.
            </p>
            
            <p>
              Simultaneamente, o país enfrenta uma escassez de mão-de-obra em sectores essenciais e 
              uma crise habitacional que afecta, de forma particular, os grupos mais vulneráveis, 
              como as famílias monoparentais.
            </p>
            
            <p>
              O Madrilusa propõe uma abordagem integradora que liga as necessidades das regiões rurais 
              ao potencial dos jovens imigrantes, promovendo a sua fixação nesses territórios como 
              estratégia para a sua revitalização e para uma integração social e profissional mais eficaz.
            </p>
            
            <p>
              Através de metodologias inovadoras de acolhimento, capacitação e acompanhamento, o projeto 
              fomenta o diálogo intercultural, a solidariedade intergeracional e o desenvolvimento 
              sustentável. O objetivo é contribuir para a construção de comunidades mais inclusivas e 
              resilientes, capazes de enfrentar os desafios actuais com criatividade e espírito de cooperação.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;