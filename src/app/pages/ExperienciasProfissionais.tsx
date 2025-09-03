import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCardUnificado from '../components/contribuicoes/ContribuicaoCardUnificado';
import ContribuicaoModalUnificado from '../components/contribuicoes/ContribuicaoModalUnificado';
import type { ContribuicaoUnificada } from '../../types/dados-profissionais.types';

const ExperienciasProfissionais: React.FC = () => {
  const [experiencias, setExperiencias] = useState<ContribuicaoUnificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState<ContribuicaoUnificada | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchExperiencias();
    }
  }, [user]);

  const fetchExperiencias = async () => {
    try {
      const response = await fetch(`/api/dados-profissionais/user/${user?.id}/experiencias`);
      const data = await response.json();
      
      if (data.success) {
        // Converter para formato unificado
        const experienciasUnificadas: ContribuicaoUnificada[] = data.data.map((exp: any) => ({
          id: exp.id,
          tipo: 'experiencia' as const,
          titulo: exp.titulo,
          descricao: `Experiência como ${exp.dados.cargo} na ${exp.dados.empresa} por ${exp.dados.tempoNoCargo}`,
          tags: [exp.dados.cargo, exp.dados.empresa, exp.dados.tempoNoCargo],
          createdAt: new Date(exp.createdAt),
          updatedAt: new Date(exp.updatedAt),
          userId: exp.userId,
          dadosEstruturados: exp.dados,
          user: exp.user
        }));
        
        setExperiencias(experienciasUnificadas);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar experiências:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar experiências profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experiencia: ContribuicaoUnificada) => {
    setEditingExperiencia(experiencia);
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
        fetchExperiencias();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar experiência:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao eliminar experiência",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchExperiencias();
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Experiências Profissionais" subtitle="Carregando..." />
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
          title="Experiências Profissionais" 
          subtitle={`${experiencias.length} experiência${experiencias.length !== 1 ? 's' : ''} registrada${experiencias.length !== 1 ? 's' : ''}`}
        />
      </Row>

      {/* Botão Adicionar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Suas Experiências Profissionais</h5>
                <Button 
                  theme="success"
                  onClick={() => {
                    setEditingExperiencia(null);
                    setShowModal(true);
                  }}
                >
                  <i className="material-icons mr-1">add</i>
                  Nova Experiência
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-0">
                Adicione suas experiências profissionais anteriores. Inclua cargos, empresas e tempo de trabalho 
                para que outros utilizadores possam conhecer melhor o seu percurso profissional.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Experiências */}
      {experiencias.length > 0 ? (
        <Row>
          {experiencias.map(experiencia => (
            <Col md={6} lg={4} className="mb-4" key={experiencia.id}>
              <ContribuicaoCardUnificado
                contribuicao={experiencia}
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
                  <i className="material-icons" style={{fontSize: '64px', color: '#28a745'}}>
                    work
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhuma experiência registrada
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando sua primeira experiência profissional. Isso ajudará outros utilizadores 
                    a conhecer melhor suas competências e percurso profissional.
                  </p>
                  
                  <Button 
                    theme="success" 
                    onClick={() => {
                      setEditingExperiencia(null);
                      setShowModal(true);
                    }}
                  >
                    <i className="material-icons mr-1">add</i>
                    Adicionar Primeira Experiência
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Experiência */}
      <ContribuicaoModalUnificado
        isOpen={showModal}
        tipo="experiencia"
        onClose={() => {
          setShowModal(false);
          setEditingExperiencia(null);
        }}
        onSave={handleSave}
        editingData={editingExperiencia}
      />
    </Container>
  );
};

export default ExperienciasProfissionais;
