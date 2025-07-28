import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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

// Interface para formulário de empresa
interface EmpresaRegistrationFormData {
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

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

// Schema de validação para Etapa 2 (Empresa)
const empresaRegistrationSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  pessoaContacto: z.string().optional(),
  morada: z.string().optional(),
  observacoes: z.string().optional(),
});

const CategoryRegistrationModal = ({ isOpen, onClose, category }: CategoryRegistrationModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [basicData, setBasicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNacionalidadesModal, setShowNacionalidadesModal] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
  const nacionalidadeModalRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nacionalidadeModalRef.current && !nacionalidadeModalRef.current.contains(event.target as Node)) {
        setShowNacionalidadesModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Form para Etapa 2 (Empresa)
  const empresaForm = useForm<EmpresaRegistrationFormData>({
    resolver: zodResolver(empresaRegistrationSchema),
    defaultValues: {
      nomeEmpresa: "",
      pessoaContacto: "",
      morada: "",
      observacoes: ""
    }
  });

  // Etapa 1: Registro básico
  const handleBasicSubmit = async (data: BasicRegistrationFormData) => {
    try {
      setIsLoading(true);
      setEmailExistsError(null); // Limpar erros anteriores
      
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
        // Se email já existe, mostrar mensagem com link de login
        if (result.error && result.error.toLowerCase().includes("email")) {
          setEmailExistsError(
            `O email "${data.email}" já está cadastrado na plataforma. Para continuar seu cadastro, você deve fazer login primeiro.`
          );
          return;
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

  // Etapa 2: Dados específicos da categoria - Imigrante
  const handleImigranteSubmit = async (data: ImigranteRegistrationFormData) => {
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
            const imigranteUserData = {
              id: userResult.data.id,
              nomeCompleto: userResult.data.nomeCompleto,
              email: userResult.data.email,
              telemovel: userResult.data.telemovel,
              categoria: userResult.data.categoria,
              foto: userResult.data.foto,
              createdAt: userResult.data.createdAt || new Date(),
              updatedAt: userResult.data.updatedAt || new Date()
            };
            
            localStorage.setItem('madrilusa_user', JSON.stringify(imigranteUserData));
            setUser(imigranteUserData);

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
          const imigranteFallbackData = {
            id: basicData.userId,
            nomeCompleto: basicForm.getValues('nomeCompleto'),
            email: basicForm.getValues('email'),
            categoria: category,
            telemovel: basicForm.getValues('telemovel') || null,
            foto: null,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          localStorage.setItem('madrilusa_user', JSON.stringify(imigranteFallbackData));
          setUser(imigranteFallbackData);

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

  // Etapa 2: Dados específicos da categoria - Empresa
  const handleEmpresaSubmit = async (data: EmpresaRegistrationFormData) => {
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

      const response = await fetch("/api/empresas/perfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: basicData.userId,
          ...data
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Perfil de empresa criado com sucesso:', result.data);
        
        // Buscar dados completos do usuário após criação do perfil
        try {
          console.log('🔍 Buscando dados do usuário empresa:', basicData.userId);
          const userResponse = await fetch(`/api/auth/user/${basicData.userId}`);
          const userResult = await userResponse.json();
          
          console.log('📥 Resposta do usuário empresa:', userResult);
          
          if (userResult.success && userResult.data) {
            // Login automático com dados completos
            const userData = {
              id: userResult.data.id,
              nomeCompleto: userResult.data.nomeCompleto,
              email: userResult.data.email,
              telemovel: userResult.data.telemovel,
              categoria: userResult.data.categoria,
              foto: userResult.data.foto,
              createdAt: userResult.data.createdAt || new Date(),
              updatedAt: userResult.data.updatedAt || new Date()
            };
            
            console.log('💾 Salvando dados empresa no localStorage:', userData);
            localStorage.setItem('madrilusa_user', JSON.stringify(userData));
            
            // Atualizar estado do useAuth diretamente
            setUser(userData);

            toast({
              title: "Registro Concluído!",
              description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
            });

            // Fechar modal e redirecionar
            onClose();
            console.log('🚀 Redirecionando empresa para dashboard...');
            
            // Usar navigate() agora que o estado está atualizado
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 1000);
          } else {
            throw new Error(`Erro ao buscar dados do usuário: ${userResult.error || 'Dados não encontrados'}`);
          }
        } catch (userError: any) {
          console.error('❌ Erro ao buscar dados completos da empresa:', userError);
          
          // Fallback: usar dados básicos se falhar buscar dados completos
          const fallbackUserData = {
            id: basicData.userId,
            nomeCompleto: basicForm.getValues('nomeCompleto'),
            email: basicForm.getValues('email'),
            categoria: category,
            telemovel: basicForm.getValues('telemovel') || null,
            foto: null,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          console.log('💾 Fallback empresa - Salvando dados básicos:', fallbackUserData);
          localStorage.setItem('madrilusa_user', JSON.stringify(fallbackUserData));
          
          // Atualizar estado do useAuth diretamente
          setUser(fallbackUserData as any);

          toast({
            title: "Registro Concluído!",
            description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
          });

          onClose();
          console.log('🚀 Redirecionando empresa para dashboard (fallback)...');
          
          // Usar navigate() agora que o estado está atualizado
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
    setEmailExistsError(null);
    basicForm.reset();
    imigranteForm.reset();
    empresaForm.reset();
    onClose();
  };

  const handleLoginClick = () => {
    // Fechar modal de registro e abrir modal de login
    onClose();
    // Aguardar um pouco para o modal fechar antes de abrir o de login
    setTimeout(() => {
      // Encontrar e clicar no botão de login do header
      const loginButton = document.querySelector('[data-login-button]') as HTMLButtonElement;
      if (loginButton) {
        loginButton.click();
      }
    }, 300);
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
            {emailExistsError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Email já cadastrado
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{emailExistsError}</p>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleLoginClick}
                        className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Fazer Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
          <form onSubmit={imigranteForm.handleSubmit(handleImigranteSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nacionalidade">Nacionalidade *</Label>
              <div ref={nacionalidadeModalRef} className="relative">
                <Input
                  id="nacionalidade"
                  {...imigranteForm.register("nacionalidade")}
                  onFocus={() => setShowNacionalidadesModal(true)}
                  placeholder="Digite ou selecione sua nacionalidade"
                  autoComplete="off"
                  className="pr-8"
                />
                                 <button
                   type="button"
                   onClick={() => {
                     setShowNacionalidadesModal(!showNacionalidadesModal);
                     // Se estiver abrindo e o campo estiver vazio, garantir que mostre todas
                     if (!showNacionalidadesModal && (imigranteForm.watch("nacionalidade") || "") === '') {
                       // Força re-render para mostrar todas as opções
                       imigranteForm.setValue("nacionalidade", "");
                     }
                   }}
                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   aria-label="Mostrar opções"
                 >
                   ▼
                 </button>
                {showNacionalidadesModal && (
                  <div className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1">
                    {NACIONALIDADES
                      .filter(pais => {
                        const currentValue = imigranteForm.watch("nacionalidade") || "";
                        return currentValue === '' || 
                               pais.toLowerCase().includes(currentValue.toLowerCase());
                      })
                      .map((pais) => (
                        <div
                          key={pais}
                          onClick={() => {
                            imigranteForm.setValue("nacionalidade", pais);
                            setShowNacionalidadesModal(false);
                          }}
                          className="px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                        >
                          {pais}
                        </div>
                      ))}
                    {NACIONALIDADES.filter(pais => {
                      const currentValue = imigranteForm.watch("nacionalidade") || "";
                      return currentValue === '' || 
                             pais.toLowerCase().includes(currentValue.toLowerCase());
                    }).length === 0 && (
                      <div className="px-3 py-2 text-gray-500">
                        Nenhuma nacionalidade encontrada
                      </div>
                    )}
                  </div>
                )}
              </div>
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

        {step === 2 && category === USER_CATEGORIES.EMPRESA && (
          <form onSubmit={empresaForm.handleSubmit(handleEmpresaSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
              <Input
                id="nomeEmpresa"
                {...empresaForm.register("nomeEmpresa")}
                placeholder="Digite o nome da empresa"
              />
              {empresaForm.formState.errors.nomeEmpresa && (
                <p className="text-red-500 text-sm mt-1">
                  {empresaForm.formState.errors.nomeEmpresa.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pessoaContacto">Pessoa de Contacto</Label>
              <Input
                id="pessoaContacto"
                {...empresaForm.register("pessoaContacto")}
                placeholder="Nome do responsável (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="morada">Morada</Label>
              <Input
                id="morada"
                {...empresaForm.register("morada")}
                placeholder="Endereço da empresa (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                {...empresaForm.register("observacoes")}
                rows={4}
                placeholder="Vagas disponíveis, requisitos, outros detalhes..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="termos-empresa" required />
              <Label htmlFor="termos-empresa" className="text-sm">
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