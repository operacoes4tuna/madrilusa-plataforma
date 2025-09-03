import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCardUnificado from '../components/contribuicoes/ContribuicaoCardUnificado';
import ContribuicaoModalUnificado from '../components/contribuicoes/ContribuicaoModalUnificado';
import type { ContribuicaoUnificada } from '../../types/dados-profissionais.types';

const IdiomasConhecidos: React.FC = () => {
  const [idiomas, setIdiomas] = useState<ContribuicaoUnificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIdioma, setEditingIdioma] = useState<ContribuicaoUnificada | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchIdiomas();
    }
  }, [user]);

  const fetchIdiomas = async () => {
    try {
      const response = await fetch(`/api/dados-profissionais/user/${user?.id}/idiomas`);
      const data = await response.json();
      
      if (data.success) {
        // Converter para formato unificado
        const idiomasUnificados: ContribuicaoUnificada[] = data.data.map((idioma: any) => ({
          id: idioma.id,
          tipo: 'idioma' as const,
          titulo: idioma.titulo,
          descricao: `Idioma ${idioma.dados.idioma} com nível ${idioma.dados.nivel}`,
          tags: [idioma.dados.idioma, idioma.dados.nivel],
          createdAt: new Date(idioma.createdAt),
          updatedAt: new Date(idioma.updatedAt),
          userId: idioma.userId,
          dadosEstruturados: idioma.dados,
          user: idioma.user
        }));
        
        setIdiomas(idiomasUnificados);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar idiomas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar idiomas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idioma: ContribuicaoUnificada) => {
    setEditingIdioma(idioma);
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
          description: `"${titulo}" foi eliminado com sucesso`,
        });
        fetchIdiomas();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar idioma:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao eliminar idioma",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchIdiomas();
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Idiomas" subtitle="Carregando..." />
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
          title="Idiomas" 
          subtitle={`${idiomas.length} idioma${idiomas.length !== 1 ? 's' : ''} registrado${idiomas.length !== 1 ? 's' : ''}`}
        />
      </Row>

      {/* Botão Adicionar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Seus Idiomas</h5>
                <Button 
                  theme="info"
                  onClick={() => {
                    setEditingIdioma(null);
                    setShowModal(true);
                  }}
                >
                  <i className="material-icons mr-1">add</i>
                  Novo Idioma
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-0">
                Adicione os idiomas que fala e seu nível de proficiência. Isso ajuda outros utilizadores 
                a conhecer suas competências linguísticas e facilita a comunicação.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Idiomas */}
      {idiomas.length > 0 ? (
        <Row>
          {idiomas.map(idioma => (
            <Col md={6} lg={4} className="mb-4" key={idioma.id}>
              <ContribuicaoCardUnificado
                contribuicao={idioma}
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
                  <i className="material-icons" style={{fontSize: '64px', color: '#6f42c1'}}>
                    language
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhum idioma registrado
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando os idiomas que fala. Inclua seu nível de proficiência 
                    para que outros utilizadores conheçam suas competências linguísticas.
                  </p>
                  
                  <Button 
                    theme="info" 
                    onClick={() => {
                      setEditingIdioma(null);
                      setShowModal(true);
                    }}
                  >
                    <i className="material-icons mr-1">add</i>
                    Adicionar Primeiro Idioma
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Idioma */}
      <ContribuicaoModalUnificado
        isOpen={showModal}
        tipo="idioma"
        onClose={() => {
          setShowModal(false);
          setEditingIdioma(null);
        }}
        onSave={handleSave}
        editingData={editingIdioma}
      />
    </Container>
  );
};

export default IdiomasConhecidos;
