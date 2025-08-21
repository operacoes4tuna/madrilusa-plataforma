import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';

interface TagSistema {
  id: string;
  nome: string;
  cor?: string;
  categoria?: string;
  usos: number;
  createdAt: string;
  updatedAt: string;
}

const TagsManagement: React.FC = () => {
  const [tags, setTags] = useState<TagSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<TagSistema | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    cor: '#0066cc'
  });

  const coresDisponiveis = [
    '#0066cc', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
  ];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags');
      const data = await response.json();
      
      if (data.success) {
        setTags(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome) {
      toast({
        title: "Erro",
        description: "Nome da tag é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingTag 
        ? `/api/admin/tags/${editingTag.id}`
        : '/api/admin/tags';
      
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        
        fetchTags();
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar tag",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tag: TagSistema) => {
    setEditingTag(tag);
    setFormData({
      nome: tag.nome,
      categoria: tag.categoria || '',
      cor: tag.cor || '#0066cc'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, nome: string, usos: number) => {
    if (usos > 0) {
      toast({
        title: "Erro",
        description: `A tag "${nome}" está sendo usada em ${usos} contribuição(ões) e não pode ser removida.`,
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Tem certeza que deseja remover a tag "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message,
        });
        fetchTags();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover tag",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria: '',
      cor: '#0066cc'
    });
    setEditingTag(null);
    setShowForm(false);
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
          title="Gestão de Tags do Sistema" 
          subtitle={`${tags.length} tags cadastradas`}
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-stats">
            <CardBody>
              <div className="row">
                <div className="col">
                  <div className="card-title text-uppercase text-muted mb-0">Total Tags</div>
                  <span className="h2 font-weight-bold mb-0">{tags.length}</span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
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
                  <div className="card-title text-uppercase text-muted mb-0">Em Uso</div>
                  <span className="h2 font-weight-bold mb-0">
                    {tags.filter(t => t.usos > 0).length}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                    <i className="material-icons">check_circle</i>
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
                  <div className="card-title text-uppercase text-muted mb-0">Não Usadas</div>
                  <span className="h2 font-weight-bold mb-0">
                    {tags.filter(t => t.usos === 0).length}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                    <i className="material-icons">warning</i>
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
                  <div className="card-title text-uppercase text-muted mb-0">Total Usos</div>
                  <span className="h2 font-weight-bold mb-0">
                    {tags.reduce((sum, t) => sum + t.usos, 0)}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                    <i className="material-icons">trending_up</i>
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
            {showForm ? 'Cancelar' : 'Adicionar Tag'}
          </Button>
        </Col>
      </Row>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col md={8}>
            <Card>
              <CardHeader>
                <h6 className="m-0">
                  {editingTag ? 'Editar Tag' : 'Nova Tag do Sistema'}
                </h6>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="nome">Nome da Tag *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          required
                          placeholder="Ex: JavaScript, Marketing, Apoio Social"
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="categoria">Categoria</label>
                        <input
                          type="text"
                          className="form-control"
                          id="categoria"
                          value={formData.categoria}
                          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                          placeholder="Ex: Tecnologia, Social, Educação"
                        />
                        <small className="form-text text-muted">
                          Opcional - para organização das tags
                        </small>
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group">
                    <label>Cor da Tag</label>
                    <div className="d-flex flex-wrap">
                      {coresDisponiveis.map(cor => (
                        <div
                          key={cor}
                          className={`border rounded mr-2 mb-2 ${formData.cor === cor ? 'border-dark' : 'border-light'}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: cor,
                            cursor: 'pointer',
                            borderWidth: formData.cor === cor ? '3px' : '1px'
                          }}
                          onClick={() => setFormData({...formData, cor})}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      className="form-control mt-2"
                      style={{ width: '100px' }}
                      value={formData.cor}
                      onChange={(e) => setFormData({...formData, cor: e.target.value})}
                    />
                  </div>

                  {/* Preview */}
                  <div className="form-group">
                    <label>Preview:</label>
                    <div>
                      <span 
                        className="badge mr-2"
                        style={{ 
                          backgroundColor: formData.cor,
                          color: '#fff',
                          fontSize: '14px',
                          padding: '8px 12px'
                        }}
                      >
                        {formData.nome || 'Nome da Tag'}
                      </span>
                    </div>
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
                      {editingTag ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Lista de Tags */}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h6 className="m-0">Tags Cadastradas</h6>
            </CardHeader>
            <CardBody>
              {tags.length === 0 ? (
                <div className="text-center py-4">
                  <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                    local_offer
                  </i>
                  <h5 className="mt-3 text-muted">
                    Nenhuma tag cadastrada
                  </h5>
                  <p className="text-muted">
                    Clique em "Adicionar Tag" para criar a primeira tag.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Categoria</th>
                        <th>Usos</th>
                        <th>Criada em</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags
                        .sort((a, b) => b.usos - a.usos)
                        .map(tag => (
                        <tr key={tag.id}>
                          <td>
                            <span 
                              className="badge"
                              style={{ 
                                backgroundColor: tag.cor || '#6c757d',
                                color: '#fff'
                              }}
                            >
                              {tag.nome}
                            </span>
                          </td>
                          <td>
                            <span className="text-muted">
                              {tag.categoria || '-'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tag.usos > 0 ? 'badge-success' : 'badge-light'}`}>
                              {tag.usos}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(tag.createdAt).toLocaleDateString('pt-PT')}
                            </small>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              theme="outline-primary"
                              className="mr-1"
                              onClick={() => handleEdit(tag)}
                            >
                              <i className="material-icons" style={{fontSize: '16px'}}>edit</i>
                            </Button>
                            <Button
                              size="sm"
                              theme={tag.usos > 0 ? "outline-secondary" : "outline-danger"}
                              onClick={() => handleDelete(tag.id, tag.nome, tag.usos)}
                              disabled={tag.usos > 0}
                              title={tag.usos > 0 ? `Tag em uso (${tag.usos} vezes)` : 'Remover tag'}
                            >
                              <i className="material-icons" style={{fontSize: '16px'}}>delete</i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TagsManagement;
