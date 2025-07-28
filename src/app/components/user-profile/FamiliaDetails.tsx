import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
  Button,
  FormCheckbox
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PerfilFamilia } from '@/modules/auth/types/auth.types';

interface FamiliaDetailsProps {
  title?: string;
}

// Opções para tipos de acolhimento
const TIPOS_ACOLHIMENTO = [
  'Dormida',
  'Alimentação',
  'Transporte Local',
  'Apoio Emocional',
  'Acolhimento de Emergência',
  'Outro'
];

// Opções para duração do acolhimento
const DURACAO_ACOLHIMENTO = [
  'Curto Prazo (até 7 dias)',
  'Médio Prazo (1 a 3 meses)',
  'Longo Prazo (mais de 3 meses)'
];

const FamiliaDetails: React.FC<FamiliaDetailsProps> = ({
  title = "Perfil de Família"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [perfilData, setPerfilData] = useState<PerfilFamilia | null>(null);
  const [formData, setFormData] = useState({
    moradaCompleta: '',
    quantidadePessoas: '',
    tiposAcolhimento: [] as string[],
    duracaoAcolhimento: [] as string[],
    observacoes: ''
  });

  // Buscar perfil da família
  useEffect(() => {
    const fetchPerfilFamilia = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/familias/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          // Parse dos arrays salvos como strings
          const tiposArray = perfil.tiposAcolhimento ? perfil.tiposAcolhimento.split(',').map((t: string) => t.trim()) : [];
          const duracaoArray = perfil.duracaoAcolhimento ? perfil.duracaoAcolhimento.split(',').map((d: string) => d.trim()) : [];
          
          setFormData({
            moradaCompleta: perfil.moradaCompleta || '',
            quantidadePessoas: perfil.quantidadePessoas || '',
            tiposAcolhimento: tiposArray,
            duracaoAcolhimento: duracaoArray,
            observacoes: perfil.observacoes || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de família:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de família.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilFamilia();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (value: string, field: 'tiposAcolhimento' | 'duracaoAcolhimento') => {
    setFormData(prev => {
      const currentArray = prev[field];
      const isChecked = currentArray.includes(value);
      
      return {
        ...prev,
        [field]: isChecked 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Validar campo obrigatório
    if (!formData.moradaCompleta || formData.moradaCompleta.trim().length === 0) {
      toast({
        title: "Erro",
        description: "Morada completa é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const url = perfilData 
        ? `/api/familias/perfil/${user.id}` 
        : `/api/familias/perfil`;
      
      const method = perfilData ? 'PUT' : 'POST';
      
      // Converter arrays para strings separadas por vírgula
      const dataToSend = {
        ...(perfilData ? {} : { userId: user.id }),
        moradaCompleta: formData.moradaCompleta,
        quantidadePessoas: formData.quantidadePessoas || undefined,
        tiposAcolhimento: formData.tiposAcolhimento.length > 0 ? formData.tiposAcolhimento.join(', ') : undefined,
        duracaoAcolhimento: formData.duracaoAcolhimento.length > 0 ? formData.duracaoAcolhimento.join(', ') : undefined,
        observacoes: formData.observacoes || undefined
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setPerfilData(result.data);
        toast({
          title: "Sucesso",
          description: perfilData ? "Perfil atualizado com sucesso!" : "Perfil criado com sucesso!",
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar perfil');
      }
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <div className="text-center">Carregando...</div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }

  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="moradaCompleta">Morada Completa *</label>
                  <FormInput
                    id="moradaCompleta"
                    name="moradaCompleta"
                    value={formData.moradaCompleta}
                    onChange={handleInputChange}
                    required
                    placeholder="Inclua freguesia e concelho (ex: Rua das Flores, 123, Penha Garcia, Idanha-a-Nova)"
                  />
                  <small className="form-text text-muted">
                    Deve incluir freguesia e concelho para melhor localização.
                  </small>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="quantidadePessoas">Quantas Pessoas pode Acolher?</label>
                  <FormInput
                    id="quantidadePessoas"
                    name="quantidadePessoas"
                    value={formData.quantidadePessoas}
                    onChange={handleInputChange}
                    placeholder="Ex: 1 adulto + 1 criança, 2 pessoas, família de 4..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Tipos de Acolhimento Disponíveis</label>
                  <div className="mt-2">
                    {TIPOS_ACOLHIMENTO.map((tipo) => (
                      <FormCheckbox
                        key={tipo}
                        checked={formData.tiposAcolhimento.includes(tipo)}
                        onChange={() => handleCheckboxChange(tipo, 'tiposAcolhimento')}
                        className="mb-2"
                      >
                        {tipo}
                      </FormCheckbox>
                    ))}
                  </div>
                  <small className="form-text text-muted">
                    Selecione todos os tipos de apoio que sua família pode oferecer.
                  </small>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Duração do Acolhimento</label>
                  <div className="mt-2">
                    {DURACAO_ACOLHIMENTO.map((duracao) => (
                      <FormCheckbox
                        key={duracao}
                        checked={formData.duracaoAcolhimento.includes(duracao)}
                        onChange={() => handleCheckboxChange(duracao, 'duracaoAcolhimento')}
                        className="mb-2"
                      >
                        {duracao}
                      </FormCheckbox>
                    ))}
                  </div>
                  <small className="form-text text-muted">
                    Indique por quanto tempo sua família pode oferecer acolhimento.
                  </small>
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="observacoes">Observações Adicionais</label>
                  <FormTextarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Preferências por perfil de acolhidos, condições especiais, disponibilidade de horários, outras informações relevantes..."
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md="12" className="text-right">
                <Button
                  type="submit"
                  theme="primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : perfilData ? "Atualizar Perfil" : "Criar Perfil"}
                </Button>
              </Col>
            </Row>
          </Form>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default FamiliaDetails; 