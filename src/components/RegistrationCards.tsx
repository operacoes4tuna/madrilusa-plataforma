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
      image: imigranteImg,
      alt: "Jovem imigrante"
    },
    {
      id: "empresa",
      title: "minha empresa",
      image: empresaImg,
      alt: "Representante de empresa"
    },
    {
      id: "municipio",
      title: "município",
      image: municipioImg,
      alt: "Representante municipal"
    },
    {
      id: "academia",
      title: "academia",
      image: academiaImg,
      alt: "Representante acadêmico"
    },
    {
      id: "familia",
      title: "família de acolhimento",
      image: familiaImg,
      alt: "Família de acolhimento"
    }
  ];

  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Registrar
            </h2>
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
                    <h3 className="text-xl font-semibold text-secondary mb-4 capitalize flex-grow flex items-center justify-center min-h-[3rem]">
                      {card.title}
                    </h3>
                    <Button
                      variant="rectangular"
                      size="rectangular"
                      className="w-full mt-auto"
                      onClick={() => setSelectedCard(card.id)}
                    >
                      Registrar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Registro */}
      <RegistrationModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        cardType={selectedCard}
      />
    </>
  );
};

export default RegistrationCards;