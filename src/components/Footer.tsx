import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contactos" className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <img
              src="/logo_madrilusa/logo branco.png"
              alt="Madrilusa"
              className="h-12 w-auto mb-4"
            />
            <p className="text-secondary-foreground/80 leading-relaxed mb-4">
              Promovendo a integração de jovens imigrantes através de inovação 
              e empreendedorismo social em territórios rurais de Portugal.
            </p>
            <p className="text-xs text-secondary-foreground/60">
              Inclusão com identidade
            </p>
          </div>

          {/* Contactos */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contactos</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3" />
                <a 
                  href="mailto:madrilusa@adritem.pt?subject=Contacto%20Site"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  madrilusa@adritem.pt
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <span className="text-secondary-foreground/80">+351 XXX XXX XXX</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <span className="text-secondary-foreground/80">Portugal</span>
              </div>
            </div>
          </div>

          {/* Parceiros */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Parceiros</h4>
            <div className="space-y-2 text-secondary-foreground/80">
              <p>ADRITEM</p>
              <p>Federação Minha Terra</p>
              <p>CoraNE</p>
              <p>ADRACES</p>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="rectangular" 
                size="rectangular"
                className="w-full"
                onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Contacto%20Site'}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contacte-nos
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            © 2024 Madrilusa. Todos os direitos reservados. 
            Iniciativa de Inovação e Empreendedorismo Social.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;