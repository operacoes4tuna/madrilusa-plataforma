import React, { useState, useEffect } from 'react';
import { Button } from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import TagSelector from './TagSelector';

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

interface ContribuicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingContribuicao?: Contribuicao | null;
  tiposDisponiveis: TipoContribuicao[];
}

const ContribuicaoModal: React.FC<ContribuicaoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingContribuicao,
  tiposDisponiveis
}) => {
  const [formData, setFormData] = useState({
    tipoContribuicaoId: '',
    descricao: '',
    tags: [] as string[]
  });
  const [selectedTipo, setSelectedTipo] = useState<TipoContribuicao | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (editingContribuicao) {
      setFormData({
        tipoContribuicaoId: editingContribuicao.tipoContribuicaoId,
        descricao: editingContribuicao.descricao,
        tags: editingContribuicao.tags || []
      });
      
      const tipo = tiposDisponiveis.find(t => t.id === editingContribuicao.tipoContribuicaoId);
      setSelectedTipo(tipo || null);
    } else {
      resetForm();
    }
  }, [editingContribuicao, tiposDisponiveis]);

  const resetForm = () => {
    setFormData({
      tipoContribuicaoId: '',
      descricao: '',
      tags: []
    });
    setSelectedTipo(null);
  };

  const handleTipoChange = (tipoId: string) => {
    const tipo = tiposDisponiveis.find(t => t.id === tipoId);
    setSelectedTipo(tipo || null);
    setFormData({
      ...formData,
      tipoContribuicaoId: tipoId,
      // Pré-preencher com texto modelo se disponível
      descricao: !editingContribuicao && tipo?.textoModelo ? tipo.textoModelo : formData.descricao,
      // Sugerir tags modelo se disponível
      tags: !editingContribuicao && tipo?.tagsModelo ? tipo.tagsModelo : formData.tags
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipoContribuicaoId || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Tipo e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const url = editingContribuicao 
        ? `/api/contribuicoes/${editingContribuicao.id}`
        : `/api/contribuicoes/user/${user?.id}`;
      
      const method = editingContribuicao ? 'PUT' : 'POST';
      
      const payload = editingContribuicao 
        ? {
            descricao: formData.descricao,
            tags: formData.tags,
            userId: user?.id
          }
        : {
            tipoContribuicaoId: formData.tipoContribuicaoId,
            descricao: formData.descricao,
            tags: formData.tags
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
        
        onSave();
        onClose();
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar contribuição:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar contribuição",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{display: 'block'}} onClick={handleClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingContribuicao ? 'Editar' : 'Adicionar'} Contribuição
            </h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Seleção do Tipo */}
              {!editingContribuicao && (
                <div className="form-group">
                  <label htmlFor="tipoContribuicao">Tipo de Contribuição *</label>
                  <select
                    className="form-control"
                    id="tipoContribuicao"
                    value={formData.tipoContribuicaoId}
                    onChange={(e) => handleTipoChange(e.target.value)}
                    required
                  >
                    <option value="">Selecione um tipo</option>
                    {tiposDisponiveis.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Informações do Tipo Selecionado */}
              {selectedTipo && (
                <div className="alert alert-info">
                  <h6 className="mb-2">{selectedTipo.titulo}</h6>
                  {selectedTipo.perguntasModelo && (
                    <p className="mb-0 small">
                      <strong>Orientação:</strong> {selectedTipo.perguntasModelo}
                    </p>
                  )}
                </div>
              )}

              {/* Descrição */}
              <div className="form-group">
                <label htmlFor="descricao">
                  Descrição *
                  {selectedTipo && (
                    <small className="text-muted ml-2">
                      ({selectedTipo.titulo})
                    </small>
                  )}
                </label>
                <textarea
                  className="form-control"
                  id="descricao"
                  rows={6}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  required
                  placeholder={selectedTipo?.perguntasModelo || "Descreva sua contribuição..."}
                />
                <small className="form-text text-muted">
                  {formData.descricao.length}/1000 caracteres
                </small>
              </div>

              {/* Seletor de Tags */}
              <div className="form-group">
                <label>Tags</label>
                <TagSelector
                  selectedTags={formData.tags}
                  onChange={(tags) => setFormData({...formData, tags})}
                  placeholder="Digite para buscar ou criar tags..."
                  maxTags={8}
                />
              </div>

              {/* Tags Sugeridas */}
              {selectedTipo?.tagsModelo && selectedTipo.tagsModelo.length > 0 && (
                <div className="form-group">
                  <label>Tags Sugeridas:</label>
                  <div>
                    {selectedTipo.tagsModelo
                      .filter(tag => !formData.tags.includes(tag))
                      .map((tag, index) => (
                      <Button
                        key={index}
                        size="sm"
                        theme="outline-secondary"
                        className="mr-1 mb-1"
                        onClick={() => {
                          if (formData.tags.length < 8) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tag]
                            });
                          }
                        }}
                        disabled={formData.tags.length >= 8}
                      >
                        + {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <Button 
                type="button" 
                theme="light" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                theme="primary"
                disabled={loading || !formData.tipoContribuicaoId || !formData.descricao.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" />
                    Salvando...
                  </>
                ) : (
                  editingContribuicao ? 'Atualizar' : 'Criar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContribuicaoModal;
