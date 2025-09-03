import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  NACIONALIDADES,
  GENEROS,
  FLUENCIA_PORTUGUES
} from "../types/auth.types";

// Interface para formulário de empresa
interface EmpresaRegistrationFormData {
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

// Interface para formulário de município
interface MunicipioRegistrationFormData {
  nomeMunicipio?: string;
  distrito?: string;
  pessoaContacto?: string;
  funcaoCargo?: string;
  projetosApoio?: string;
  disponibilidadeAcoes?: string;
  observacoes?: string;
}

// Interface para formulário de academia
interface AcademiaRegistrationFormData {
  nomeAcademia: string;
  tipoAcademia?: string;
  regiao?: string;
  pessoaContacto?: string;
  emailInstitucional?: string;
  telefone?: string;
  ofertaFormativa?: string;
  website?: string;
  observacoes?: string;
}

// Interface para formulário de família
interface FamiliaRegistrationFormData {
  moradaCompleta: string;
  quantidadePessoas?: string;
  tiposAcolhimento?: string[];
  duracaoAcolhimento?: string[];
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
  
  // ✨ NOVOS CAMPOS - Informações Adicionais
  genero: z.string().optional(),
  municipioResidencia: z.string().optional(),
  transporteProprio: z.boolean().optional(),
  possibilidadeMudancaMorada: z.boolean().optional(),
  fluenciaPortugues: z.string().optional(),
});

// Schema de validação para Etapa 2 (Empresa)
const empresaRegistrationSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  pessoaContacto: z.string().optional(),
  morada: z.string().optional(),
  observacoes: z.string().optional(),
});

// Schema de validação para Etapa 2 (Município)
const municipioRegistrationSchema = z.object({
  nomeMunicipio: z.string().optional(),
  distrito: z.string().optional(),
  pessoaContacto: z.string().optional(),
  funcaoCargo: z.string().optional(),
  projetosApoio: z.string().optional(),
  disponibilidadeAcoes: z.string().optional(),
  observacoes: z.string().optional(),
});

// Schema de validação para Etapa 2 (Academia)
const academiaRegistrationSchema = z.object({
  nomeAcademia: z.string().min(1, "Nome da academia é obrigatório"),
  tipoAcademia: z.string().optional(),
  regiao: z.string().optional(),
  pessoaContacto: z.string().optional(),
  emailInstitucional: z.string().email("Email deve ter formato válido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  ofertaFormativa: z.string().optional(),
  website: z.string().url("Website deve ser uma URL válida").optional().or(z.literal("")),
  observacoes: z.string().optional(),
});

// Schema de validação para Etapa 2 (Família)
const familiaRegistrationSchema = z.object({
  moradaCompleta: z.string().min(10, "Morada completa deve ter pelo menos 10 caracteres"),
  quantidadePessoas: z.string().optional(),
  tiposAcolhimento: z.array(z.string()).optional(),
  duracaoAcolhimento: z.array(z.string()).optional(),
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
      aceitaNotificacoes: false,
      
      // ✨ NOVOS CAMPOS - Informações Adicionais
      genero: "",
      municipioResidencia: "",
      transporteProprio: false,
      possibilidadeMudancaMorada: false,
      fluenciaPortugues: ""
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

  // Form para Etapa 2 (Município)
  const municipioForm = useForm<MunicipioRegistrationFormData>({
    resolver: zodResolver(municipioRegistrationSchema),
    defaultValues: {
      nomeMunicipio: "",
      distrito: "",
      pessoaContacto: "",
      funcaoCargo: "",
      projetosApoio: "",
      disponibilidadeAcoes: "",
      observacoes: ""
    }
  });

  // Form para Etapa 2 (Academia)
  const academiaForm = useForm<AcademiaRegistrationFormData>({
    resolver: zodResolver(academiaRegistrationSchema),
    defaultValues: {
      nomeAcademia: "",
      tipoAcademia: "",
      regiao: "",
      pessoaContacto: "",
      emailInstitucional: "",
      telefone: "",
      ofertaFormativa: "",
      website: "",
      observacoes: ""
    }
  });

  // Form para Etapa 2 (Família)
  const familiaForm = useForm<FamiliaRegistrationFormData>({
    resolver: zodResolver(familiaRegistrationSchema),
    defaultValues: {
      moradaCompleta: "",
      quantidadePessoas: "",
      tiposAcolhimento: [],
      duracaoAcolhimento: [],
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

  // Etapa 2: Dados específicos da categoria - Município
  const handleMunicipioSubmit = async (data: MunicipioRegistrationFormData) => {
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

      const response = await fetch("/api/municipios/perfil", {
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
        console.log('✅ Perfil de município criado com sucesso:', result.data);
        
        // Buscar dados completos do usuário após criação do perfil
        try {
          console.log('🔍 Buscando dados do usuário município:', basicData.userId);
          const userResponse = await fetch(`/api/auth/user/${basicData.userId}`);
          const userResult = await userResponse.json();
          
          console.log('📥 Resposta do usuário município:', userResult);
          
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
            
            console.log('💾 Salvando dados município no localStorage:', userData);
            localStorage.setItem('madrilusa_user', JSON.stringify(userData));
            
            // Atualizar estado do useAuth diretamente
            setUser(userData);

            toast({
              title: "Registro Concluído!",
              description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
            });

            // Fechar modal e redirecionar
            onClose();
            console.log('🚀 Redirecionando município para dashboard...');
            
            // Usar navigate() agora que o estado está atualizado
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 1000);
          } else {
            throw new Error(`Erro ao buscar dados do usuário: ${userResult.error || 'Dados não encontrados'}`);
          }
        } catch (userError: any) {
          console.error('❌ Erro ao buscar dados completos do município:', userError);
          
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
          
          console.log('💾 Fallback município - Salvando dados básicos:', fallbackUserData);
          localStorage.setItem('madrilusa_user', JSON.stringify(fallbackUserData));
          
          // Atualizar estado do useAuth diretamente
          setUser(fallbackUserData as any);

          toast({
            title: "Registro Concluído!",
            description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
          });

          onClose();
          console.log('🚀 Redirecionando município para dashboard (fallback)...');
          
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

  // Etapa 2: Dados específicos da categoria - Academia
  const handleAcademiaSubmit = async (data: AcademiaRegistrationFormData) => {
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

      const response = await fetch("/api/academias/perfil", {
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
        console.log('✅ Perfil de academia criado com sucesso:', result.data);
        
        // Buscar dados completos do usuário após criação do perfil
        try {
          console.log('🔍 Buscando dados do usuário academia:', basicData.userId);
          const userResponse = await fetch(`/api/auth/user/${basicData.userId}`);
          const userResult = await userResponse.json();
          
          console.log('📥 Resposta do usuário academia:', userResult);
          
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
            
            console.log('💾 Salvando dados academia no localStorage:', userData);
            localStorage.setItem('madrilusa_user', JSON.stringify(userData));
            
            // Atualizar estado do useAuth diretamente
            setUser(userData);

            toast({
              title: "Registro Concluído!",
              description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
            });

            // Fechar modal e redirecionar
            onClose();
            console.log('🚀 Redirecionando academia para dashboard...');
            
            // Usar navigate() agora que o estado está atualizado
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 1000);
          } else {
            throw new Error(`Erro ao buscar dados do usuário: ${userResult.error || 'Dados não encontrados'}`);
          }
        } catch (userError: any) {
          console.error('❌ Erro ao buscar dados completos da academia:', userError);
          
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
          
          console.log('💾 Fallback academia - Salvando dados básicos:', fallbackUserData);
          localStorage.setItem('madrilusa_user', JSON.stringify(fallbackUserData));
          
          // Atualizar estado do useAuth diretamente
          setUser(fallbackUserData as any);

          toast({
            title: "Registro Concluído!",
            description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
          });

          onClose();
          console.log('🚀 Redirecionando academia para dashboard (fallback)...');
          
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

  // Etapa 2: Dados específicos da categoria - Família
  const handleFamiliaSubmit = async (data: FamiliaRegistrationFormData) => {
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

      // Converter arrays para strings separadas por vírgula
      const dataToSend = {
        userId: basicData.userId,
        moradaCompleta: data.moradaCompleta,
        quantidadePessoas: data.quantidadePessoas || undefined,
        tiposAcolhimento: data.tiposAcolhimento && data.tiposAcolhimento.length > 0 ? data.tiposAcolhimento.join(', ') : undefined,
        duracaoAcolhimento: data.duracaoAcolhimento && data.duracaoAcolhimento.length > 0 ? data.duracaoAcolhimento.join(', ') : undefined,
        observacoes: data.observacoes || undefined
      };

      const response = await fetch("/api/familias/perfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Perfil de família criado com sucesso:', result.data);
        
        // Buscar dados completos do usuário após criação do perfil
        try {
          console.log('🔍 Buscando dados do usuário família:', basicData.userId);
          const userResponse = await fetch(`/api/auth/user/${basicData.userId}`);
          const userResult = await userResponse.json();
          
          console.log('📥 Resposta do usuário família:', userResult);
          
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
            
            console.log('💾 Salvando dados família no localStorage:', userData);
            localStorage.setItem('madrilusa_user', JSON.stringify(userData));
            
            // Atualizar estado do useAuth diretamente
            setUser(userData);

            toast({
              title: "Registro Concluído!",
              description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
            });

            // Fechar modal e redirecionar
            onClose();
            console.log('🚀 Redirecionando família para dashboard...');
            
            // Usar navigate() agora que o estado está atualizado
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 1000);
          } else {
            throw new Error(`Erro ao buscar dados do usuário: ${userResult.error || 'Dados não encontrados'}`);
          }
        } catch (userError: any) {
          console.error('❌ Erro ao buscar dados completos da família:', userError);
          
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
          
          console.log('💾 Fallback família - Salvando dados básicos:', fallbackUserData);
          localStorage.setItem('madrilusa_user', JSON.stringify(fallbackUserData));
          
          // Atualizar estado do useAuth diretamente
          setUser(fallbackUserData as any);

          toast({
            title: "Registro Concluído!",
            description: "Bem-vindo(a) ao Madrilusa! Redirecionando para sua plataforma...",
          });

          onClose();
          console.log('🚀 Redirecionando família para dashboard (fallback)...');
          
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
    municipioForm.reset();
    academiaForm.reset();
    familiaForm.reset();
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
        return "Registro de Família de Acolhimento";
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

            {/* ✨ NOVOS CAMPOS - Informações Adicionais */}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genero">Género</Label>
                  <Select 
                    onValueChange={(value) => imigranteForm.setValue("genero", value)}
                    defaultValue={imigranteForm.watch("genero")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o género" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENEROS.map((genero) => (
                        <SelectItem key={genero} value={genero}>
                          {genero === 'F' ? 'Feminino' : genero === 'M' ? 'Masculino' : 'Outro'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fluenciaPortugues">Fluência em Português</Label>
                  <Select 
                    onValueChange={(value) => imigranteForm.setValue("fluenciaPortugues", value)}
                    defaultValue={imigranteForm.watch("fluenciaPortugues")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLUENCIA_PORTUGUES.map((nivel) => (
                        <SelectItem key={nivel} value={nivel}>
                          {nivel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="municipioResidencia">Município de Residência</Label>
                <Input
                  id="municipioResidencia"
                  {...imigranteForm.register("municipioResidencia")}
                  placeholder="Digite o município onde reside"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transporteProprio"
                    checked={imigranteForm.watch("transporteProprio") || false}
                    onCheckedChange={(checked) => {
                      imigranteForm.setValue("transporteProprio", checked as boolean);
                    }}
                  />
                  <Label htmlFor="transporteProprio" className="text-sm font-normal">
                    Tenho transporte próprio
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="possibilidadeMudancaMorada"
                    checked={imigranteForm.watch("possibilidadeMudancaMorada") || false}
                    onCheckedChange={(checked) => {
                      imigranteForm.setValue("possibilidadeMudancaMorada", checked as boolean);
                    }}
                  />
                  <Label htmlFor="possibilidadeMudancaMorada" className="text-sm font-normal">
                    Possibilidade de mudança de morada
                  </Label>
                </div>
              </div>
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

        {step === 2 && category === USER_CATEGORIES.MUNICIPIO && (
          <form onSubmit={municipioForm.handleSubmit(handleMunicipioSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nomeMunicipio">Nome do Município</Label>
              <Input
                id="nomeMunicipio"
                {...municipioForm.register("nomeMunicipio")}
                placeholder="Digite o nome do município (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="distrito">Distrito / Região Administrativa</Label>
              <Input
                id="distrito"
                {...municipioForm.register("distrito")}
                placeholder="Ex: Porto, Lisboa, Coimbra... (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="pessoaContacto">Pessoa de Contacto Institucional</Label>
              <Input
                id="pessoaContacto"
                {...municipioForm.register("pessoaContacto")}
                placeholder="Nome do responsável (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="funcaoCargo">Função / Cargo</Label>
              <Input
                id="funcaoCargo"
                {...municipioForm.register("funcaoCargo")}
                placeholder="Ex: Vereador, Técnico Superior... (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="projetosApoio">Projetos de Apoio a Imigrantes Existentes</Label>
              <Textarea
                id="projetosApoio"
                {...municipioForm.register("projetosApoio")}
                rows={3}
                placeholder="Ex: CLAIM, CLDS, Programa Bairros Saudáveis... (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="disponibilidadeAcoes">Disponibilidade para Acolher Ações Locais</Label>
              <Input
                id="disponibilidadeAcoes"
                {...municipioForm.register("disponibilidadeAcoes")}
                placeholder="Ex: Sim, mediante agendamento prévio (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                {...municipioForm.register("observacoes")}
                rows={4}
                placeholder="Horários de atendimento, espaços disponíveis, eventos locais..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="termos-municipio" required />
              <Label htmlFor="termos-municipio" className="text-sm">
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

        {step === 2 && category === USER_CATEGORIES.ACADEMIA && (
          <form onSubmit={academiaForm.handleSubmit(handleAcademiaSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nomeAcademia">Nome da Academia / Instituição *</Label>
              <Input
                id="nomeAcademia"
                {...academiaForm.register("nomeAcademia")}
                placeholder="Digite o nome da academia ou instituição"
              />
              {academiaForm.formState.errors.nomeAcademia && (
                <p className="text-red-500 text-sm mt-1">
                  {academiaForm.formState.errors.nomeAcademia.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tipoAcademia">Tipo de Academia</Label>
              <Input
                id="tipoAcademia"
                {...academiaForm.register("tipoAcademia")}
                placeholder="Ex: Universidade, Escola Técnica, Centro de Formação..."
              />
            </div>

            <div>
              <Label htmlFor="regiao">Região / Zona de Atuação</Label>
              <Input
                id="regiao"
                {...academiaForm.register("regiao")}
                placeholder="Ex: Lisboa, Porto, Região Norte..."
              />
            </div>

            <div>
              <Label htmlFor="pessoaContacto">Pessoa de Contacto</Label>
              <Input
                id="pessoaContacto"
                {...academiaForm.register("pessoaContacto")}
                placeholder="Nome do responsável (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="emailInstitucional">Email Institucional</Label>
              <Input
                id="emailInstitucional"
                type="email"
                {...academiaForm.register("emailInstitucional")}
                placeholder="contato@academia.pt (opcional)"
              />
              {academiaForm.formState.errors.emailInstitucional && (
                <p className="text-red-500 text-sm mt-1">
                  {academiaForm.formState.errors.emailInstitucional.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...academiaForm.register("telefone")}
                placeholder="Ex: +351 123 456 789 (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="website">Website / Página Institucional</Label>
              <Input
                id="website"
                type="url"
                {...academiaForm.register("website")}
                placeholder="https://www.academia.pt (opcional)"
              />
              {academiaForm.formState.errors.website && (
                <p className="text-red-500 text-sm mt-1">
                  {academiaForm.formState.errors.website.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ofertaFormativa">Oferta Formativa</Label>
              <Textarea
                id="ofertaFormativa"
                {...academiaForm.register("ofertaFormativa")}
                rows={3}
                placeholder="Descreva os cursos e capacitações oferecidas (lista resumida ou link para catálogo)..."
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                {...academiaForm.register("observacoes")}
                rows={3}
                placeholder="Informações adicionais sobre a instituição, modalidades de ensino, certificações..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="termos-academia" required />
              <Label htmlFor="termos-academia" className="text-sm">
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

        {step === 2 && category === USER_CATEGORIES.FAMILIA_ACOLHIMENTO && (
          <form onSubmit={familiaForm.handleSubmit(handleFamiliaSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="moradaCompleta">Morada Completa *</Label>
              <Input
                id="moradaCompleta"
                {...familiaForm.register("moradaCompleta")}
                placeholder="Inclua freguesia e concelho (ex: Rua das Flores, 123, Penha Garcia, Idanha-a-Nova)"
              />
              {familiaForm.formState.errors.moradaCompleta && (
                <p className="text-red-500 text-sm mt-1">
                  {familiaForm.formState.errors.moradaCompleta.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Deve incluir freguesia e concelho para melhor localização.
              </p>
            </div>

            <div>
              <Label htmlFor="quantidadePessoas">Quantas Pessoas pode Acolher?</Label>
              <Input
                id="quantidadePessoas"
                {...familiaForm.register("quantidadePessoas")}
                placeholder="Ex: 1 adulto + 1 criança, 2 pessoas, família de 4..."
              />
            </div>

            <div>
              <Label>Tipos de Acolhimento Disponíveis</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Dormida', 'Alimentação', 'Transporte Local', 'Apoio Emocional', 'Acolhimento de Emergência', 'Outro'].map((tipo) => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${tipo}`}
                      checked={familiaForm.watch("tiposAcolhimento")?.includes(tipo) || false}
                      onCheckedChange={(checked) => {
                        const currentTipos = familiaForm.getValues("tiposAcolhimento") || [];
                        if (checked) {
                          familiaForm.setValue("tiposAcolhimento", [...currentTipos, tipo]);
                        } else {
                          familiaForm.setValue("tiposAcolhimento", currentTipos.filter(t => t !== tipo));
                        }
                      }}
                    />
                    <Label htmlFor={`tipo-${tipo}`} className="text-sm font-normal">
                      {tipo}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selecione todos os tipos de apoio que sua família pode oferecer.
              </p>
            </div>

            <div>
              <Label>Duração do Acolhimento</Label>
              <div className="space-y-2 mt-2">
                {['Curto Prazo (até 7 dias)', 'Médio Prazo (1 a 3 meses)', 'Longo Prazo (mais de 3 meses)'].map((duracao) => (
                  <div key={duracao} className="flex items-center space-x-2">
                    <Checkbox
                      id={`duracao-${duracao}`}
                      checked={familiaForm.watch("duracaoAcolhimento")?.includes(duracao) || false}
                      onCheckedChange={(checked) => {
                        const currentDuracao = familiaForm.getValues("duracaoAcolhimento") || [];
                        if (checked) {
                          familiaForm.setValue("duracaoAcolhimento", [...currentDuracao, duracao]);
                        } else {
                          familiaForm.setValue("duracaoAcolhimento", currentDuracao.filter(d => d !== duracao));
                        }
                      }}
                    />
                    <Label htmlFor={`duracao-${duracao}`} className="text-sm font-normal">
                      {duracao}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Indique por quanto tempo sua família pode oferecer acolhimento.
              </p>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                {...familiaForm.register("observacoes")}
                rows={4}
                placeholder="Preferências por perfil de acolhidos, condições especiais, disponibilidade de horários, outras informações relevantes..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="termos-familia" required />
              <Label htmlFor="termos-familia" className="text-sm">
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