import React, { useState, useEffect } from 'react';
import { Button } from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { parseTagsSafely } from '../../../lib/tagsUtils';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string;
  perguntasModelo?: string;
  ativo: boolean;
}

interface ContribuicaoAdmin {
  id: string;
  descricao: string;
  tags: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nomeCompleto: string;
    email: string;
    categoria: string;
    telemovel?: string;
    diasNaPlataforma: number;
  };
}

interface Estatisticas {
  total: number;
  ativas: number;
  inativas: number;
  usuarios: number;
}

interface ContribuicoesAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: TipoContribuicao | null;
  onRefresh: () => void;
}

const ContribuicoesAdminModal: React.FC<ContribuicoesAdminModalProps> = ({
  isOpen, onClose, tipo, onRefresh
}) => {
  const [contribuicoes, setContribuicoes] = useState<ContribuicaoAdmin[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'inativas'>('todas');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && tipo?.id) {
      fetchContribuicoes();
    }
  }, [isOpen, tipo]);

  const fetchContribuicoes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tipos-contribuicao/${tipo?.id}/contribuicoes`);
      const data = await response.json();
      
      if (data.success) {
        setContribuicoes(data.data.contribuicoes);
        setEstatisticas(data.data.estatisticas);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar contribuições:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contribuições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (contribuicaoId: string, novoStatus: boolean, nomeUsuario: string) => {
    const acao = novoStatus ? 'publicar' : 'despublicar';
    if (!window.confirm(`${acao.charAt(0).toUpperCase() + acao.slice(1)} contribuição de ${nomeUsuario}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contribuicao/${contribuicaoId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: novoStatus })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Sucesso",
          description: data.message
        });
        fetchContribuicoes();
        onRefresh();
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

  const handleDelete = async (contribuicaoId: string, nomeUsuario: string) => {
    if (!window.confirm(`EXCLUIR PERMANENTEMENTE a contribuição de ${nomeUsuario}?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contribuicao/${contribuicaoId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Sucesso", 
          description: data.message
        });
        fetchContribuicoes();
        onRefresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao excluir contribuição:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir contribuição",
        variant: "destructive",
      });
    }
  };

  const contribuicoesFiltradas = contribuicoes.filter(contrib => {
    if (filtro === 'ativas') return contrib.ativo;
    if (filtro === 'inativas') return !contrib.ativo;
    return true;
  });

  const getCategoryLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'IMIGRANTE': 'Imigrante',
      'EMPRESA': 'Empresa',
      'MUNICIPIO': 'Município',
      'ACADEMIA': 'Academia',
      'FAMILIA_ACOLHIMENTO': 'Família'
    };
    return labels[categoria] || categoria;
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{display: 'block'}} onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="material-icons mr-2">visibility</i>
              Contribuições: {tipo?.titulo} ({getCategoryLabel(tipo?.categoria || '')})
            </h5>
            <button className="btn-close" onClick={onClose}>&times;</button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Estatísticas */}
            {estatisticas && (
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card card-stats">
                    <div className="card-body text-center">
                      <div className="icon-shape-modal bg-primary text-white shadow mx-auto mb-2">
                        <i className="material-icons">assignment</i>
                      </div>
                      <span className="h4 font-weight-bold">{estatisticas.total}</span>
                      <p className="card-title text-uppercase text-muted mb-0">Total</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-stats">
                    <div className="card-body text-center">
                      <div className="icon-shape-modal bg-success text-white shadow mx-auto mb-2">
                        <i className="material-icons">check_circle</i>
                      </div>
                      <span className="h4 font-weight-bold text-success">{estatisticas.ativas}</span>
                      <p className="card-title text-uppercase text-muted mb-0">Ativas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-stats">
                    <div className="card-body text-center">
                      <div className="icon-shape-modal bg-warning text-white shadow mx-auto mb-2">
                        <i className="material-icons">visibility_off</i>
                      </div>
                      <span className="h4 font-weight-bold text-warning">{estatisticas.inativas}</span>
                      <p className="card-title text-uppercase text-muted mb-0">Ocultas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-stats">
                    <div className="card-body text-center">
                      <div className="icon-shape-modal bg-info text-white shadow mx-auto mb-2">
                        <i className="material-icons">people</i>
                      </div>
                      <span className="h4 font-weight-bold text-info">{estatisticas.usuarios}</span>
                      <p className="card-title text-uppercase text-muted mb-0">Usuários</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filtros */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="btn-group" role="group">
                  <button 
                    className={`btn btn-sm ${filtro === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('todas')}
                  >
                    Todas ({estatisticas?.total || 0})
                  </button>
                  <button 
                    className={`btn btn-sm ${filtro === 'ativas' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFiltro('ativas')}
                  >
                    Ativas ({estatisticas?.ativas || 0})
                  </button>
                  <button 
                    className={`btn btn-sm ${filtro === 'inativas' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFiltro('inativas')}
                  >
                    Ocultas ({estatisticas?.inativas || 0})
                  </button>
                </div>
              </div>
              <div className="col-md-6 text-right">
                <Button
                  size="sm"
                  theme="outline-secondary"
                  onClick={fetchContribuicoes}
                  disabled={loading}
                >
                  <i className="material-icons mr-1">refresh</i>
                  Atualizar
                </Button>
              </div>
            </div>

            {/* Lista de Contribuições */}
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Carregando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Usuário</th>
                      <th>Contribuição</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contribuicoesFiltradas.map(contrib => (
                      <tr key={contrib.id} className={!contrib.ativo ? 'table-warning' : ''}>
                        <td>
                          <div>
                            <strong>{contrib.user.nomeCompleto}</strong>
                            <br />
                            <small className="text-muted">{contrib.user.email}</small>
                            <br />
                            <span className="badge badge-light">
                              {getCategoryLabel(contrib.user.categoria)}
                            </span>
                            <small className="text-muted d-block">
                              {contrib.user.diasNaPlataforma} dias na plataforma
                            </small>
                            {contrib.user.telemovel && (
                              <small className="text-muted d-block">
                                📱 {contrib.user.telemovel}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            <p className="mb-1">
                              {contrib.descricao.length > 100 
                                ? `${contrib.descricao.substring(0, 100)}...`
                                : contrib.descricao
                              }
                            </p>
                            {contrib.descricao.length > 100 && (
                              <small className="text-primary">
                                <a href="#" onClick={(e) => {
                                  e.preventDefault();
                                  alert(contrib.descricao);
                                }} style={{ textDecoration: 'none' }}>
                                  Ver texto completo
                                </a>
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            {(() => {
                              const tags = parseTagsSafely(contrib.tags);

                              return (
                                <>
                                  {tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="badge badge-secondary mr-1 mb-1">
                                      {tag}
                                    </span>
                                  ))}
                                  {tags.length > 2 && (
                                    <span className="badge badge-light" title={tags.join(', ')}>
                                      +{tags.length - 2}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${contrib.ativo ? 'success' : 'warning'}`}>
                            {contrib.ativo ? 'Ativa' : 'Oculta'}
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(contrib.createdAt).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                            <br />
                            <span className="text-muted">
                              {new Date(contrib.createdAt).toLocaleTimeString('pt-PT', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className={`btn btn-outline-${contrib.ativo ? 'warning' : 'success'}`}
                              onClick={() => handleToggleStatus(contrib.id, !contrib.ativo, contrib.user.nomeCompleto)}
                              title={contrib.ativo ? 'Despublicar (ocultar)' : 'Publicar (tornar visível)'}
                            >
                              <i className="material-icons" style={{fontSize: '14px'}}>
                                {contrib.ativo ? 'visibility_off' : 'visibility'}
                              </i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(contrib.id, contrib.user.nomeCompleto)}
                              title="Excluir permanentemente"
                            >
                              <i className="material-icons" style={{fontSize: '14px'}}>delete</i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {contribuicoesFiltradas.length === 0 && !loading && (
                  <div className="text-center py-4">
                    <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                      {filtro === 'ativas' ? 'check_circle' : 
                       filtro === 'inativas' ? 'visibility_off' : 'assignment'}
                    </i>
                    <h5 className="mt-3 text-muted">
                      Nenhuma contribuição {filtro !== 'todas' ? filtro : 'encontrada'}
                    </h5>
                    <p className="text-muted">
                      {filtro === 'todas' 
                        ? 'Este tipo ainda não possui contribuições cadastradas.'
                        : `Não há contribuições ${filtro} para este tipo.`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                {estatisticas && (
                  <small className="text-muted">
                    Total: {estatisticas.total} | 
                    Ativas: {estatisticas.ativas} | 
                    Ocultas: {estatisticas.inativas} | 
                    Usuários: {estatisticas.usuarios}
                  </small>
                )}
              </div>
              <Button theme="secondary" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContribuicoesAdminModal;
