import React, { useState } from 'react';
import { Button } from 'shards-react';
import { useToast } from '@/hooks/use-toast';

// Tipos para IA
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

interface AITextEnhancerProps {
  originalText: string;
  onTextChanged: (newText: string) => void;
  context: AIContext;
  disabled?: boolean;
  className?: string;
}

interface EnhanceResponse {
  success: boolean;
  data?: {
    originalText: string;
    enhancedText: string;
    timestamp: string;
    tokensUsed?: number;
  };
  error?: string;
  message?: string;
}

const AITextEnhancer: React.FC<AITextEnhancerProps> = ({
  originalText,
  onTextChanged,
  context,
  disabled = false,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (!originalText.trim() || originalText.length < 20) {
      toast({
        title: "Texto insuficiente",
        description: "Escreva pelo menos 20 caracteres para usar a IA",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setShowSuggestion(true);

    try {
      const response = await fetch('/api/ai/enhance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          context: context,
          enhancementType: 'enhance'
        }),
      });

      const data: EnhanceResponse = await response.json();

      if (data.success && data.data) {
        setSuggestion(data.data.enhancedText);
        
        toast({
          title: "✨ Texto aprimorado!",
          description: `IA processou ${data.data.tokensUsed || 0} tokens`,
        });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao aprimorar texto:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com IA';
      setError(errorMessage);
      
      toast({
        title: "Erro na IA",
        description: errorMessage,
        variant: "destructive",
      });
      
      setShowSuggestion(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptSuggestion = () => {
    console.log('🔧 AI ENHANCER DEBUG: handleAcceptSuggestion iniciado', {
      hasSuggestion: !!suggestion,
      suggestionLength: suggestion.length,
      suggestionPreview: suggestion.substring(0, 100) + '...',
      onTextChangedType: typeof onTextChanged,
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('🔧 AI ENHANCER DEBUG: Chamando onTextChanged...');
      onTextChanged(suggestion);
      console.log('✅ AI ENHANCER DEBUG: onTextChanged executado com sucesso');
      
      setShowSuggestion(false);
      setSuggestion('');
      
      toast({
        title: "✅ Sugestão aceite",
        description: "Texto atualizado com sucesso",
      });
    } catch (error) {
      console.error('❌ AI ENHANCER DEBUG: Erro ao executar onTextChanged:', error);
      toast({
        title: "Erro",
        description: "Erro ao aplicar sugestão: " + (error instanceof Error ? error.message : 'Desconhecido'),
        variant: "destructive",
      });
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setSuggestion('');
    
    toast({
      title: "Sugestão descartada",
      description: "Texto original mantido",
    });
  };

  const canUseAI = originalText.trim().length >= 20 && !disabled;

  return (
    <div className={`ai-text-enhancer ${className}`}>
      {/* Botão de Ativação */}
      <div className="d-flex align-items-center justify-content-between mt-2">
        <small className="text-muted">
          {originalText.length >= 20 ? 
            "✨ IA disponível para aprimoramento" : 
            `Escreva mais ${20 - originalText.length} caracteres para usar IA`
          }
        </small>
        
        <Button
          size="sm"
          theme="outline-primary"
          onClick={handleEnhance}
          disabled={!canUseAI || isProcessing}
          className="ai-enhance-btn"
          style={{ 
            fontSize: '12px',
            padding: '4px 8px',
            borderColor: '#F5A623',
            color: '#F5A623'
          }}
        >
          {isProcessing ? (
            <>
              <span 
                className="spinner-border spinner-border-sm mr-1" 
                role="status" 
                style={{ width: '12px', height: '12px' }}
              />
              Aprimorando...
            </>
          ) : (
            <>
              ✨ Aprimorar com IA
            </>
          )}
        </Button>
      </div>

      {/* Painel de Sugestão */}
      {showSuggestion && (
        <div className="ai-suggestion-panel mt-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0" style={{ color: '#4A90A4' }}>
              <i className="material-icons mr-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>
                auto_fix_high
              </i>
              Sugestão da IA
            </h6>
            <Button
              size="sm"
              theme="light"
              onClick={handleRejectSuggestion}
              style={{ fontSize: '12px', padding: '2px 6px' }}
            >
              ✕
            </Button>
          </div>
          
          {error ? (
            <div className="alert alert-danger py-2">
              <small>❌ {error}</small>
            </div>
          ) : isProcessing ? (
            <div className="ai-processing">
              <div className="d-flex align-items-center">
                <span 
                  className="spinner-border spinner-border-sm mr-2" 
                  role="status"
                  style={{ width: '16px', height: '16px' }}
                />
                <small className="text-muted">A IA está a processar o seu texto...</small>
              </div>
            </div>
          ) : suggestion ? (
            <>
              <div className="ai-suggestion-content mb-3">
                <div className="suggestion-text p-2 border rounded" style={{ backgroundColor: '#fff' }}>
                  {suggestion}
                </div>
              </div>

              <div className="ai-suggestion-actions">
                <Button
                  size="sm"
                  theme="success"
                  onClick={handleAcceptSuggestion}
                  className="mr-2"
                  style={{ fontSize: '12px' }}
                >
                  ✓ Aceitar Sugestão
                </Button>
                <Button
                  size="sm"
                  theme="outline-secondary"
                  onClick={handleRejectSuggestion}
                  style={{ fontSize: '12px' }}
                >
                  Descartar
                </Button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Tooltip Explicativo */}
      {canUseAI && !showSuggestion && (
        <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
          💡 A IA pode melhorar clareza, gramática e impacto do seu texto
        </small>
      )}
    </div>
  );
};

export default AITextEnhancer;
