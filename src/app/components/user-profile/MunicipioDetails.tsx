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
  Button
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PerfilMunicipio } from '@/modules/auth/types/auth.types';

interface MunicipioDetailsProps {
  title?: string;
}

const MunicipioDetails: React.FC<MunicipioDetailsProps> = ({
  title = "Perfil de Município"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [perfilData, setPerfilData] = useState<PerfilMunicipio | null>(null);
  const [formData, setFormData] = useState({
    nomeMunicipio: '',
    distrito: '',
    pessoaContacto: '',
    funcaoCargo: '',
    projetosApoio: '',
    disponibilidadeAcoes: '',
    observacoes: ''
  });

  // Buscar perfil do município
  useEffect(() => {
    const fetchPerfilMunicipio = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/municipios/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          setFormData({
            nomeMunicipio: perfil.nomeMunicipio || '',
            distrito: perfil.distrito || '',
            pessoaContacto: perfil.pessoaContacto || '',
            funcaoCargo: perfil.funcaoCargo || '',
            projetosApoio: perfil.projetosApoio || '',
            disponibilidadeAcoes: perfil.disponibilidadeAcoes || '',
            observacoes: perfil.observacoes || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de município:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de município.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilMunicipio();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      const url = perfilData 
        ? `/api/municipios/perfil/${user.id}` 
        : `/api/municipios/perfil`;
      
      const method = perfilData ? 'PUT' : 'POST';
      
      const dataToSend = perfilData 
        ? formData 
        : { ...formData, userId: user.id };

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
                  <label htmlFor="nomeMunicipio">Nome do Município</label>
                  <FormInput
                    id="nomeMunicipio"
                    name="nomeMunicipio"
                    value={formData.nomeMunicipio}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do município"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="distrito">Distrito / Região Administrativa</label>
                  <FormInput
                    id="distrito"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    placeholder="Ex: Porto, Lisboa, Coimbra..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="pessoaContacto">Pessoa de Contacto Institucional</label>
                  <FormInput
                    id="pessoaContacto"
                    name="pessoaContacto"
                    value={formData.pessoaContacto}
                    onChange={handleInputChange}
                    placeholder="Nome do responsável"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="funcaoCargo">Função / Cargo</label>
                  <FormInput
                    id="funcaoCargo"
                    name="funcaoCargo"
                    value={formData.funcaoCargo}
                    onChange={handleInputChange}
                    placeholder="Ex: Vereador, Técnico Superior..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="projetosApoio">Projetos de Apoio a Imigrantes Existentes</label>
                  <FormTextarea
                    id="projetosApoio"
                    name="projetosApoio"
                    rows={3}
                    value={formData.projetosApoio}
                    onChange={handleInputChange}
                    placeholder="Ex: CLAIM, CLDS, Programa Bairros Saudáveis, outros..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="disponibilidadeAcoes">Disponibilidade para Acolher Ações Locais</label>
                  <FormInput
                    id="disponibilidadeAcoes"
                    name="disponibilidadeAcoes"
                    value={formData.disponibilidadeAcoes}
                    onChange={handleInputChange}
                    placeholder="Ex: Sim, mediante agendamento prévio"
                  />
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
                    placeholder="Horários de atendimento, espaços disponíveis, eventos locais, outras informações relevantes..."
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

export default MunicipioDetails; 