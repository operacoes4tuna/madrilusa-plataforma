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
import type { PerfilAcademia } from '@/modules/auth/types/auth.types';

interface AcademiaDetailsProps {
  title?: string;
}

const AcademiaDetails: React.FC<AcademiaDetailsProps> = ({
  title = "Perfil de Academia"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [perfilData, setPerfilData] = useState<PerfilAcademia | null>(null);
  const [formData, setFormData] = useState({
    nomeAcademia: '',
    tipoAcademia: '',
    regiao: '',
    pessoaContacto: '',
    emailInstitucional: '',
    telefone: '',
    ofertaFormativa: '',
    website: '',
    observacoes: ''
  });

  // Buscar perfil da academia
  useEffect(() => {
    const fetchPerfilAcademia = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/academias/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          setFormData({
            nomeAcademia: perfil.nomeAcademia || '',
            tipoAcademia: perfil.tipoAcademia || '',
            regiao: perfil.regiao || '',
            pessoaContacto: perfil.pessoaContacto || '',
            emailInstitucional: perfil.emailInstitucional || '',
            telefone: perfil.telefone || '',
            ofertaFormativa: perfil.ofertaFormativa || '',
            website: perfil.website || '',
            observacoes: perfil.observacoes || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de academia:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de academia.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilAcademia();
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

    // Validar campo obrigatório
    if (!formData.nomeAcademia || formData.nomeAcademia.trim().length === 0) {
      toast({
        title: "Erro",
        description: "Nome da Academia é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const url = perfilData 
        ? `/api/academias/perfil/${user.id}` 
        : `/api/academias/perfil`;
      
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
              <Col md="12">
                <FormGroup>
                  <label htmlFor="nomeAcademia">Nome da Academia / Instituição *</label>
                  <FormInput
                    id="nomeAcademia"
                    name="nomeAcademia"
                    value={formData.nomeAcademia}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o nome da academia ou instituição"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="tipoAcademia">Tipo de Academia</label>
                  <FormInput
                    id="tipoAcademia"
                    name="tipoAcademia"
                    value={formData.tipoAcademia}
                    onChange={handleInputChange}
                    placeholder="Ex: Universidade, Escola Técnica, Centro de Formação..."
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="regiao">Região / Zona de Atuação</label>
                  <FormInput
                    id="regiao"
                    name="regiao"
                    value={formData.regiao}
                    onChange={handleInputChange}
                    placeholder="Ex: Lisboa, Porto, Região Norte..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="pessoaContacto">Pessoa de Contacto</label>
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
                  <label htmlFor="telefone">Telefone</label>
                  <FormInput
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="Ex: +351 123 456 789"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="emailInstitucional">Email Institucional</label>
                  <FormInput
                    id="emailInstitucional"
                    name="emailInstitucional"
                    type="email"
                    value={formData.emailInstitucional}
                    onChange={handleInputChange}
                    placeholder="contato@academia.pt"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="website">Website / Página Institucional</label>
                  <FormInput
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.academia.pt"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="ofertaFormativa">Oferta Formativa</label>
                  <FormTextarea
                    id="ofertaFormativa"
                    name="ofertaFormativa"
                    rows={4}
                    value={formData.ofertaFormativa}
                    onChange={handleInputChange}
                    placeholder="Descreva os cursos e capacitações oferecidas (lista resumida ou link para catálogo)..."
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
                    rows={3}
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre a instituição, modalidades de ensino, certificações, etc..."
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

export default AcademiaDetails; 