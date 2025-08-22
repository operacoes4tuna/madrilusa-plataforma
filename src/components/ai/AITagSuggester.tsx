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
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { suggestTags } = useAI();
  const { toast } = useToast();

  // Auto-sugestão removida - apenas sugestão manual

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
      
      // Adicionar automaticamente as primeiras 3-4 sugestões mais relevantes
      const tagsToAdd = newSuggestions.slice(0, Math.min(4, maxTags - selectedTags.length));
      
      if (tagsToAdd.length > 0) {
        const updatedTags = [...selectedTags, ...tagsToAdd];
        onTagsChanged(updatedTags);
        
        toast({
          title: "✨ Tags adicionadas",
          description: `${tagsToAdd.length} tags relevantes adicionadas: ${tagsToAdd.join(', ')}`,
        });
      } else {
        toast({
          title: "Nenhuma tag nova",
          description: "Todas as tags sugeridas já estão selecionadas",
        });
      }
    } catch (error) {
      console.error('Erro na sugestão manual:', error);
      toast({
        title: "Erro na IA",
        description: "Não foi possível obter sugestões de tags",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
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
        <div className="d-flex align-items-center">
          <label className="mb-0 mr-2">Tags</label>
          <Button
            size="sm"
            theme="outline-primary"
            onClick={handleManualSuggest}
            disabled={!canSuggestTags || isLoadingSuggestions}
            style={{ 
              fontSize: '11px',
              padding: '3px 6px',
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
        
        {isLoadingSuggestions && (
          <small className="text-primary">
            <span 
              className="spinner-border spinner-border-sm mr-1" 
              style={{ width: '12px', height: '12px' }}
            />
            Processando...
          </small>
        )}
      </div>



      {/* Informação quando não pode sugerir */}
      {!canSuggestTags && !disabled && (
        <small className="text-muted d-block mb-2" style={{ fontSize: '11px' }}>
          {selectedTags.length >= maxTags ? 
            `Limite de ${maxTags} tags atingido` :
            `💡 Clique "🏷️ Sugerir com IA" para obter sugestões baseadas no texto`
          }
        </small>
      )}
    </div>
  );
};

export default AITagSuggester;
