// Componente para Configurar Critérios Eliminatórios

import React from 'react';
import type { CriterioEliminatorio, CriteriosEliminatorios } from '../../../types/sinergia-config.types';

interface CriterioEliminatorioEditorProps {
  criterio: keyof CriteriosEliminatorios;
  config: CriterioEliminatorio;
  onChange: (config: CriterioEliminatorio) => void;
  disabled?: boolean;
}

export const CriterioEliminatorioEditor: React.FC<CriterioEliminatorioEditorProps> = ({
  criterio,
  config,
  onChange,
  disabled = false
}) => {
  const getCriterioInfo = (criterio: keyof CriteriosEliminatorios) => {
    switch (criterio) {
      case 'genero':
        return {
          title: 'Género',
          description: 'Eliminar candidatos quando o género não corresponde ao especificado pela empresa',
          options: [
            { value: 'especifico', label: 'Apenas quando género específico é exigido' },
            { value: 'sempre', label: 'Sempre que não corresponder' }
          ]
        };
      case 'transporteProprio':
        return {
          title: 'Transporte Próprio',
          description: 'Eliminar candidatos sem transporte quando este é obrigatório',
          options: [
            { value: 'obrigatorio', label: 'Apenas quando obrigatório (S)' },
            { value: 'sempre', label: 'Sempre que não tiver transporte' }
          ]
        };
      case 'fluenciaPortugues':
        return {
          title: 'Fluência em Português',
          description: 'Eliminar candidatos com fluência insuficiente quando exigida',
          options: [
            { value: 'obrigatorio', label: 'Apenas quando obrigatório (S)' },
            { value: 'sempre', label: 'Sempre que fluência for insuficiente' }
          ]
        };
      default:
        return {
          title: criterio,
          description: '',
          options: []
        };
    }
  };

  const info = getCriterioInfo(criterio);

  const handleAtivoChange = (ativo: boolean) => {
    onChange({ ...config, ativo });
  };

  const handleCondicaoChange = (aplicarQuando: string) => {
    onChange({
      ...config,
      condicoes: {
        ...config.condicoes,
        aplicarQuando: aplicarQuando as any
      }
    });
  };

  const handleNiveisMininosChange = (niveis: string[]) => {
    onChange({
      ...config,
      condicoes: {
        ...config.condicoes,
        niveisMinimos: niveis
      }
    });
  };

  return (
    <div className={`p-4 border rounded-lg ${config.ativo ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-800 flex items-center">
            {config.ativo && <span className="text-red-500 mr-2">⚠️</span>}
            {info.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {info.description}
          </p>
        </div>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.ativo}
            onChange={(e) => handleAtivoChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.ativo 
              ? 'bg-red-500' 
              : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.ativo ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {config.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </label>
      </div>

      {config.ativo && (
        <div className="space-y-3 pt-3 border-t border-red-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aplicar eliminação:
            </label>
            <div className="space-y-2">
              {info.options.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`${criterio}-aplicar`}
                    value={option.value}
                    checked={config.condicoes.aplicarQuando === option.value}
                    onChange={(e) => handleCondicaoChange(e.target.value)}
                    disabled={disabled}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Configurações específicas para fluência */}
          {criterio === 'fluenciaPortugues' && config.ativo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Níveis mínimos aceitos:
              </label>
              <div className="space-y-2">
                {['Básica', 'Intermediária', 'Avançada', 'Fluente'].map((nivel) => (
                  <label key={nivel} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.condicoes.niveisMinimos?.includes(nivel) || false}
                      onChange={(e) => {
                        const niveisAtuais = config.condicoes.niveisMinimos || [];
                        const novosNiveis = e.target.checked
                          ? [...niveisAtuais, nivel]
                          : niveisAtuais.filter(n => n !== nivel);
                        handleNiveisMininosChange(novosNiveis);
                      }}
                      disabled={disabled}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{nivel}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Aviso sobre impacto */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Critério Eliminatório Ativo
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Candidatos que não atenderem este critério serão automaticamente eliminados 
                  antes da análise, independentemente de outros fatores.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para gerenciar todos os critérios eliminatórios
interface GrupoEliminatoriosProps {
  eliminatorios: CriteriosEliminatorios;
  onChange: (eliminatorios: CriteriosEliminatorios) => void;
  disabled?: boolean;
}

export const GrupoEliminatorios: React.FC<GrupoEliminatoriosProps> = ({
  eliminatorios,
  onChange,
  disabled = false
}) => {
  const criteriosAtivos = Object.values(eliminatorios).filter(c => c.ativo).length;

  const handleCriterioChange = (criterio: keyof CriteriosEliminatorios, config: CriterioEliminatorio) => {
    onChange({
      ...eliminatorios,
      [criterio]: config
    });
  };

  return (
    <div className="space-y-4">
      {/* Resumo geral */}
      <div className={`p-4 rounded-lg border-2 ${
        criteriosAtivos > 0 
          ? 'border-red-200 bg-red-50' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">
            Critérios Eliminatórios Ativos:
          </span>
          <span className={`text-xl font-bold ${
            criteriosAtivos > 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {criteriosAtivos} de {Object.keys(eliminatorios).length}
          </span>
        </div>
        
        {criteriosAtivos > 0 ? (
          <p className="text-sm text-red-600 mt-1">
            ⚠️ {criteriosAtivos} critério{criteriosAtivos > 1 ? 's' : ''} eliminará{criteriosAtivos === 1 ? '' : 'ão'} candidatos automaticamente
          </p>
        ) : (
          <p className="text-sm text-gray-600 mt-1">
            ✅ Nenhum critério eliminatório ativo - todos os candidatos serão analisados
          </p>
        )}
      </div>

      {/* Editores individuais */}
      <div className="space-y-4">
        {Object.entries(eliminatorios).map(([criterio, config]) => (
          <CriterioEliminatorioEditor
            key={criterio}
            criterio={criterio as keyof CriteriosEliminatorios}
            config={config}
            onChange={(novoConfig) => handleCriterioChange(criterio as keyof CriteriosEliminatorios, novoConfig)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Ações rápidas */}
      {!disabled && (
        <div className="flex space-x-2 pt-4 border-t">
          <button
            onClick={() => {
              // Desativar todos
              const novosEliminatorios = Object.keys(eliminatorios).reduce((acc, key) => ({
                ...acc,
                [key]: { ...eliminatorios[key as keyof CriteriosEliminatorios], ativo: false }
              }), {} as CriteriosEliminatorios);
              onChange(novosEliminatorios);
            }}
            className="px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Desativar Todos
          </button>
          
          <button
            onClick={() => {
              // Configuração conservadora (ativar todos)
              const novosEliminatorios = Object.keys(eliminatorios).reduce((acc, key) => ({
                ...acc,
                [key]: { ...eliminatorios[key as keyof CriteriosEliminatorios], ativo: true }
              }), {} as CriteriosEliminatorios);
              onChange(novosEliminatorios);
            }}
            className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Ativar Todos (Rigoroso)
          </button>
        </div>
      )}
    </div>
  );
};
