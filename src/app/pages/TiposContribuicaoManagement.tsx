import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { USER_CATEGORIES } from '../../../shared-types/api.types';

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
  const { toast } = useToast();

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

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'IMIGRANTE': 'Imigrante',
      'EMPRESA': 'Empresa',
      'MUNICIPIO': 'Município',
      'ACADEMIA': 'Academia',
      'FAMILIA_ACOLHIMENTO': 'Família de Acolhimento'
    };
    return labels[categoria] || categoria;
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
          subtitle={`${tipos.length} tipos cadastrados`}
          className="text-sm-left mb-3" 
        />
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
        {tipos.map(tipo => (
          <Col md={6} lg={4} className="mb-4" key={tipo.id}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h6 className="m-0">{tipo.titulo}</h6>
                <span className={`badge badge-${tipo.ativo ? 'success' : 'secondary'}`}>
                  {tipo.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  <strong>Categoria:</strong> {getCategoryLabel(tipo.categoria)}
                </p>
                
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
                      {JSON.parse(tipo.tagsModelo).map((tag: string, index: number) => (
                        <span key={index} className="badge badge-light mr-1 mb-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-3">
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

      {tipos.length === 0 && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                category
              </i>
              <h5 className="mt-3 text-muted">
                Nenhum tipo de contribuição cadastrado
              </h5>
              <p className="text-muted">
                Clique em "Adicionar Tipo" para criar o primeiro tipo.
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TiposContribuicaoManagement;
