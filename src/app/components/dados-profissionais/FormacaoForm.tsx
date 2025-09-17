import React, { useState, useEffect } from 'react';
import { 
  FormGroup, 
  FormInput, 
  FormSelect, 
  Button, 
  Card, 
  CardBody,
  CardHeader 
} from 'shards-react';
import type {
  DadosFormacao,
  FormacaoFormData,
  ContribuicaoUnificada
} from '../../../types/dados-profissionais.types';
import { NIVEIS_ESCOLARIDADE } from '../../../types/dados-profissionais.types';

interface FormacaoFormProps {
  onSubmit: (data: FormacaoFormData) => void;
  editingData?: ContribuicaoUnificada | null;
  loading?: boolean;
}

const FormacaoForm: React.FC<FormacaoFormProps> = ({ 
  onSubmit, 
  editingData, 
  loading = false 
}) => {
  const [formacoes, setFormacoes] = useState<DadosFormacao[]>([
    { nivelEscolaridade: 'Ensino Básico', curso: '', instituicao: '', dataTermino: '' }
  ]);

  // Carregar dados para edição
  useEffect(() => {
    if (editingData && editingData.tipo === 'formacao' && editingData.dadosEstruturados) {
      const dadosForm = editingData.dadosEstruturados as DadosFormacao;
      setFormacoes([dadosForm]);
    }
  }, [editingData]);

  const adicionarFormacao = () => {
    setFormacoes([...formacoes, { 
      nivelEscolaridade: 'Ensino Básico', 
      curso: '', 
      instituicao: '', 
      dataTermino: '' 
    }]);
  };

  const removerFormacao = (index: number) => {
    if (formacoes.length > 1) {
      setFormacoes(formacoes.filter((_, i) => i !== index));
    }
  };

  const updateFormacao = (index: number, field: keyof DadosFormacao, value: string) => {
    const novasFormacoes = [...formacoes];
    (novasFormacoes[index] as any)[field] = value;
    setFormacoes(novasFormacoes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formações
    const formacoesValidas = formacoes.filter(form => 
      form.nivelEscolaridade.trim() !== ''
    );

    if (formacoesValidas.length === 0) {
      alert('Por favor, preencha pelo menos uma formação.');
      return;
    }

    onSubmit({ formacoes: formacoesValidas });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <p className="text-muted">
          Adicione suas formações acadêmicas e cursos. Pode adicionar múltiplas formações de uma só vez.
        </p>
      </div>

      {formacoes.map((form, index) => (
        <Card key={index} className="mb-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Formação {index + 1}</h6>
            {formacoes.length > 1 && (
              <Button 
                size="sm" 
                theme="outline-danger"
                onClick={() => removerFormacao(index)}
                type="button"
              >
                <i className="material-icons" style={{ fontSize: '16px' }}>remove</i>
                Remover
              </Button>
            )}
          </CardHeader>
          
          <CardBody>
            <FormGroup>
              <label htmlFor={`nivel-${index}`}>
                Nível de Escolaridade <span className="text-danger">*</span>
              </label>
              <FormSelect
                id={`nivel-${index}`}
                value={form.nivelEscolaridade}
                onChange={(e) => updateFormacao(index, 'nivelEscolaridade', e.target.value)}
                required
                className="form-control"
              >
                {NIVEIS_ESCOLARIDADE.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`curso-${index}`}>
                Nome do Curso
              </label>
              <FormInput
                id={`curso-${index}`}
                value={form.curso || ''}
                onChange={(e) => updateFormacao(index, 'curso', e.target.value)}
                placeholder="Ex: Engenharia Informática, Marketing Digital..."
              />
              <small className="text-muted">
                Opcional - deixe em branco se não se aplicar
              </small>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`instituicao-${index}`}>
                Instituição de Ensino
              </label>
              <FormInput
                id={`instituicao-${index}`}
                value={form.instituicao || ''}
                onChange={(e) => updateFormacao(index, 'instituicao', e.target.value)}
                placeholder="Ex: Universidade de Lisboa, ISCTE..."
              />
              <small className="text-muted">
                Opcional - nome da escola, universidade ou centro de formação
              </small>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`data-${index}`}>
                Data de Término
              </label>
              <FormInput
                id={`data-${index}`}
                type="date"
                value={form.dataTermino || ''}
                onChange={(e) => updateFormacao(index, 'dataTermino', e.target.value)}
              />
              <small className="text-muted">
                Opcional - quando concluiu ou prevê concluir
              </small>
            </FormGroup>
          </CardBody>
        </Card>
      ))}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          theme="outline-primary" 
          onClick={adicionarFormacao}
          type="button"
        >
          <i className="material-icons mr-1">add</i>
          Adicionar Outra Formação
        </Button>
        
        <div>
          <Button 
            type="submit" 
            theme="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="material-icons mr-1">save</i>
                {editingData ? 'Atualizar' : 'Salvar'} Formação{formacoes.length > 1 ? 'ões' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormacaoForm;
