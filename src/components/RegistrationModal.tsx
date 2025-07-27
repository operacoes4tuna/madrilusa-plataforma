import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: string | null;
}

const RegistrationModal = ({ isOpen, onClose, cardType }: RegistrationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Campos gerais
    nome: "",
    email: "",
    telefone: "",
    codigoPais: "+351",
    
    // Campos específicos imigrante
    nacionalidade: "",
    dataNascimento: "",
    objetivoEmprego: "",
    objetivoFormacao: "",
    objetivoRegularizacao: "",
    objetivoOutros: "",
    mensagem: "",
    
    // Campos específicos empresa
    nomeEmpresa: "",
    pessoaContacto: "",
    morada: "",
    observacoesEmpresa: "",
    
    // Campos específicos município
    nomeMunicipio: "",
    distritoRegiao: "",
    pessoaContactoInstitucional: "",
    funcaoCargo: "",
    gabinetesApoio: "",
    disponibilidadeAcolher: "",
    observacoesMunicipio: "",
    
    // Campos específicos academia
    nomeAcademia: "",
    tipoAcademia: "",
    regiaoAtuacao: "",
    ofertaFormativa: "",
    websiteInstitucional: "",
    observacoesAcademia: "",
    
    // Campos específicos família
    nomeResponsavel: "",
    moradaCompleta: "",
    quantasPessoas: "",
    tipoAcolhimento: [],
    duracaoAcolhimento: [],
    observacoesFamilia: "",
    
    // Termos e condições
    concordaPoliticaDados: false,
    concordaPoliticaCookies: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar termos obrigatórios
    if (!formData.concordaPoliticaDados || !formData.concordaPoliticaCookies) {
      toast({
        title: "Atenção",
        description: "É necessário concordar com as políticas de dados e cookies.",
        variant: "destructive"
      });
      return;
    }
    
    // Simular envio do formulário
    toast({
      title: "Registo enviado com sucesso!",
      description: "Entraremos em contacto em breve.",
    });
    
    // Reset form
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      codigoPais: "+351",
      nacionalidade: "",
      dataNascimento: "",
      objetivoEmprego: "",
      objetivoFormacao: "",
      objetivoRegularizacao: "",
      objetivoOutros: "",
      mensagem: "",
      nomeEmpresa: "",
      pessoaContacto: "",
      morada: "",
      observacoesEmpresa: "",
      nomeMunicipio: "",
      distritoRegiao: "",
      pessoaContactoInstitucional: "",
      funcaoCargo: "",
      gabinetesApoio: "",
      disponibilidadeAcolher: "",
      observacoesMunicipio: "",
      nomeAcademia: "",
      tipoAcademia: "",
      regiaoAtuacao: "",
      ofertaFormativa: "",
      websiteInstitucional: "",
      observacoesAcademia: "",
      nomeResponsavel: "",
      moradaCompleta: "",
      quantasPessoas: "",
      tipoAcolhimento: [],
      duracaoAcolhimento: [],
      observacoesFamilia: "",
      concordaPoliticaDados: false,
      concordaPoliticaCookies: false
    });
    
    onClose();
  };

  const handleChange = (name: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxArrayChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      if (checked) {
        return {
          ...prev,
          [name]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [name]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const getFormTitle = () => {
    switch(cardType) {
      case "imigrante": return "Registo - Jovem Imigrante";
      case "empresa": return "Registo - Empresa";
      case "municipio": return "Registo - Município";
      case "academia": return "Registo - Academia";
      case "familia": return "Registo - Família de Acolhimento";
      default: return "Registo";
    }
  };

  const paisesOptions = [
    { value: "+351", label: "Portugal (+351)" },
    { value: "+55", label: "Brasil (+55)" },
    { value: "+244", label: "Angola (+244)" },
    { value: "+258", label: "Moçambique (+258)" },
    { value: "+238", label: "Cabo Verde (+238)" },
    { value: "+245", label: "Guiné-Bissau (+245)" },
    { value: "+239", label: "São Tomé e Príncipe (+239)" },
    { value: "+670", label: "Timor-Leste (+670)" },
    { value: "+853", label: "Macau (+853)" },
    { value: "+1", label: "Estados Unidos (+1)" },
    { value: "+33", label: "França (+33)" },
    { value: "+49", label: "Alemanha (+49)" },
    { value: "+34", label: "Espanha (+34)" },
  ];

  const nacionalidadesOptions = [
    "Portuguesa", "Brasileira", "Angolana", "Moçambicana", "Cabo-verdiana", 
    "Guineense", "São-tomense", "Timorense", "Francesa", "Espanhola", 
    "Alemã", "Italiana", "Americana", "Outra"
  ];

  const renderSpecificFields = () => {
    switch(cardType) {
      case "imigrante":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                <Select value={formData.nacionalidade} onValueChange={(value) => handleChange("nacionalidade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {nacionalidadesOptions.map(nacionalidade => (
                      <SelectItem key={nacionalidade} value={nacionalidade}>
                        {nacionalidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Objetivos (descreva as suas expectativas)</h3>
              <div>
                <Label htmlFor="objetivoEmprego">Emprego</Label>
                <Textarea
                  id="objetivoEmprego"
                  value={formData.objetivoEmprego}
                  onChange={(e) => handleChange("objetivoEmprego", e.target.value)}
                  placeholder="Descreva as suas expectativas e área de interesse profissional"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="objetivoFormacao">Formação</Label>
                <Textarea
                  id="objetivoFormacao"
                  value={formData.objetivoFormacao}
                  onChange={(e) => handleChange("objetivoFormacao", e.target.value)}
                  placeholder="Indique cursos ou capacitações desejadas"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="objetivoRegularizacao">Regularização</Label>
                <Textarea
                  id="objetivoRegularizacao"
                  value={formData.objetivoRegularizacao}
                  onChange={(e) => handleChange("objetivoRegularizacao", e.target.value)}
                  placeholder="Especifique necessidades relacionadas à documentação"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="objetivoOutros">Outros</Label>
                <Textarea
                  id="objetivoOutros"
                  value={formData.objetivoOutros}
                  onChange={(e) => handleChange("objetivoOutros", e.target.value)}
                  placeholder="Outros objetivos ou necessidades específicas"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                <Textarea
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => handleChange("mensagem", e.target.value)}
                  placeholder="Informações adicionais, competências especiais, etc."
                  rows={3}
                />
              </div>
            </div>
          </>
        );
      
      case "empresa":
        return (
          <>
            <div>
              <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
              <Input
                id="nomeEmpresa"
                value={formData.nomeEmpresa}
                onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
                placeholder="Nome da empresa"
                required
              />
            </div>
            <div>
              <Label htmlFor="pessoaContacto">Pessoa de Contacto</Label>
              <Input
                id="pessoaContacto"
                value={formData.pessoaContacto}
                onChange={(e) => handleChange("pessoaContacto", e.target.value)}
                placeholder="Nome do responsável pela empresa"
              />
            </div>
            <div>
              <Label htmlFor="morada">Morada</Label>
              <Input
                id="morada"
                value={formData.morada}
                onChange={(e) => handleChange("morada", e.target.value)}
                placeholder="Endereço da empresa"
              />
            </div>
            <div>
              <Label htmlFor="observacoesEmpresa">Observações Adicionais</Label>
              <Textarea
                id="observacoesEmpresa"
                value={formData.observacoesEmpresa}
                onChange={(e) => handleChange("observacoesEmpresa", e.target.value)}
                placeholder="Informações sobre vagas, requisitos ou outros detalhes relevantes"
                rows={4}
              />
            </div>
          </>
        );
      
      case "municipio":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeMunicipio">Nome do Município</Label>
                <Input
                  id="nomeMunicipio"
                  value={formData.nomeMunicipio}
                  onChange={(e) => handleChange("nomeMunicipio", e.target.value)}
                  placeholder="Nome do município"
                />
              </div>
              <div>
                <Label htmlFor="distritoRegiao">Distrito / Região Administrativa</Label>
                <Input
                  id="distritoRegiao"
                  value={formData.distritoRegiao}
                  onChange={(e) => handleChange("distritoRegiao", e.target.value)}
                  placeholder="Distrito ou região"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pessoaContactoInstitucional">Pessoa de Contacto Institucional</Label>
                <Input
                  id="pessoaContactoInstitucional"
                  value={formData.pessoaContactoInstitucional}
                  onChange={(e) => handleChange("pessoaContactoInstitucional", e.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <Label htmlFor="funcaoCargo">Função / Cargo</Label>
                <Input
                  id="funcaoCargo"
                  value={formData.funcaoCargo}
                  onChange={(e) => handleChange("funcaoCargo", e.target.value)}
                  placeholder="Cargo do responsável"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gabinetesApoio">Gabinetes ou Projetos de Apoio a Imigrantes Existentes</Label>
              <Input
                id="gabinetesApoio"
                value={formData.gabinetesApoio}
                onChange={(e) => handleChange("gabinetesApoio", e.target.value)}
                placeholder="Ex: CLAIM, CLDS, Programa Bairros Saudáveis, outros"
              />
            </div>
            <div>
              <Label htmlFor="disponibilidadeAcolher">Disponibilidade para acolher ações locais do projeto</Label>
              <Select value={formData.disponibilidadeAcolher} onValueChange={(value) => handleChange("disponibilidadeAcolher", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim, totalmente disponível</SelectItem>
                  <SelectItem value="condicional">Sim, com condições</SelectItem>
                  <SelectItem value="parcial">Parcialmente disponível</SelectItem>
                  <SelectItem value="nao">Não disponível no momento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="observacoesMunicipio">Observações Adicionais</Label>
              <Textarea
                id="observacoesMunicipio"
                value={formData.observacoesMunicipio}
                onChange={(e) => handleChange("observacoesMunicipio", e.target.value)}
                placeholder="Ex: horários de atendimento, espaços disponíveis, eventos locais"
                rows={3}
              />
            </div>
          </>
        );
      
      case "academia":
        return (
          <>
            <div>
              <Label htmlFor="nomeAcademia">Nome da Academia / Instituição *</Label>
              <Input
                id="nomeAcademia"
                value={formData.nomeAcademia}
                onChange={(e) => handleChange("nomeAcademia", e.target.value)}
                placeholder="Nome da instituição"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoAcademia">Tipo de Academia</Label>
                <Input
                  id="tipoAcademia"
                  value={formData.tipoAcademia}
                  onChange={(e) => handleChange("tipoAcademia", e.target.value)}
                  placeholder="Ex: escolas de formação, cursos técnicos, universidades"
                />
              </div>
              <div>
                <Label htmlFor="regiaoAtuacao">Região / Zona de Atuação</Label>
                <Input
                  id="regiaoAtuacao"
                  value={formData.regiaoAtuacao}
                  onChange={(e) => handleChange("regiaoAtuacao", e.target.value)}
                  placeholder="Área geográfica de atuação"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ofertaFormativa">Oferta Formativa</Label>
              <Textarea
                id="ofertaFormativa"
                value={formData.ofertaFormativa}
                onChange={(e) => handleChange("ofertaFormativa", e.target.value)}
                placeholder="Descrição dos cursos e capacitações oferecidas"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="websiteInstitucional">Website / Página Institucional</Label>
              <Input
                id="websiteInstitucional"
                type="url"
                value={formData.websiteInstitucional}
                onChange={(e) => handleChange("websiteInstitucional", e.target.value)}
                placeholder="https://www.exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="observacoesAcademia">Observações</Label>
              <Textarea
                id="observacoesAcademia"
                value={formData.observacoesAcademia}
                onChange={(e) => handleChange("observacoesAcademia", e.target.value)}
                placeholder="Informações adicionais sobre a instituição"
                rows={3}
              />
            </div>
          </>
        );
      
      case "familia":
        return (
          <>
            <div>
              <Label htmlFor="nomeResponsavel">Nome Completo do Responsável *</Label>
              <Input
                id="nomeResponsavel"
                value={formData.nomeResponsavel}
                onChange={(e) => handleChange("nomeResponsavel", e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="moradaCompleta">Morada Completa *</Label>
              <Textarea
                id="moradaCompleta"
                value={formData.moradaCompleta}
                onChange={(e) => handleChange("moradaCompleta", e.target.value)}
                placeholder="Deve incluir freguesia e concelho. Ex: Penha Garcia, Idanha-a-Nova"
                rows={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantasPessoas">Quantas Pessoas pode Acolher?</Label>
              <Input
                id="quantasPessoas"
                value={formData.quantasPessoas}
                onChange={(e) => handleChange("quantasPessoas", e.target.value)}
                placeholder="Ex: 1 adulto + 1 criança"
              />
            </div>
            
            <div>
              <Label>Tipo de Acolhimento Disponível (selecione todas as opções aplicáveis)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: "dormida", label: "Dormida" },
                  { value: "alimentacao", label: "Alimentação" },
                  { value: "transporte", label: "Transporte Local" },
                  { value: "apoio-emocional", label: "Apoio Emocional" },
                  { value: "emergencia", label: "Acolhimento de Emergência" },
                  { value: "outro", label: "Outro" }
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.tipoAcolhimento.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxArrayChange("tipoAcolhimento", option.value, checked as boolean)}
                    />
                    <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Duração do Acolhimento (selecione todas as opções aplicáveis)</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  { value: "curto-prazo", label: "Curto Prazo (até 7 dias)" },
                  { value: "medio-prazo", label: "Médio Prazo (1 a 3 meses)" },
                  { value: "longo-prazo", label: "Longo Prazo (mais de 3 meses)" }
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.duracaoAcolhimento.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxArrayChange("duracaoAcolhimento", option.value, checked as boolean)}
                    />
                    <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="observacoesFamilia">Observações Adicionais</Label>
              <Textarea
                id="observacoesFamilia"
                value={formData.observacoesFamilia}
                onChange={(e) => handleChange("observacoesFamilia", e.target.value)}
                placeholder="Ex: preferências por perfil de acolhidos, condições especiais, disponibilidade de horários"
                rows={3}
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const getPhoneLabel = () => {
    switch(cardType) {
      case "imigrante": return "Telemóvel (WhatsApp) *";
      case "empresa": return "Telefone de Contacto *";
      case "municipio": return "Telefone *";
      case "academia": return "Telefone";
      case "familia": return "Telefone de Contacto *";
      default: return "Telefone *";
    }
  };

  const isPhoneRequired = () => {
    return cardType !== "academia";
  };

  const isEmailRequired = () => {
    return cardType !== "familia";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            {getFormTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">
                {cardType === "familia" ? "Nome Completo do Responsável" : "Nome Completo"} *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">
                Email {isEmailRequired() ? "*" : ""}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required={isEmailRequired()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigoPais">Código do País</Label>
              <Select value={formData.codigoPais} onValueChange={(value) => handleChange("codigoPais", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paisesOptions.map(pais => (
                    <SelectItem key={pais.value} value={pais.value}>
                      {pais.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="telefone">{getPhoneLabel()}</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="XXX XXX XXX"
                required={isPhoneRequired()}
              />
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {renderSpecificFields()}

          {/* Termos e Condições */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-secondary">Termos e Condições</h3>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="concordaPoliticaDados"
                checked={formData.concordaPoliticaDados}
                onCheckedChange={(checked) => handleChange("concordaPoliticaDados", checked as boolean)}
                required
              />
              <Label htmlFor="concordaPoliticaDados" className="text-sm leading-relaxed">
                Concordo com a <strong>política de dados e privacidade</strong> *
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="concordaPoliticaCookies"
                checked={formData.concordaPoliticaCookies}
                onCheckedChange={(checked) => handleChange("concordaPoliticaCookies", checked as boolean)}
                required
              />
              <Label htmlFor="concordaPoliticaCookies" className="text-sm leading-relaxed">
                Concordo com a <strong>política de cookies</strong> *
              </Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="rectangular" className="flex-1">
              Enviar Registo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;