import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "Quem pode participar do projeto Madrilusa?",
      answer: "O projeto destina-se principalmente a jovens imigrantes com menos de 30 anos, residentes em qualquer território nacional ou internacional. Também podem participar famílias de acolhimento, empresas, municípios e instituições académicas."
    },
    {
      question: "Como posso me registar no projeto?",
      answer: "Pode registar-se através dos formulários disponíveis na nossa página, selecionando a categoria que melhor se adequa ao seu perfil: jovem imigrante, empresa, município, academia ou família de acolhimento."
    },
    {
      question: "Quais são os benefícios de participar?",
      answer: "Os participantes têm acesso a programas de capacitação, desenvolvimento de competências, oportunidades de emprego, rede de apoio para integração, e contribuem para a construção de comunidades mais inclusivas e resilientes."
    },
    {
      question: "O projeto tem algum custo?",
      answer: "Não, a participação no projeto Madrilusa é gratuita. É uma iniciativa de inovação e empreendedorismo social financiada pelas entidades promotoras."
    },
    {
      question: "Em que regiões o projeto atua?",
      answer: "O projeto foca especialmente em territórios rurais de Portugal, promovendo a fixação de jovens imigrantes nessas regiões como estratégia de revitalização territorial."
    },
    {
      question: "Quanto tempo dura o programa?",
      answer: "O projeto tem duração de 36 meses e propõe-se a alcançar cerca de 2.400 jovens ao longo deste período."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            Perguntas frequentes
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 bg-card hover:shadow-card-custom transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="text-lg font-semibold text-secondary">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed pt-2">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-card rounded-lg p-8 shadow-card-custom">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-muted-foreground mb-6">
                Entre em contacto connosco. Estamos aqui para ajudar!
              </p>
              <Button 
                variant="rectangular" 
                size="lg" 
                className="gap-2"
                onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Contacto%20Site'}
              >
                <Mail className="w-4 h-4" />
                Contactar-nos
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;