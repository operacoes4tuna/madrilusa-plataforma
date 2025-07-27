import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink, Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const entities = [
    {
      name: "Minha Terra",
      email: "mariaclarabraga@minhaterra.pt",
      phone: "(+351) 913 196 839"
    },
    {
      name: "Adritem",
      email: "madrilusa@adritem.pt", 
      phone: "(+351) 937 342 173"
    },
    {
      name: "Adraces",
      email: "apoio-imigrantes@adraces.pt",
      phone: "(+351) 272 540 200"
    },
    {
      name: "CoraNE",
      email: "terrafria@corane.pt",
      phone: "(+351) 273 332 925"
    }
  ];

  return (
    <footer id="contactos" className="bg-muted/30 text-foreground py-16">
      <div className="container mx-auto px-4">
        {/* Logo e Redes Sociais */}
        <div className="text-center mb-12">
          <img
            src="/logo_madrilusa/logo madrilusa.png"
            alt="Madrilusa"
            className="h-16 w-auto mx-auto mb-6"
          />
          
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Contactos das 4 Entidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {entities.map((entity, index) => (
            <div key={index} className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {entity.name}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <a 
                    href={`mailto:${entity.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {entity.email}
                  </a>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <a 
                    href={`tel:${entity.phone.replace(/\s+/g, '')}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {entity.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Logos dos Parceiros */}
        <div className="border-t border-border pt-8 mb-8">
          <h4 className="text-lg font-semibold text-center mb-4 text-muted-foreground">
            Parceiros e Financiadores
          </h4>
          
          <div className="text-center">
            <img
              src="/logo_madrilusa/barradelogosmadrilusa.png"
              alt="Logos dos Parceiros e Financiadores - Madrilusa"
              className="w-full max-w-2xl mx-auto h-auto"
            />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2025 Madrilusa. Todos os direitos reservados.
              </p>
              <p className="text-muted-foreground text-xs">
                Projecto de Inovação e Empreendedorismo Social
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm">
              <button 
                onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Política%20Privacidade'}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Política de Privacidade
              </button>
              <button 
                onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Termos%20Uso'}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Termos de Uso
              </button>
            </div>
          </div>
          
          {/* Desenvolvido pela 4tuna - Centralizado */}
          <div className="text-center mt-6 pt-6">
            <p className="text-muted-foreground text-xs">
              Desenvolvido pela{' '}
              <a 
                href="https://a4tunados.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-muted-foreground cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                4tuna
              </a>
              {' '}com ❤️ para promover integração social e desenvolvimento sustentável
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;