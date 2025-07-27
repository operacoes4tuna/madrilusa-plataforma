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
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            Perguntas frequentes
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-secondary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Não encontrou a resposta que procurava?
            </p>
            <Button variant="rectangular" size="rectangular">
              <Mail className="w-4 h-4 mr-2" />
              Contacte-nos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;