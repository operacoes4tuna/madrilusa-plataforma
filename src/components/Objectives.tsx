import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Heart, Handshake } from "lucide-react";

const Objectives = () => {
  const objectives = [
    {
      icon: Globe,
      title: "Promover a integração social",
      description: "Promovemos a integração de jovens imigrantes em Portugal, valorizando os seus talentos e colocando-os ao serviço das necessidades dos territórios rurais. Através de iniciativas inovadoras, impulsionamos a inclusão social, o desenvolvimento sustentável e a revitalização das comunidades.",
      image: "https://static.wixstatic.com/media/bd849e_c12a9a73b9d541e08c1e1f608a569118~mv2.png/v1/crop/x_23,y_0,w_1491,h_1024/fill/w_373,h_255,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/integracao_porto.png"
    },
    {
      icon: Users,
      title: "Valorizar as competências",
      description: "O Madrilusa valoriza as competências, os talentos e a cultura de origem dos jovens imigrantes, promovendo a sua integração em territórios rurais. A iniciativa reforça identidades, dinamiza o desenvolvimento local e contribui para a construção de comunidades mais inclusivas e diversificadas.",
      image: "https://static.wixstatic.com/media/bd849e_6c4d6b59745540dfa33842463bef92da~mv2.png/v1/fill/w_375,h_257,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/imigrantes_coworking_portugal_realista.png"
    },
    {
      icon: Heart,
      title: "Combater a exclusão social",
      description: "Combatemos a exclusão social e promovemos a empregabilidade de jovens imigrantes, articulando as suas competências com as necessidades dos territórios rurais. A iniciativa cria oportunidades concretas, reforçando a inclusão e promovendo o desenvolvimento sustentável das comunidades locais.",
      image: "https://static.wixstatic.com/media/bd849e_4badef6280d7423791ca63ef9ce1befe~mv2.png/v1/fill/w_375,h_257,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/imigrantes_portugal.png"
    },
    {
      icon: Handshake,
      title: "Criar redes de apoio",
      description: "O Madrilusa cria redes de apoio para o acolhimento e integração de jovens imigrantes, reforçando a cooperação entre comunidades e instituições. Esta articulação promove a inclusão social, garante um acompanhamento contínuo e contribui para o desenvolvimento de ambientes acolhedores e sustentáveis nos territórios rurais.",
      image: "https://static.wixstatic.com/media/nsplsh_4d6247376b775770744949~mv2.jpg/v1/fill/w_375,h_257,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Markus%20Spiske.jpg"
    }
  ];

  return (
    <section id="objetivos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            Principais Objetivos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {objectives.map((objective, index) => {
            const IconComponent = objective.icon;
            return (
              <Card key={index} className="hover-lift h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-secondary mb-2">
                        {objective.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={objective.image}
                      alt={objective.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {objective.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Objectives;