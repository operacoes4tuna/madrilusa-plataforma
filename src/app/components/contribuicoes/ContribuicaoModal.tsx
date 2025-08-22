import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import TagSelector from './TagSelector';
import AITextEnhancer from '@/components/ai/AITextEnhancer';
import AITagSuggester from '@/components/ai/AITagSuggester';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[] | string; // Pode ser array ou string JSON
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
  tipoPreSelecionado?: TipoContribuicao; // ✨ NOVO: Tipo pré-selecionado
  ocultarSeletorTipo?: boolean;          // ✨ NOVO: Ocultar seletor de tipo
}

const ContribuicaoModal: React.FC<ContribuicaoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingContribuicao,
  tiposDisponiveis,
  tipoPreSelecionado,
  ocultarSeletorTipo = false
}) => {
  const [formData, setFormData] = useState({
    tipoContribuicaoId: '',
    descricao: '',
    tags: [] as string[]
  });
  const [selectedTipo, setSelectedTipo] = useState<TipoContribuicao | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<any[]>([]); // Tags do sistema para IA
  const [isFormInitialized, setIsFormInitialized] = useState(false); // 🔧 Flag para controlar inicialização
  const { toast } = useToast();
  const { user } = useAuth();

  // 🔧 Refs para controle direto dos elementos
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formDataRef = useRef(formData);

  // Manter ref sincronizada com state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // 🤖 Contexto para IA - Memoizado para evitar re-renders
  const aiContext = useMemo(() => ({
    platformContext: "Plataforma Madrilusa para integração de jovens imigrantes em territórios rurais portugueses",
    userCategory: user?.categoria || 'IMIGRANTE',
    contributionType: selectedTipo?.titulo || '',
    typeContext: selectedTipo?.contextoIA || '',
    specificGuidance: selectedTipo?.perguntasModelo || '',
    tone: 'profissional mas acessível e acolhedor',
    focus: 'relevância para integração social em Portugal',
    maxLength: 1000,
    additionalGuidelines: 'Use linguagem inclusiva e inspire confiança'
  }), [
    user?.categoria, 
    selectedTipo?.titulo, 
    selectedTipo?.contextoIA, 
    selectedTipo?.perguntasModelo
  ]);

  // Buscar tags existentes para contexto da IA
  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const response = await fetch('/api/contribuicoes/tags/list');
        const data = await response.json();
        
        if (data.success) {
          setAvailableTags(data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
      }
    };

    if (isOpen) {
      fetchAvailableTags();
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('🔧 USEEFFECT DEBUG: useEffect de inicialização disparado', {
      editingContribuicao: !!editingContribuicao,
      tipoPreSelecionado: !!tipoPreSelecionado,
      isFormInitialized,
      isOpen,
      timestamp: new Date().toISOString()
    });

    // Só inicializar quando modal abre e ainda não foi inicializado
    if (!isOpen) {
      return;
    }

    if (editingContribuicao && !isFormInitialized) {
      console.log('🔧 USEEFFECT DEBUG: Inicializando para edição');
      setFormData({
        tipoContribuicaoId: editingContribuicao.tipoContribuicaoId,
        descricao: editingContribuicao.descricao,
        tags: editingContribuicao.tags || []
      });
      
      const tipo = tiposDisponiveis.find(t => t.id === editingContribuicao.tipoContribuicaoId);
      setSelectedTipo(tipo || null);
      setIsFormInitialized(true);
    } else if (tipoPreSelecionado && !isFormInitialized) {
      console.log('🔧 USEEFFECT DEBUG: Inicializando com tipo pré-selecionado');
      // ✨ NOVO: Configurar com tipo pré-selecionado
      setFormData({
        tipoContribuicaoId: tipoPreSelecionado.id,
        descricao: tipoPreSelecionado.textoModelo || '',
        tags: (() => {
          if (tipoPreSelecionado.tagsModelo) {
            try {
              if (typeof tipoPreSelecionado.tagsModelo === 'string') {
                return JSON.parse(tipoPreSelecionado.tagsModelo);
              } else if (Array.isArray(tipoPreSelecionado.tagsModelo)) {
                return tipoPreSelecionado.tagsModelo;
              }
            } catch (error) {
              console.error('Erro ao fazer parse das tags modelo:', error);
            }
          }
          return [];
        })()
      });
      setSelectedTipo(tipoPreSelecionado);
      setIsFormInitialized(true);
    } else if (!editingContribuicao && !tipoPreSelecionado && !isFormInitialized) {
      console.log('🔧 USEEFFECT DEBUG: Resetando formulário');
      resetForm();
      setIsFormInitialized(true);
    }
  }, [editingContribuicao, tiposDisponiveis, tipoPreSelecionado, isOpen, isFormInitialized]);

  // 🔧 Handler robusto para texto (DOM + State)
  const handleTextChange = useCallback((newText: string) => {
    console.log('🔧 MODAL DEBUG: handleTextChange chamado', {
      textoNovo: newText.substring(0, 50) + '...',
      tamanhoNovo: newText.length,
      estadoAtual: formDataRef.current.descricao.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    try {
      // 1. Atualizar DOM diretamente para feedback imediato
      if (textareaRef.current) {
        console.log('🔧 MODAL DEBUG: Atualizando DOM diretamente...');
        textareaRef.current.value = newText;
        textareaRef.current.focus();
        // Posicionar cursor no final
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
      
      // 2. Atualizar estado React
      setFormData(prev => {
        console.log('🔧 MODAL DEBUG: setFormData executado', {
          prevDescricao: prev.descricao.substring(0, 50) + '...',
          novaDescricao: newText.substring(0, 50) + '...',
          mudou: prev.descricao !== newText
        });
        return { ...prev, descricao: newText };
      });
      
      // 3. Disparar evento para garantir consistência
      if (textareaRef.current) {
        const event = new Event('input', { bubbles: true });
        textareaRef.current.dispatchEvent(event);
      }
      
      console.log('✅ MODAL DEBUG: handleTextChange completo com sucesso');
    } catch (error) {
      console.error('❌ MODAL DEBUG: Erro em handleTextChange:', error);
    }
  }, []);

  const handleTagsChange = useCallback((newTags: string[]) => {
    console.log('🔧 MODAL DEBUG: handleTagsChange chamado', {
      tagsNovas: newTags,
      quantidadeNova: newTags.length,
      timestamp: new Date().toISOString()
    });
    
    setFormData(prev => {
      console.log('🔧 MODAL DEBUG: setFormData para tags executado', {
        prevTags: prev.tags,
        novasTags: newTags,
        mudou: JSON.stringify(prev.tags) !== JSON.stringify(newTags)
      });
      return { ...prev, tags: newTags };
    });
  }, []); // Sem dependências para evitar stale closure

  const resetForm = () => {
    console.log('🔧 RESET DEBUG: Resetando formulário');
    setFormData({
      tipoContribuicaoId: '',
      descricao: '',
      tags: []
    });
    setSelectedTipo(null);
    setIsFormInitialized(false); // 🔧 Reset da flag
  };

  const handleTipoChange = (tipoId: string) => {
    const tipo = tiposDisponiveis.find(t => t.id === tipoId);
    setSelectedTipo(tipo || null);
    
    // Parse das tags modelo se disponível
    let tagsModelo: string[] = [];
    if (tipo?.tagsModelo) {
      try {
        if (typeof tipo.tagsModelo === 'string') {
          tagsModelo = JSON.parse(tipo.tagsModelo);
        } else if (Array.isArray(tipo.tagsModelo)) {
          tagsModelo = tipo.tagsModelo;
        }
      } catch (error) {
        console.error('Erro ao fazer parse das tags modelo:', error);
        tagsModelo = [];
      }
    }
    
    setFormData({
      ...formData,
      tipoContribuicaoId: tipoId,
      // Pré-preencher com texto modelo se disponível
      descricao: !editingContribuicao && tipo?.textoModelo ? tipo.textoModelo : formData.descricao,
      // Sugerir tags modelo se disponível
      tags: !editingContribuicao && tagsModelo.length > 0 ? tagsModelo : formData.tags
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
    console.log('🔧 CLOSE DEBUG: Fechando modal');
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
              {!editingContribuicao && !ocultarSeletorTipo && (
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

              {/* Tipo Pré-selecionado (apenas visual) */}
              {ocultarSeletorTipo && selectedTipo && (
                <div className="alert alert-primary">
                  <h6 className="mb-1">
                    <i className="material-icons mr-1">category</i>
                    {selectedTipo.titulo}
                  </h6>
                  {selectedTipo.contextoIA && (
                    <p className="mb-0 small text-muted">
                      {selectedTipo.contextoIA}
                    </p>
                  )}
                </div>
              )}

              {/* Informações do Tipo Selecionado */}
              {selectedTipo && !ocultarSeletorTipo && (
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
                  ref={textareaRef}
                  className="form-control"
                  id="descricao"
                  rows={6}
                  value={formData.descricao}
                  onChange={(e) => {
                    console.log('🔧 TEXTAREA DEBUG: onChange disparado', e.target.value.substring(0, 50) + '...');
                    handleTextChange(e.target.value);
                  }}
                  required
                  placeholder={selectedTipo?.perguntasModelo || "Descreva sua contribuição..."}
                />
                <small className="form-text text-muted">
                  {formData.descricao.length}/1000 caracteres
                </small>
                
                {/* 🔧 DEBUG: Mostrar estado atual */}
                <div className="mt-1 p-1" style={{ fontSize: '10px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                  <strong>DEBUG Estado:</strong> Descrição: {formData.descricao.length} chars | Tags: {formData.tags.length} items
                  {formData.tags.length > 0 && ` (${formData.tags.join(', ')})`}
                </div>

                {/* 🤖 Componente de IA */}
                {selectedTipo && formData.descricao.trim().length >= 20 && (
                  <AITextEnhancer
                    originalText={formData.descricao}
                    onTextChanged={handleTextChange}
                    context={aiContext}
                    disabled={loading}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Seletor de Tags com IA */}
              <div className="form-group">
                <AITagSuggester
                  text={formData.descricao}
                  context={aiContext}
                  selectedTags={formData.tags}
                  onTagsChanged={handleTagsChange}
                  existingTags={availableTags}
                  disabled={loading}
                  maxTags={8}
                />
                
                {/* TagSelector original como fallback */}
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Ou use o seletor manual:</small>
                  <TagSelector
                    selectedTags={formData.tags}
                    onChange={handleTagsChange}
                    placeholder="Digite para buscar ou criar tags..."
                    maxTags={8}
                  />
                </div>
              </div>

              {/* Tags Sugeridas */}
              {(() => {
                // Parse seguro das tags modelo
                let tagsModelo: string[] = [];
                if (selectedTipo?.tagsModelo) {
                  try {
                    if (typeof selectedTipo.tagsModelo === 'string') {
                      tagsModelo = JSON.parse(selectedTipo.tagsModelo);
                    } else if (Array.isArray(selectedTipo.tagsModelo)) {
                      tagsModelo = selectedTipo.tagsModelo;
                    }
                  } catch (error) {
                    console.error('Erro ao fazer parse das tags modelo:', error);
                    tagsModelo = [];
                  }
                }

                return tagsModelo.length > 0 && (
                  <div className="form-group">
                    <label>Tags Sugeridas:</label>
                    <div>
                      {tagsModelo
                        .filter(tag => !formData.tags.includes(tag))
                        .map((tag, index) => (
                        <Button
                          key={index}
                          size="sm"
                          theme="outline-secondary"
                          className="mr-1 mb-1"
                          onClick={() => {
                            if (formData.tags.length < 8) {
                              const newTags = [...formData.tags, tag];
                              handleTagsChange(newTags);
                            }
                          }}
                          disabled={formData.tags.length >= 8}
                        >
                          + {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })()}
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
