import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  tagsModelo?: string[] | string;
  perguntasModelo?: string;
  ativo: boolean;
}

interface Contribuicao {
  id: string;
  userId: string;
  tipoContribuicaoId: string;
  descricao: string;
  tags: string[] | string; // Pode ser array ou string JSON
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  tipoContribuicao: TipoContribuicao;
}

const ContribuicoesPorTipo: React.FC = () => {
  const { tipoId } = useParams<{ tipoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tipo, setTipo] = useState<TipoContribuicao | null>(null);
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContribuicao, setEditingContribuicao] = useState<Contribuicao | null>(null);

  useEffect(() => {
    if (tipoId && user?.id) {
      fetchTipoEContribuicoes();
    }
  }, [tipoId, user]);

  const fetchTipoEContribuicoes = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/contribuicoes/user/${user?.id}/tipo/${tipoId}`);
      const data = await response.json();
      
      if (data.success) {
        setTipo(data.data.tipo);
        setContribuicoes(data.data.contribuicoes);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Tipo de contribuição não encontrado ou não disponível",
        variant: "destructive",
      });
      
      // Redirecionar para dashboard se tipo inválido
      navigate('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, descricao: string) => {
    if (!window.confirm(`Tem certeza que deseja remover esta contribuição?\n\n"${descricao.substring(0, 100)}..."`)) {
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
        fetchTipoEContribuicoes();
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

  const getIconForTipo = (titulo: string): string => {
    const iconMap: Record<string, string> = {
      'Habilidades': 'star',
      'Oportunidades': 'work',
      'Projetos': 'account_balance',
      'Eventos': 'event',
      'Notícias': 'article',
      'Cursos': 'menu_book',
      'Suporte': 'favorite'
    };
    return iconMap[titulo] || 'assignment';
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

  if (!tipo) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="text-center py-5">
          <i className="material-icons" style={{fontSize: '64px', color: '#ccc'}}>
            error_outline
          </i>
          <h4 className="mt-3 text-muted">
            Tipo de contribuição não encontrado
          </h4>
          <p className="text-muted mb-4">
            O tipo solicitado não existe ou não está disponível para sua categoria.
          </p>
          <Button theme="primary" onClick={() => navigate('/app/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <Col>
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/app/dashboard" className="text-decoration-none">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Meus {tipo.titulo}
              </li>
            </ol>
          </nav>
          
          <PageTitle 
            title={`Meus ${tipo.titulo}`}
            subtitle={`${contribuicoes.length} ${tipo.titulo.toLowerCase()} cadastrada${contribuicoes.length !== 1 ? 's' : ''}`}
            className="text-sm-left mb-3" 
          />
        </Col>
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
                    <i className="material-icons">{getIconForTipo(tipo.titulo)}</i>
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
                    {(() => {
                      const allTags = contribuicoes.flatMap(c => {
                        try {
                          if (typeof c.tags === 'string') {
                            return JSON.parse(c.tags);
                          } else if (Array.isArray(c.tags)) {
                            return c.tags;
                          }
                          return [];
                        } catch (error) {
                          return [];
                        }
                      });
                      return new Set(allTags).size;
                    })()}
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
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Status</div>
                  <span className="h6 font-weight-bold mb-0">
                    {contribuicoes.filter(c => c.ativo).length} Ativa{contribuicoes.filter(c => c.ativo).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                    <i className="material-icons">check_circle</i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Botão Adicionar */}
      <Row className="mb-4">
        <Col>
          <Button 
            theme="primary" 
            onClick={() => setShowForm(true)}
            className="mb-3"
          >
            <i className="material-icons mr-1">add</i>
            Adicionar {tipo.titulo.slice(0, -1)} {/* Remove 's' do final */}
          </Button>
          
          {tipo.perguntasModelo && (
            <div className="alert alert-info">
              <h6 className="mb-2">
                <i className="material-icons mr-1">info</i>
                Orientações para {tipo.titulo}
              </h6>
              <p className="mb-0 small">{tipo.perguntasModelo}</p>
            </div>
          )}
        </Col>
      </Row>

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
                    {getIconForTipo(tipo.titulo)}
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhum(a) {tipo.titulo.toLowerCase().slice(0, -1)} cadastrado(a)
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando seu(a) primeiro(a) {tipo.titulo.toLowerCase().slice(0, -1)} à plataforma.
                  </p>
                  
                  <Button 
                    theme="primary" 
                    onClick={() => setShowForm(true)}
                  >
                    <i className="material-icons mr-1">add</i>
                    Adicionar Primeiro(a) {tipo.titulo.slice(0, -1)}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Contribuição Pré-configurado */}
      <ContribuicaoModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingContribuicao(null);
        }}
        onSave={() => {
          fetchTipoEContribuicoes();
          setEditingContribuicao(null);
        }}
        editingContribuicao={editingContribuicao}
        tiposDisponiveis={[tipo]} // Apenas o tipo atual
        tipoPreSelecionado={tipo}
        ocultarSeletorTipo={true}
      />
    </Container>
  );
};

export default ContribuicoesPorTipo;
