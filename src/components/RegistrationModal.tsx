import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: string | null;
}

const RegistrationModal = ({ isOpen, onClose, cardType }: RegistrationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    idade: "",
    nacionalidade: "",
    cidade: "",
    organizacao: "",
    cargo: "",
    experiencia: "",
    motivacao: "",
    disponibilidade: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do formulário
    toast({
      title: "Registro enviado com sucesso!",
      description: "Entraremos em contacto em breve.",
    });
    
    // Reset form
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      idade: "",
      nacionalidade: "",
      cidade: "",
      organizacao: "",
      cargo: "",
      experiencia: "",
      motivacao: "",
      disponibilidade: ""
    });
    
    onClose();
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFormTitle = () => {
    switch(cardType) {
      case "imigrante": return "Registro - Jovem Imigrante";
      case "empresa": return "Registro - Empresa";
      case "municipio": return "Registro - Município";
      case "academia": return "Registro - Academia";
      case "familia": return "Registro - Família de Acolhimento";
      default: return "Registro";
    }
  };

  const renderSpecificFields = () => {
    switch(cardType) {
      case "imigrante":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={formData.idade}
                  onChange={(e) => handleChange("idade", e.target.value)}
                  placeholder="Ex: 25"
                />
              </div>
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Input
                  id="nacionalidade"
                  value={formData.nacionalidade}
                  onChange={(e) => handleChange("nacionalidade", e.target.value)}
                  placeholder="Ex: Brasileira"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="experiencia">Experiência Profissional</Label>
              <Textarea
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => handleChange("experiencia", e.target.value)}
                placeholder="Descreva sua experiência profissional..."
                rows={3}
              />
            </div>
          </>
        );
      
      case "empresa":
      case "academia":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizacao">
                  {cardType === "empresa" ? "Nome da Empresa" : "Nome da Instituição"}
                </Label>
                <Input
                  id="organizacao"
                  value={formData.organizacao}
                  onChange={(e) => handleChange("organizacao", e.target.value)}
                  placeholder={cardType === "empresa" ? "Nome da empresa" : "Nome da instituição"}
                />
              </div>
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleChange("cargo", e.target.value)}
                  placeholder="Seu cargo"
                />
              </div>
            </div>
          </>
        );
      
      case "municipio":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizacao">Município</Label>
                <Input
                  id="organizacao"
                  value={formData.organizacao}
                  onChange={(e) => handleChange("organizacao", e.target.value)}
                  placeholder="Nome do município"
                />
              </div>
              <div>
                <Label htmlFor="cargo">Departamento/Função</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleChange("cargo", e.target.value)}
                  placeholder="Seu departamento ou função"
                />
              </div>
            </div>
          </>
        );
      
      case "familia":
        return (
          <>
            <div>
              <Label htmlFor="disponibilidade">Disponibilidade de Acolhimento</Label>
              <Select value={formData.disponibilidade} onValueChange={(value) => handleChange("disponibilidade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediata">Imediata</SelectItem>
                  <SelectItem value="1-3-meses">1-3 meses</SelectItem>
                  <SelectItem value="3-6-meses">3-6 meses</SelectItem>
                  <SelectItem value="6-meses-mais">Mais de 6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experiencia">Experiência com Acolhimento</Label>
              <Textarea
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => handleChange("experiencia", e.target.value)}
                placeholder="Descreva sua experiência com acolhimento (se houver)..."
                rows={3}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            {getFormTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="+351 xxx xxx xxx"
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                placeholder="Sua cidade"
              />
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {renderSpecificFields()}

          {/* Motivação */}
          <div>
            <Label htmlFor="motivacao">Motivação</Label>
            <Textarea
              id="motivacao"
              value={formData.motivacao}
              onChange={(e) => handleChange("motivacao", e.target.value)}
              placeholder="Por que gostaria de participar do projeto Madrilusa?"
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="rectangular" className="flex-1">
              Enviar Registro
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;