import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contactos" className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-primary mb-4">MADRILUSA</h3>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Promovendo a integração de jovens imigrantes através de inovação 
              e empreendedorismo social em territórios rurais de Portugal.
            </p>
          </motion.div>

          {/* Contactos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
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
          </motion.div>

          {/* Parceiros */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-4">Parceiros</h4>
            <div className="space-y-2 text-secondary-foreground/80">
              <p>ADRITEM</p>
              <p>Federação Minha Terra</p>
              <p>CoraNE</p>
              <p>ADRACES</p>
            </div>
          </motion.div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-secondary-foreground/60 text-sm">
              © 2024 Madrilusa. Todos os direitos reservados.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary-foreground/60 hover:text-primary mt-4 md:mt-0"
              onClick={() => window.location.href = 'mailto:madrilusa@adritem.pt?subject=Contacto%20Site'}
            >
              Política de Privacidade
            </Button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;