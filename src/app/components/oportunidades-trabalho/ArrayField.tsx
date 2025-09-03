import React from 'react';
import { FormGroup, FormInput, Button } from 'shards-react';

interface ArrayFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  required?: boolean;
  helpText?: string;
}

const ArrayField: React.FC<ArrayFieldProps> = ({
  label,
  values,
  onChange,
  placeholder = `Digite ${label.toLowerCase()}...`,
  maxItems = 10,
  required = false,
  helpText
}) => {

  const addItem = () => {
    if (values.length < maxItems) {
      onChange([...values, '']);
    }
  };

  const removeItem = (index: number) => {
    if (values.length > 1) {
      onChange(values.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <FormGroup>
      <label>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {helpText && (
        <small className="text-muted d-block mb-2">{helpText}</small>
      )}

      {values.map((value, index) => (
        <div key={index} className="d-flex mb-2">
          <FormInput
            value={value}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-grow-1"
            required={required && index === 0} // Primeiro item obrigatório se campo for required
          />
          
          {values.length > 1 && (
            <Button
              size="sm"
              theme="outline-danger"
              className="ml-2"
              onClick={() => removeItem(index)}
              type="button"
            >
              <i className="material-icons" style={{ fontSize: '16px' }}>remove</i>
            </Button>
          )}
        </div>
      ))}

      {values.length < maxItems && (
        <Button
          size="sm"
          theme="outline-secondary"
          onClick={addItem}
          type="button"
          className="mt-1"
        >
          <i className="material-icons mr-1" style={{ fontSize: '16px' }}>add</i>
          Adicionar {label.toLowerCase()}
        </Button>
      )}

      {values.length >= maxItems && (
        <small className="text-muted">
          Máximo de {maxItems} itens atingido
        </small>
      )}
    </FormGroup>
  );
};

export default ArrayField;
