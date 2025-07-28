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
  FormSelect,
  FormTextarea,
  Button
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PerfilImigrante, NACIONALIDADES } from '@/modules/auth/types/auth.types';

interface ImigranteDetailsProps {
  title?: string;
}

const ImigranteDetails: React.FC<ImigranteDetailsProps> = ({
  title = "Perfil de Imigrante"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nacionalidades, setNacionalidades] = useState<string[]>([]);

  const [perfilData, setPerfilData] = useState<PerfilImigrante | null>(null);
  const [formData, setFormData] = useState({
    nacionalidade: '',
    dataNascimento: '',
    objetivoEmprego: '',
    objetivoFormacao: '',
    objetivoRegularizacao: '',
    objetivoOutros: '',
    mensagem: ''
  });

  // Buscar nacionalidades disponíveis
  useEffect(() => {
    const fetchNacionalidades = async () => {
      try {
        const response = await fetch('/api/imigrantes/nacionalidades');
        const result = await response.json();
        if (result.success) {
          setNacionalidades(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar nacionalidades:', error);
      }
    };

    fetchNacionalidades();
  }, []);

  // Buscar perfil do imigrante
  useEffect(() => {
    const fetchPerfilImigrante = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/imigrantes/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          // Formatar data para input
          const dataFormatada = perfil.dataNascimento 
            ? new Date(perfil.dataNascimento).toISOString().split('T')[0]
            : '';

          setFormData({
            nacionalidade: perfil.nacionalidade || '',
            dataNascimento: dataFormatada,
            objetivoEmprego: perfil.objetivoEmprego || '',
            objetivoFormacao: perfil.objetivoFormacao || '',
            objetivoRegularizacao: perfil.objetivoRegularizacao || '',
            objetivoOutros: perfil.objetivoOutros || '',
            mensagem: perfil.mensagem || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de imigrante:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de imigrante.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilImigrante();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    try {
      setIsSaving(true);

      const dataToSend = {
        ...formData,
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : undefined
      };

      const url = perfilData 
        ? `/api/imigrantes/perfil/${user.id}` 
        : `/api/imigrantes/perfil`;
      
      const method = perfilData ? 'PUT' : 'POST';
      
      if (!perfilData) {
        (dataToSend as any).userId = user.id;
      }

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
              <Col md="6">
                <FormGroup>
                  <label htmlFor="nacionalidade">Nacionalidade *</label>
                  <FormSelect
                    id="nacionalidade"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione sua nacionalidade</option>
                    {nacionalidades.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="dataNascimento">Data de Nascimento *</label>
                  <FormInput
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="objetivoEmprego">Objetivos - Emprego</label>
                  <FormTextarea
                    id="objetivoEmprego"
                    name="objetivoEmprego"
                    rows={3}
                    value={formData.objetivoEmprego}
                    onChange={handleInputChange}
                    placeholder="Descreva suas expectativas e área de interesse profissional"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="objetivoFormacao">Objetivos - Formação</label>
                  <FormTextarea
                    id="objetivoFormacao"
                    name="objetivoFormacao"
                    rows={3}
                    value={formData.objetivoFormacao}
                    onChange={handleInputChange}
                    placeholder="Indique cursos ou capacitações desejadas"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="objetivoRegularizacao">Objetivos - Regularização</label>
                  <FormTextarea
                    id="objetivoRegularizacao"
                    name="objetivoRegularizacao"
                    rows={3}
                    value={formData.objetivoRegularizacao}
                    onChange={handleInputChange}
                    placeholder="Especifique necessidades relacionadas à documentação"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="objetivoOutros">Outros Objetivos</label>
                  <FormTextarea
                    id="objetivoOutros"
                    name="objetivoOutros"
                    rows={3}
                    value={formData.objetivoOutros}
                    onChange={handleInputChange}
                    placeholder="Outros objetivos ou necessidades específicas"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="mensagem">Mensagem Adicional</label>
                  <FormTextarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais que gostaria de compartilhar"
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

export default ImigranteDetails; 