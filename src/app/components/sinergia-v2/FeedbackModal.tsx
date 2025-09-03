import React, { useState } from 'react';
import { 
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  FormTextarea,
  FormSelect
} from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { RigorousMatchFrontend } from '../../../types/sinergia-v2.types';

interface FeedbackModalProps {
  isOpen: boolean;
  match: RigorousMatchFrontend | null;
  onClose: () => void;
  onSubmit: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  match,
  onClose,
  onSubmit
}) => {
  const [scorePercebido, setScorePercebido] = useState<number>(3);
  const [relevante, setRelevante] = useState<boolean>(true);
  const [comentario, setComentario] = useState<string>('');
  const [criteriosImportantes, setCriteriosImportantes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const criteriosDisponiveis = [
    'genero',
    'idade',
    'municipio',
    'transporteProprio',
    'fluenciaPortugues',
    'experiencias',
    'formacao',
    'idiomas',
    'habilidades',
    'caracteristicas'
  ];

  const criteriosLabels: Record<string, string> = {
    'genero': 'Género',
    'idade': 'Idade',
    'municipio': 'Localização',
    'transporteProprio': 'Transporte Próprio',
    'fluenciaPortugues': 'Fluência em Português',
    'experiencias': 'Experiências Profissionais',
    'formacao': 'Formação Acadêmica',
    'idiomas': 'Idiomas',
    'habilidades': 'Habilidades Técnicas',
    'caracteristicas': 'Características Pessoais'
  };

  const handleSubmitFeedback = async () => {
    if (!match || !user) return;

    setIsSubmitting(true);

    try {
      const feedback = {
        userId: user.id,
        oportunidadeId: match.oportunidadeId,
        imigranteId: match.imigranteId,
        scoreOriginal: match.scoreTotal,
        scorePercebido,
        relevante,
        comentario: comentario.trim() || undefined,
        criteriosImportantes
      };

      const response = await fetch('/api/sinergia-v2/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Feedback Enviado",
          description: "Obrigado! Seu feedback ajudará a melhorar o sistema.",
        });
        
        onSubmit();
        onClose();
        
        // Reset form
        setScorePercebido(3);
        setRelevante(true);
        setComentario('');
        setCriteriosImportantes([]);
      } else {
        throw new Error(data.message || 'Erro ao enviar feedback');
      }

    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCriterioToggle = (criterio: string) => {
    setCriteriosImportantes(prev => 
      prev.includes(criterio) 
        ? prev.filter(c => c !== criterio)
        : [...prev, criterio]
    );
  };

  if (!match) return null;

  return (
    <Modal open={isOpen} toggle={onClose} size="lg">
      <ModalHeader>
        <div className="d-flex align-items-center">
          <i className="material-icons mr-2">feedback</i>
          Feedback sobre Compatibilidade
        </div>
      </ModalHeader>
      
      <ModalBody>
        {/* Resumo do Match */}
        <div className="mb-4 p-3 bg-light rounded">
          <h6 className="mb-2">Match Analisado:</h6>
          <div className="d-flex justify-content-between align-items-center">
            <span>Score Calculado pelo Sistema:</span>
            <span className="font-weight-bold text-primary">{match.scoreTotal}%</span>
          </div>
        </div>

        {/* Avaliação do Usuário */}
        <FormGroup>
          <label>Como avalia esta compatibilidade? *</label>
          <FormSelect
            value={scorePercebido}
            onChange={(e) => setScorePercebido(parseInt(e.target.value))}
            className="form-control"
          >
            <option value={1}>⭐ - Muito baixa compatibilidade</option>
            <option value={2}>⭐⭐ - Baixa compatibilidade</option>
            <option value={3}>⭐⭐⭐ - Compatibilidade moderada</option>
            <option value={4}>⭐⭐⭐⭐ - Boa compatibilidade</option>
            <option value={5}>⭐⭐⭐⭐⭐ - Excelente compatibilidade</option>
          </FormSelect>
        </FormGroup>

        {/* Relevância */}
        <FormGroup>
          <label>Este match é relevante/útil para você?</label>
          <div className="mt-2">
            <div className="custom-control custom-radio custom-control-inline">
              <input 
                type="radio" 
                id="relevante-sim" 
                name="relevante" 
                className="custom-control-input"
                checked={relevante}
                onChange={() => setRelevante(true)}
              />
              <label className="custom-control-label" htmlFor="relevante-sim">
                Sim, é relevante
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input 
                type="radio" 
                id="relevante-nao" 
                name="relevante" 
                className="custom-control-input"
                checked={!relevante}
                onChange={() => setRelevante(false)}
              />
              <label className="custom-control-label" htmlFor="relevante-nao">
                Não, não é relevante
              </label>
            </div>
          </div>
        </FormGroup>

        {/* Critérios Importantes */}
        <FormGroup>
          <label>Quais critérios considera mais importantes? (selecione até 5)</label>
          <div className="mt-2">
            {criteriosDisponiveis.map(criterio => (
              <div key={criterio} className="custom-control custom-checkbox mb-1">
                <input 
                  type="checkbox" 
                  className="custom-control-input" 
                  id={`criterio-${criterio}`}
                  checked={criteriosImportantes.includes(criterio)}
                  onChange={() => handleCriterioToggle(criterio)}
                  disabled={!criteriosImportantes.includes(criterio) && criteriosImportantes.length >= 5}
                />
                <label className="custom-control-label" htmlFor={`criterio-${criterio}`}>
                  {criteriosLabels[criterio]}
                </label>
              </div>
            ))}
          </div>
          <small className="text-muted">
            Selecionados: {criteriosImportantes.length}/5
          </small>
        </FormGroup>

        {/* Comentário Opcional */}
        <FormGroup>
          <label>Comentários adicionais (opcional)</label>
          <FormTextarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Compartilhe suas observações sobre esta análise..."
            rows={3}
            maxLength={500}
          />
          <small className="text-muted">
            {comentario.length}/500 caracteres
          </small>
        </FormGroup>

        {/* Aviso sobre uso dos dados */}
        <div className="mt-3 p-2 bg-info text-white rounded">
          <small>
            <i className="material-icons mr-1" style={{ fontSize: '14px' }}>info</i>
            Seu feedback será usado para melhorar o algoritmo de matching. 
            Os dados são anônimos e agregados para análise estatística.
          </small>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          theme="secondary" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          theme="primary" 
          onClick={handleSubmitFeedback}
          disabled={isSubmitting || criteriosImportantes.length === 0}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <i className="material-icons mr-1">send</i>
              Enviar Feedback
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FeedbackModal;
