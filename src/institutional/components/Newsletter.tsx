import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Atenção",
        description: "Por favor, insira o seu email.",
        variant: "destructive"
      });
      return;
    }

    // Simular subscrição
    toast({
      title: "Subscrição realizada com sucesso!",
      description: "Obrigado por subscrever a nossa newsletter.",
    });
    
    setEmail("");
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagem */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-glow">
              <img
                src="https://static.wixstatic.com/media/nsplsh_b20e61da4f704213863247b706c5cdf2~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Alexis%20Brown.jpg"
                alt="Grupo de jovens diversos sorrindo ao ar livre"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Formulário */}
          <div className="text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Subscreva a nossa Newsletter
            </h2>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Mantenha-se informado sobre todas as novidades do projecto Madrilusa, 
              oportunidades de participação e histórias inspiradoras da nossa comunidade.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Vosso e-mail"
                  className="text-lg py-3 bg-white text-foreground border-none"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold py-3 px-8"
              >
                Subscrever
              </Button>
            </form>

            <p className="text-sm text-white/70 mt-4">
              Ao subscrever, concorda com a nossa política de privacidade. 
              Pode cancelar a subscrição a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 