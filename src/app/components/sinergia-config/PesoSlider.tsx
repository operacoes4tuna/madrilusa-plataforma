// Componente Slider para Configuração de Pesos

import React from 'react';
import { CRITERIO_LABELS, CRITERIO_DESCRIPTIONS } from '../../../types/sinergia-config.types';
import type { ScoringWeights } from '../../../types/sinergia-config.types';

interface PesoSliderProps {
  criterio: keyof ScoringWeights;
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
  showDescription?: boolean;
}

export const PesoSlider: React.FC<PesoSliderProps> = ({
  criterio,
  value,
  onChange,
  max,
  disabled = false,
  showDescription = true
}) => {
  const label = CRITERIO_LABELS[criterio];
  const description = CRITERIO_DESCRIPTIONS[criterio];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  // Determinar cor baseada no valor
  const getSliderColor = (valor: number) => {
    if (valor === 0) return 'bg-gray-300';
    if (valor <= 5) return 'bg-red-400';
    if (valor <= 10) return 'bg-orange-400';
    if (valor <= 15) return 'bg-yellow-400';
    if (valor <= 20) return 'bg-blue-400';
    return 'bg-green-400';
  };

  const getTextColor = (valor: number) => {
    if (valor === 0) return 'text-gray-600';
    if (valor <= 5) return 'text-red-600';
    if (valor <= 10) return 'text-orange-600';
    if (valor <= 15) return 'text-yellow-600';
    if (valor <= 20) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className={`p-4 border rounded-lg ${disabled ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-gray-700">
          {label}
        </label>
        <span className={`text-lg font-bold ${getTextColor(value)}`}>
          {value}%
        </span>
      </div>
      
      <div className="relative mb-3">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full h-2 rounded-lg appearance-none cursor-pointer
            ${getSliderColor(value)}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: `linear-gradient(to right, 
              ${value > 0 ? '#10b981' : '#d1d5db'} 0%, 
              ${value > 0 ? '#10b981' : '#d1d5db'} ${(value / max) * 100}%, 
              #e5e7eb ${(value / max) * 100}%, 
              #e5e7eb 100%)`
          }}
        />
        
        {/* Marcadores de valor */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>{Math.floor(max / 4)}%</span>
          <span>{Math.floor(max / 2)}%</span>
          <span>{Math.floor((max * 3) / 4)}%</span>
          <span>{max}%</span>
        </div>
      </div>

      {showDescription && (
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      )}

      {/* Indicador visual do impacto */}
      <div className="mt-2 flex items-center space-x-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-full ${
                value >= (level * max) / 5 
                  ? getSliderColor(value).replace('bg-', 'bg-')
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {value === 0 && 'Sem impacto'}
          {value > 0 && value <= 5 && 'Impacto mínimo'}
          {value > 5 && value <= 10 && 'Impacto baixo'}
          {value > 10 && value <= 15 && 'Impacto médio'}
          {value > 15 && value <= 20 && 'Impacto alto'}
          {value > 20 && 'Impacto máximo'}
        </span>
      </div>
    </div>
  );
};

// Componente para grupo de sliders com validação de soma
interface GrupoPesosProps {
  pesos: ScoringWeights;
  onChange: (pesos: ScoringWeights) => void;
  disabled?: boolean;
}

export const GrupoPesos: React.FC<GrupoPesosProps> = ({
  pesos,
  onChange,
  disabled = false
}) => {
  const somaTotal = Object.values(pesos).reduce((acc, val) => acc + val, 0);
  const isValido = Math.abs(somaTotal - 100) < 0.01;

  const handlePesoChange = (criterio: keyof ScoringWeights, valor: number) => {
    const novosPesos = { ...pesos, [criterio]: valor };
    onChange(novosPesos);
  };

  // Calcular máximo disponível para cada slider
  const getMaxDisponivel = (criterio: keyof ScoringWeights) => {
    const outrosPesos = Object.entries(pesos)
      .filter(([key]) => key !== criterio)
      .reduce((acc, [, val]) => acc + val, 0);
    
    return Math.max(0, 100 - outrosPesos);
  };

  return (
    <div className="space-y-4">
      {/* Indicador de soma total */}
      <div className={`p-4 rounded-lg border-2 ${
        isValido 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">
            Soma Total dos Pesos:
          </span>
          <span className={`text-xl font-bold ${
            isValido ? 'text-green-600' : 'text-red-600'
          }`}>
            {somaTotal.toFixed(1)}%
          </span>
        </div>
        
        {!isValido && (
          <p className="text-sm text-red-600 mt-1">
            ⚠️ A soma dos pesos deve ser exatamente 100%
          </p>
        )}
        
        {isValido && (
          <p className="text-sm text-green-600 mt-1">
            ✅ Configuração de pesos válida
          </p>
        )}
      </div>

      {/* Sliders individuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(pesos).map(([criterio, valor]) => (
          <PesoSlider
            key={criterio}
            criterio={criterio as keyof ScoringWeights}
            value={valor}
            onChange={(novoValor) => handlePesoChange(criterio as keyof ScoringWeights, novoValor)}
            max={getMaxDisponivel(criterio as keyof ScoringWeights) + valor}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Ações rápidas */}
      {!disabled && (
        <div className="flex space-x-2 pt-4 border-t">
          <button
            onClick={() => {
              // Distribuir igualmente
              const pesoIgual = Math.floor(100 / Object.keys(pesos).length);
              const resto = 100 - (pesoIgual * Object.keys(pesos).length);
              
              const novoPesos: ScoringWeights = Object.keys(pesos).reduce((acc, key, index) => ({
                ...acc,
                [key]: pesoIgual + (index < resto ? 1 : 0)
              }), {} as ScoringWeights);
              
              onChange(novoPesos);
            }}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Distribuir Igualmente
          </button>
          
          <button
            onClick={() => {
              // Resetar para padrão
              const pesoPadrao: ScoringWeights = {
                genero: 10,
                idade: 10,
                municipio: 15,
                transporteProprio: 10,
                fluenciaPortugues: 15,
                experiencias: 20,
                formacao: 15,
                idiomas: 5,
                habilidades: 3,
                caracteristicas: 2
              };
              onChange(pesoPadrao);
            }}
            className="px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Restaurar Padrão
          </button>
        </div>
      )}
    </div>
  );
};
