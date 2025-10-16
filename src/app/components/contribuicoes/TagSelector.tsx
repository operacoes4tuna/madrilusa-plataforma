import React, { useState, useEffect } from 'react';
import { Button } from 'shards-react';

interface TagSistema {
  id: string;
  nome: string;
  cor?: string;
  categoria?: string;
  usos: number;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  placeholder = "Selecione ou digite tags...",
  maxTags = 10
}) => {
  // 🔧 Garantir que selectedTags seja sempre um array
  const safeTags = Array.isArray(selectedTags) ? selectedTags : [];
  const [availableTags, setAvailableTags] = useState<TagSistema[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
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

  const filteredTags = availableTags.filter(tag => {
    const matchesSearch = tag.nome.toLowerCase().includes(inputValue.toLowerCase());
    const notAlreadySelected = !safeTags.includes(tag.nome);
    return matchesSearch && notAlreadySelected;
  });

  // Se não houver busca, mostrar todas as tags ordenadas por categoria e uso
  const displayTags = inputValue.length === 0
    ? availableTags
        .filter(tag => !safeTags.includes(tag.nome))
        .sort((a, b) => {
          // Priorizar tags de Personalidade
          if (a.categoria === 'Personalidade' && b.categoria !== 'Personalidade') return -1;
          if (a.categoria !== 'Personalidade' && b.categoria === 'Personalidade') return 1;
          // Depois ordenar por usos e nome
          if (b.usos !== a.usos) return b.usos - a.usos;
          return a.nome.localeCompare(b.nome);
        })
    : filteredTags;

  const handleAddTag = (tagName: string) => {
    if (safeTags.length >= maxTags) {
      return;
    }

    if (!safeTags.includes(tagName)) {
      onChange([...safeTags, tagName]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(safeTags.filter(tag => tag !== tagName));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find(t => t.nome === tagName);
    return tag?.cor || '#6c757d';
  };

  return (
    <div className="tag-selector">
      {/* Tags Selecionadas */}
      {safeTags.length > 0 && (
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Tags selecionadas:</small>
          <div>
            {safeTags.map((tag, index) => (
              <span 
                key={index}
                className="badge mr-1 mb-1 d-inline-flex align-items-center"
                style={{ 
                  backgroundColor: getTagColor(tag),
                  color: '#fff',
                  fontSize: '12px',
                  padding: '6px 8px'
                }}
              >
                {tag}
                <button
                  type="button"
                  className="btn btn-sm p-0 ml-1"
                  style={{ 
                    color: '#fff', 
                    fontSize: '14px',
                    lineHeight: '1',
                    background: 'none',
                    border: 'none'
                  }}
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input para adicionar tags */}
      <div className="position-relative">
        <input
          type="text"
          className="form-control"
          placeholder={safeTags.length >= maxTags 
            ? `Máximo de ${maxTags} tags atingido`
            : placeholder
          }
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          disabled={safeTags.length >= maxTags}
        />

        {/* Sugestões */}
        {showSuggestions && displayTags.length > 0 && (
          <div
            className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
            style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}
          >
            {displayTags.slice(0, 20).map((tag) => (
              <div
                key={tag.id}
                className="px-3 py-2 border-bottom cursor-pointer hover-bg-light"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAddTag(tag.nome)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: tag.cor || '#6c757d',
                      color: '#fff'
                    }}
                  >
                    {tag.nome}
                  </span>
                  <small className="text-muted">
                    {tag.usos} uso{tag.usos !== 1 ? 's' : ''}
                  </small>
                </div>
                {tag.categoria && (
                  <small className="text-muted d-block mt-1">
                    {tag.categoria}
                  </small>
                )}
              </div>
            ))}
            
            {/* Opção para criar nova tag */}
            {inputValue.trim() && !availableTags.find(t => 
              t.nome.toLowerCase() === inputValue.toLowerCase()
            ) && (
              <div
                className="px-3 py-2 border-top cursor-pointer text-primary"
                style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                onClick={() => handleAddTag(inputValue.trim())}
              >
                <i className="material-icons mr-1" style={{fontSize: '16px'}}>add</i>
                Criar tag "{inputValue.trim()}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags Sugeridas */}
      {safeTags.length < maxTags && displayTags.length > 0 && (
        <div className="mt-3">
          <small className="text-muted d-block mb-2">Tags Sugeridas:</small>
          <div>
            {displayTags.slice(0, 15).map((tag) => (
              <span
                key={tag.id}
                className="badge mr-1 mb-1"
                style={{
                  backgroundColor: tag.cor || '#6c757d',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '6px 8px',
                  cursor: 'pointer'
                }}
                onClick={() => handleAddTag(tag.nome)}
              >
                {tag.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Informações */}
      <small className="form-text text-muted mt-1">
        Digite para buscar tags existentes ou criar novas.
        Máximo {maxTags} tags. ({safeTags.length}/{maxTags})
      </small>
    </div>
  );
};

export default TagSelector;
