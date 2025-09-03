import React from 'react';
import { FormGroup, FormInput, FormSelect, Button, Row, Col } from 'shards-react';
import type { IdiomaOportunidade } from '../../../types/oportunidades-trabalho.types';
import { NIVEIS_IDIOMA } from '../../../types/oportunidades-trabalho.types';

interface IdiomaFieldProps {
  label: string;
  idiomas: IdiomaOportunidade[];
  onChange: (idiomas: IdiomaOportunidade[]) => void;
  maxItems?: number;
  helpText?: string;
}

const IdiomaField: React.FC<IdiomaFieldProps> = ({
  label,
  idiomas,
  onChange,
  maxItems = 5,
  helpText
}) => {

  const idiomasComuns = [
    'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 
    'Russo', 'Chinês', 'Japonês', 'Árabe', 'Hindi', 'Holandês'
  ];

  const addIdioma = () => {
    if (idiomas.length < maxItems) {
      onChange([...idiomas, { idioma: '', nivel: 'Básico' }]);
    }
  };

  const removeIdioma = (index: number) => {
    if (idiomas.length > 1) {
      onChange(idiomas.filter((_, i) => i !== index));
    }
  };

  const updateIdioma = (index: number, field: keyof IdiomaOportunidade, value: string) => {
    const newIdiomas = [...idiomas];
    (newIdiomas[index] as any)[field] = value;
    onChange(newIdiomas);
  };

  return (
    <FormGroup>
      <label>{label}</label>
      
      {helpText && (
        <small className="text-muted d-block mb-2">{helpText}</small>
      )}

      {idiomas.map((idioma, index) => (
        <div key={index} className="border rounded p-3 mb-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Idioma {index + 1}</h6>
            {idiomas.length > 1 && (
              <Button
                size="sm"
                theme="outline-danger"
                onClick={() => removeIdioma(index)}
                type="button"
              >
                <i className="material-icons" style={{ fontSize: '16px' }}>remove</i>
              </Button>
            )}
          </div>

          <Row>
            <Col md={8}>
              <FormGroup>
                <label htmlFor={`idioma-${index}`}>Nome do Idioma</label>
                <FormInput
                  id={`idioma-${index}`}
                  value={idioma.idioma}
                  onChange={(e) => updateIdioma(index, 'idioma', e.target.value)}
                  placeholder="Ex: Inglês, Espanhol..."
                  list={`idiomas-list-${index}`}
                />
                <datalist id={`idiomas-list-${index}`}>
                  {idiomasComuns.map((idiomaSugestao) => (
                    <option key={idiomaSugestao} value={idiomaSugestao} />
                  ))}
                </datalist>
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <label htmlFor={`nivel-${index}`}>Nível Mínimo</label>
                <FormSelect
                  id={`nivel-${index}`}
                  value={idioma.nivel}
                  onChange={(e) => updateIdioma(index, 'nivel', e.target.value)}
                  className="form-control"
                >
                  {NIVEIS_IDIOMA.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
            </Col>
          </Row>
        </div>
      ))}

      {idiomas.length < maxItems && (
        <Button
          size="sm"
          theme="outline-secondary"
          onClick={addIdioma}
          type="button"
          className="mt-1"
        >
          <i className="material-icons mr-1" style={{ fontSize: '16px' }}>add</i>
          Adicionar idioma
        </Button>
      )}

      {idiomas.length >= maxItems && (
        <small className="text-muted">
          Máximo de {maxItems} idiomas atingido
        </small>
      )}
    </FormGroup>
  );
};

export default IdiomaField;
