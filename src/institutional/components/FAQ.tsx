import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";

const FAQ = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("familiasAcolhimento");

  const categories = [
    { id: "familiasAcolhimento", label: "FAMÍLIAS DE ACOLHIMENTO", color: "text-primary" },
    { id: "jovensImigrantes", label: "JOVENS IMIGRANTES", color: "text-secondary" },
    { id: "gerais", label: "GERAIS", color: "text-muted-foreground" },
    { id: "empresas", label: "PARA EMPRESAS", color: "text-green-600" }
  ];

  const faqsByCategory = {
    familiasAcolhimento: [
      {
        question: "Como posso tornar-me numa família de acolhimento?",
        answer: "Para se tornar numa família de acolhimento, deve preencher o formulário de registo na nossa plataforma, indicando a sua disponibilidade e tipo de apoio que pode oferecer. Após a inscrição, entraremos em contacto para uma reunião de avaliação e formação."
      },
      {
        question: "Que tipo de apoio posso oferecer?",
        answer: "Pode oferecer diferentes tipos de apoio: dormida, alimentação, transporte local, apoio emocional, acolhimento de emergência ou outros tipos de suporte. Pode escolher múltiplas opções conforme a sua disponibilidade."
      },
      {
        question: "Quanto tempo dura o acolhimento?",
        answer: "A duração varia conforme as suas possibilidades: curto prazo (até 7 dias), médio prazo (1 a 3 meses) ou longo prazo (mais de 3 meses). Pode indicar múltiplas opções no seu registo."
      }
    ],
    jovensImigrantes: [
      {
        question: "Quem pode participar no projecto como jovem imigrante?",
        answer: "Jovens imigrantes com menos de 30 anos, residentes em Portugal ou no estrangeiro, que procurem apoio na integração, formação, emprego ou regularização documental."
      },
      {
        question: "Que tipo de apoio está disponível?",
        answer: "Oferecemos apoio integral através das sessões +Futuro: elaboração de currículo, preparação para entrevistas, orientação académica, reconhecimento de habilitações, apoio na procura de formações e estágios."
      },
      {
        question: "Como funciona o Programa +Futuro?",
        answer: "O Programa +Futuro oferece sessões individuais ou em pequenos grupos focadas na inserção no mercado de trabalho, desenvolvimento de competências e acompanhamento no ensino superior."
      }
    ],
    gerais: [
      {
        question: "Qual é a duração do projecto Madrilusa?",
        answer: "O projecto Madrilusa tem duração de 36 meses e propõe-se alcançar cerca de 2.400 jovens ao longo deste período, criando um impacto duradouro nas comunidades envolvidas."
      },
      {
        question: "Em que regiões o projecto actua?",
        answer: "O projecto foca especialmente em territórios rurais de Portugal, promovendo a fixação de jovens imigrantes nessas regiões como estratégia de revitalização territorial e desenvolvimento sustentável."
      },
      {
        question: "O projecto tem algum custo para os participantes?",
        answer: "Não, a participação no projecto Madrilusa é totalmente gratuita. É uma iniciativa de inovação e empreendedorismo social financiada pelas entidades promotoras e parceiros."
      }
    ],
    empresas: [
      {
        question: "Como as empresas podem participar no projecto?",
        answer: "As empresas podem registar-se na nossa plataforma para aceder a uma base de talentos qualificados, oferecer oportunidades de trabalho e estágios, e participar numa rede de responsabilidade social."
      },
      {
        question: "Que benefícios as empresas têm ao participar?",
        answer: "As empresas têm acesso a jovens qualificados e motivados, contribuem para a responsabilidade social corporativa, e participam no desenvolvimento territorial sustentável."
      }
    ]
  };

  const contactsByTerritory = [
    {
      name: "Minha Terra",
      email: "minhaterra@minhaterra.pt",
      phone: "(+351) 2178 197 230"
    },
    {
      name: "Adritem", 
      email: "madrilusa@adritem.pt",
      phone: "(+351) 937 342 173"
    }
  ];

  return (
    <>
      <section id="faq" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Esclarecemos as principais dúvidas sobre o projecto Madrilusa. 
              Para mais informações específicas, consulte as nossas categorias especializadas.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button 
                variant="rectangular" 
                size="lg"
                onClick={() => setIsPanelOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary-glow"
              >
                Ver FAQ Detalhado por Categoria
              </Button>
            </div>

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {faqsByCategory.gerais.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6 bg-card hover:shadow-card-custom transition-shadow duration-300">
                    <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:no-underline">
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
              <div className="bg-card rounded-lg p-8 shadow-card-custom">
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Ainda tem dúvidas?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Entre em contacto connosco. Estamos aqui para ajudar e esclarecer 
                  todas as suas questões sobre o projecto Madrilusa.
                </p>
                <Button 
                  variant="rectangular" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Contacto%20Site%20Madrilusa'}
                >
                  <Mail className="w-4 h-4" />
                  Contactar-nos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Painel Lateral FAQ */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsPanelOpen(false)}
          />
          
          {/* Painel */}
          <div className="ml-auto w-full max-w-3xl bg-background h-full overflow-y-auto relative border-l border-border">
            <div className="p-8">
              {/* Botão Fechar */}
              <button
                onClick={() => setIsPanelOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>

              <h2 className="text-3xl font-bold text-secondary mb-8">
                Perguntas Frequentes por Categoria
              </h2>

              {/* Tabs das Categorias */}
              <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeCategory === category.id
                        ? `${category.color} border-b-2 border-current bg-muted/50`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Conteúdo das FAQs */}
              <div className="space-y-6">
                {faqsByCategory[activeCategory as keyof typeof faqsByCategory]?.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg p-6 bg-card">
                    <h3 className="text-lg font-semibold text-secondary mb-3">
                      {String(index + 1).padStart(2, '0')}. {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Secção de Contactos por Território */}
              {activeCategory === "jovensImigrantes" && (
                <div className="mt-8 bg-primary/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    Contactos por Território
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Se tens interesse, faz o teu registo e entra em contacto connosco:
                  </p>
                  <div className="space-y-3">
                    {contactsByTerritory.map((contact, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background rounded-lg p-4">
                        <div>
                          <p className="font-medium text-secondary">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;