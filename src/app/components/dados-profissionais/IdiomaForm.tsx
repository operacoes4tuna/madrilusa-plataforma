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
  DadosIdioma, 
  IdiomaFormData,
  ContribuicaoUnificada 
} from '../../../types/dados-profissionais.types';
import { NIVEIS_IDIOMA } from '../../../types/dados-profissionais.types';

interface IdiomaFormProps {
  onSubmit: (data: IdiomaFormData) => void;
  editingData?: ContribuicaoUnificada | null;
  loading?: boolean;
}

const IdiomaForm: React.FC<IdiomaFormProps> = ({ 
  onSubmit, 
  editingData, 
  loading = false 
}) => {
  const [idiomas, setIdiomas] = useState<DadosIdioma[]>([
    { idioma: '', nivel: 'Básico' }
  ]);

  // Lista de idiomas comuns para sugestão
  const idiomasComuns = [
    'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 
    'Russo', 'Chinês', 'Japonês', 'Árabe', 'Hindi', 'Holandês',
    'Sueco', 'Norueguês', 'Dinamarquês', 'Finlandês', 'Polaco',
    'Checo', 'Húngaro', 'Romeno', 'Búlgaro', 'Grego', 'Turco'
  ];

  // Carregar dados para edição
  useEffect(() => {
    if (editingData && editingData.tipo === 'idioma' && editingData.dadosEstruturados) {
      const dadosIdioma = editingData.dadosEstruturados as DadosIdioma;
      setIdiomas([dadosIdioma]);
    }
  }, [editingData]);

  const adicionarIdioma = () => {
    setIdiomas([...idiomas, { idioma: '', nivel: 'Básico' }]);
  };

  const removerIdioma = (index: number) => {
    if (idiomas.length > 1) {
      setIdiomas(idiomas.filter((_, i) => i !== index));
    }
  };

  const updateIdioma = (index: number, field: keyof DadosIdioma, value: string) => {
    const novosIdiomas = [...idiomas];
    (novosIdiomas[index] as any)[field] = value;
    setIdiomas(novosIdiomas);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar idiomas
    const idiomasValidos = idiomas.filter(idioma => 
      idioma.idioma.trim() !== ''
    );

    if (idiomasValidos.length === 0) {
      alert('Por favor, preencha pelo menos um idioma.');
      return;
    }

    onSubmit({ idiomas: idiomasValidos });
  };

  const getNivelDescription = (nivel: string) => {
    switch (nivel) {
      case 'Básico':
        return 'Conhecimentos elementares, consegue comunicar em situações simples';
      case 'Intermédio':
        return 'Consegue comunicar sobre tópicos familiares e de interesse pessoal';
      case 'Avançado':
        return 'Comunica fluentemente, compreende textos complexos';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <p className="text-muted">
          Adicione os idiomas que fala e o seu nível de proficiência. Pode adicionar múltiplos idiomas de uma só vez.
        </p>
      </div>

      {idiomas.map((idioma, index) => (
        <Card key={index} className="mb-3">
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Idioma {index + 1}</h6>
            {idiomas.length > 1 && (
              <Button 
                size="sm" 
                theme="outline-danger"
                onClick={() => removerIdioma(index)}
                type="button"
              >
                <i className="material-icons" style={{ fontSize: '16px' }}>remove</i>
                Remover
              </Button>
            )}
          </CardHeader>
          
          <CardBody>
            <FormGroup>
              <label htmlFor={`idioma-${index}`}>
                Idioma <span className="text-danger">*</span>
              </label>
              <FormInput
                id={`idioma-${index}`}
                value={idioma.idioma}
                onChange={(e) => updateIdioma(index, 'idioma', e.target.value)}
                placeholder="Ex: Inglês, Espanhol, Francês..."
                list={`idiomas-list-${index}`}
                required
              />
              <datalist id={`idiomas-list-${index}`}>
                {idiomasComuns.map((idiomaSugestao) => (
                  <option key={idiomaSugestao} value={idiomaSugestao} />
                ))}
              </datalist>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor={`nivel-${index}`}>
                Nível de Proficiência <span className="text-danger">*</span>
              </label>
              <FormSelect
                id={`nivel-${index}`}
                value={idioma.nivel}
                onChange={(e) => updateIdioma(index, 'nivel', e.target.value)}
                required
              >
                {NIVEIS_IDIOMA.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel}
                  </option>
                ))}
              </FormSelect>
              <small className="text-muted">
                {getNivelDescription(idioma.nivel)}
              </small>
            </FormGroup>
          </CardBody>
        </Card>
      ))}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          theme="outline-primary" 
          onClick={adicionarIdioma}
          type="button"
        >
          <i className="material-icons mr-1">add</i>
          Adicionar Outro Idioma
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
                {editingData ? 'Atualizar' : 'Salvar'} Idioma{idiomas.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default IdiomaForm;
