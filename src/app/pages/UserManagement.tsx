import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'shards-react';
import PageTitle from '../components/common/PageTitle';

interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  telemovel?: string;
  categoria?: string;
  createdAt: string;
  updatedAt: string;
  perfilImigrante?: any;
  perfilEmpresa?: any;
  perfilMunicipio?: any;
  perfilAcademia?: any;
  perfilFamilia?: any;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (filter === 'ALL') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.categoria === filter));
    }
  };

  const getCategoryBadgeColor = (categoria: string) => {
    const colors = {
      'IMIGRANTE': 'badge-success',
      'EMPRESA': 'badge-primary', 
      'MUNICIPIO': 'badge-warning',
      'ACADEMIA': 'badge-info',
      'FAMILIA_ACOLHIMENTO': 'badge-secondary',
      'ADMIN': 'badge-danger'
    };
    return colors[categoria as keyof typeof colors] || 'badge-light';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProfileStatus = (user: User) => {
    const hasProfile = user.perfilImigrante || user.perfilEmpresa || 
                      user.perfilMunicipio || user.perfilAcademia || user.perfilFamilia;
    return hasProfile ? 'Completo' : 'Básico';
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/user/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
        alert('Usuário removido com sucesso');
      } else {
        alert('Erro ao remover usuário: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      alert('Erro de conexão ao remover usuário');
    }
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="Gestão de Usuários" 
            subtitle="Carregando..."
            className="text-sm-left mb-3" 
          />
        </Row>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="Gestão de Usuários" 
            subtitle="Erro"
            className="text-sm-left mb-3" 
          />
        </Row>
        <div className="alert alert-danger">
          <h5>Erro ao carregar usuários</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchUsers}>
            Tentar Novamente
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Gestão de Usuários" 
          subtitle={`${filteredUsers.length} usuários encontrados`}
          className="text-sm-left mb-3" 
        />
      </Row>

      <Row className="mb-4">
        <Col>
          <div className="card small">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label htmlFor="categoryFilter" className="form-label">
                    <strong>Filtrar por Categoria:</strong>
                  </label>
                  <select 
                    id="categoryFilter"
                    className="form-control"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">Todas as Categorias ({users.length})</option>
                    <option value="IMIGRANTE">
                      Imigrantes ({users.filter(u => u.categoria === 'IMIGRANTE').length})
                    </option>
                    <option value="EMPRESA">
                      Empresas ({users.filter(u => u.categoria === 'EMPRESA').length})
                    </option>
                    <option value="MUNICIPIO">
                      Municípios ({users.filter(u => u.categoria === 'MUNICIPIO').length})
                    </option>
                    <option value="ACADEMIA">
                      Academias ({users.filter(u => u.categoria === 'ACADEMIA').length})
                    </option>
                    <option value="FAMILIA_ACOLHIMENTO">
                      Famílias ({users.filter(u => u.categoria === 'FAMILIA_ACOLHIMENTO').length})
                    </option>
                    <option value="ADMIN">
                      Administradores ({users.filter(u => u.categoria === 'ADMIN').length})
                    </option>
                  </select>
                </div>
                <div className="col-md-6 text-right">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={fetchUsers}
                    disabled={loading}
                  >
                    <i className="material-icons mr-1">refresh</i>
                    Atualizar Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {filteredUsers.map(user => (
          <Col md="6" lg="4" className="mb-4" key={user.id}>
            <div className="card small">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{user.nomeCompleto}</h6>
                  <span className={`badge ${getCategoryBadgeColor(user.categoria || '')}`}>
                    {user.categoria || 'Sem categoria'}
                  </span>
                </div>
                
                <p className="text-muted mb-1 small">
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>email</i>
                  {user.email}
                </p>
                
                {user.telemovel && (
                  <p className="text-muted mb-1 small">
                    <i className="material-icons mr-1" style={{fontSize: '14px'}}>phone</i>
                    {user.telemovel}
                  </p>
                )}
                
                <p className="text-muted mb-1 small">
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>calendar_today</i>
                  Membro desde {formatDate(user.createdAt)}
                </p>

                <p className="text-muted mb-3 small">
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>account_circle</i>
                  Perfil: {getProfileStatus(user)}
                </p>
                
                <div className="btn-group btn-group-sm w-100">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setSelectedUser(user)}
                  >
                    <i className="material-icons">visibility</i>
                    Ver Detalhes
                  </button>
                  {user.categoria !== 'ADMIN' && (
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <i className="material-icons">delete</i>
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {filteredUsers.length === 0 && !loading && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                person_off
              </i>
              <h5 className="mt-3 text-muted">
                Nenhum usuário encontrado
              </h5>
              <p className="text-muted">
                Não há usuários registrados para o filtro selecionado.
              </p>
            </div>
          </Col>
        </Row>
      )}

      {selectedUser && (
        <div 
          className="modal fade show" 
          style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} 
          onClick={() => setSelectedUser(null)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalhes do Usuário - {selectedUser.nomeCompleto}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn btn-sm btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Dados Básicos</h6>
                    <ul className="list-unstyled">
                      <li><strong>Nome:</strong> {selectedUser.nomeCompleto}</li>
                      <li><strong>Email:</strong> {selectedUser.email}</li>
                      <li><strong>Telemóvel:</strong> {selectedUser.telemovel || 'Não informado'}</li>
                      <li><strong>Categoria:</strong> 
                        <span className={`badge ml-2 ${getCategoryBadgeColor(selectedUser.categoria || '')}`}>
                          {selectedUser.categoria || 'Sem categoria'}
                        </span>
                      </li>
                      <li><strong>Criado em:</strong> {formatDate(selectedUser.createdAt)}</li>
                      <li><strong>Atualizado em:</strong> {formatDate(selectedUser.updatedAt)}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Perfil Específico</h6>
                    {getProfileStatus(selectedUser).includes('Completo') ? (
                      <div>
                        {selectedUser.perfilImigrante && <p><strong>✓ Perfil de Imigrante cadastrado</strong></p>}
                        {selectedUser.perfilEmpresa && <p><strong>✓ Perfil de Empresa cadastrado</strong></p>}
                        {selectedUser.perfilMunicipio && <p><strong>✓ Perfil de Município cadastrado</strong></p>}
                        {selectedUser.perfilAcademia && <p><strong>✓ Perfil de Academia cadastrado</strong></p>}
                        {selectedUser.perfilFamilia && <p><strong>✓ Perfil de Família cadastrado</strong></p>}
                      </div>
                    ) : (
                      <p className="text-muted">Nenhum perfil específico cadastrado</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserManagement; 