// Componente para Configurar IA do SinergIA Madrilusa V2

import React, { useState } from 'react';
import type { IAConfiguration } from '../../../types/sinergia-config.types';

interface IAConfigEditorProps {
  config: IAConfiguration;
  onChange: (config: IAConfiguration) => void;
  disabled?: boolean;
}

export const IAConfigEditor: React.FC<IAConfigEditorProps> = ({
  config,
  onChange,
  disabled = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: keyof IAConfiguration, value: any) => {
    onChange({ ...config, [field]: value });
  };

  // Calcular custo estimado por dia
  const estimarCustoDiario = () => {
    if (!config.habilitada) return 0;
    
    // Estimativa baseada em uso médio
    const analisesEstimadasPorDia = 50; // Estimativa conservadora
    const percentualQueUsaIA = 0.6; // 60% dos matches usam IA (threshold)
    const analisesDiariasComIA = analisesEstimadasPorDia * percentualQueUsaIA;
    
    return analisesDiariasComIA * config.custoMaximoPorAnalise;
  };

  const custoDiario = estimarCustoDiario();

  return (
    <div className="space-y-6">
      {/* Toggle principal da IA */}
      <div className={`p-6 border-2 rounded-lg ${
        config.habilitada 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              {config.habilitada && <span className="text-blue-500 mr-2">🤖</span>}
              Inteligência Artificial
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Usar IA para análise semântica avançada dos matches
            </p>
          </div>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.habilitada}
              onChange={(e) => handleChange('habilitada', e.target.checked)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config.habilitada 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config.habilitada ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {config.habilitada ? 'Ativada' : 'Desativada'}
            </span>
          </label>
        </div>

        {config.habilitada && (
          <div className="bg-blue-100 border border-blue-200 rounded p-3">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  IA Ativa - Análise Semântica Habilitada
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  A IA será usada para análise semântica detalhada quando o score estruturado 
                  atingir o threshold configurado, melhorando a precisão dos matches.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configurações básicas da IA */}
      {config.habilitada && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threshold para ativar IA */}
          <div className="p-4 border rounded-lg bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score Mínimo para IA
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={config.thresholdMinimo}
                onChange={(e) => handleChange('thresholdMinimo', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-bold text-blue-600">
                {config.thresholdMinimo}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              IA será usada apenas em matches com score ≥ {config.thresholdMinimo}%
            </p>
          </div>

          {/* Peso da IA no score final */}
          <div className="p-4 border rounded-lg bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso da IA no Score Final
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={config.pesoIA}
                onChange={(e) => handleChange('pesoIA', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-bold text-purple-600">
                {config.pesoIA}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Score final = {100 - config.pesoIA}% estruturado + {config.pesoIA}% IA
            </p>
          </div>
        </div>
      )}

      {/* Configurações avançadas */}
      {config.habilitada && (
        <div className="border rounded-lg bg-white">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-700">
              Configurações Avançadas
            </span>
            <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showAdvanced && (
            <div className="p-4 border-t bg-gray-50 space-y-4">
              {/* Modelo de IA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo de IA
                </label>
                <select
                  value={config.modelo}
                  onChange={(e) => handleChange('modelo', e.target.value)}
                  disabled={disabled}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gpt-4">GPT-4 (Recomendado)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  GPT-4 oferece melhor qualidade, GPT-3.5 é mais econômico
                </p>
              </div>

              {/* Máximo de tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Tokens
                </label>
                <input
                  type="number"
                  min="500"
                  max="4000"
                  step="100"
                  value={config.maxTokens}
                  onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                  disabled={disabled}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mais tokens = análises mais detalhadas, mas maior custo
                </p>
              </div>

              {/* Temperatura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura ({config.temperatura})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperatura}
                  onChange={(e) => handleChange('temperatura', parseFloat(e.target.value))}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.0 (Determinística)</span>
                  <span>1.0 (Criativa)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Valores baixos geram respostas mais consistentes
                </p>
              </div>

              {/* Custo máximo por análise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custo Máximo por Análise (USD)
                </label>
                <input
                  type="number"
                  min="0.01"
                  max="1.00"
                  step="0.01"
                  value={config.custoMaximoPorAnalise}
                  onChange={(e) => handleChange('custoMaximoPorAnalise', parseFloat(e.target.value))}
                  disabled={disabled}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Análises que excederem este custo serão canceladas
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estimativa de custos */}
      {config.habilitada && (
        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">
            💰 Estimativa de Custos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-yellow-700">Por análise:</span>
              <div className="font-bold text-yellow-800">
                ${config.custoMaximoPorAnalise.toFixed(3)}
              </div>
            </div>
            <div>
              <span className="text-yellow-700">Estimativa diária:</span>
              <div className="font-bold text-yellow-800">
                ${custoDiario.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-yellow-700">Estimativa mensal:</span>
              <div className="font-bold text-yellow-800">
                ${(custoDiario * 30).toFixed(2)}
              </div>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            * Estimativas baseadas em ~50 análises/dia com {Math.round((config.thresholdMinimo / 100) * 60 * 100)}% usando IA
          </p>
        </div>
      )}

      {/* Ações rápidas */}
      {!disabled && config.habilitada && (
        <div className="flex space-x-2 pt-4 border-t">
          <button
            onClick={() => {
              // Configuração econômica
              onChange({
                ...config,
                modelo: 'gpt-3.5-turbo',
                thresholdMinimo: 60,
                pesoIA: 20,
                maxTokens: 1000,
                temperatura: 0.2,
                custoMaximoPorAnalise: 0.02
              });
            }}
            className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Configuração Econômica
          </button>
          
          <button
            onClick={() => {
              // Configuração premium
              onChange({
                ...config,
                modelo: 'gpt-4',
                thresholdMinimo: 30,
                pesoIA: 40,
                maxTokens: 2000,
                temperatura: 0.3,
                custoMaximoPorAnalise: 0.10
              });
            }}
            className="px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Configuração Premium
          </button>
        </div>
      )}
    </div>
  );
};
