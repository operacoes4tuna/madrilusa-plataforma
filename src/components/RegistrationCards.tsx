import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import RegistrationModal from "./RegistrationModal";

// Import das imagens
import imigranteImg from "@/assets/imigrante.png";
import empresaImg from "@/assets/empresa.png";
import municipioImg from "@/assets/municipio.png";
import academiaImg from "@/assets/academia.png";
import familiaImg from "@/assets/familia.png";

const RegistrationCards = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cards = [
    {
      id: "imigrante",
      title: "sou imigrante",
      description: "Jovens com menos de 30 anos que procuram integração, formação e oportunidades de emprego",
      image: imigranteImg,
      alt: "Jovem imigrante"
    },
    {
      id: "empresa",
      title: "minha empresa",
      description: "Empresas que desejam aceder a talentos qualificados e oferecer oportunidades de trabalho",
      image: empresaImg,
      alt: "Representante de empresa"
    },
    {
      id: "municipio",
      title: "município",
      description: "Administrações municipais interessadas em revitalização territorial e apoio a imigrantes",
      image: municipioImg,
      alt: "Representante municipal"
    },
    {
      id: "academia",
      title: "academia",
      description: "Instituições de ensino e formação que querem disponibilizar capacitações",
      image: academiaImg,
      alt: "Representante académico"
    },
    {
      id: "familia",
      title: "família de acolhimento",
      description: "Famílias que oferecem suporte e acolhimento para facilitar a integração social",
      image: familiaImg,
      alt: "Família de acolhimento"
    }
  ];

  return (
    <>
      <section id="registrar" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Como posso participar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Escolha a categoria que melhor se adequa ao seu perfil e descubra como pode 
              fazer parte desta iniciativa de inovação social. A participação é totalmente gratuita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {cards.map((card) => (
              <div key={card.id}>
                <Card className="hover-lift cursor-pointer group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={card.image}
                        alt={card.alt}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary mb-3 capitalize">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {card.description}
                    </p>
                    <Button
                      variant="rectangular"
                      size="rectangular"
                      className="w-full mt-auto"
                      onClick={() => setSelectedCard(card.id)}
                    >
                      Registar-me
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Tem dúvidas sobre qual categoria escolher?
            </p>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver Perguntas Frequentes
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Registo */}
      <RegistrationModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        cardType={selectedCard}
      />
    </>
  );
};

export default RegistrationCards;