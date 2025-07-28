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
import type { PerfilEmpresa } from '@/modules/auth/types/auth.types';

interface EmpresaDetailsProps {
  title?: string;
}

const EmpresaDetails: React.FC<EmpresaDetailsProps> = ({
  title = "Perfil de Empresa"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [perfilData, setPerfilData] = useState<PerfilEmpresa | null>(null);
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    pessoaContacto: '',
    morada: '',
    observacoes: ''
  });

  // Buscar perfil da empresa
  useEffect(() => {
    const fetchPerfilEmpresa = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/empresas/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          setFormData({
            nomeEmpresa: perfil.nomeEmpresa || '',
            pessoaContacto: perfil.pessoaContacto || '',
            morada: perfil.morada || '',
            observacoes: perfil.observacoes || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de empresa:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de empresa.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilEmpresa();
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
        ? `/api/empresas/perfil/${user.id}` 
        : `/api/empresas/perfil`;
      
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
                  <label htmlFor="nomeEmpresa">Nome da Empresa *</label>
                  <FormInput
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o nome da empresa"
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
                  <label htmlFor="morada">Morada</label>
                  <FormInput
                    id="morada"
                    name="morada"
                    value={formData.morada}
                    onChange={handleInputChange}
                    placeholder="Endereço da empresa"
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
                    placeholder="Informações sobre vagas disponíveis, requisitos, outros detalhes relevantes..."
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

export default EmpresaDetails; 