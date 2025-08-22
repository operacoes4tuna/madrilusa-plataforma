import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { USER_CATEGORIES } from '@/modules/auth/types/auth.types';
import ContribuicoesAdminModal from '../components/admin/ContribuicoesAdminModal';
import { 
  getCategoryConfig, 
  getCategoryColor, 
  getCategoryBadge, 
  getCategoryLabel,
  getCategoryIcon,
  getCategoryCardClass,
  getCategoryHeaderClass
} from '../utils/categoryColors';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string;
  perguntasModelo?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

const TiposContribuicaoManagement: React.FC = () => {
  const [tipos, setTipos] = useState<TipoContribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTipo, setEditingTipo] = useState<TipoContribuicao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [contribuicoesCount, setContribuicoesCount] = useState<Record<string, number>>({});
  const [viewingTipo, setViewingTipo] = useState<TipoContribuicao | null>(null);
  const [showContribuicoesModal, setShowContribuicoesModal] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const { toast } = useToast();

  // Tipos filtrados baseados na categoria selecionada
  const tiposFiltrados = useMemo(() => {
    if (filtroCategoria === 'TODAS') {
      return tipos;
    }
    return tipos.filter(tipo => tipo.categoria === filtroCategoria);
  }, [tipos, filtroCategoria]);

  // Categorias disponíveis nos tipos
  const categoriasDisponiveis = useMemo(() => {
    const cats = [...new Set(tipos.map(tipo => tipo.categoria))];
    return cats.sort();
  }, [tipos]);

  // Contar tipos por categoria
  const getCountPorCategoria = (categoria: string) => {
    return tipos.filter(tipo => tipo.categoria === categoria).length;
  };

  // Contar contribuições por categoria
  const getTotalContribuicoesPorCategoria = (categoria: string) => {
    return tipos
      .filter(tipo => tipo.categoria === categoria)
      .reduce((total, tipo) => total + (contribuicoesCount[tipo.id] || 0), 0);
  };

  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    contextoIA: '',
    textoModelo: '',
    tagsModelo: '',
    perguntasModelo: ''
  });

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const response = await fetch('/api/admin/tipos-contribuicao');
      const data = await response.json();
      
      if (data.success) {
        setTipos(data.data);
        // Buscar contadores de contribuições
        fetchContribuicoesCount(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tipos de contribuição",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContribuicoesCount = async (tiposList: TipoContribuicao[]) => {
    try {
      const counts: Record<string, number> = {};
      
      // Buscar contadores para cada tipo em paralelo
      const promises = tiposList.map(async (tipo) => {
        try {
          const response = await fetch(`/api/admin/tipos-contribuicao/${tipo.id}/contribuicoes`);
          const data = await response.json();
          if (data.success) {
            counts[tipo.id] = data.data.estatisticas.total;
          }
        } catch (error) {
          console.error(`Erro ao buscar contador para ${tipo.titulo}:`, error);
          counts[tipo.id] = 0;
        }
      });

      await Promise.all(promises);
      setContribuicoesCount(counts);
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Título e categoria são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingTipo 
        ? `/api/admin/tipos-contribuicao/${editingTipo.id}`
        : '/api/admin/tipos-contribuicao';
      
      const method = editingTipo ? 'PUT' : 'POST';
      
      // Preparar dados (converter tagsModelo de string para array)
      const payload = {
        ...formData,
        tagsModelo: formData.tagsModelo 
          ? formData.tagsModelo.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        fetchTipos();
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar tipo:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar tipo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tipo: TipoContribuicao) => {
    setEditingTipo(tipo);
    setFormData({
      titulo: tipo.titulo,
      categoria: tipo.categoria,
      contextoIA: tipo.contextoIA || '',
      textoModelo: tipo.textoModelo || '',
      tagsModelo: tipo.tagsModelo ? JSON.parse(tipo.tagsModelo).join(', ') : '',
      perguntasModelo: tipo.perguntasModelo || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o tipo "${titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tipos-contribuicao/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        fetchTipos();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao remover tipo:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover tipo",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      categoria: '',
      contextoIA: '',
      textoModelo: '',
      tagsModelo: '',
      perguntasModelo: ''
    });
    setEditingTipo(null);
    setShowForm(false);
  };

  const handleViewContribuicoes = (tipo: TipoContribuicao) => {
    setViewingTipo(tipo);
    setShowContribuicoesModal(true);
  };

  const handleCloseContribuicoesModal = () => {
    setShowContribuicoesModal(false);
    setViewingTipo(null);
    // Refresh contadores após possíveis alterações
    if (tipos.length > 0) {
      fetchContribuicoesCount(tipos);
    }
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
          title="Gestão de Tipos de Contribuição" 
          subtitle={`${tiposFiltrados.length} de ${tipos.length} tipos exibidos`}
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Estatísticas por Categoria */}
      {categoriasDisponiveis.length > 0 && (
        <Row className="mb-4">
          {categoriasDisponiveis.map(categoria => (
            <Col md={6} lg={4} key={categoria} className="mb-3">
              <Card 
                className={`card-stats card-stats-categoria ${
                  filtroCategoria === categoria ? 'active' : ''
                }`}
                onClick={() => setFiltroCategoria(categoria)}
              >
                <CardBody>
                  <div className="row">
                    <div className="col">
                      <div 
                        className="card-title text-uppercase mb-0"
                        style={{ color: getCategoryColor(categoria) }}
                      >
                        {getCategoryLabel(categoria)}
                      </div>
                      <span className="h3 font-weight-bold mb-0">
                        {getCountPorCategoria(categoria)}
                      </span>
                      <p className="mb-0 text-muted small">
                        {getTotalContribuicoesPorCategoria(categoria)} contribuições
                      </p>
                    </div>
                    <div className="col-auto">
                      <div 
                        className="icon-shape-fixed text-white shadow"
                        style={{ backgroundColor: getCategoryColor(categoria) }}
                      >
                        <i className="material-icons">
                          {getCategoryIcon(categoria)}
                        </i>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
          
          {/* Card "Todas" */}
          <Col md={6} lg={4} className="mb-3">
            <Card 
              className={`card-stats card-stats-categoria ${
                filtroCategoria === 'TODAS' ? 'active' : ''
              }`}
              onClick={() => setFiltroCategoria('TODAS')}
            >
              <CardBody>
                <div className="row">
                  <div className="col">
                    <div className="card-title text-uppercase text-muted mb-0">
                      Todas as Categorias
                    </div>
                    <span className="h3 font-weight-bold mb-0">
                      {tipos.length}
                    </span>
                    <p className="mb-0 text-muted small">
                      {Object.values(contribuicoesCount).reduce((a, b) => a + b, 0)} contribuições
                    </p>
                  </div>
                  <div className="col-auto">
                    <div className="icon-shape-fixed bg-secondary text-white shadow">
                      <i className="material-icons">category</i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filtros Adicionais */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <h6 className="m-0">Filtros</h6>
            </CardHeader>
            <CardBody>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label htmlFor="filtroCategoria" className="form-label">
                    <strong>Categoria Selecionada:</strong>
                  </label>
                  <select 
                    id="filtroCategoria"
                    className="form-control"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                  >
                    <option value="TODAS">
                      Todas as Categorias ({tipos.length})
                    </option>
                    {categoriasDisponiveis.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {getCategoryLabel(categoria)} ({getCountPorCategoria(categoria)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    <strong>Filtros Rápidos:</strong>
                  </label>
                  <div className="d-flex flex-wrap">
                    <button
                      className={`btn btn-sm mr-1 mb-1 ${
                        filtroCategoria === 'TODAS' ? 'btn-secondary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setFiltroCategoria('TODAS')}
                    >
                      Todas ({tipos.length})
                    </button>
                    {categoriasDisponiveis.map(categoria => (
                      <button
                        key={categoria}
                        className={`btn btn-sm mr-1 mb-1 btn-filtro-categoria ${
                          filtroCategoria === categoria 
                            ? `btn-${getCategoryBadge(categoria)}` 
                            : `btn-outline-${getCategoryBadge(categoria)}`
                        }`}
                        onClick={() => setFiltroCategoria(categoria)}
                      >
                        <i className="material-icons mr-1" style={{fontSize: '14px'}}>
                          {getCategoryIcon(categoria)}
                        </i>
                        {getCategoryLabel(categoria)} ({getCountPorCategoria(categoria)})
                      </button>
                    ))}
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
            onClick={() => setShowForm(!showForm)}
            className="mb-3"
          >
            <i className="material-icons mr-1">add</i>
            {showForm ? 'Cancelar' : 'Adicionar Tipo'}
          </Button>
        </Col>
      </Row>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader>
                <h6 className="m-0">
                  {editingTipo ? 'Editar Tipo' : 'Novo Tipo de Contribuição'}
                </h6>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="titulo">Título *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="categoria">Categoria *</label>
                        <select
                          className="form-control"
                          id="categoria"
                          value={formData.categoria}
                          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          {Object.entries(USER_CATEGORIES)
                            .filter(([key]) => key !== 'ADMIN')
                            .map(([key, value]) => (
                            <option key={key} value={value}>
                              {getCategoryLabel(value)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group">
                    <label htmlFor="contextoIA">Contexto para IA</label>
                    <textarea
                      className="form-control"
                      id="contextoIA"
                      rows={2}
                      value={formData.contextoIA}
                      onChange={(e) => setFormData({...formData, contextoIA: e.target.value})}
                      placeholder="Descrição para orientar a IA sobre este tipo de contribuição"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="textoModelo">Texto Modelo</label>
                    <textarea
                      className="form-control"
                      id="textoModelo"
                      rows={3}
                      value={formData.textoModelo}
                      onChange={(e) => setFormData({...formData, textoModelo: e.target.value})}
                      placeholder="Exemplo de texto para orientar o usuário"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tagsModelo">Tags Modelo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tagsModelo"
                      value={formData.tagsModelo}
                      onChange={(e) => setFormData({...formData, tagsModelo: e.target.value})}
                      placeholder="Tags separadas por vírgula (ex: Tecnologia, JavaScript, React)"
                    />
                    <small className="form-text text-muted">
                      Separe as tags por vírgula
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="perguntasModelo">Perguntas Modelo</label>
                    <textarea
                      className="form-control"
                      id="perguntasModelo"
                      rows={3}
                      value={formData.perguntasModelo}
                      onChange={(e) => setFormData({...formData, perguntasModelo: e.target.value})}
                      placeholder="Perguntas para orientar o usuário no preenchimento"
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <Button 
                      type="button" 
                      theme="light" 
                      className="mr-2"
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" theme="primary">
                      {editingTipo ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Lista de Tipos */}
      <Row>
        {tiposFiltrados.map(tipo => (
          <Col md={6} lg={4} className="mb-4" key={tipo.id}>
            <Card className={getCategoryCardClass(tipo.categoria)}>
              <CardHeader className={`${getCategoryHeaderClass(tipo.categoria)} d-flex justify-content-between align-items-center`}>
                <div className="d-flex align-items-center">
                  <i 
                    className="material-icons mr-2" 
                    style={{color: getCategoryColor(tipo.categoria)}}
                  >
                    {getCategoryIcon(tipo.categoria)}
                  </i>
                  <h6 className="m-0">{tipo.titulo}</h6>
                </div>
                <span className={`badge badge-${tipo.ativo ? 'success' : 'secondary'}`}>
                  {tipo.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </CardHeader>
              <CardBody>
                {/* Badge de categoria com cor específica */}
                <div className="mb-2">
                  <span className={`badge badge-${getCategoryBadge(tipo.categoria)}`}>
                    <i className="material-icons mr-1" style={{fontSize: '12px'}}>
                      {getCategoryIcon(tipo.categoria)}
                    </i>
                    {getCategoryLabel(tipo.categoria)}
                  </span>
                </div>
                
                {tipo.contextoIA && (
                  <p className="text-muted mb-2 small">
                    <strong>IA:</strong> {tipo.contextoIA.substring(0, 100)}...
                  </p>
                )}

                {tipo.textoModelo && (
                  <p className="text-muted mb-2 small">
                    <strong>Exemplo:</strong> {tipo.textoModelo.substring(0, 100)}...
                  </p>
                )}

                {tipo.tagsModelo && (
                  <div className="mb-2">
                    <small className="text-muted d-block mb-1"><strong>Tags modelo:</strong></small>
                    <div>
                      {(() => {
                        try {
                          const tags = JSON.parse(tipo.tagsModelo);
                          if (Array.isArray(tags)) {
                            return tags.map((tag: string, index: number) => (
                              <span key={index} className="badge badge-light mr-1 mb-1">
                                {tag}
                              </span>
                            ));
                          }
                        } catch (error) {
                          console.error('Erro ao fazer parse das tags modelo:', error);
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    size="sm"
                    theme="outline-info"
                    className="mr-2"
                    onClick={() => handleViewContribuicoes(tipo)}
                    title="Visualizar contribuições"
                    style={{
                      borderColor: getCategoryColor(tipo.categoria),
                      color: getCategoryColor(tipo.categoria)
                    }}
                  >
                    <i className="material-icons" style={{fontSize: '16px'}}>visibility</i>
                    {contribuicoesCount[tipo.id] !== undefined && (
                      <span 
                        className={`badge badge-${getCategoryBadge(tipo.categoria)} ml-1`}
                        style={{ fontSize: '10px' }}
                      >
                        {contribuicoesCount[tipo.id]}
                      </span>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    theme="outline-primary"
                    className="mr-2"
                    onClick={() => handleEdit(tipo)}
                  >
                    <i className="material-icons" style={{fontSize: '16px'}}>edit</i>
                  </Button>
                  <Button
                    size="sm"
                    theme="outline-danger"
                    onClick={() => handleDelete(tipo.id, tipo.titulo)}
                  >
                    <i className="material-icons" style={{fontSize: '16px'}}>delete</i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {tiposFiltrados.length === 0 && !loading && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                {filtroCategoria === 'TODAS' ? 'category' : getCategoryIcon(filtroCategoria)}
              </i>
              <h5 className="mt-3 text-muted">
                {filtroCategoria === 'TODAS' 
                  ? 'Nenhum tipo de contribuição cadastrado'
                  : `Nenhum tipo encontrado para ${getCategoryLabel(filtroCategoria)}`
                }
              </h5>
              <p className="text-muted">
                {filtroCategoria === 'TODAS'
                  ? 'Clique em "Adicionar Tipo" para criar o primeiro tipo.'
                  : `Não há tipos de contribuição cadastrados para a categoria ${getCategoryLabel(filtroCategoria)}.`
                }
              </p>
              {filtroCategoria !== 'TODAS' && (
                <Button 
                  theme="outline-secondary" 
                  onClick={() => setFiltroCategoria('TODAS')}
                  className="mt-2"
                >
                  Ver Todas as Categorias
                </Button>
              )}
            </div>
          </Col>
        </Row>
      )}

      {/* Modal de Visualização de Contribuições */}
      <ContribuicoesAdminModal
        isOpen={showContribuicoesModal}
        onClose={handleCloseContribuicoesModal}
        tipo={viewingTipo}
        onRefresh={fetchTipos}
      />
    </Container>
  );
};

export default TiposContribuicaoManagement;
