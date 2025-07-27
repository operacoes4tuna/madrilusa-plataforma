import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const About = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <section id="sobre" className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Bem-vindos ao Madrilusa
            </h2>
            <p className="text-xl text-primary max-w-3xl mx-auto">
              Inclusão com identidade
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-lg text-white/90 leading-relaxed space-y-6">
              <p>
                O projecto Madrilusa é uma iniciativa de Inovação e Empreendedorismo Social promovida 
                em parceria entre a <strong className="text-primary">ADRITEM</strong> com a{" "}
                <strong className="text-primary">Federação Minha Terra</strong>, a{" "}
                <strong className="text-primary">CoraNE</strong> e a{" "}
                <strong className="text-primary">ADRACES</strong>.
              </p>
              
              <p>
                A proposta busca enfrentar a exclusão social de jovens imigrantes em Portugal, 
                associando o seu potencial às necessidades de zonas rurais afectadas pelo 
                despovoamento e envelhecimento.
              </p>
              
              <p>
                Diante da escassez de mão-de-obra e da crise habitacional que atinge especialmente 
                os mais vulneráveis, o projecto promove a fixação desses jovens em territórios 
                rurais como estratégia de revitalização e inclusão.
              </p>
              
              <p>
                Por meio de metodologias inovadoras de acolhimento, capacitação e acompanhamento, 
                Madrilusa incentiva o diálogo intercultural, a solidariedade entre gerações e o 
                desenvolvimento sustentável, com o objectivo de construir comunidades mais 
                inclusivas e resilientes.
              </p>

              <div className="text-center mt-8">
                <Button 
                  variant="rectangular" 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary-glow"
                  onClick={() => setIsPanelOpen(true)}
                >
                  Sabe Mais
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Painel Lateral Sobre */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsPanelOpen(false)}
          />
          
          {/* Painel */}
          <div className="ml-auto w-full max-w-2xl bg-secondary text-secondary-foreground h-full overflow-y-auto relative">
            <div className="p-8">
              {/* Botão Fechar */}
              <button
                onClick={() => setIsPanelOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <h2 className="text-3xl font-bold text-white mb-8">
                Descrição Detalhada do Projecto
              </h2>

              <div className="space-y-6 text-white/90 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Iniciativa de Inovação e Empreendedorismo Social</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Missão: apoiar a integração de jovens imigrantes em Portugal</li>
                    <li>Foco especial na Região Norte</li>
                    <li>Abordagem próxima, inclusiva e participada</li>
                    <li>Objectivo: criar oportunidades reais de participação cívica, empregabilidade e valorização intercultural</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Três Eixos Principais</h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li><strong>Empreendedorismo e Emprego</strong></li>
                    <li><strong>Cultura e Arte</strong></li>
                    <li><strong>Acolhimento e Integração</strong></li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Metodologia</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Aposta no talento, competências e histórias de vida de jovens com menos de 30 anos</li>
                    <li>Oriundos de diversos países</li>
                    <li>Mais do que intervenção social: rede de partilha, capacitação e envolvimento comunitário</li>
                    <li>Os próprios jovens são convidados a ser protagonistas da mudança</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Parcerias e Apoios</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Parceiros locais, autarquias, associações e empresas</li>
                    <li>Promoção de oficinas, estágios, espaços culturais</li>
                    <li>Acções de mentoria e momentos de convívio intercultural</li>
                    <li>Objectivo: inclusão quando todos têm lugar à mesa</li>
                    <li>Abertura de portas e janelas para um futuro mais justo, diverso e digno</li>
                  </ul>
                </div>

                <div className="bg-primary/20 rounded-lg p-6 mt-8">
                  <p className="text-primary font-semibold text-center text-lg">
                    "Mais do que uma intervenção social, somos uma rede de partilha, capacitação 
                    e envolvimento comunitário onde todos têm lugar à mesa."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default About;