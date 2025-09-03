import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCardUnificado from '../components/contribuicoes/ContribuicaoCardUnificado';
import ContribuicaoModalUnificado from '../components/contribuicoes/ContribuicaoModalUnificado';
import type { ContribuicaoUnificada } from '../../types/dados-profissionais.types';

const FormacaoAcademica: React.FC = () => {
  const [formacoes, setFormacoes] = useState<ContribuicaoUnificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFormacao, setEditingFormacao] = useState<ContribuicaoUnificada | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchFormacoes();
    }
  }, [user]);

  const fetchFormacoes = async () => {
    try {
      const response = await fetch(`/api/dados-profissionais/user/${user?.id}/formacoes`);
      const data = await response.json();
      
      if (data.success) {
        // Converter para formato unificado
        const formacoesUnificadas: ContribuicaoUnificada[] = data.data.map((form: any) => ({
          id: form.id,
          tipo: 'formacao' as const,
          titulo: form.titulo,
          descricao: `${form.dados.curso || form.dados.nivelEscolaridade}${form.dados.instituicao ? ` na ${form.dados.instituicao}` : ''}${form.dados.dataTermino ? ` (concluído em ${new Date(form.dados.dataTermino).toLocaleDateString('pt-PT')})` : ''}`,
          tags: [form.dados.nivelEscolaridade, form.dados.curso, form.dados.instituicao].filter(Boolean),
          createdAt: new Date(form.createdAt),
          updatedAt: new Date(form.updatedAt),
          userId: form.userId,
          dadosEstruturados: form.dados,
          user: form.user
        }));
        
        setFormacoes(formacoesUnificadas);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar formações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar formações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (formacao: ContribuicaoUnificada) => {
    setEditingFormacao(formacao);
    setShowModal(true);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja eliminar "${titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/dados-profissionais/dado/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `"${titulo}" foi eliminada com sucesso`,
        });
        fetchFormacoes();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar formação:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao eliminar formação",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchFormacoes();
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Formação" subtitle="Carregando..." />
        </Row>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Formação" 
          subtitle={`${formacoes.length} formação${formacoes.length !== 1 ? 'ões' : ''} registrada${formacoes.length !== 1 ? 's' : ''}`}
        />
      </Row>

      {/* Botão Adicionar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Sua Formação Acadêmica</h5>
                <Button 
                  theme="warning"
                  onClick={() => {
                    setEditingFormacao(null);
                    setShowModal(true);
                  }}
                >
                  <i className="material-icons mr-1">add</i>
                  Nova Formação
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-0">
                Adicione suas formações acadêmicas, cursos e certificações. Inclua escolaridade, 
                cursos superiores, formações profissionais e outras qualificações relevantes.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Formações */}
      {formacoes.length > 0 ? (
        <Row>
          {formacoes.map(formacao => (
            <Col md={6} lg={4} className="mb-4" key={formacao.id}>
              <ContribuicaoCardUnificado
                contribuicao={formacao}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <i className="material-icons" style={{fontSize: '64px', color: '#F5A623'}}>
                    school
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhuma formação registrada
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando sua formação acadêmica. Inclua escolaridade, cursos superiores, 
                    formações profissionais e outras qualificações que possui.
                  </p>
                  
                  <Button 
                    theme="warning" 
                    onClick={() => {
                      setEditingFormacao(null);
                      setShowModal(true);
                    }}
                  >
                    <i className="material-icons mr-1">add</i>
                    Adicionar Primeira Formação
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Formação */}
      <ContribuicaoModalUnificado
        isOpen={showModal}
        tipo="formacao"
        onClose={() => {
          setShowModal(false);
          setEditingFormacao(null);
        }}
        onSave={handleSave}
        editingData={editingFormacao}
      />
    </Container>
  );
};

export default FormacaoAcademica;
