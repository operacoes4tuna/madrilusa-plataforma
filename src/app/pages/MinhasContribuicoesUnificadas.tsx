import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, ButtonGroup } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCardUnificado from '../components/contribuicoes/ContribuicaoCardUnificado';
import ContribuicaoModalUnificado from '../components/contribuicoes/ContribuicaoModalUnificado';
import type { 
  ContribuicaoUnificada, 
  ModalTipo 
} from '../../../types/dados-profissionais.types';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[] | string;
  perguntasModelo?: string;
}

const MinhasContribuicoesUnificadas: React.FC = () => {
  const [todasContribuicoes, setTodasContribuicoes] = useState<ContribuicaoUnificada[]>([]);
  const [tiposDisponiveis, setTiposDisponiveis] = useState<TipoContribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState<ModalTipo>('normal');
  const [editingContribuicao, setEditingContribuicao] = useState<ContribuicaoUnificada | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchTodasContribuicoes();
      fetchTiposDisponiveis();
    }
  }, [user]);

  const fetchTodasContribuicoes = async () => {
    try {
      const response = await fetch(`/api/contribuicoes/user/${user?.id}/todas`);
      const data = await response.json();
      
      if (data.success) {
        setTodasContribuicoes(data.data);
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

  const openModal = (tipo: ModalTipo) => {
    setTipoModal(tipo);
    setEditingContribuicao(null);
    setShowModal(true);
  };

  const handleEdit = (contribuicao: ContribuicaoUnificada) => {
    setEditingContribuicao(contribuicao);
    setTipoModal(contribuicao.tipo as ModalTipo);
    setShowModal(true);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja eliminar "${titulo}"?`)) {
      return;
    }

    try {
      // Determinar se é contribuição normal ou dado profissional
      const contribuicao = todasContribuicoes.find(c => c.id === id);
      
      let response;
      if (contribuicao?.tipo === 'contribuicao_normal') {
        response = await fetch(`/api/contribuicoes/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id })
        });
      } else {
        response = await fetch(`/api/dados-profissionais/dado/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id })
        });
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `"${titulo}" foi eliminado com sucesso`,
        });
        fetchTodasContribuicoes();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao eliminar",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    fetchTodasContribuicoes();
  };

  const getTipoLabel = (categoria: string) => {
    switch (categoria) {
      case 'IMIGRANTE': return 'Habilidades';
      case 'EMPRESA': return 'Oportunidades';
      case 'ACADEMIA': return 'Cursos';
      case 'MUNICIPIO': return 'Iniciativas';
      case 'FAMILIA_ACOLHIMENTO': return 'Ofertas';
      default: return 'Contribuições';
    }
  };

  const getTipoInfo = (tipo: ModalTipo) => {
    switch (tipo) {
      case 'normal':
        return {
          label: getTipoLabel(user?.categoria || '').slice(0, -1),
          icon: 'lightbulb_outline',
          description: 'Habilidades, objetivos e outros textos livres'
        };
      case 'experiencia':
        return {
          label: 'Experiência',
          icon: 'work',
          description: 'Experiências profissionais anteriores'
        };
      case 'formacao':
        return {
          label: 'Formação',
          icon: 'school',
          description: 'Formações acadêmicas e cursos'
        };
      case 'idioma':
        return {
          label: 'Idioma',
          icon: 'language',
          description: 'Idiomas que fala e níveis de proficiência'
        };
    }
  };

  const isImigrante = user?.categoria === 'IMIGRANTE';

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Minhas Contribuições" subtitle="Carregando..." />
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
          title="Minhas Contribuições" 
          subtitle={`${todasContribuicoes.length} contribuições registradas`}
        />
      </Row>

      {/* Botões de Adicionar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Adicionar Nova Contribuição</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-wrap gap-2">
                {/* Contribuição Normal - sempre disponível */}
                {tiposDisponiveis.length > 0 && (
                  <Button 
                    theme="primary"
                    onClick={() => openModal('normal')}
                    className="mb-2"
                  >
                    <i className="material-icons mr-1">lightbulb_outline</i>
                    {getTipoInfo('normal').label}
                  </Button>
                )}
                
                {/* Dados Profissionais - apenas para imigrantes */}
                {isImigrante && (
                  <>
                    <Button 
                      theme="success"
                      onClick={() => openModal('experiencia')}
                      className="mb-2"
                    >
                      <i className="material-icons mr-1">work</i>
                      {getTipoInfo('experiencia').label}
                    </Button>
                    
                    <Button 
                      theme="warning"
                      onClick={() => openModal('formacao')}
                      className="mb-2"
                    >
                      <i className="material-icons mr-1">school</i>
                      {getTipoInfo('formacao').label}
                    </Button>
                    
                    <Button 
                      theme="info"
                      onClick={() => openModal('idioma')}
                      className="mb-2"
                    >
                      <i className="material-icons mr-1">language</i>
                      {getTipoInfo('idioma').label}
                    </Button>
                  </>
                )}
              </div>
              
              {/* Descrições dos tipos */}
              <div className="mt-3">
                <small className="text-muted">
                  {tiposDisponiveis.length > 0 && (
                    <div className="mb-1">
                      <strong>{getTipoInfo('normal').label}:</strong> {getTipoInfo('normal').description}
                    </div>
                  )}
                  {isImigrante && (
                    <>
                      <div className="mb-1">
                        <strong>{getTipoInfo('experiencia').label}:</strong> {getTipoInfo('experiencia').description}
                      </div>
                      <div className="mb-1">
                        <strong>{getTipoInfo('formacao').label}:</strong> {getTipoInfo('formacao').description}
                      </div>
                      <div className="mb-1">
                        <strong>{getTipoInfo('idioma').label}:</strong> {getTipoInfo('idioma').description}
                      </div>
                    </>
                  )}
                </small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Contribuições */}
      {todasContribuicoes.length > 0 ? (
        <Row>
          {todasContribuicoes.map(contribuicao => (
            <Col md={6} lg={4} className="mb-4" key={contribuicao.id}>
              <ContribuicaoCardUnificado
                contribuicao={contribuicao}
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
                  <i className="material-icons" style={{fontSize: '64px', color: '#ccc'}}>
                    assignment
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhuma contribuição registrada
                  </h4>
                  <p className="text-muted mb-4">
                    Comece adicionando sua primeira contribuição à plataforma.
                  </p>
                  
                  {(tiposDisponiveis.length > 0 || isImigrante) ? (
                    <div>
                      {tiposDisponiveis.length > 0 && (
                        <Button 
                          theme="primary" 
                          onClick={() => openModal('normal')}
                          className="mr-2 mb-2"
                        >
                          <i className="material-icons mr-1">lightbulb_outline</i>
                          Primeira {getTipoInfo('normal').label}
                        </Button>
                      )}
                      
                      {isImigrante && (
                        <Button 
                          theme="success" 
                          onClick={() => openModal('experiencia')}
                          className="mb-2"
                        >
                          <i className="material-icons mr-1">work</i>
                          Primeira {getTipoInfo('experiencia').label}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <strong>Atenção:</strong> Não há tipos de contribuição disponíveis para sua categoria. 
                      Entre em contacto com o administrador.
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal Unificado */}
      <ContribuicaoModalUnificado
        isOpen={showModal}
        tipo={tipoModal}
        onClose={() => {
          setShowModal(false);
          setEditingContribuicao(null);
        }}
        onSave={handleSave}
        editingData={editingContribuicao}
        tiposDisponiveis={tiposDisponiveis}
      />
    </Container>
  );
};

export default MinhasContribuicoesUnificadas;
