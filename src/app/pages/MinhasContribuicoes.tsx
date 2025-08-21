import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCard from '../components/contribuicoes/ContribuicaoCard';
import ContribuicaoModal from '../components/contribuicoes/ContribuicaoModal';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
  perguntasModelo?: string;
}

interface Contribuicao {
  id: string;
  userId: string;
  tipoContribuicaoId: string;
  descricao: string;
  tags: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  tipoContribuicao: TipoContribuicao;
}

const MinhasContribuicoes: React.FC = () => {
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
  const [tiposDisponiveis, setTiposDisponiveis] = useState<TipoContribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContribuicao, setEditingContribuicao] = useState<Contribuicao | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchContribuicoes();
      fetchTiposDisponiveis();
    }
  }, [user]);

  const fetchContribuicoes = async () => {
    try {
      const response = await fetch(`/api/contribuicoes/user/${user?.id}/formatadas`);
      const data = await response.json();
      
      if (data.success) {
        setContribuicoes(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar contribuições:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar suas contribuições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTiposDisponiveis = async () => {
    try {
      const response = await fetch(`/api/contribuicoes/user/${user?.id}/tipos-disponiveis`);
      const data = await response.json();
      
      if (data.success) {
        setTiposDisponiveis(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos disponíveis:', error);
    }
  };

  const handleDelete = async (id: string, descricao: string) => {
    if (!confirm(`Tem certeza que deseja remover esta contribuição?\n\n"${descricao.substring(0, 100)}..."`)) {
      return;
    }

    try {
      const response = await fetch(`/api/contribuicoes/${id}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Contribuição removida com sucesso",
        });
        fetchContribuicoes();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao remover contribuição:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover contribuição",
        variant: "destructive",
      });
    }
  };

  const getTipoLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'IMIGRANTE': 'Habilidades',
      'EMPRESA': 'Oportunidades',
      'MUNICIPIO': 'Projetos',
      'ACADEMIA': 'Cursos',
      'FAMILIA_ACOLHIMENTO': 'Suporte'
    };
    return labels[categoria] || 'Contribuições';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title={`Minhas ${getTipoLabel(user?.categoria || '')}`}
          subtitle={`${contribuicoes.length} contribuição(ões) cadastrada(s)`}
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Estatísticas Rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Total</div>
                  <span className="h2 font-weight-bold mb-0">{contribuicoes.length}</span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                    <i className="material-icons">assignment</i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Tipos Disponíveis</div>
                  <span className="h2 font-weight-bold mb-0">{tiposDisponiveis.length}</span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                    <i className="material-icons">category</i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Tags Usadas</div>
                  <span className="h2 font-weight-bold mb-0">
                    {new Set(contribuicoes.flatMap(c => c.tags)).size}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                    <i className="material-icons">local_offer</i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Última Atualização</div>
                  <span className="h6 font-weight-bold mb-0">
                    {contribuicoes.length > 0 
                      ? new Date(Math.max(...contribuicoes.map(c => new Date(c.updatedAt).getTime()))).toLocaleDateString('pt-PT')
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                    <i className="material-icons">schedule</i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Botão Adicionar */}
      {tiposDisponiveis.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Button 
              theme="primary" 
              onClick={() => setShowForm(true)}
              className="mb-3"
            >
              <i className="material-icons mr-1">add</i>
              Adicionar {getTipoLabel(user?.categoria || '').slice(0, -1)}
            </Button>
          </Col>
        </Row>
      )}

      {/* Lista de Contribuições */}
      {contribuicoes.length > 0 ? (
        <Row>
          {contribuicoes.map(contribuicao => (
            <Col md={6} lg={4} className="mb-4" key={contribuicao.id}>
              <ContribuicaoCard
                contribuicao={contribuicao}
                onEdit={(contrib) => {
                  setEditingContribuicao(contrib);
                  setShowForm(true);
                }}
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
                  <i className="material-icons" style={{fontSize: '64px', color: '#ccc'}}>
                    assignment
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhuma {getTipoLabel(user?.categoria || '').toLowerCase()} cadastrada
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando sua primeira contribuição à plataforma.
                  </p>
                  
                  {tiposDisponiveis.length > 0 ? (
                    <Button 
                      theme="primary" 
                      onClick={() => setShowForm(true)}
                    >
                      <i className="material-icons mr-1">add</i>
                      Adicionar Primeira {getTipoLabel(user?.categoria || '').slice(0, -1)}
                    </Button>
                  ) : (
                    <div className="alert alert-info">
                      <strong>Atenção:</strong> Não há tipos de contribuição disponíveis para sua categoria. 
                      Entre em contato com o administrador.
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Contribuição */}
      <ContribuicaoModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingContribuicao(null);
        }}
        onSave={() => {
          fetchContribuicoes();
          setEditingContribuicao(null);
        }}
        editingContribuicao={editingContribuicao}
        tiposDisponiveis={tiposDisponiveis}
      />
    </Container>
  );
};

export default MinhasContribuicoes;
