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
  DadosExperiencia,
  ExperienciaFormData,
  ContribuicaoUnificada
} from '../../../types/dados-profissionais.types';
import { TEMPOS_CARGO } from '../../../types/dados-profissionais.types';

interface ExperienciaFormProps {
  onSubmit: (data: ExperienciaFormData) => void;
  editingData?: ContribuicaoUnificada | null;
  loading?: boolean;
}

const ExperienciaForm: React.FC<ExperienciaFormProps> = ({ 
  onSubmit, 
  editingData, 
  loading = false 
}) => {
  const [experiencias, setExperiencias] = useState<DadosExperiencia[]>([
    { cargo: '', empresa: '', tempoNoCargo: 'Menos de 6 meses' }
  ]);

  // Carregar dados para edição
  useEffect(() => {
    if (editingData && editingData.tipo === 'experiencia' && editingData.dadosEstruturados) {
      const dadosExp = editingData.dadosEstruturados as DadosExperiencia;
      setExperiencias([dadosExp]);
    }
  }, [editingData]);

  const adicionarExperiencia = () => {
    setExperiencias([...experiencias, { cargo: '', empresa: '', tempoNoCargo: 'Menos de 6 meses' }]);
  };

  const removerExperiencia = (index: number) => {
    if (experiencias.length > 1) {
      setExperiencias(experiencias.filter((_, i) => i !== index));
    }
  };

  const updateExperiencia = (index: number, field: keyof DadosExperiencia, value: string) => {
    const novasExperiencias = [...experiencias];
    (novasExperiencias[index] as any)[field] = value;
    setExperiencias(novasExperiencias);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar experiências
    const experienciasValidas = experiencias.filter(exp => 
      exp.cargo.trim() !== '' && exp.empresa.trim() !== ''
    );

    if (experienciasValidas.length === 0) {
      alert('Por favor, preencha pelo menos uma experiência completa.');
      return;
    }

    onSubmit({ experiencias: experienciasValidas });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <p className="text-muted">
          Adicione suas experiências profissionais. Pode adicionar múltiplas experiências de uma só vez.
        </p>
      </div>

      {experiencias.map((exp, index) => (
        <Card key={index} className="mb-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Experiência {index + 1}</h6>
            {experiencias.length > 1 && (
              <Button 
                size="sm" 
                theme="outline-danger"
                onClick={() => removerExperiencia(index)}
                type="button"
              >
                <i className="material-icons" style={{ fontSize: '16px' }}>remove</i>
                Remover
              </Button>
            )}
          </CardHeader>
          
          <CardBody>
            <FormGroup>
              <label htmlFor={`cargo-${index}`}>
                Cargo/Função <span className="text-danger">*</span>
              </label>
              <FormInput
                id={`cargo-${index}`}
                value={exp.cargo}
                onChange={(e) => updateExperiencia(index, 'cargo', e.target.value)}
                placeholder="Ex: Desenvolvedor Frontend, Gestor de Vendas..."
                required
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`empresa-${index}`}>
                Nome da Empresa <span className="text-danger">*</span>
              </label>
              <FormInput
                id={`empresa-${index}`}
                value={exp.empresa}
                onChange={(e) => updateExperiencia(index, 'empresa', e.target.value)}
                placeholder="Ex: Tech Solutions, Café Central..."
                required
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`tempo-${index}`}>
                Tempo no Cargo <span className="text-danger">*</span>
              </label>
              <FormSelect
                id={`tempo-${index}`}
                value={exp.tempoNoCargo}
                onChange={(e) => updateExperiencia(index, 'tempoNoCargo', e.target.value)}
                required
                className="form-control"
              >
                {TEMPOS_CARGO.map((tempo) => (
                  <option key={tempo} value={tempo}>
                    {tempo}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </CardBody>
        </Card>
      ))}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          theme="outline-primary" 
          onClick={adicionarExperiencia}
          type="button"
        >
          <i className="material-icons mr-1">add</i>
          Adicionar Outra Experiência
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
                {editingData ? 'Atualizar' : 'Salvar'} Experiência{experiencias.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExperienciaForm;
