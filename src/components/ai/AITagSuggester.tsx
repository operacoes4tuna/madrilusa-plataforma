import React, { useState, useEffect } from 'react';
import { Button } from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';

// Tipos para o componente
interface AIContext {
  platformContext: string;
  userCategory: string;
  contributionType: string;
  typeContext?: string;
  specificGuidance?: string;
  tone: string;
  focus: string;
  maxLength: number;
  additionalGuidelines?: string;
}

interface TagSistema {
  id: string;
  nome: string;
  cor?: string;
  categoria?: string;
  usos: number;
}

interface AITagSuggesterProps {
  text: string;
  context: AIContext;
  selectedTags: string[];
  onTagsChanged: (tags: string[]) => void;
  existingTags: TagSistema[];
  disabled?: boolean;
  maxTags?: number;
}

const AITagSuggester: React.FC<AITagSuggesterProps> = ({
  text,
  context,
  selectedTags,
  onTagsChanged,
  existingTags,
  disabled = false,
  maxTags = 8
}) => {
  const [aiSuggestedTags, setAISuggestedTags] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { suggestTags } = useAI();
  const { toast } = useToast();

  // Auto-sugerir tags quando texto muda (debounced)
  useEffect(() => {
    if (text.trim().length >= 30 && selectedTags.length < maxTags) {
      const timeoutId = setTimeout(() => {
        handleAutoSuggest();
      }, 2000); // Aguarda 2s após parar de digitar

      return () => clearTimeout(timeoutId);
    }
  }, [text, selectedTags.length]);

  const handleAutoSuggest = async () => {
    if (text.trim().length < 10) return;
    
    setIsLoadingSuggestions(true);
    
    try {
      const existingTagNames = existingTags.map(t => t.nome);
      const suggestions = await suggestTags(text, context, existingTagNames, selectedTags);
      
      // Filtrar tags que já estão selecionadas
      const newSuggestions = suggestions.filter(tag => !selectedTags.includes(tag));
      setAISuggestedTags(newSuggestions);
      
      if (newSuggestions.length > 0) {
        toast({
          title: "🏷️ Tags sugeridas",
          description: `IA sugeriu ${newSuggestions.length} tags relevantes`,
        });
      }
    } catch (error) {
      console.error('Erro na sugestão automática:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleManualSuggest = async () => {
    if (!text.trim() || text.length < 10) {
      toast({
        title: "Texto insuficiente",
        description: "Escreva pelo menos 10 caracteres para sugerir tags",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingSuggestions(true);
    
    try {
      const existingTagNames = existingTags.map(t => t.nome);
      const suggestions = await suggestTags(text, context, existingTagNames, selectedTags);
      
      const newSuggestions = suggestions.filter(tag => !selectedTags.includes(tag));
      setAISuggestedTags(newSuggestions);
      
      toast({
        title: "✨ Sugestões atualizadas",
        description: `${newSuggestions.length} tags relevantes encontradas`,
      });
    } catch (error) {
      console.error('Erro na sugestão manual:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addTag = (tag: string) => {
    if (selectedTags.length >= maxTags) {
      toast({
        title: "Limite atingido",
        description: `Máximo de ${maxTags} tags permitidas`,
        variant: "destructive",
      });
      return;
    }

    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      
      try {
        onTagsChanged(newTags);
        
        // Remover da lista de sugestões
        setAISuggestedTags(aiSuggestedTags.filter(t => t !== tag));
        
        toast({
          title: "Tag adicionada",
          description: `"${tag}" foi adicionada às suas tags`,
        });
      } catch (error) {
        console.error('Erro ao adicionar tag:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar tag",
          variant: "destructive",
        });
      }
    }
  };

  const getTagInfo = (tagName: string) => {
    const existingTag = existingTags.find(t => 
      t.nome.toLowerCase() === tagName.toLowerCase()
    );
    
    return {
      isExisting: !!existingTag,
      color: existingTag?.cor || '#6c757d',
      usage: existingTag?.usos || 0,
      category: existingTag?.categoria
    };
  };

  const canSuggestTags = text.trim().length >= 10 && selectedTags.length < maxTags && !disabled;

  return (
    <div className="ai-tag-suggester">
      {/* Header com botão de sugestão manual */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="mb-0">
          Tags
          {isLoadingSuggestions && (
            <small className="text-primary ml-2">
              <span 
                className="spinner-border spinner-border-sm mr-1" 
                style={{ width: '12px', height: '12px' }}
              />
              Sugerindo...
            </small>
          )}
        </label>
        
        <Button
          size="sm"
          theme="outline-primary"
          onClick={handleManualSuggest}
          disabled={!canSuggestTags || isLoadingSuggestions}
          style={{ 
            fontSize: '12px',
            padding: '4px 8px',
            borderColor: '#F5A623',
            color: '#F5A623'
          }}
        >
          {isLoadingSuggestions ? (
            <>
              <span 
                className="spinner-border spinner-border-sm mr-1" 
                style={{ width: '10px', height: '10px' }}
              />
              Sugerindo...
            </>
          ) : (
            <>
              🏷️ Sugerir com IA
            </>
          )}
        </Button>
      </div>

      {/* Tags Sugeridas pela IA */}
      {aiSuggestedTags.length > 0 && (
        <div className="ai-suggested-tags mb-3 p-2 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted mb-0">
              ✨ <strong>Sugestões da IA:</strong>
            </small>
            <Button
              size="sm"
              theme="light"
              onClick={() => setAISuggestedTags([])}
              style={{ fontSize: '10px', padding: '2px 4px' }}
            >
              Limpar
            </Button>
          </div>
          
          <div className="d-flex flex-wrap">
            {aiSuggestedTags.map((tag, index) => {
              const tagInfo = getTagInfo(tag);
              
              return (
                <div key={index} className="mr-1 mb-1">
                  <Button
                    size="sm"
                    theme={tagInfo.isExisting ? "primary" : "outline-primary"}
                    onClick={() => addTag(tag)}
                    disabled={selectedTags.length >= maxTags}
                    style={{ 
                      fontSize: '11px',
                      padding: '4px 8px',
                      backgroundColor: tagInfo.isExisting ? tagInfo.color : 'transparent',
                      borderColor: tagInfo.color,
                      color: tagInfo.isExisting ? '#fff' : tagInfo.color
                    }}
                    title={tagInfo.isExisting ? 
                      `Tag existente (${tagInfo.usage} usos)` : 
                      'Tag nova'
                    }
                  >
                    {tagInfo.isExisting ? '✓' : '+'} {tag}
                  </Button>
                </div>
              );
            })}
          </div>
          
          <small className="text-muted d-block mt-1" style={{ fontSize: '10px' }}>
            ✓ = Tag existente na plataforma | + = Tag nova
          </small>
        </div>
      )}

      {/* Informação sobre sugestão automática */}
      {canSuggestTags && aiSuggestedTags.length === 0 && !isLoadingSuggestions && (
        <small className="text-muted d-block mb-2" style={{ fontSize: '11px' }}>
          💡 A IA irá sugerir tags automaticamente enquanto escreve (após 30 caracteres)
        </small>
      )}

      {/* Informação quando não pode sugerir */}
      {!canSuggestTags && !disabled && (
        <small className="text-muted d-block mb-2" style={{ fontSize: '11px' }}>
          {selectedTags.length >= maxTags ? 
            `Limite de ${maxTags} tags atingido` :
            `Escreva mais ${10 - text.trim().length} caracteres para sugestões de IA`
          }
        </small>
      )}
    </div>
  );
};

export default AITagSuggester;
