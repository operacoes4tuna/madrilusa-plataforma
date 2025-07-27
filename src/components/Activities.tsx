import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Network, Briefcase } from "lucide-react";

const Activities = () => {
  const activities = [
    {
      icon: GraduationCap,
      title: "Desenvolvimento de competências",
      description: "para a inserção no mercado de trabalho, inserido no Programa +Futuro.",
      image: "https://static.wixstatic.com/media/nsplsh_6457595533692d6d71456f~mv2_d_7952_5304_s_4_2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Annie%20Spratt.jpg"
    },
    {
      icon: Users,
      title: "Criação da Luso Academia",
      description: "para fomentar talentos e partilhar saberes culturais.",
      image: "https://static.wixstatic.com/media/nsplsh_414c356e7430756f57506f~mv2_d_2592_1936_s_2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Miguel%20Ferreira.jpg"
    },
    {
      icon: Network,
      title: "Rede de Apoio",
      description: "Ao Acolhimento e Integração com actividades de capacitação em economia doméstica, cidadania e participação cívica.",
      image: "https://static.wixstatic.com/media/nsplsh_98b77565b8fa415fb25cae0939cd624d~mv2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Kelly%20Sikkema.jpg"
    },
    {
      icon: Briefcase,
      title: "Realização de estágios",
      description: "de verão e trabalhos temporários para os jovens.",
      image: "https://static.wixstatic.com/media/nsplsh_f6dde0573716445d9ab615e590424000~mv2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Ofspace%20LLC.jpg"
    }
  ];

  return (
    <section id="atividades" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            As acções do projecto incluem
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Através de uma abordagem integrada, desenvolvemos múltiplas iniciativas que promovem 
            a integração social e o desenvolvimento sustentável das comunidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <Card key={index} className="hover-lift h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary">
                      {activity.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-subtle rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Participe connosco nesta jornada
            </h3>
            <p className="text-muted-foreground mb-6">
              Cada acção do Madrilusa é desenhada para criar impacto real na vida das pessoas 
              e no desenvolvimento das comunidades rurais.
            </p>
            <button 
              onClick={() => document.getElementById('registrar')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-glow transition-colors"
            >
              Registe-se e faça parte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;