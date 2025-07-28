import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import CategoryRegistrationModal from "@/modules/auth/components/CategoryRegistrationModal";
import { UserCategory, USER_CATEGORIES } from "@/modules/auth/types/auth.types";

// Import das imagens
import imigranteImg from "@/assets/imigrante.png";
import empresaImg from "@/assets/empresa.png";
import municipioImg from "@/assets/municipio.png";
import academiaImg from "@/assets/academia.png";
import familiaImg from "@/assets/familia.png";

const RegistrationCards = () => {
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | null>(null);

  const cards = [
    {
      id: "imigrante",
      title: "sou imigrante",
      description: "Jovens com menos de 30 anos que procuram integração, formação e oportunidades de emprego",
      image: imigranteImg,
      alt: "Jovem imigrante",
      category: USER_CATEGORIES.IMIGRANTE
    },
    {
      id: "empresa",
      title: "minha empresa",
      description: "Empresas que desejam aceder a talentos qualificados e oferecer oportunidades de trabalho",
      image: empresaImg,
      alt: "Representante de empresa",
      category: USER_CATEGORIES.EMPRESA
    },
    {
      id: "municipio",
      title: "município",
      description: "Administrações municipais interessadas em revitalização territorial e apoio a imigrantes",
      image: municipioImg,
      alt: "Representante municipal",
      category: USER_CATEGORIES.MUNICIPIO
    },
    {
      id: "academia",
      title: "academia",
      description: "Instituições de ensino e formação que querem disponibilizar capacitações",
      image: academiaImg,
      alt: "Representante académico",
      category: USER_CATEGORIES.ACADEMIA
    },
    {
      id: "familia",
      title: "família de acolhimento",
      description: "Famílias que oferecem suporte e acolhimento para facilitar a integração social",
      image: familiaImg,
      alt: "Família de acolhimento",
      category: USER_CATEGORIES.FAMILIA_ACOLHIMENTO
    }
  ];

  const handleCardClick = (category: UserCategory) => {
    // Por enquanto, apenas IMIGRANTE está implementado
    if (category === USER_CATEGORIES.IMIGRANTE) {
      setSelectedCategory(category);
    } else {
      // Para outras categorias, mostrar aviso temporário
      alert(`Registro para ${category} será implementado em breve!`);
    }
  };

  return (
    <>
      <section id="registration-cards" className="py-20 bg-background">
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
                      className={`w-full mt-auto ${
                        card.category === USER_CATEGORIES.IMIGRANTE 
                          ? 'bg-primary hover:bg-primary-glow' 
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                      onClick={() => handleCardClick(card.category)}
                    >
                      {card.category === USER_CATEGORIES.IMIGRANTE ? 'Registar-me' : 'Em Breve'}
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

      {/* Novo Modal de Registo por Categoria */}
      {selectedCategory && (
        <CategoryRegistrationModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
        />
      )}
    </>
  );
};

export default RegistrationCards;