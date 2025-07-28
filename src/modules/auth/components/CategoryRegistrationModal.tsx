import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  UserCategory, 
  USER_CATEGORIES,
  BasicRegistrationFormData,
  ImigranteRegistrationFormData,
  NACIONALIDADES
} from "../types/auth.types";

interface CategoryRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: UserCategory;
}

// Schema de validação para Etapa 1
const basicRegistrationSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telemovel: z.string().optional(),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Schema de validação para Etapa 2 (Imigrante)
const imigranteRegistrationSchema = z.object({
  nacionalidade: z.string().min(1, "Nacionalidade é obrigatória"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  objetivos: z.array(z.string()).optional(),
  objetivoOutros: z.string().optional(),
  mensagem: z.string().optional(),
  aceitaNotificacoes: z.boolean().optional(),
});

const CategoryRegistrationModal = ({ isOpen, onClose, category }: CategoryRegistrationModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [basicData, setBasicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form para Etapa 1
  const basicForm = useForm<BasicRegistrationFormData>({
    resolver: zodResolver(basicRegistrationSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      telemovel: "",
      senha: "",
      categoria: category
    }
  });

  // Form para Etapa 2 (Imigrante)
  const imigranteForm = useForm<ImigranteRegistrationFormData>({
    resolver: zodResolver(imigranteRegistrationSchema),
    defaultValues: {
      nacionalidade: "",
      dataNascimento: "",
      objetivos: [],
      objetivoOutros: "",
      mensagem: "",
      aceitaNotificacoes: false
    }
  });

  // Etapa 1: Registro básico
  const handleBasicSubmit = async (data: BasicRegistrationFormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/register-basic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          categoria: category
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBasicData(result.data);
        setStep(2);
        toast({
          title: "Etapa 1 Concluída!",
          description: "Agora complete com seus dados específicos.",
        });
      } else {
        // Se email já existe, tentar fazer login
        if (result.error && result.error.toLowerCase().includes("email")) {
          try {
            const loginResponse = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                senha: data.senha
              }),
            });

            const loginResult = await loginResponse.json();

            if (loginResult.success) {
              const user = loginResult.data.user;
              
              // Verificar se usuário já tem a categoria desejada
              if (user.categoria === category) {
                // Verificar se já tem perfil específico da categoria
                let hasProfile = false;
                
                if (category === USER_CATEGORIES.IMIGRANTE) {
                  const profileResponse = await fetch(`/api/imigrantes/has-perfil/${user.id}`);
                  const profileResult = await profileResponse.json();
                  hasProfile = profileResult.success && profileResult.data.hasPerfil;
                }

                if (hasProfile) {
                  // Usuário já tem perfil completo, fazer login direto
                  localStorage.setItem('user', JSON.stringify(user));
                  toast({
                    title: "Login realizado!",
                    description: "Redirecionando para sua plataforma...",
                  });
                  onClose();
                  setTimeout(() => {
                    navigate('/app/dashboard');
                  }, 1000);
                  return;
                } else {
                  // Usuário tem categoria mas não tem perfil específico, continuar para etapa 2
                  setBasicData({ 
                    userId: user.id,
                    nomeCompleto: user.nomeCompleto,
                    email: user.email 
                  });
                  setStep(2);
                  toast({
                    title: "Login realizado!",
                    description: "Complete seu perfil específico.",
                  });
                  return;
                }
              } else {
                // Usuário não tem categoria ou tem categoria diferente
                toast({
                  title: "Erro",
                  description: `Este email já está registrado em outra categoria. Entre em contato conosco.`,
                  variant: "destructive",
                });
                return;
              }
            } else {
              throw new Error("Senha incorreta");
            }
          } catch (loginError: any) {
            toast({
              title: "Email já existe",
              description: "Email já cadastrado. Verifique sua senha ou use o login.",
              variant: "destructive",
            });
            return;
          }
        } else {
          throw new Error(result.error || "Erro no registro");
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no Registro",
        description: error.message || "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Etapa 2: Dados específicos da categoria
  const handleSpecificSubmit = async (data: ImigranteRegistrationFormData) => {
    if (!basicData?.userId) {
      toast({
        title: "Erro",
        description: "Dados básicos não encontrados. Reinicie o processo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/imigrantes/perfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: basicData.userId,
          ...data,
          dataNascimento: new Date(data.dataNascimento).toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Buscar dados completos do usuário após criação do perfil
        try {
          const userResponse = await fetch(`/api/auth/user/${basicData.userId}`);
          const userResult = await userResponse.json();
          
          if (userResult.success) {
            // Login automático com dados completos
            localStorage.setItem('user', JSON.stringify({
              id: userResult.data.id,
              nomeCompleto: userResult.data.nomeCompleto,
              email: userResult.data.email,
              telemovel: userResult.data.telemovel,
              categoria: userResult.data.categoria,
              foto: userResult.data.foto
            }));

            toast({
              title: "Registro Concluído!",
              description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
            });

            // Fechar modal e redirecionar
            onClose();
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 1000);
          } else {
            throw new Error("Erro ao buscar dados do usuário");
          }
        } catch (userError: any) {
          // Fallback: usar dados básicos se falhar buscar dados completos
          localStorage.setItem('user', JSON.stringify({
            id: basicData.userId,
            nomeCompleto: basicForm.getValues('nomeCompleto'),
            email: basicForm.getValues('email'),
            categoria: category
          }));

          toast({
            title: "Registro Concluído!",
            description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
          });

          onClose();
          setTimeout(() => {
            navigate('/app/dashboard');
          }, 1000);
        }
      } else {
        throw new Error(result.error || "Erro ao criar perfil");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao Finalizar Registro",
        description: error.message || "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBasicData(null);
    basicForm.reset();
    imigranteForm.reset();
    onClose();
  };

  const getCategoryTitle = (cat: UserCategory) => {
    switch (cat) {
      case USER_CATEGORIES.IMIGRANTE:
        return "Registro de Imigrante";
      case USER_CATEGORIES.EMPRESA:
        return "Registro de Empresa";
      case USER_CATEGORIES.MUNICIPIO:
        return "Registro de Município";
      case USER_CATEGORIES.ACADEMIA:
        return "Registro de Academia";
      case USER_CATEGORIES.FAMILIA_ACOLHIMENTO:
        return "Registro de Família";
      default:
        return "Registro";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-secondary">
            {getCategoryTitle(category)}
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2">
            {step === 1 ? "Dados Básicos" : "Dados Específicos"}
          </p>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={basicForm.handleSubmit(handleBasicSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                {...basicForm.register("nomeCompleto")}
                placeholder="Digite seu nome completo"
              />
              {basicForm.formState.errors.nomeCompleto && (
                <p className="text-red-500 text-sm mt-1">
                  {basicForm.formState.errors.nomeCompleto.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...basicForm.register("email")}
                placeholder="Digite seu email"
              />
              {basicForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {basicForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="telemovel">Telemóvel (WhatsApp)</Label>
              <Input
                id="telemovel"
                {...basicForm.register("telemovel")}
                placeholder="+351 912 345 678"
              />
            </div>

            <div>
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                {...basicForm.register("senha")}
                placeholder="Mínimo 6 caracteres"
              />
              {basicForm.formState.errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {basicForm.formState.errors.senha.message}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processando..." : "Continuar"}
              </Button>
            </div>
          </form>
        )}

        {step === 2 && category === USER_CATEGORIES.IMIGRANTE && (
          <form onSubmit={imigranteForm.handleSubmit(handleSpecificSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nacionalidade">Nacionalidade *</Label>
              <Select onValueChange={(value) => imigranteForm.setValue("nacionalidade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua nacionalidade" />
                </SelectTrigger>
                <SelectContent>
                  {NACIONALIDADES.map((pais) => (
                    <SelectItem key={pais} value={pais}>
                      {pais}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {imigranteForm.formState.errors.nacionalidade && (
                <p className="text-red-500 text-sm mt-1">
                  {imigranteForm.formState.errors.nacionalidade.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...imigranteForm.register("dataNascimento")}
              />
              {imigranteForm.formState.errors.dataNascimento && (
                <p className="text-red-500 text-sm mt-1">
                  {imigranteForm.formState.errors.dataNascimento.message}
                </p>
              )}
            </div>

            <div>
              <Label>Objetivos *</Label>
              <div className="space-y-2 mt-2">
                {['Emprego', 'Formação', 'Regularização'].map((objetivo) => (
                  <div key={objetivo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`objetivo-${objetivo}`}
                      checked={imigranteForm.watch("objetivos")?.includes(objetivo) || false}
                      onCheckedChange={(checked) => {
                        const currentObjetivos = imigranteForm.getValues("objetivos") || [];
                        if (checked) {
                          imigranteForm.setValue("objetivos", [...currentObjetivos, objetivo]);
                        } else {
                          imigranteForm.setValue("objetivos", currentObjetivos.filter(obj => obj !== objetivo));
                        }
                      }}
                    />
                    <Label htmlFor={`objetivo-${objetivo}`} className="text-sm font-normal">
                      {objetivo}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="objetivoOutros">Outros Objetivos</Label>
              <Textarea
                id="objetivoOutros"
                {...imigranteForm.register("objetivoOutros")}
                placeholder="Outros objetivos ou necessidades específicas"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="mensagem">Mensagem Adicional</Label>
              <Textarea
                id="mensagem"
                {...imigranteForm.register("mensagem")}
                placeholder="Informações adicionais que gostaria de compartilhar"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="aceitaNotificacoes"
                checked={imigranteForm.watch("aceitaNotificacoes") || false}
                onCheckedChange={(checked) => {
                  imigranteForm.setValue("aceitaNotificacoes", checked as boolean);
                }}
              />
              <Label htmlFor="aceitaNotificacoes" className="text-sm font-normal">
                Aceito receber notificações de oportunidades, notícias e eventos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="termos" required />
              <Label htmlFor="termos" className="text-sm">
                Concordo com a política de dados e privacidade e política de cookies *
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Finalizando..." : "Concluir Registro"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryRegistrationModal; 