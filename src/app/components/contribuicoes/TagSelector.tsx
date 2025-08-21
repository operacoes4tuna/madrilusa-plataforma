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

  const filteredTags = availableTags.filter(tag =>
    tag.nome.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.includes(tag.nome)
  );

  const handleAddTag = (tagName: string) => {
    if (selectedTags.length >= maxTags) {
      return;
    }

    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter(tag => tag !== tagName));
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
      {selectedTags.length > 0 && (
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Tags selecionadas:</small>
          <div>
            {selectedTags.map((tag, index) => (
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
          placeholder={selectedTags.length >= maxTags 
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
          disabled={selectedTags.length >= maxTags}
        />

        {/* Sugestões */}
        {showSuggestions && filteredTags.length > 0 && (
          <div 
            className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
            style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
          >
            {filteredTags.slice(0, 8).map((tag, index) => (
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

      {/* Informações */}
      <small className="form-text text-muted mt-1">
        Digite para buscar tags existentes ou criar novas. 
        Máximo {maxTags} tags. ({selectedTags.length}/{maxTags})
      </small>
    </div>
  );
};

export default TagSelector;
