import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Network, Briefcase, MessageCircle } from "lucide-react";

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
      description: "Ao Acolhimento e Integração com atividades de capacitação em economia doméstica, cidadania e participação cívica.",
      image: "https://static.wixstatic.com/media/nsplsh_98b77565b8fa415fb25cae0939cd624d~mv2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Kelly%20Sikkema.jpg"
    },
    {
      icon: Briefcase,
      title: "Realização de estágios",
      description: "de verão e trabalhos temporários para os jovens.",
      image: "https://static.wixstatic.com/media/nsplsh_f6dde0573716445d9ab615e590424000~mv2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Ofspace%20LLC.jpg"
    },
    {
      icon: MessageCircle,
      title: "Campanhas de sensibilização",
      description: "sobre a exclusão social da população imigrante.",
      image: "https://static.wixstatic.com/media/nsplsh_b20e61da4f704213863247b706c5cdf2~mv2.jpg/v1/fill/w_324,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Alexis%20Brown.jpg"
    }
  ];

  return (
    <section id="atividades" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            As ações do projeto incluem
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover-lift h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4 relative overflow-hidden rounded-lg">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">
                          {activity.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Activities;