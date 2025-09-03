import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader, 
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoCardUnificado from '../components/contribuicoes/ContribuicaoCardUnificado';
import OportunidadeForm from '../components/oportunidades-trabalho/OportunidadeForm';
import type { 
  ContribuicaoUnificada,
  OportunidadeFormData,
  OportunidadeStats,
  OportunidadeTrabalho
} from '../../types/oportunidades-trabalho.types';

const OportunidadesTrabalho: React.FC = () => {
  const [oportunidades, setOportunidades] = useState<ContribuicaoUnificada[]>([]);
  const [stats, setStats] = useState<OportunidadeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOportunidade, setEditingOportunidade] = useState<ContribuicaoUnificada | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchOportunidades();
      fetchStats();
    }
  }, [user]);

  const fetchOportunidades = async () => {
    try {
      const response = await fetch(`/api/oportunidades-trabalho/empresa/${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Converter para formato unificado
        const oportunidadesUnificadas: ContribuicaoUnificada[] = data.data.map((op: any) => ({
          id: op.id,
          tipo: 'oportunidade_trabalho' as const,
          titulo: op.titulo,
          descricao: `${op.nomeCargo}${op.nomeProfissao ? ` (${op.nomeProfissao})` : ''} | ${op.descricaoCargo?.substring(0, 100)}${op.descricaoCargo && op.descricaoCargo.length > 100 ? '...' : ''}`,
          tags: [op.nomeCargo, op.nomeProfissao, op.municipioResidencia].filter(Boolean),
          createdAt: new Date(op.createdAt),
          updatedAt: new Date(op.updatedAt),
          userId: op.userId,
          dadosEstruturados: op,
          user: op.user
        }));
        
        setOportunidades(oportunidadesUnificadas);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar oportunidades de trabalho",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/oportunidades-trabalho/empresa/${user?.id}/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleEdit = (oportunidade: ContribuicaoUnificada) => {
    setEditingOportunidade(oportunidade);
    setShowModal(true);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja eliminar a oportunidade "${titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/oportunidades-trabalho/oportunidade/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `Oportunidade "${titulo}" foi eliminada com sucesso`,
        });
        fetchOportunidades();
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao eliminar oportunidade:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao eliminar oportunidade",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      const response = await fetch(`/api/oportunidades-trabalho/oportunidade/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id,
          ativo 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `Oportunidade ${ativo ? 'ativada' : 'inativada'} com sucesso`,
        });
        fetchOportunidades();
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao alterar status",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/oportunidades-trabalho/oportunidade/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Oportunidade duplicada com sucesso",
        });
        fetchOportunidades();
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao duplicar oportunidade:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao duplicar oportunidade",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (formData: OportunidadeFormData) => {
    try {
      const url = editingOportunidade 
        ? `/api/oportunidades-trabalho/oportunidade/${editingOportunidade.id}`
        : `/api/oportunidades-trabalho/empresa/${user?.id}`;
      
      const method = editingOportunidade ? 'PUT' : 'POST';
      
      const payload = editingOportunidade 
        ? { ...formData, userId: user?.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        setShowModal(false);
        setEditingOportunidade(null);
        fetchOportunidades();
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar oportunidade",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Oportunidades de Trabalho" subtitle="Carregando..." />
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
          title="Oportunidades de Trabalho" 
          subtitle={`${oportunidades.length} oportunidade${oportunidades.length !== 1 ? 's' : ''} publicada${oportunidades.length !== 1 ? 's' : ''}`}
        />
      </Row>

      {/* Estatísticas */}
      {stats && (
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-primary text-white mr-3">
                    <i className="material-icons">work_outline</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalOportunidades}</span>
                    <span className="stats-small__label text-uppercase text-muted">Total</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-success text-white mr-3">
                    <i className="material-icons">check_circle</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.oportunidadesAtivas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Ativas</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-warning text-white mr-3">
                    <i className="material-icons">pause</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.oportunidadesInativas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Inativas</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-info text-white mr-3">
                    <i className="material-icons">visibility</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalVisualizacoes}</span>
                    <span className="stats-small__label text-uppercase text-muted">Visualizações</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botão Adicionar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Suas Oportunidades de Trabalho</h5>
                <Button 
                  theme="primary"
                  onClick={() => {
                    setEditingOportunidade(null);
                    setShowModal(true);
                  }}
                >
                  <i className="material-icons mr-1">add</i>
                  Nova Oportunidade
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-0">
                Publique oportunidades de trabalho detalhadas para atrair os candidatos ideais. 
                Defina critérios específicos para facilitar o match com perfis adequados.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Oportunidades */}
      {oportunidades.length > 0 ? (
        <Row>
          {oportunidades.map(oportunidade => {
            const opData = oportunidade.dadosEstruturados as OportunidadeTrabalho;
            
            return (
              <Col md={6} lg={4} className="mb-4" key={oportunidade.id}>
                <div style={{ opacity: opData.ativo ? 1 : 0.6 }}>
                  <ContribuicaoCardUnificado
                    contribuicao={oportunidade}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onDuplicate={handleDuplicate}
                  />
                  
                  {/* Badge de status */}
                  <div className="mt-2">
                    <Badge 
                      theme={opData.ativo ? "success" : "warning"}
                      className="mr-2"
                    >
                      {opData.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                    
                    {opData.visualizacoes > 0 && (
                      <Badge theme="info">
                        {opData.visualizacoes} visualizações
                      </Badge>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <i className="material-icons" style={{fontSize: '64px', color: '#fd7e14'}}>
                    work_outline
                  </i>
                  <h4 className="mt-3 text-muted">
                    Nenhuma oportunidade publicada
                  </h4>
                  <p className="text-muted mb-4">
                    Comece publicando sua primeira oportunidade de trabalho. Defina critérios específicos 
                    para encontrar os candidatos ideais para sua empresa.
                  </p>
                  
                  <Button 
                    theme="primary" 
                    onClick={() => {
                      setEditingOportunidade(null);
                      setShowModal(true);
                    }}
                  >
                    <i className="material-icons mr-1">add</i>
                    Publicar Primeira Oportunidade
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Oportunidade */}
      <Modal open={showModal} toggle={() => setShowModal(false)} size="xl">
        <ModalHeader>
          {editingOportunidade ? 'Editar Oportunidade de Trabalho' : 'Nova Oportunidade de Trabalho'}
        </ModalHeader>
        
        <ModalBody>
          <OportunidadeForm
            onSubmit={handleSave}
            editingOportunidade={editingOportunidade}
            loading={loading}
          />
        </ModalBody>
        
        <ModalFooter>
          <Button 
            theme="secondary" 
            onClick={() => {
              setShowModal(false);
              setEditingOportunidade(null);
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default OportunidadesTrabalho;
